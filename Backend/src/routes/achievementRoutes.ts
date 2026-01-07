import { Router } from "express";
import {
  createAchievement,
  getAllAchievements,
  getAchievementById,
  updateAchievement,
  deleteAchievement,
} from "../controllers/achievementController";
import {createAchievementSchema } from "../validations/achievementValidation"
import {validateRequest} from "../middlewares/validateRequest"
import { protect, authorizeRoles } from "../middlewares/authmiddlewares";

const router = Router();

router.post("/", protect, authorizeRoles("Admin", "HR"),validateRequest(createAchievementSchema), createAchievement);
router.get("/", protect, getAllAchievements);
router.get("/:employeeId", protect, getAchievementById);
router.put("/:id", protect, authorizeRoles("Admin", "HR"), updateAchievement);
router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin", "HR"),
  deleteAchievement
);

export default router;
