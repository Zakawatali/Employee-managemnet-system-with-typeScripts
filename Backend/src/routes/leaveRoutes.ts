import { Router } from "express";
import {
  applyLeave,
  getAllLeaves,
  getLeaveByEmployeeId,
  approveLeave,
  rejectLeave,
  cancelLeave,
  deleteLeave,
} from "../controllers/leaveController";
import { protect, authorizeRoles } from "../middlewares/authmiddlewares";
import {leaveRequestSchema} from "../validations/leaveValidation"
import {validateRequest} from "../middlewares/validateRequest"

const router = Router();

router.post("/applyLeave", protect,validateRequest(leaveRequestSchema), applyLeave);
router.get("/", protect, getAllLeaves);
 router.get("/:employeeId", protect, getLeaveByEmployeeId);
router.put(
  "/approve/:id",
  protect,
  authorizeRoles("Admin", "HR"),
  approveLeave
);
router.put(
  "/reject/:id",
  protect,
  authorizeRoles("Admin", "HR"),
  rejectLeave
);
router.put(
  "/cancel/:id",
  protect,
  authorizeRoles("Admin", "HR"),
  cancelLeave
);
router.delete("/:id", protect, authorizeRoles("Admin", "HR"), deleteLeave);

export default router;
