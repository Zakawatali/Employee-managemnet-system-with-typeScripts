"use strict";
// import { Request, Response } from "express";
// import { Types } from "mongoose";
// import Achievement from "../models/Achievement";
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
exports.deleteAchievement = exports.updateAchievement = exports.getAchievementById = exports.getAllAchievements = exports.createAchievement = void 0;
const achievementService = __importStar(require("../Services/achievementServices"));
/**
 * Controller to create a new achievement.
 */
const createAchievement = async (req, res, next) => {
    try {
        const { user, title, body } = req.body;
        const achievementData = { user, title, body };
        const achievement = await achievementService.createAchievementService(achievementData);
        res.result = { achievement };
        next(201);
    }
    catch (err) {
        const message = err.message || "Error creating achievement";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.createAchievement = createAchievement;
/**
 * Controller to get all achievements.
 */
const getAllAchievements = async (_req, res, next) => {
    try {
        const achievements = await achievementService.getAllAchievementsService();
        res.result = { achievements };
        next(200);
    }
    catch (err) {
        const message = err.message || "Error fetching achievements";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.getAllAchievements = getAllAchievements;
/**
 * Controller to get achievements by employee ID.
 */
const getAchievementById = async (req, res, next) => {
    try {
        const { employeeId } = req.params;
        const result = await achievementService.getAchievementsByEmployeeService(employeeId);
        res.result = result; // Contains { totalAchievements, data }
        next(200);
    }
    catch (err) {
        const message = err.message || "Server error while fetching achievements";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.getAchievementById = getAchievementById;
/**
 * Controller to update an existing achievement.
 */
const updateAchievement = async (req, res, next) => {
    try {
        const { title, body } = req.body;
        const { id } = req.params;
        const updateData = { title, body };
        const achievement = await achievementService.updateAchievementService(id, updateData);
        res.result = achievement;
        next(200);
    }
    catch (err) {
        const message = err.message || "Error updating achievement";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.updateAchievement = updateAchievement;
/**
 * Controller to delete an achievement.
 */
const deleteAchievement = async (req, res, next) => {
    try {
        const { id } = req.params;
        const achievement = await achievementService.deleteAchievementService(id);
        res.result = achievement;
        next(200);
    }
    catch (err) {
        const message = err.message || "Error deleting achievement";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.deleteAchievement = deleteAchievement;
