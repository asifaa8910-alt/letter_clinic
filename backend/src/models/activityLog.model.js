import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    timestamp: {
      type: String,
      required: true
    },
    action: {
      type: String,
      required: true
    },
    details: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
