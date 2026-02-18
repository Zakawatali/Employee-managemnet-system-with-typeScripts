import * as achievementRepository from "../repositories/achievementRepositories";
import { AchievementDocument } from "../models/Achievement"; // Assuming this type is available
import { Types } from "mongoose";
import {ERROR_MESSAGES} from "../constants/errorMessages"
import {SUCCESS_MESSAGES} from "../constants/successMessages"
import { ApiError } from "../utils/ApiError";


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
// export const getAllAchievementsService = async (): Promise<AchievementDocument[]> => {
//   return achievementRepository.findAllAchievements();
// };
// export const getAllAchievementsService = async (
//   page: number,
//   limit: number
// ): Promise<{
//   achievements: AchievementDocument[];
//   total: number;
//   totalPages: number;
//   page: number;
// }> => {
//   const skip = (page - 1) * limit;

//   const [achievements, total] = await Promise.all([
//     achievementRepository.findAllAchievementsPaginated(skip, limit),
//     achievementRepository.countAchievements(),
//   ]);

//   return {
//     achievements,
//     total,
//     totalPages: Math.ceil(total / limit),
//     page,
//   };
// };
export const getAllAchievementsService = async (
  page: number,
  limit: number,
  search?: string
): Promise<{
  achievements: AchievementDocument[];
  total: number;
  totalPages: number;
  page: number;
}> => {
  const skip = (page - 1) * limit;

  const [achievements, total] = await Promise.all([
    achievementRepository.findAllAchievementsPaginated(skip, limit, search),
    achievementRepository.countAchievements(),
    
  ]);

  return {
    achievements,
    total,
    totalPages: Math.ceil(total / limit),
    page,
  };
};

/**
 * Service to retrieve achievements for a specific employee.
 * @param employeeId The ID of the employee whose achievements to fetch.
 */
export const getAchievementsByEmployeeService = async (
  employeeId: string,
  page: number,
  limit: number
): Promise<{
  data: AchievementDocument[];
  total: number;
  totalPages: number;
  page: number;
}> => {
  // Input Validation
  if (!employeeId || !Types.ObjectId.isValid(employeeId)) {
    throw new ApiError("Invalid Employee ID provided",401);
  }

  const skip = (page - 1) * limit;

  // Fetch achievements for the page
  const achievements = await achievementRepository.findAchievementsByEmployeeId(
    employeeId,
    skip,
    limit
  );

  if (!achievements || achievements.length === 0) {
    throw new ApiError(ERROR_MESSAGES.ACHIEVEMENT_NOT_FOUBD,404);
  }

  // Get total count for this employee
  const total = await achievementRepository.countAchievementsbyid(employeeId);

  return {
    data: achievements,
    total,
    totalPages: Math.ceil(total / limit),
    page,
  };
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
    throw new ApiError(ERROR_MESSAGES.ACHIEVEMENT_NOT_FOUBD,404);
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
    throw new ApiError(ERROR_MESSAGES.ACHIEVEMENT_NOT_FOUBD,404);
    return;
  }

  return deletedAchievement;
};