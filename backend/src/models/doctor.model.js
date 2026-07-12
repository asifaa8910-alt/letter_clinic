import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
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
    specialty: {
      type: String,
      default: "General Medicine"
    },
    experience: {
      type: Number,
      default: 0
    },
    fee: {
      type: Number,
      default: 400
    },
    rating: {
      type: Number,
      default: 5.0
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    hospital: {
      type: String,
      default: "City Hospital"
    },
    verified: {
      type: Boolean,
      default: false
    },
    bio: {
      type: String,
      default: "Clinical practitioner."
    }
  },
  {
    timestamps: true
  }
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
