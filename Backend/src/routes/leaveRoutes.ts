import { Router } from "express";
import { activityLogger } from "../middlewares/activityLogger.middleware";
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

// router.post("/applyLeave", protect,validateRequest(leaveRequestSchema), applyLeave);
// router.get("/", protect, getAllLeaves);
//  router.get("/:employeeId", protect, getLeaveByEmployeeId);
// router.put(
//   "/approve/:id",
//   protect,
//   authorizeRoles("Admin", "HR"),
//   approveLeave
// );
// router.put(
//   "/reject/:id",
//   protect,
//   authorizeRoles("Admin", "HR"),
//   rejectLeave
// );
// router.put(
//   "/cancel/:id",
//   protect,
//   authorizeRoles("Admin", "HR"),
//   cancelLeave
// );
// router.delete("/:id", protect, authorizeRoles("Admin", "HR"), deleteLeave);
// Apply leave
router.post(
  "/applyLeave",
  protect,
  validateRequest(leaveRequestSchema),
  activityLogger({ action: "APPLY_LEAVE", module: "LEAVE" }),
  applyLeave
);

// Get all leaves
router.get(
  "/",
  protect,
  activityLogger({ action: "GET_ALL_LEAVES", module: "LEAVE" }),
  getAllLeaves
);

// Get leave by employee ID
router.get(
  "/:employeeId",
  protect,
  activityLogger({ action: "GET_LEAVE_BY_EMPLOYEE", module: "LEAVE" }),
  getLeaveByEmployeeId
);

// Approve leave
router.put(
  "/approve/:id",
  protect,
  authorizeRoles("Admin", "HR"),
  activityLogger({ action: "APPROVE_LEAVE", module: "LEAVE" }),
  approveLeave
);

// Reject leave
router.put(
  "/reject/:id",
  protect,
  authorizeRoles("Admin", "HR"),
  activityLogger({ action: "REJECT_LEAVE", module: "LEAVE" }),
  rejectLeave
);

// Cancel leave
router.put(
  "/cancel/:id",
  protect,
  authorizeRoles("Admin", "HR"),
  activityLogger({ action: "CANCEL_LEAVE", module: "LEAVE" }),
  cancelLeave
);

// Delete leave
router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin", "HR"),
  activityLogger({ action: "DELETE_LEAVE", module: "LEAVE" }),
  deleteLeave
);

export default router;
