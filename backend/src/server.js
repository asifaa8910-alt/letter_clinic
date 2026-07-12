import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./database/connection.js";
import { seedDB } from "./database/seed.js";

// Load Environment variables
dotenv.config();

const startServer = async () => {
  // Connect to local MongoDB Database
  await connectDB();
  
  // Seed database
  await seedDB();

  const PORT = process.env.PORT || 5050;

  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err, promise) => {
    console.error(`Unhandled Rejection Error: ${err.message}`);
    server.close(() => process.exit(1));
  });
};

startServer();
