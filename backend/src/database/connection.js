import mongoose from "mongoose";

let cachedPromise = null;

export const connectDB = async () => {
  // If already connected, reuse connection immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If already connecting, await existing promise
  if (mongoose.connection.readyState === 2 && cachedPromise) {
    return cachedPromise;
  }

  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/letter_clinic";
  const isAtlas = uri.includes("mongodb.net") || uri.startsWith("mongodb+srv://");

  try {
    console.log(`Connecting to MongoDB (${isAtlas ? "MongoDB Atlas Cloud" : "Local MongoDB"})...`);

    cachedPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      autoIndex: true
    });

    const conn = await cachedPromise;
    console.log(`✓ MongoDB Connected: ${conn.connection.host} [Database: ${conn.connection.name}]`);

    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB runtime connection error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB connection disconnected. Attempting reconnect...");
    });

    return conn;
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    console.warn("Ensure MongoDB is running locally or check your MongoDB Atlas credentials in backend/.env");
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  }
};
