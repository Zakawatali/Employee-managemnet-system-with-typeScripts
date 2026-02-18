import { Router } from "express";
import { activityLogger } from "../middlewares/activityLogger.middleware";
import {
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController";
import { protect, authorizeRoles } from "../middlewares/authmiddlewares";

const router = Router();

// router.get(
//   "/",
//   protect,
//   authorizeRoles("Employee", "HR", "Admin"),
//   getAllEmployees
// );
// router.get(
//   "/:id",
//   protect,
//   authorizeRoles("Employee", "HR", "Admin"),
//   getEmployeeById
// );
// router.put(
//   "/:id",
//   protect,
//   authorizeRoles("HR", "Admin"),
//   updateEmployee
// );
// router.delete(
//   "/:id",
//   protect,
//   authorizeRoles("HR", "Admin"),
//   deleteEmployee
// );
// Get all employees
router.get(
  "/",
  protect,
  authorizeRoles("Employee", "HR", "Admin"),
  activityLogger({ action: "GET_ALL_EMPLOYEES", module: "EMPLOYEE" }),
  getAllEmployees
);

// Get employee by ID
router.get(
  "/:id",
  protect,
  authorizeRoles("Employee", "HR", "Admin"),
  activityLogger({ action: "GET_EMPLOYEE_BY_ID", module: "EMPLOYEE" }),
  getEmployeeById
);

// Update employee
router.put(
  "/:id",
  protect,
  authorizeRoles("HR", "Admin"),
  activityLogger({ action: "UPDATE_EMPLOYEE", module: "EMPLOYEE" }),
  updateEmployee
);

// Delete employee
router.delete(
  "/:id",
  protect,
  authorizeRoles("HR", "Admin"),
  activityLogger({ action: "DELETE_EMPLOYEE", module: "EMPLOYEE" }),
  deleteEmployee
);
export default router;
