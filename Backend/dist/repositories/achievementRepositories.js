"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAchievementById = exports.updateAchievementById = exports.findAchievementById = exports.findAchievementsByEmployeeId = exports.findAllAchievements = exports.createAchievement = void 0;
const Achievement_1 = __importDefault(require("../models/Achievement")); // Assuming AchievementDocument type exists
/**
 * Creates a new Achievement record in the database.
 * @param achievementData The data for the new achievement.
 * @returns The newly created Achievement document.
 */
const createAchievement = async (achievementData) => {
    const newAchievement = new Achievement_1.default(achievementData);
    return newAchievement.save();
};
exports.createAchievement = createAchievement;
/**
 * Finds all achievements, populating the user details.
 * @returns An array of Achievement documents.
 */
const findAllAchievements = async () => {
    return Achievement_1.default.find()
        .populate("user", "firstName lastName email")
        .exec();
};
exports.findAllAchievements = findAllAchievements;
/**
 * Finds all achievements associated with a specific user/employee ID.
 * @param employeeId The ID of the user.
 * @returns An array of Achievement documents.
 */
const findAchievementsByEmployeeId = async (employeeId) => {
    return Achievement_1.default.find({ user: employeeId })
        .populate("user", "firstName lastName email")
        .exec();
};
exports.findAchievementsByEmployeeId = findAchievementsByEmployeeId;
/**
 * Finds an achievement by its ID.
 * @param id The ID of the achievement.
 * @returns The Achievement document or null if not found.
 */
const findAchievementById = async (id) => {
    return Achievement_1.default.findById(id).exec();
};
exports.findAchievementById = findAchievementById;
/**
 * Updates an achievement by ID.
 * @param id The ID of the achievement to update.
 * @param updateData The data to apply (e.g., title, body).
 * @returns The updated Achievement document or null if not found.
 */
const updateAchievementById = async (id, updateData) => {
    return Achievement_1.default.findByIdAndUpdate(id, updateData, { new: true }).exec();
};
exports.updateAchievementById = updateAchievementById;
/**
 * Finds and deletes an achievement by ID.
 * @param id The ID of the achievement to delete.
 * @returns The deleted Achievement document or null if not found.
 */
const deleteAchievementById = async (id) => {
    return Achievement_1.default.findByIdAndDelete(id).exec();
};
exports.deleteAchievementById = deleteAchievementById;
