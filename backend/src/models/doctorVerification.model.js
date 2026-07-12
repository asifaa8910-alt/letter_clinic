import mongoose from "mongoose";

const doctorVerificationSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true
    },
    doctorName: {
      type: String,
      required: true
    },
    license: {
      type: String,
      default: "Pending Upload"
    },
    degree: {
      type: String,
      default: "Pending Upload"
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending"
    },
    submittedAt: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const DoctorVerification = mongoose.model("DoctorVerification", doctorVerificationSchema);
