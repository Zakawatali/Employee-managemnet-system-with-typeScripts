import { Router } from "express";
import {
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController";
import { protect, authorizeRoles } from "../middlewares/authmiddlewares";

const router = Router();

router.get(
  "/",
  protect,
  authorizeRoles("Employee", "HR", "Admin"),
  getAllEmployees
);
router.get(
  "/:id",
  protect,
  authorizeRoles("Employee", "HR", "Admin"),
  getEmployeeById
);
router.put(
  "/:id",
  protect,
  authorizeRoles("HR", "Admin"),
  updateEmployee
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("HR", "Admin"),
  deleteEmployee
);

export default router;
