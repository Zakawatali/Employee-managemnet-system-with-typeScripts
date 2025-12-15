"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAchievementService = exports.updateAchievementService = exports.getAchievementsByEmployeeService = exports.getAllAchievementsService = exports.createAchievementService = void 0;
const achievementRepository = __importStar(require("../repositories/achievementRepositories"));
const mongoose_1 = require("mongoose");
/**
 * Service to handle the creation of a new achievement.
 */
const createAchievementService = async (achievementData) => {
    // Business logic: Any pre-save validation or data transformation goes here
    const newAchievement = await achievementRepository.createAchievement(achievementData);
    return newAchievement;
};
exports.createAchievementService = createAchievementService;
/**
 * Service to retrieve all achievements.
 */
const getAllAchievementsService = async () => {
    return achievementRepository.findAllAchievements();
};
exports.getAllAchievementsService = getAllAchievementsService;
/**
 * Service to retrieve achievements for a specific employee.
 * @param employeeId The ID of the employee whose achievements to fetch.
 */
const getAchievementsByEmployeeService = async (employeeId) => {
    // Input Validation
    if (!employeeId || !mongoose_1.Types.ObjectId.isValid(employeeId)) {
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
exports.getAchievementsByEmployeeService = getAchievementsByEmployeeService;
/**
 * Service to update an existing achievement.
 * @param id The ID of the achievement to update.
 * @param updateData The new title and body.
 */
const updateAchievementService = async (id, updateData) => {
    const updatedAchievement = await achievementRepository.updateAchievementById(id, updateData);
    if (!updatedAchievement) {
        throw new Error("Achievement not found");
        return;
    }
    return updatedAchievement;
};
exports.updateAchievementService = updateAchievementService;
/**
 * Service to delete an achievement.
 * @param id The ID of the achievement to delete.
 */
const deleteAchievementService = async (id) => {
    const deletedAchievement = await achievementRepository.deleteAchievementById(id);
    if (!deletedAchievement) {
        throw new Error("Achievement not found");
        return;
    }
    return deletedAchievement;
};
exports.deleteAchievementService = deleteAchievementService;
