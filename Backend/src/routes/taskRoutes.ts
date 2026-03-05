import { Router } from "express";
import { activityLogger } from "../middlewares/activityLogger.middleware";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController";
import { protect, authorizeRoles } from "../middlewares/authmiddlewares";
import {createTaskSchema} from "../validations/taskValidation"
import {validateRequest} from "../middlewares/validateRequest"

const router = Router();

// router.post(
//   "/createTasks",
//   protect,
//   authorizeRoles("Admin", "HR"),
//   validateRequest(createTaskSchema),
//   activityLogger({action: "CREATE_TASKS", module: "HR"}),
//   createTask
// );
// router.get("/allTasks", protect, getAllTasks);
// router.get("/:id", protect, getTaskById);
// router.put("/:id", protect,validateRequest(createTaskSchema), updateTask);
// router.delete(
//   "/:id",
//   protect,
//   authorizeRoles("Admin", "HR"),
//   deleteTask
// );
// Create task
router.post(
  "/createTasks",
  protect,
  authorizeRoles("Admin", "HR"),
  validateRequest(createTaskSchema),
  activityLogger({ action: "CREATE_TASK", module: "HR" }),
  createTask
);

// Get all tasks
router.get(
  "/allTasks",
  protect,
  activityLogger({ action: "GET_ALL_TASKS", module: "HR" }),
  getAllTasks
);

// Get single task by ID
router.get(
  "/:id",
  protect,
  activityLogger({ action: "GET_TASK_BY_ID", module: "USER" }),
  getTaskById
);

// Update task
router.put(
  "/:id",
  protect,
  activityLogger({ action: "UPDATE_TASK", module: "HR" }),
  updateTask
);

// Delete task
router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin", "HR"),
  activityLogger({ action: "DELETE_TASK", module: "HR" }),
  deleteTask
);

export default router;


