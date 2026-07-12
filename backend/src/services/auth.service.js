import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Patient } from "../models/patient.model.js";
import { Doctor } from "../models/doctor.model.js";
import { DoctorVerification } from "../models/doctorVerification.model.js";
import { ActivityLog } from "../models/activityLog.model.js";
import { Notification } from "../models/notification.model.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

export const registerUser = async (name, email, password, role) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const user = await User.create({ name, email, password, role });
  const token = generateToken(user._id);

  if (role === "patient") {
    await Patient.create({ userId: user._id, name, email });
    await Notification.create({
      userId: user._id,
      title: "Welcome to Letters Clinic",
      message: "Your digital medical workspace is ready. You can consult doctors and track your vitals here.",
      timestamp: new Date().toLocaleString(),
      type: "system"
    });
  } else if (role === "doctor") {
    const doctor = await Doctor.create({
      userId: user._id,
      name,
      specialty: "General Medicine",
      experience: 0,
      fee: 400,
      rating: 5.0,
      reviewsCount: 0,
      hospital: "City Hospital",
      verified: false,
      bio: "Newly registered practitioner."
    });

    await DoctorVerification.create({
      doctorId: doctor._id,
      doctorName: name,
      license: "Pending Upload",
      degree: "Pending Upload",
      status: "Pending",
      submittedAt: new Date().toISOString().split("T")[0]
    });
  }

  await ActivityLog.create({
    timestamp: new Date().toLocaleString(),
    action: "User Registration",
    details: `New user ${name} registered as a ${role}.`
  });

  return { user, token };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id);

  await ActivityLog.create({
    timestamp: new Date().toLocaleString(),
    action: "User Login",
    details: `${user.name} (${user.role}) logged in successfully.`
  });

  return { user, token };
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user || !(await user.comparePassword(currentPassword))) {
    throw new Error("Incorrect current password");
  }
  user.password = newPassword;
  await user.save();

  await ActivityLog.create({
    timestamp: new Date().toLocaleString(),
    action: "Password Change",
    details: `${user.name} (${user.role}) changed their password.`
  });
};

