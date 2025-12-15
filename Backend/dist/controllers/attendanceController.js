"use strict";
// import { Request, Response } from "express";
// import { Types } from "mongoose";
// import Attendance from "../models/Attendance";
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
exports.getMonthlySummary = exports.getDailySummary = exports.getAttendanceById = exports.getAllattendance = exports.deleteAttendance = exports.updateAttendance = exports.checkOut = exports.checkIn = void 0;
const attendanceService = __importStar(require("../Services/attendanceServices"));
// Helper interface to properly type errors that might contain a statusCode
/**
 * Controller to handle employee check-in.
 */
const checkIn = async (req, res, next) => {
    try {
        const { employeeId } = req.params;
        const attendance = await attendanceService.checkInService(employeeId);
        res.result = { attendance };
        next(200);
    }
    catch (err) {
        const message = err.message || "Error during check-in";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.checkIn = checkIn;
/**
 * Controller to handle employee check-out.
 */
const checkOut = async (req, res, next) => {
    try {
        const { employeeId } = req.params;
        const attendance = await attendanceService.checkOutService(employeeId);
        res.result = { attendance };
        next(200);
    }
    catch (err) {
        const message = err.message || "Error during check-out";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.checkOut = checkOut;
/**
 * Controller to update an attendance record manually.
 */
const updateAttendance = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedAttendance = await attendanceService.updateAttendanceService(id, updateData);
        res.result = { attendance: updatedAttendance };
        next(200);
    }
    catch (err) {
        const message = err.message || "Error updating attendance";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.updateAttendance = updateAttendance;
/**
 * Controller to delete an attendance record.
 */
const deleteAttendance = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedAttendance = await attendanceService.deleteAttendanceService(id);
        res.result = { attendance: deletedAttendance };
        next(200);
    }
    catch (err) {
        const message = err.message || "Error deleting attendance";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.deleteAttendance = deleteAttendance;
/**
 * Controller to get all attendance records.
 */
const getAllattendance = async (_req, res, next) => {
    try {
        const result = await attendanceService.getAllAttendanceService();
        res.result = result; // { records, count }
        next(200);
    }
    catch (err) {
        const message = err.message || "Error fetching attendance";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.getAllattendance = getAllattendance;
/**
 * Controller to get attendance history and stats for a specific employee.
 */
const getAttendanceById = async (req, res, next) => {
    try {
        // Handling multiple possible param names from the original controller logic
        const employeeId = req.params.Id || req.params.employeeId;
        if (!employeeId) {
            res.error = "Employee ID is required";
            next(400);
            return;
        }
        const result = await attendanceService.getAttendanceByEmployeeIdService(employeeId);
        res.result = result;
        next(200);
    }
    catch (err) {
        const message = err.message || "Error fetching attendance by ID";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.getAttendanceById = getAttendanceById;
/**
 * Controller to get a daily attendance summary.
 */
const getDailySummary = async (req, res, next) => {
    try {
        const dateQuery = req.query.date;
        const result = await attendanceService.getDailySummaryService(dateQuery || "");
        res.result = result;
        next(200);
    }
    catch (err) {
        const message = err.message || "Server error";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.getDailySummary = getDailySummary;
/**
 * Controller to get a monthly attendance summary for an employee.
 */
const getMonthlySummary = async (req, res, next) => {
    try {
        const { employeeId, year, month } = req.query;
        const result = await attendanceService.getMonthlySummaryService(employeeId, year, month);
        res.result = result;
        next(200);
    }
    catch (err) {
        const message = err.message || "Server error";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.getMonthlySummary = getMonthlySummary;
