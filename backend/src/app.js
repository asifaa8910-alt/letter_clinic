import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";

const app = express();

// Standard Security & Body Parsing Middlewares
app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173", // default Vite dev server port
  credentials: true
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routing Setup
app.use("/api", routes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found - ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  console.error(`[Error]: ${err.message}`, err.stack);
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: process.env.NODE_ENV === "development" ? [err.stack] : []
  });
});

export default app;
