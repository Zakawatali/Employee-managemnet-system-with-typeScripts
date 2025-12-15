import { Router } from "express";
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

router.post("/checkin/:employeeId", protect, checkIn);
router.post("/checkout/:employeeId", protect, checkOut);
router.get("/getAttendance", protect, getAllattendance);
router.get("/:Id", protect, getAttendanceById);
router.put(
  "/:id",
  protect,
  authorizeRoles("Admin", "HR"),
  updateAttendance
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin", "HR"),
  deleteAttendance
);
router.get("/summary/daily", getDailySummary);
router.get("/summary/monthly", getMonthlySummary);

export default router;
