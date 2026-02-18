import { Router } from "express";
import { activityLogger } from "../middlewares/activityLogger.middleware";
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

// router.post("/", protect, authorizeRoles("Admin", "HR"),validateRequest(createAchievementSchema), createAchievement);
// router.get("/", protect, getAllAchievements);
// router.get("/:employeeId", protect, getAchievementById);
// router.put("/:id", protect, authorizeRoles("Admin", "HR"), updateAchievement);
// router.delete(
//   "/:id",
//   protect,
//   authorizeRoles("Admin", "HR"),
//   deleteAchievement
// );
// Create achievement
router.post(
  "/",
  protect,
  authorizeRoles("Admin", "HR"),
  validateRequest(createAchievementSchema),
  activityLogger({ action: "CREATE_ACHIEVEMENT", module: "ACHIEVEMENT" }),
  createAchievement
);

// Get all achievements
router.get(
  "/",
  protect,
  activityLogger({ action: "GET_ALL_ACHIEVEMENTS", module: "ACHIEVEMENT" }),
  getAllAchievements
);

// Get achievement by employee ID
router.get(
  "/:employeeId",
  protect,
  activityLogger({ action: "GET_ACHIEVEMENT_BY_EMPLOYEE", module: "ACHIEVEMENT" }),
  getAchievementById
);

// Update achievement
router.put(
  "/:id",
  protect,
  authorizeRoles("Admin", "HR"),
  activityLogger({ action: "UPDATE_ACHIEVEMENT", module: "ACHIEVEMENT" }),
  updateAchievement
);

// Delete achievement
router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin", "HR"),
  activityLogger({ action: "DELETE_ACHIEVEMENT", module: "ACHIEVEMENT" }),
  deleteAchievement
);
export default router;
