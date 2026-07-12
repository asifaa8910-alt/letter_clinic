import { Appointment } from "../models/appointment.model.js";
import { Slot } from "../models/slot.model.js";
import { User } from "../models/user.model.js";
import { ActivityLog } from "../models/activityLog.model.js";
import { Notification } from "../models/notification.model.js";

export const bookAppointment = async (patientId, patientName, doctorId, doctorName, slotId) => {
  const slot = await Slot.findById(slotId);
  if (!slot || !slot.available) {
    throw new Error("Selected slot is no longer available.");
  }

  slot.available = false;
  await slot.save();

  const appointment = await Appointment.create({
    patientId,
    patientName,
    doctorId,
    doctorName,
    slotDate: slot.date,
    slotTime: slot.time,
    status: "Booked",
    videoRoomId: `room-${Math.floor(100000 + Math.random() * 900000)}`
  });

  await ActivityLog.create({
    timestamp: new Date().toLocaleString(),
    action: "Appointment Booked",
    details: `Patient ${patientName} booked slot on ${slot.date} at ${slot.time} with ${doctorName}.`
  });

  // Notifications
  await Notification.create({
    userId: patientId,
    title: "Appointment Booked",
    message: `Your appointment with Dr. ${doctorName} is confirmed for ${slot.date} at ${slot.time}.`,
    timestamp: new Date().toLocaleString(),
    type: "appointment"
  });

  await Notification.create({
    userId: doctorId,
    title: "New Consultation",
    message: `Patient ${patientName} booked a consultation for ${slot.date} at ${slot.time}.`,
    timestamp: new Date().toLocaleString(),
    type: "appointment"
  });

  return appointment;
};

export const getAppointments = async (role, userId) => {
  if (role === "patient") {
    return await Appointment.find({ patientId: userId });
  } else if (role === "doctor") {
    return await Appointment.find({ doctorId: userId });
  }
  return await Appointment.find({});
};

export const cancelAppointment = async (appointmentId) => {
  const app = await Appointment.findById(appointmentId);
  if (!app) return;

  app.status = "Cancelled";
  await app.save();

  // Find slot to make it available again
  const slot = await Slot.findOne({
    doctorId: app.doctorId,
    date: app.slotDate,
    time: app.slotTime
  });

  if (slot) {
    slot.available = true;
    await slot.save();
  }

  await ActivityLog.create({
    timestamp: new Date().toLocaleString(),
    action: "Appointment Cancelled",
    details: `Appointment between ${app.patientName} and ${app.doctorName} was cancelled.`
  });

  // Notifications
  await Notification.create({
    userId: app.patientId,
    title: "Appointment Cancelled",
    message: `Your appointment with Dr. ${app.doctorName} has been cancelled.`,
    timestamp: new Date().toLocaleString(),
    type: "appointment"
  });

  await Notification.create({
    userId: app.doctorId,
    title: "Appointment Cancelled",
    message: `Appointment with patient ${app.patientName} has been cancelled.`,
    timestamp: new Date().toLocaleString(),
    type: "appointment"
  });
};

export const completeAppointment = async (appointmentId) => {
  const app = await Appointment.findById(appointmentId);
  if (!app) return;

  app.status = "Completed";
  await app.save();

  await ActivityLog.create({
    timestamp: new Date().toLocaleString(),
    action: "Appointment Completed",
    details: `Consultation between ${app.patientName} and ${app.doctorName} completed.`
  });
};
