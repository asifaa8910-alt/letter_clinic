import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  duration: { type: String, required: true },
  instructions: { type: String, required: true }
});

const prescriptionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    doctorName: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    symptoms: {
      type: String,
      required: true
    },
    medicines: {
      type: [medicineSchema],
      default: []
    },
    notes: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

export const Prescription = mongoose.model("Prescription", prescriptionSchema);
