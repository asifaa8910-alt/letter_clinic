import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    medicineName: {
      type: String,
      default: ""
    },
    dosage: {
      type: String,
      default: ""
    },
    frequency: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "medicine"
    },
    time: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const Reminder = mongoose.model("Reminder", reminderSchema);
