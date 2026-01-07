import { Router } from "express";
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

router.post(
  "/createTasks",
  protect,
  authorizeRoles("Admin", "HR"),
  validateRequest(createTaskSchema),
  createTask
);
router.get("/allTasks", protect, getAllTasks);
router.get("/:id", protect, getTaskById);
router.put("/:id", protect,validateRequest(createTaskSchema), updateTask);
router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin", "HR"),
  deleteTask
);

export default router;


