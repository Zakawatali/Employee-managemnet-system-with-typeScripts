import path from "path";
import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
 import employeeRoutes from "./routes/employeeRoutes";
import taskRoutes from "./routes/taskRoutes";
 import attendanceRoutes from "./routes/attendanceRoutes";
import leaveRoutes from "./routes/leaveRoutes";
 import achievementRoutes from "./routes/achievementRoutes";
 import documentRoutes from "./routes/documentRoutes";
 import { markAbsentsJob } from "./utils/attendanceCron";
import { OutputHandler } from "./middlewares/outputHandler";
import rateLimit     from "./utils/rateLimit"


dotenv.config();
const app: Application = express();

const corsOptions: CorsOptions = {
  origin: process.env.FRONTEND_URL || "*",
};
app.use(cors(corsOptions));
connectDB();
// ✅ Start Cron Job
 markAbsentsJob();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded());
app.use(rateLimit)
// Initialize result/error holders
app.use((req: any, res: any, next: any) => {
  res.result = null;
  res.error = null;
  next();
});



 const uploadsDir = path.resolve(__dirname, "../uploads");

// Routes
 app.use("/api/users", userRoutes);
 app.use("/api/employee", employeeRoutes);
 app.use("/api/task", taskRoutes);
 app.use("/api/attendance", attendanceRoutes);
 app.use("/api/leaves", leaveRoutes);
 app.use("/api/achievements", achievementRoutes);
 app.use("/uploads", express.static(uploadsDir));
 app.use("/api/documents", documentRoutes);
 app.use('/uploads', express.static(uploadsDir));
// Output Handler
app.use(OutputHandler)

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
