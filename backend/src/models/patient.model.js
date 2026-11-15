import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      default: ""
    },
    bloodGroup: {
      type: String,
      default: "O+"
    },
    medicalHistory: {
      type: String,
      default: "None reported"
    }
  },
  {
    timestamps: true
  }
);

export const Patient = mongoose.model("Patient", patientSchema);
