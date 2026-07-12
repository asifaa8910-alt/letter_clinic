import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    read: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "info"
    },
    timestamp: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Notification = mongoose.model("Notification", notificationSchema);
