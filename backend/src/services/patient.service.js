import { User } from "../models/user.model.js";
import { Patient } from "../models/patient.model.js";
import { SymptomReport } from "../models/symptomReport.model.js";
import { ActivityLog } from "../models/activityLog.model.js";
import { Reminder } from "../models/reminder.model.js";
import { Appointment } from "../models/appointment.model.js";

// AI Triage Rules
const SYMPTOM_RULES = [
  {
    keywords: ["chest", "heart", "palpitation", "breathing", "tightness", "cardiac"],
    specialty: "Cardiology",
    urgency: "High",
    confidence: "92%",
    conditions: ["Angina", "Arrhythmia", "Stress-induced palpitations"]
  },
  {
    keywords: ["headache", "migraine", "dizzy", "numbness", "seizure", "stroke", "tremor"],
    specialty: "Neurology",
    urgency: "Medium",
    confidence: "88%",
    conditions: ["Migraine Headaches", "Tension Headaches", "Peripheral Neuropathy"]
  },
  {
    keywords: ["rash", "acne", "skin", "itch", "mole", "spot", "burn", "eczema"],
    specialty: "Dermatology",
    urgency: "Low",
    confidence: "95%",
    conditions: ["Contact Dermatitis", "Atopic Eczema", "Acne Vulgaris"]
  },
  {
    keywords: ["sad", "depressed", "anxious", "panic", "sleep", "hallucination", "stress", "mood"],
    specialty: "Psychiatry",
    urgency: "Medium",
    confidence: "85%",
    conditions: ["Generalized Anxiety", "Major Depressive Episode", "Insomnia"]
  },
  {
    keywords: ["fever", "cough", "flu", "sore throat", "cold", "body ache", "fatigue"],
    specialty: "Pediatrics",
    urgency: "Medium",
    confidence: "78%",
    conditions: ["Viral Influenza", "Acute Pharyngitis", "Common Cold"]
  }
];

export const analyzeSymptoms = async (userId, age, gender, symptomsText, duration, severity) => {
  const textLower = symptomsText.toLowerCase();
  let match = null;

  for (const rule of SYMPTOM_RULES) {
    if (rule.keywords.some(k => textLower.includes(k))) {
      match = rule;
      break;
    }
  }

  if (!match) {
    match = {
      specialty: "General Medicine",
      urgency: severity === "Severe" ? "High" : "Low",
      confidence: "65%",
      conditions: ["General Fatigue / Weakness", "Atypical Symptom Presentation"]
    };
  }

  const report = await SymptomReport.create({
    userId,
    date: new Date().toISOString().split("T")[0],
    age,
    gender,
    symptoms: symptomsText,
    duration,
    severity,
    suggestedSpecialist: match.specialty,
    urgencyLevel: match.urgency,
    possibleConditions: match.conditions,
    confidenceScore: match.confidence
  });

  return report;
};

export const updatePatientProfile = async (userId, name, email, password) => {
  // Check if email already exists for another user
  const emailUser = await User.findOne({ email });
  if (emailUser && emailUser._id.toString() !== userId.toString()) {
    throw new Error("Email already registered by another account");
  }

  const user = await User.findById(userId);
  if (!user) throw new Error("Patient credentials not found");

  user.name = name;
  user.email = email;
  if (password) {
    user.password = password;
  }
  await user.save();

  await Patient.findOneAndUpdate({ userId }, { name, email });

  await ActivityLog.create({
    timestamp: new Date().toLocaleString(),
    action: "Patient Profile Updated",
    details: `Patient ${name} updated profile details.`
  });

  return user;
};

// Triage History
export const getSymptomReports = async (userId) => {
  return await SymptomReport.find({ userId }).sort({ createdAt: -1 });
};

export const getSymptomReportById = async (id, userId) => {
  return await SymptomReport.findOne({ _id: id, userId });
};

export const deleteSymptomReport = async (id, userId) => {
  return await SymptomReport.deleteOne({ _id: id, userId });
};

// Reminders
export const getReminders = async (userId) => {
  return await Reminder.find({ userId }).sort({ createdAt: -1 });
};

export const createReminder = async (userId, medicineName, dosage, frequency, time) => {
  return await Reminder.create({
    userId,
    type: "medicine",
    time,
    message: `${medicineName} (${dosage}) - ${frequency}`,
    active: true
  });
};

export const toggleReminder = async (id, userId) => {
  const reminder = await Reminder.findOne({ _id: id, userId });
  if (!reminder) throw new Error("Reminder not found");
  reminder.active = !reminder.active;
  await reminder.save();
  return reminder;
};

export const deleteReminder = async (id, userId) => {
  return await Reminder.deleteOne({ _id: id, userId });
};

export const updateReminder = async (reminderId, userId, updateFields) => {
  const reminder = await Reminder.findOne({ _id: reminderId, userId });
  if (!reminder) {
    throw new Error("Reminder not found");
  }

  // ponytail: Reminder stores medicine data packed into a single `message` string.
  // Parsing it back out with regex is fragile. Upgrade path: add medicineName/dosage/frequency
  // as real fields on the Reminder schema and drop the packed message format.
  // Format is "medicineName (dosage) - frequency"
  let medicineName = "";
  let dosage = "";
  let frequency = "";

  const match = reminder.message.match(/^(.*?)\s*\((.*?)\)\s*-\s*(.*)$/);
  if (match) {
    medicineName = match[1];
    dosage = match[2];
    frequency = match[3];
  } else {
    medicineName = reminder.message;
  }

  // Override with updated fields if provided
  if (updateFields.medicineName !== undefined) medicineName = updateFields.medicineName;
  if (updateFields.dosage !== undefined) dosage = updateFields.dosage;
  if (updateFields.frequency !== undefined) frequency = updateFields.frequency;

  if (updateFields.time !== undefined) {
    reminder.time = updateFields.time;
  }

  reminder.message = `${medicineName} (${dosage}) - ${frequency}`;
  await reminder.save();
  return reminder;
};

export const getPatientStats = async (userId) => {
  const upcomingAppointments = await Appointment.countDocuments({ patientId: userId, status: "Booked" });
  const completedAppointments = await Appointment.countDocuments({ patientId: userId, status: "Completed" });
  const activeReminders = await Reminder.countDocuments({ userId, active: true });
  const totalSymptomReports = await SymptomReport.countDocuments({ userId });

  return {
    upcomingAppointments,
    completedAppointments,
    activeReminders,
    totalSymptomReports
  };
};


