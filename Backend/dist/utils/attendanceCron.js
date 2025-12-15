"use strict";
// import cron from "node-cron";
// import Attendance from "../models/Attendance.js";
// import Employee from "../models/EmployeeProfile.js";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAbsentsJob = void 0;
// export const markAbsentsJob = () => {
//   // Run every day at 11:50 AM Pakistan time
//   cron.schedule(
//     "15 12 * * *", // cron expression
//     async () => {
//       try {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         const employees = await Employee.find();
//         for (const emp of employees) {
//           const existing = await Attendance.findOne({
//             employeeId: emp._id,
//             date: today,
//           });
//           if (!existing) {
//             await Attendance.create({
//               employeeId: emp._id,
//               date: today,
//               status: "absent",
//             });
//           }
//         }
//         console.log("✅ Absentees marked at 11:11 AM");
//       } catch (err) {
//         console.error("❌ Error in absent marking:", err.message);
//       }
//     },
//     {
//       timezone: "Asia/Karachi", // ✅ correct place for options
//     }
//   );
// };
const node_cron_1 = __importDefault(require("node-cron"));
const Attendance_1 = __importDefault(require("../models/Attendance"));
const EmployeeProfile_1 = __importDefault(require("../models/EmployeeProfile"));
const markAbsentsJob = () => {
    return node_cron_1.default.schedule("11 11 * * *", async () => {
        try {
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            const end = new Date();
            end.setHours(23, 59, 59, 999);
            const employees = await EmployeeProfile_1.default.find();
            for (const emp of employees) {
                const existing = await Attendance_1.default.findOne({
                    employeeId: emp._id,
                    date: { $gte: start, $lte: end },
                });
                if (!existing) {
                    await Attendance_1.default.create({
                        employeeId: emp._id,
                        date: start,
                        status: "absent",
                    });
                }
            }
            console.log("✅ Absentees marked for", start.toDateString());
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error";
            console.error("❌ Error in absent marking:", message);
        }
    }, {
        timezone: "Asia/Karachi",
    });
};
exports.markAbsentsJob = markAbsentsJob;
