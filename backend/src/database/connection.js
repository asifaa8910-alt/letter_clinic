import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/letter_clinic";
  const isAtlas = uri.includes("mongodb.net") || uri.startsWith("mongodb+srv://");

  try {
    console.log(`Connecting to MongoDB (${isAtlas ? "MongoDB Atlas Cloud" : "Local MongoDB"})...`);

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      autoIndex: true
    });

    console.log(`✓ MongoDB Connected: ${conn.connection.host} [Database: ${conn.connection.name}]`);

    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB runtime connection error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB connection disconnected. Attempting reconnect...");
    });
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    console.warn("Ensure MongoDB is running locally or check your MongoDB Atlas credentials in backend/.env");
    process.exit(1);
  }
};
