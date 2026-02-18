import { Router } from "express";
import { activityLogger } from "../middlewares/activityLogger.middleware";
import {
  checkIn,
  checkOut,
  updateAttendance,
  deleteAttendance,
  getAllattendance,
  getAttendanceById,
  getDailySummary,
  getMonthlySummary,
} from "../controllers/attendanceController";
import { protect, authorizeRoles } from "../middlewares/authmiddlewares";

const router = Router();

// router.post("/checkin/:employeeId", protect, checkIn);
// router.post("/checkout/:employeeId", protect, checkOut);
// router.get("/getAttendance", protect, getAllattendance);
// router.get("/:Id", protect, getAttendanceById);
// router.put(
//   "/:id",
//   protect,
//   authorizeRoles("Admin", "HR"),
//   updateAttendance
// );
// router.delete(
//   "/:id",
//   protect,
//   authorizeRoles("Admin", "HR"),
//   deleteAttendance
// );
// router.get("/summary/daily", getDailySummary);
// router.get("/summary/monthly", getMonthlySummary);
// Employee check-in
router.post(
  "/checkin/:employeeId",
  protect,
  activityLogger({ action: "CHECK_IN", module: "ATTENDANCE" }),
  checkIn
);

// Employee check-out
router.post(
  "/checkout/:employeeId",
  protect,
  activityLogger({ action: "CHECK_OUT", module: "ATTENDANCE" }),
  checkOut
);

// Get all attendance records
router.get(
  "/getAttendance",
  protect,
  activityLogger({ action: "GET_ALL_ATTENDANCE", module: "ATTENDANCE" }),
  getAllattendance
);

// Get attendance by ID
router.get(
  "/:Id",
  protect,
  activityLogger({ action: "GET_ATTENDANCE_BY_ID", module: "ATTENDANCE" }),
  getAttendanceById
);

// Update attendance (Admin/HR)
router.put(
  "/:id",
  protect,
  authorizeRoles("Admin", "HR"),
  activityLogger({ action: "UPDATE_ATTENDANCE", module: "ATTENDANCE" }),
  updateAttendance
);

// Delete attendance (Admin/HR)
router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin", "HR"),
  activityLogger({ action: "DELETE_ATTENDANCE", module: "ATTENDANCE" }),
  deleteAttendance
);

// Daily summary
router.get(
  "/summary/daily",
  activityLogger({ action: "DAILY_ATTENDANCE_SUMMARY", module: "ATTENDANCE" }),
  getDailySummary
);

// Monthly summary
router.get(
  "/summary/monthly",
  activityLogger({ action: "MONTHLY_ATTENDANCE_SUMMARY", module: "ATTENDANCE" }),
  getMonthlySummary
);
export default router;
