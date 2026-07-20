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
      experience: Number(data.experience),
      fee: Number(data.fee),
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

// Slots
export const getDoctorSlots = async (id) => {
  const doc = await Doctor.findOne({ $or: [{ userId: id }, { _id: id }] });
  if (!doc) return [];
  return await Slot.find({ doctorId: doc.userId });
};

export const addDoctorSlot = async (doctorId, date, time) => {
  return await Slot.create({ doctorId, date, time, available: true });
};

export const deleteDoctorSlot = async (slotId) => {
  return await Slot.findByIdAndDelete(slotId);
};

// Reviews
export const getDoctorReviews = async (id) => {
  const doc = await Doctor.findOne({ $or: [{ userId: id }, { _id: id }] });
  if (!doc) return [];
  return await Review.find({ doctorId: doc.userId });
};

// Prescriptions
export const getPatientPrescriptions = async (patientId) => {
  return await Prescription.find({ patientId });
};

export const createPrescription = async (patientId, doctorName, symptoms, medicines, notes) => {
  const rx = await Prescription.create({
    patientId,
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

export const addReview = async (doctorId, patientName, rating, comment) => {
  const review = await Review.create({
    doctorId,
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

export const toggleDoctorSlot = async (slotId, doctorId) => {
  const slot = await Slot.findOne({ _id: slotId, doctorId });
  if (!slot) throw new Error("Slot not found");
  slot.available = !slot.available;
  await slot.save();
  return slot;
};

export const getDoctorPrescriptions = async (doctorName) => {
  return await Prescription.find({ doctorName }).sort({ createdAt: -1 });
};

export const getPrescriptionById = async (id) => {
  return await Prescription.findById(id);
};

export const getPatientReviews = async (patientName) => {
  return await Review.find({ patientName }).sort({ createdAt: -1 });
};

export const updateReview = async (id, patientName, rating, comment) => {
  const review = await Review.findOne({ _id: id, patientName });
  if (!review) throw new Error("Review not found");
  
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

export const deleteReview = async (id, patientName) => {
  const review = await Review.findOne({ _id: id, patientName });
  if (!review) throw new Error("Review not found");
  
  const docId = review.doctorId;
  await Review.deleteOne({ _id: id, patientName });

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
    ver.status = "Pending"; // reset status on update
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

  // Create an Activity Log entry
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

  const totalPrescriptions = await Prescription.countDocuments({ doctorName });

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



