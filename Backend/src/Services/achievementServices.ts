import * as achievementRepository from "../repositories/achievementRepositories";
import { AchievementDocument } from "../models/Achievement"; // Assuming this type is available
import { Types } from "mongoose";



/**
 * Service to handle the creation of a new achievement.
 */
export const createAchievementService = async (
  achievementData: any
): Promise<AchievementDocument> => {
  // Business logic: Any pre-save validation or data transformation goes here

  const newAchievement = await achievementRepository.createAchievement(achievementData);
  return newAchievement;
};

/**
 * Service to retrieve all achievements.
 */
export const getAllAchievementsService = async (): Promise<AchievementDocument[]> => {
  return achievementRepository.findAllAchievements();
};

/**
 * Service to retrieve achievements for a specific employee.
 * @param employeeId The ID of the employee whose achievements to fetch.
 */
export const getAchievementsByEmployeeService = async (
  employeeId: string
): Promise<{ totalAchievements: number; data: AchievementDocument[] }> => {
  // Input Validation
  if (!employeeId || !Types.ObjectId.isValid(employeeId)) {
    throw new Error("Invalid Employee ID provided");
    return;
  }

  const achievements = await achievementRepository.findAchievementsByEmployeeId(employeeId);

  if (!achievements || achievements.length === 0) {
    throw new Error("No achievements found for this employee");
    return;
  }

  return { totalAchievements: achievements.length, data: achievements };
};

/**
 * Service to update an existing achievement.
 * @param id The ID of the achievement to update.
 * @param updateData The new title and body.
 */
export const updateAchievementService = async (
  id: string,
  updateData: { title?: string; body?: string }
): Promise<AchievementDocument> => {
  const updatedAchievement = await achievementRepository.updateAchievementById(id, updateData);

  if (!updatedAchievement) {
    throw new Error("Achievement not found");
    return;
  }

  return updatedAchievement;
};

/**
 * Service to delete an achievement.
 * @param id The ID of the achievement to delete.
 */
export const deleteAchievementService = async (id: string): Promise<AchievementDocument> => {
  const deletedAchievement = await achievementRepository.deleteAchievementById(id);

  if (!deletedAchievement) {
    throw new Error("Achievement not found");
    return;
  }

  return deletedAchievement;
};