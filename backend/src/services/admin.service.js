import { User } from "../models/user.model.js";
import { Patient } from "../models/patient.model.js";
import { Doctor } from "../models/doctor.model.js";
import { DoctorVerification } from "../models/doctorVerification.model.js";
import { Appointment } from "../models/appointment.model.js";
import { Slot } from "../models/slot.model.js";
import { Review } from "../models/review.model.js";
import { ActivityLog } from "../models/activityLog.model.js";

export const getVerifications = async () => {
  return await DoctorVerification.find({});
};

export const updateVerificationStatus = async (verificationId, status) => {
  const ver = await DoctorVerification.findById(verificationId);
  if (!ver) throw new Error("Verification record not found");

  ver.status = status;
  await ver.save();

  if (status === "Approved") {
    await Doctor.findByIdAndUpdate(ver.doctorId, { verified: true });
  }

  await ActivityLog.create({
    timestamp: new Date().toLocaleString(),
    action: "License Verification",
    details: `Admin ${status} license verification request for ${ver.doctorName}.`
  });

  return ver;
};

export const getAdminStats = async () => {
  const totalPatients = await User.countDocuments({ role: "patient" });
  const totalDoctors = await Doctor.countDocuments({});
  const verifiedDoctors = await Doctor.countDocuments({ verified: true });
  const totalAppointments = await Appointment.countDocuments({});
  const completedConsultations = await Appointment.countDocuments({ status: "Completed" });

  return {
    totalPatients,
    totalDoctors,
    verifiedDoctors,
    totalAppointments,
    completedConsultations
  };
};

export const getActivityLogs = async () => {
  return await ActivityLog.find({}).sort({ createdAt: -1 }).limit(100);
};

export const clearActivityLogs = async () => {
  return await ActivityLog.deleteMany({});
};

export const getPatients = async () => {
  return await User.find({ role: "patient" });
};

// Admin CRUD Patients
export const addPatientByAdmin = async (patientData) => {
  const existingUser = await User.findOne({ email: patientData.email });
  if (existingUser) throw new Error("Email already registered");

  const user = await User.create({
    name: patientData.name,
    email: patientData.email,
    password: patientData.password || "password",
    role: "patient"
  });

  const patient = await Patient.create({
    userId: user._id,
    name: patientData.name,
    email: patientData.email
  });

  await ActivityLog.create({
    timestamp: new Date().toLocaleString(),
    action: "Patient Created",
    details: `Admin created patient profile for ${patientData.name}`
  });

  return patient;
};

export const updatePatientByAdmin = async (id, patientData) => {
  const patient = await Patient.findOne({ $or: [{ userId: id }, { _id: id }] });
  if (!patient) {
    const user = await User.findById(id);
    if (!user) throw new Error("Patient not found");
    const newPat = await Patient.create({ userId: user._id, name: user.name, email: user.email });
    return updatePatientByAdmin(newPat._id, patientData);
  }

  const userId = patient.userId;
  const user = await User.findById(userId);
  if (!user) throw new Error("Patient credentials not found");

  if (patientData.email) {
    const existing = await User.findOne({ email: patientData.email });
    if (existing && existing._id.toString() !== userId.toString()) {
      throw new Error("Email already in use by another user");
    }
    user.email = patientData.email;
    patient.email = patientData.email;
  }

  if (patientData.name) {
    user.name = patientData.name;
    patient.name = patientData.name;
  }

  if (patientData.password) {
    user.password = patientData.password;
  }

  await user.save();
  await patient.save();

  await ActivityLog.create({
    timestamp: new Date().toLocaleString(),
    action: "Patient Updated",
    details: `Admin updated patient profile for ${patient.name}`
  });

  return user;
};

export const deletePatientByAdmin = async (id) => {
  const patient = await Patient.findOne({ $or: [{ userId: id }, { _id: id }] });
  if (!patient) {
    const user = await User.findById(id);
    if (user) {
      await User.findByIdAndDelete(id);
      await Appointment.deleteMany({ patientId: id });
    }
    return;
  }

  const userId = patient.userId;
  await User.findByIdAndDelete(userId);
  await Patient.findByIdAndDelete(patient._id);
  await Appointment.deleteMany({ patientId: userId });

  await ActivityLog.create({
    timestamp: new Date().toLocaleString(),
    action: "Patient Deleted",
    details: `Admin deleted patient profile for ${patient.name}`
  });
};

// Admin CRUD Doctors
export const addDoctorByAdmin = async (doctorData) => {
  const existingUser = await User.findOne({ email: doctorData.email });
  if (existingUser) throw new Error("Email already registered");

  const user = await User.create({
    name: doctorData.name,
    email: doctorData.email,
    password: doctorData.password || "password",
    role: "doctor"
  });

  const doctor = await Doctor.create({
    userId: user._id,
    name: doctorData.name,
    specialty: doctorData.specialty || "General Medicine",
    experience: Number(doctorData.experience) || 0,
    fee: Number(doctorData.fee) || 400,
    rating: 5.0,
    reviewsCount: 0,
    hospital: doctorData.hospital || "City Hospital",
    verified: doctorData.verified || false,
    bio: doctorData.bio || "No biography provided."
  });

  if (!doctor.verified) {
    await DoctorVerification.create({
      doctorId: doctor._id,
      doctorName: doctorData.name,
      license: doctorData.license || "MCI-ADMIN-CREATED",
      degree: doctorData.degree || "MBBS",
      status: "Pending",
      submittedAt: new Date().toISOString().split("T")[0]
    });
  }

  await ActivityLog.create({
    timestamp: new Date().toLocaleString(),
    action: "Doctor Created",
    details: `Admin created doctor profile for ${doctorData.name}`
  });

  return doctor;
};

export const updateDoctorByAdmin = async (id, doctorData) => {
  const doctor = await Doctor.findOne({ $or: [{ userId: id }, { _id: id }] });
  if (!doctor) throw new Error("Doctor profile not found");

  const userId = doctor.userId;
  const user = await User.findById(userId);
  if (!user) throw new Error("Doctor credentials not found");

  if (doctorData.email) {
    const existing = await User.findOne({ email: doctorData.email });
    if (existing && existing._id.toString() !== userId.toString()) {
      throw new Error("Email already in use by another user");
    }
    user.email = doctorData.email;
  }

  if (doctorData.name) {
    user.name = doctorData.name;
  }

  if (doctorData.password) {
    user.password = doctorData.password;
  }

  await user.save();

  // update doctor document
  doctor.name = doctorData.name || doctor.name;
  doctor.specialty = doctorData.specialty || doctor.specialty;
  doctor.experience = doctorData.experience !== undefined ? Number(doctorData.experience) : doctor.experience;
  doctor.fee = doctorData.fee !== undefined ? Number(doctorData.fee) : doctor.fee;
  doctor.hospital = doctorData.hospital || doctor.hospital;
  doctor.verified = doctorData.verified !== undefined ? doctorData.verified : doctor.verified;
  doctor.bio = doctorData.bio || doctor.bio;
  await doctor.save();

  if (doctorData.verified) {
    await DoctorVerification.findOneAndUpdate({ doctorId: doctor._id }, { status: "Approved" });
  }

  await ActivityLog.create({
    timestamp: new Date().toLocaleString(),
    action: "Doctor Updated",
    details: `Admin updated doctor profile for ${doctor.name}`
  });

  return doctor;
};

export const deleteDoctorByAdmin = async (id) => {
  const doctor = await Doctor.findOne({ $or: [{ userId: id }, { _id: id }] });
  if (!doctor) throw new Error("Doctor profile not found");
  
  const userId = doctor.userId;
  const doctorName = doctor.name;

  await DoctorVerification.findOneAndDelete({ doctorId: doctor._id });
  await Doctor.findByIdAndDelete(doctor._id);
  await User.findByIdAndDelete(userId);
  await Slot.deleteMany({ doctorId: userId });
  await Appointment.deleteMany({ doctorId: userId });

  await ActivityLog.create({
    timestamp: new Date().toLocaleString(),
    action: "Doctor Deleted",
    details: `Admin deleted doctor profile for ${doctorName}`
  });
};

export const getAllAppointments = async () => {
  return await Appointment.find({}).sort({ createdAt: -1 });
};

export const updateAppointmentStatus = async (id, status) => {
  const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
  if (!appointment) throw new Error("Appointment not found");
  return appointment;
};

export const deleteAppointment = async (id) => {
  return await Appointment.findByIdAndDelete(id);
};

export const getAllReviews = async () => {
  return await Review.find({}).sort({ createdAt: -1 });
};

export const deleteReviewByAdmin = async (id) => {
  const review = await Review.findById(id);
  if (!review) throw new Error("Review not found");
  
  const docId = review.doctorId;
  await Review.findByIdAndDelete(id);

  const reviews = await Review.find({ doctorId: docId });
  if (reviews.length > 0) {
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Doctor.findOneAndUpdate(
      { userId: docId },
      {
        rating: Number(avg.toFixed(1)),
        reviewsCount: reviews.length
      }
    );
  } else {
    await Doctor.findOneAndUpdate(
      { userId: docId },
      {
        rating: 5.0,
        reviewsCount: 0
      }
    );
  }
};

