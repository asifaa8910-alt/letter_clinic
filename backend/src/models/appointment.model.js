import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    patientName: {
      type: String,
      required: true
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    doctorName: {
      type: String,
      required: true
    },
    slotDate: {
      type: String,
      required: true
    },
    slotTime: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Booked", "Cancelled", "Completed"],
      default: "Booked"
    },
    videoRoomId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
