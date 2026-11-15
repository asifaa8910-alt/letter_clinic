import dotenv from "dotenv";
dotenv.config();

import app from "../backend/src/app.js";
import { connectDB } from "../backend/src/database/connection.js";

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Vercel Serverless Function DB Error:", error);
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message
    });
  }
}
