import { Router } from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController";
import { protect, authorizeRoles } from "../middlewares/authmiddlewares";

const router = Router();

router.post(
  "/createTasks",
  protect,
  authorizeRoles("Admin", "HR"),
  createTask
);
router.get("/allTasks", protect, getAllTasks);
router.get("/:id", protect, getTaskById);
router.put("/:id", protect, updateTask);
router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin", "HR"),
  deleteTask
);

export default router;


