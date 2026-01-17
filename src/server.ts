import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

async function main() {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to DB", error);
  }
}

main();
