import mongoose from "mongoose";
import { MONGO_URI } from "./env.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);

    console.log("🟢 MongoDB Connected");
    console.log("Host:", conn.connection.host);
    console.log("DB Name:", conn.connection.name);  // SHOW EXACT DB
  } catch (error) {
    console.error("🔴 MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};
