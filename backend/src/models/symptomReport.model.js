import mongoose from "mongoose";

const symptomReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    date: {
      type: String,
      required: true
    },
    age: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true
    },
    symptoms: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      required: true
    },
    suggestedSpecialist: {
      type: String,
      required: true
    },
    urgencyLevel: {
      type: String,
      required: true
    },
    possibleConditions: {
      type: [String],
      default: []
    },
    confidenceScore: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const SymptomReport = mongoose.model("SymptomReport", symptomReportSchema);
