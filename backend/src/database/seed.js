import { User } from "../models/user.model.js";
import { Doctor } from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";
import { Slot } from "../models/slot.model.js";
import { Review } from "../models/review.model.js";
import { DoctorVerification } from "../models/doctorVerification.model.js";
import { ActivityLog } from "../models/activityLog.model.js";
import { Notification } from "../models/notification.model.js";

const MOCK_DOCTORS_DATA = [
  {
    email: "doctor@clinic.com",
    name: "Dr. Eleanor Vance",
    specialty: "Cardiology",
    experience: 12,
    fee: 800,
    rating: 4.9,
    reviewsCount: 42,
    hospital: "Apex Cardiac Hospital, Mumbai",
    verified: true,
    bio: "Specializing in cardiovascular health, preventative cardiology, and non-invasive diagnostics."
  },
  {
    email: "doctor2@clinic.com",
    name: "Dr. Marcus Thorne",
    specialty: "Neurology",
    experience: 15,
    fee: 1000,
    rating: 4.8,
    reviewsCount: 38,
    hospital: "Fortis Memorial Research Institute, Delhi NCR",
    verified: true,
    bio: "Focused on headaches, cognitive disorders, neuromuscular medicine, and epilepsy."
  },
  {
    email: "doctor3@clinic.com",
    name: "Dr. Sarah Lin",
    specialty: "Dermatology",
    experience: 8,
    fee: 600,
    rating: 4.7,
    reviewsCount: 29,
    hospital: "Clear Skin Skin & Laser Clinic, Bengaluru",
    verified: true,
    bio: "Expertise in clinical dermatology, acne treatment, skin-hair disorders, and advanced therapies."
  },
  {
    email: "doctor4@clinic.com",
    name: "Dr. Robert Chen",
    specialty: "Pediatrics",
    experience: 10,
    fee: 500,
    rating: 4.9,
    reviewsCount: 55,
    hospital: "Apollo Children's Hospital, Chennai",
    verified: false,
    bio: "Dedicated to the comprehensive care of children from infancy through adolescence."
  },
  {
    email: "doctor5@clinic.com",
    name: "Dr. Anya Petrova",
    specialty: "Psychiatry",
    experience: 14,
    fee: 700,
    rating: 4.6,
    reviewsCount: 22,
    hospital: "NIMHANS Wellness Center affiliate, Bengaluru",
    verified: true,
    bio: "Providing empathetic care for anxiety disorders, depression, and stress management."
  }
];

export const seedDB = async () => {
  try {
    const userCount = await User.countDocuments({});
    if (userCount > 0) {
      console.log("Database already seeded. Skipping initial seeding.");
      return;
    }

    console.log("Seeding initial database...");

    // 1. Seed Patients
    const patientUser = await User.create({
      name: "John Doe",
      email: "patient@clinic.com",
      password: "password",
      role: "patient"
    });
    await Patient.create({
      userId: patientUser._id,
      name: patientUser.name,
      email: patientUser.email
    });

    // 2. Seed Admin
    await User.create({
      name: "Platform Admin",
      email: "admin@clinic.com",
      password: "password",
      role: "admin"
    });

    // 3. Seed Doctors
    for (const docInfo of MOCK_DOCTORS_DATA) {
      const docUser = await User.create({
        name: docInfo.name,
        email: docInfo.email,
        password: "password",
        role: "doctor"
      });

      const doctorObj = await Doctor.create({
        userId: docUser._id,
        name: docInfo.name,
        specialty: docInfo.specialty,
        experience: docInfo.experience,
        fee: docInfo.fee,
        rating: docInfo.rating,
        reviewsCount: docInfo.reviewsCount,
        hospital: docInfo.hospital,
        verified: docInfo.verified,
        bio: docInfo.bio
      });

      // Verification requests
      if (!docInfo.verified) {
        await DoctorVerification.create({
          doctorId: doctorObj._id,
          doctorName: docInfo.name,
          license: "MCI-99201-IND",
          degree: "MD Pediatrics (AIIMS Delhi)",
          status: "Pending",
          submittedAt: "2026-07-08"
        });
      } else {
        await DoctorVerification.create({
          doctorId: doctorObj._id,
          doctorName: docInfo.name,
          license: "MCI-APPROVED",
          degree: "MD Specialization",
          status: "Approved",
          submittedAt: "2026-07-01"
        });
      }
    }

    // 4. Seed Slots for doctor@clinic.com (Dr. Eleanor Vance)
    const docEleanor = await User.findOne({ email: "doctor@clinic.com" });
    const docMarcus = await User.findOne({ email: "doctor2@clinic.com" });
    const docSarah = await User.findOne({ email: "doctor3@clinic.com" });
    const docAnya = await User.findOne({ email: "doctor5@clinic.com" });

    if (docEleanor) {
      await Slot.create({ doctorId: docEleanor._id, date: "2026-07-09", time: "09:00 AM", available: true });
      await Slot.create({ doctorId: docEleanor._id, date: "2026-07-09", time: "10:30 AM", available: true });
      await Slot.create({ doctorId: docEleanor._id, date: "2026-07-10", time: "02:00 PM", available: true });
    }
    if (docMarcus) {
      await Slot.create({ doctorId: docMarcus._id, date: "2026-07-09", time: "11:00 AM", available: true });
      await Slot.create({ doctorId: docMarcus._id, date: "2026-07-09", time: "01:00 PM", available: true });
    }
    if (docSarah) {
      await Slot.create({ doctorId: docSarah._id, date: "2026-07-09", time: "03:00 PM", available: true });
      await Slot.create({ doctorId: docSarah._id, date: "2026-07-10", time: "09:30 AM", available: true });
    }
    if (docAnya) {
      await Slot.create({ doctorId: docAnya._id, date: "2026-07-09", time: "10:00 AM", available: true });
    }

    // 5. Seed Reviews
    if (docEleanor) {
      await Review.create({
        doctorId: docEleanor._id,
        patientName: "Jane Smith",
        rating: 5,
        comment: "Exceptional cardiologist! Spent time explaining everything.",
        date: "2026-07-05"
      });
    }

    // 6. Seed Activity Logs & Notifications
    await ActivityLog.create({ timestamp: new Date().toLocaleString(), action: "System Seed", details: "Initial medical platform database seeded successfully." });
    await ActivityLog.create({ timestamp: new Date().toLocaleString(), action: "Admin Action", details: "Platform admin registered to security logs." });

    if (patientUser) {
      await Notification.create({ userId: patientUser._id, title: "Welcome to Letters Clinic", message: "Your digital medical workspace is ready. You can consult doctors and track your vitals here.", read: false, type: "system", timestamp: new Date().toLocaleString() });
    }
    if (docEleanor) {
      await Notification.create({ userId: docEleanor._id, title: "Verification Approved", message: "Congratulations! Your clinical practitioner license has been approved.", read: false, type: "verification", timestamp: new Date().toLocaleString() });
    }

    console.log("Database seeded successfully.");
  } catch (err) {
    console.error(`Database Seeding Error: ${err.message}`);
  }
};
