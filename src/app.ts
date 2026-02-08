import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { ensureDbConnection } from "./app/config/db";

const app: Application = express();

// middleware
app.use(express.json());
app.use(cors());

// Ensure DB connection before processing requests (for Vercel serverless)
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ensureDbConnection();
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Database connection failed" });
  }
});

// API routes
app.use("/api", router);

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "BdCalling Academy IELTS API is running!",
    version: "1.0.0",
  });
});

// Global error handler
app.use(globalErrorHandler);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
