import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

const app: Application = express();

// middleware
app.use(express.json());
app.use(cors());

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
