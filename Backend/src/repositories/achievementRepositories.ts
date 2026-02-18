import Achievement, { AchievementDocument } from "../models/Achievement"; // Assuming AchievementDocument type exists
import { Types } from "mongoose";

/**
 * Creates a new Achievement record in the database.
 * @param achievementData The data for the new achievement.
 * @returns The newly created Achievement document.
 */
export const createAchievement = async (achievementData: any): Promise<AchievementDocument> => {
  const newAchievement = new Achievement(achievementData);
  return newAchievement.save();
};

/**
 * Finds all achievements, populating the user details.
 * @returns An array of Achievement documents.
 */
// export const findAllAchievements = async (): Promise<AchievementDocument[]> => {
//   return Achievement.find()
//     .populate("user", "firstName lastName email")
//     .exec();
// };
// export const findAllAchievementsPaginated = async (
//   skip: number,
//   limit: number
// ): Promise<AchievementDocument[]> => {
//   return Achievement.find()
//     .populate("user", "firstName lastName email")
//     .skip(skip)
//     .limit(limit)
//     .exec();
// };
export const countAchievements = async (): Promise<number> => {
  return Achievement.countDocuments();
};
export const findAllAchievementsPaginated = async (
  skip: number,
  limit: number,
  search?: string
): Promise<AchievementDocument[]> => {
  const matchStage: any = {};

  if (search && search.trim() !== "") {
    matchStage.$or = [
      { title: { $regex: search, $options: "i" } },
      { "user.firstName": { $regex: search, $options: "i" } },
      { "user.lastName": { $regex: search, $options: "i" } },
    ];
  }

  const achievements = await Achievement.aggregate([
    // Lookup user data
    {
      $lookup: {
        from: "employeeprofiles", // MongoDB collection name of EmployeeProfile
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $sort: { createdAt: -1 } }, 
    { $unwind: "$user" }, // Flatten the user array
    { $match: matchStage },
    { $skip: skip },
      { $limit: limit },

    {
      $project: {
        title: 1,
        body: 1,
        createdAt: 1,
        updatedAt: 1,
        user: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
        },
      },
    },
  ]);

  return achievements;
};


export const countAchievementsbyid = async (employeeId: string): Promise<number> => {
  return Achievement.countDocuments({ user: employeeId });
};


/**
 * Finds all achievements associated with a specific user/employee ID.
 * @param employeeId The ID of the user.
 * @returns An array of Achievement documents.
 */
export const findAchievementsByEmployeeId = async (
  employeeId: string,skip:number,limit:number
): Promise<AchievementDocument[]> => {
  return Achievement.find({ user: employeeId })
    .populate("user", "firstName lastName email")
    .skip(skip)
    .limit(limit)
    .exec();
};

/**
 * Finds an achievement by its ID.
 * @param id The ID of the achievement.
 * @returns The Achievement document or null if not found.
 */
export const findAchievementById = async (id: string): Promise<AchievementDocument | null> => {
  return Achievement.findById(id).exec();
};

/**
 * Updates an achievement by ID.
 * @param id The ID of the achievement to update.
 * @param updateData The data to apply (e.g., title, body).
 * @returns The updated Achievement document or null if not found.
 */
export const updateAchievementById = async (
  id: string,
  updateData: { title?: string; body?: string }
): Promise<AchievementDocument | null> => {
  return Achievement.findByIdAndUpdate(id, updateData, { new: true }).exec();
};

/**
 * Finds and deletes an achievement by ID.
 * @param id The ID of the achievement to delete.
 * @returns The deleted Achievement document or null if not found.
 */
export const deleteAchievementById = async (id: string): Promise<AchievementDocument | null> => {
  return Achievement.findByIdAndDelete(id).exec();
};