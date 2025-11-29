import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { PORT } from "./config/env.js";

import authRoutes from "./routes/authRoutes.js";  // ✅ ADD THIS
import taskRoutes from "./routes/taskRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// ROUTES MUST BE ABOVE ERROR HANDLER
app.use("/api/auth", authRoutes);   // ✅ ENABLE IT
app.use("/api/tasks", taskRoutes);

// Error Handler (MUST be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
