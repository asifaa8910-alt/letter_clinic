import { User } from "../models/user.model.js";
import { Doctor } from "../models/doctor.model.js";
import { Slot } from "../models/slot.model.js";
import { Review } from "../models/review.model.js";
import { Prescription } from "../models/prescription.model.js";
import { Appointment } from "../models/appointment.model.js";
import { Notification } from "../models/notification.model.js";
import { ActivityLog } from "../models/activityLog.model.js";
import { DoctorVerification } from "../models/doctorVerification.model.js";

export const getDoctors = async (filters = {}) => {
  const query = {};
  if (filters.specialty) {
    query.specialty = filters.specialty;
  }
  if (filters.search) {
    query.name = { $regex: filters.search, $options: "i" };
  }
  if (filters.maxFee) {
    query.fee = { $lte: Number(filters.maxFee) };
  }
  if (filters.onlyVerified) {
    query.verified = true;
  }
  const docs = await Doctor.find(query).populate("userId", "email");
  return docs.map(doc => {
    const obj = doc.toObject();
    return { ...obj, email: obj.userId?.email || "" };
  });
};

export const getDoctorByUserId = async (userId) => {
  const doc = await Doctor.findOne({ userId }).populate("userId", "email");
  if (!doc) return null;
  const obj = doc.toObject();
  return { ...obj, email: obj.userId?.email || "" };
};

export const updateDoctorProfile = async (userId, data) => {
  const emailUser = await User.findOne({ email: data.email });
  if (emailUser && emailUser._id.toString() !== userId.toString()) {
    throw new Error("Email already registered by another account");
  }

  const user = await User.findById(userId);
  if (!user) throw new Error("Doctor credentials not found");

  user.name = data.name;
  user.email = data.email;
  if (data.password) {
    user.password = data.password;
  }
  await user.save();

  const doctor = await Doctor.findOneAndUpdate(
    { userId },
    {
      name: data.name,
      specialty: data.specialty,
      experience: Number(data.experience) || 0,
      fee: Number(data.fee) || 400,
      hospital: data.hospital,
      bio: data.bio
    },
    { new: true }
  );

  await ActivityLog.create({
    timestamp: new Date().toLocaleString(),
    action: "Doctor Profile Updated",
    details: `Doctor ${data.name} updated profile details.`
  });

  return doctor;
};

// Slots with IDOR Protection
export const getDoctorSlots = async (id) => {
  const doc = await Doctor.findOne({ $or: [{ userId: id }, { _id: id }] });
  if (!doc) return [];
  return await Slot.find({ doctorId: doc.userId }).sort({ date: 1, time: 1 });
};

export const addDoctorSlot = async (doctorId, date, time) => {
  return await Slot.create({ doctorId, date, time, available: true });
};

export const deleteDoctorSlot = async (slotId, doctorId) => {
  // IDOR Protection: Doctor can only delete their own slots
  const query = doctorId ? { _id: slotId, doctorId } : { _id: slotId };
  const slot = await Slot.findOneAndDelete(query);
  if (!slot) {
    throw new Error("Slot not found or not authorized to delete");
  }
  return slot;
};

export const toggleDoctorSlot = async (slotId, doctorId) => {
  const slot = await Slot.findOne({ _id: slotId, doctorId });
  if (!slot) throw new Error("Slot not found or not authorized");
  slot.available = !slot.available;
  await slot.save();
  return slot;
};

// Reviews with Patient ID Tracking & IDOR Protection
export const getDoctorReviews = async (id) => {
  const doc = await Doctor.findOne({ $or: [{ userId: id }, { _id: id }] });
  if (!doc) return [];
  return await Review.find({ doctorId: doc.userId }).sort({ createdAt: -1 });
};

export const addReview = async (doctorId, patientId, patientName, rating, comment) => {
  const review = await Review.create({
    doctorId,
    patientId,
    patientName,
    rating: Number(rating),
    comment,
    date: new Date().toISOString().split("T")[0]
  });

  const reviews = await Review.find({ doctorId });
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await Doctor.findOneAndUpdate(
    { userId: doctorId },
    {
      rating: Number(avg.toFixed(1)),
      reviewsCount: reviews.length
    }
  );

  await ActivityLog.create({
    timestamp: new Date().toLocaleString(),
    action: "Review Submitted",
    details: `Patient ${patientName} submitted review for Doctor ID ${doctorId} with ${rating} stars.`
  });

  return review;
};

export const getPatientReviews = async (patientId, patientName) => {
  return await Review.find({
    $or: [{ patientId }, { patientName }]
  }).sort({ createdAt: -1 });
};

export const updateReview = async (id, patientId, patientName, rating, comment) => {
  const review = await Review.findOne({
    _id: id,
    $or: [{ patientId }, { patientName }]
  });
  if (!review) throw new Error("Review not found or not authorized to edit");

  if (rating !== undefined) review.rating = Number(rating);
  if (comment !== undefined) review.comment = comment;
  await review.save();

  const reviews = await Review.find({ doctorId: review.doctorId });
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await Doctor.findOneAndUpdate(
    { userId: review.doctorId },
    {
      rating: Number(avg.toFixed(1)),
      reviewsCount: reviews.length
    }
  );

  return review;
};

export const deleteReview = async (id, patientId, patientName) => {
  const review = await Review.findOne({
    _id: id,
    $or: [{ patientId }, { patientName }]
  });
  if (!review) throw new Error("Review not found or not authorized to delete");

  const docId = review.doctorId;
  await Review.deleteOne({ _id: id });

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

// Prescriptions with IDOR Protection
export const getPatientPrescriptions = async (patientId) => {
  return await Prescription.find({ patientId }).sort({ createdAt: -1 });
};

export const createPrescription = async (patientId, doctorId, doctorName, symptoms, medicines, notes) => {
  const rx = await Prescription.create({
    patientId,
    doctorId,
    doctorName,
    date: new Date().toISOString().split("T")[0],
    symptoms,
    medicines,
    notes
  });

  await Notification.create({
    userId: patientId,
    title: "Prescription Received",
    message: `Dr. ${doctorName} has issued a digital prescription for you.`,
    timestamp: new Date().toLocaleString(),
    type: "prescription"
  });

  await ActivityLog.create({
    timestamp: new Date().toLocaleString(),
    action: "Prescription Issued",
    details: `Dr. ${doctorName} issued digital prescription to Patient ID ${patientId}.`
  });

  return rx;
};

export const getDoctorPrescriptions = async (doctorId, doctorName) => {
  return await Prescription.find({
    $or: [{ doctorId }, { doctorName }]
  }).sort({ createdAt: -1 });
};

export const getPrescriptionById = async (id, user) => {
  const rx = await Prescription.findById(id);
  if (!rx) return null;

  // IDOR Protection: Verify caller is the patient, doctor, or admin
  if (user && user.role !== "admin") {
    const isOwner =
      rx.patientId.toString() === user._id.toString() ||
      (rx.doctorId && rx.doctorId.toString() === user._id.toString()) ||
      rx.doctorName === user.name;
    if (!isOwner) {
      throw new Error("Not authorized to view this prescription");
    }
  }

  return rx;
};

export const getDoctorVerificationStatus = async (userId) => {
  const doc = await Doctor.findOne({ userId });
  if (!doc) throw new Error("Doctor profile not found");
  return await DoctorVerification.findOne({ doctorId: doc._id });
};

export const submitVerification = async (userId, license, degree) => {
  const doc = await Doctor.findOne({ userId });
  if (!doc) {
    throw new Error("Doctor profile not found");
  }

  // Find existing verification request
  let ver = await DoctorVerification.findOne({ doctorId: doc._id });
  if (ver) {
    if (ver.status === "Approved") {
      throw new Error("Verification request is already approved.");
    }
    ver.license = license;
    ver.degree = degree;
    ver.status = "Pending";
    ver.submittedAt = new Date().toISOString().split("T")[0];
    await ver.save();
  } else {
    ver = await DoctorVerification.create({
      doctorId: doc._id,
      doctorName: doc.name,
      license,
      degree,
      status: "Pending",
      submittedAt: new Date().toISOString().split("T")[0]
    });
  }

  await ActivityLog.create({
    timestamp: new Date().toLocaleString(),
    action: "Doctor Verification Submitted",
    details: `Doctor ${doc.name} submitted verification details.`
  });

  return ver;
};

export const getDoctorStats = async (userId) => {
  const doc = await Doctor.findOne({ userId });
  if (!doc) {
    throw new Error("Doctor profile not found");
  }

  const doctorName = doc.name;

  const totalAppointments = await Appointment.countDocuments({ doctorId: userId });
  const bookedAppointments = await Appointment.countDocuments({ doctorId: userId, status: "Booked" });
  const completedAppointments = await Appointment.countDocuments({ doctorId: userId, status: "Completed" });
  const cancelledAppointments = await Appointment.countDocuments({ doctorId: userId, status: "Cancelled" });

  const totalPrescriptions = await Prescription.countDocuments({
    $or: [{ doctorId: userId }, { doctorName }]
  });

  return {
    totalAppointments,
    bookedAppointments,
    completedAppointments,
    cancelledAppointments,
    totalPrescriptions,
    rating: doc.rating,
    reviewsCount: doc.reviewsCount
  };
};
