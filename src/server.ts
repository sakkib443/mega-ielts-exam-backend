import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./app/config/db";

dotenv.config();

// For Vercel serverless: export app directly
export default app;

// For local development
if (process.env.NODE_ENV !== "production") {
  const startServer = async () => {
    try {
      await connectDB();
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  };
  startServer();
}
