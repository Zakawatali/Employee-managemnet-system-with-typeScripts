"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const employeeRoutes_1 = __importDefault(require("./routes/employeeRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const attendanceRoutes_1 = __importDefault(require("./routes/attendanceRoutes"));
const leaveRoutes_1 = __importDefault(require("./routes/leaveRoutes"));
const achievementRoutes_1 = __importDefault(require("./routes/achievementRoutes"));
const documentRoutes_1 = __importDefault(require("./routes/documentRoutes"));
const attendanceCron_1 = require("./utils/attendanceCron");
const outputHandler_1 = require("./middlewares/outputHandler");
dotenv_1.default.config();
// ✅ allow requests from your frontend
const app = (0, express_1.default)();
const corsOptions = {
    origin: process.env.FRONTEND_URL || "*",
};
app.use((0, cors_1.default)(corsOptions));
// ✅ Start Cron Job
(0, db_1.default)();
(0, attendanceCron_1.markAbsentsJob)();
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
// Initialize result/error holders
app.use((req, res, next) => {
    res.result = null;
    res.error = null;
    next();
});
const uploadsDir = path_1.default.resolve(__dirname, "../uploads");
// Routes
app.use("/api/users", userRoutes_1.default);
app.use("/api/employee", employeeRoutes_1.default);
app.use("/api/task", taskRoutes_1.default);
app.use("/api/attendance", attendanceRoutes_1.default);
app.use("/api/leaves", leaveRoutes_1.default);
app.use("/api/achievements", achievementRoutes_1.default);
app.use("/uploads", express_1.default.static(uploadsDir));
app.use("/api/documents", documentRoutes_1.default);
// Output Handler
app.use(outputHandler_1.OutputHandler);
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
