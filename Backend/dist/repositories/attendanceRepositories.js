"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregateMonthlySummary = exports.aggregateDailySummary = exports.findAttendanceByEmployeeId = exports.findAllAttendance = exports.deleteAttendanceRecord = exports.updateAttendanceRecord = exports.saveAttendanceDocument = exports.createAttendance = exports.findTodayAttendance = void 0;
const Attendance_1 = __importDefault(require("../models/Attendance")); // Assuming AttendanceDocument type exists
const mongoose_1 = require("mongoose");
// --- CRUD Operations ---
/**
 * Finds today's attendance record for a specific employee.
 * @param employeeId Employee ID.
 * @param dateOnly Date object representing the start of the day (normalized).
 * @returns Attendance document or null.
 */
const findTodayAttendance = async (employeeId, dateOnly) => {
    return Attendance_1.default.findOne({ employeeId, date: dateOnly }).exec();
};
exports.findTodayAttendance = findTodayAttendance;
/**
 * Creates and saves a new Attendance record.
 */
const createAttendance = async (data) => {
    const newAttendance = new Attendance_1.default(data);
    return newAttendance.save();
};
exports.createAttendance = createAttendance;
/**
 * Saves an existing Attendance document (used for check-in/out updates).
 * @param attendanceDoc The Mongoose document to save.
 * @returns The saved document.
 */
const saveAttendanceDocument = async (attendanceDoc) => {
    return attendanceDoc.save();
};
exports.saveAttendanceDocument = saveAttendanceDocument;
/**
 * Finds and updates an attendance record by its ID.
 */
const updateAttendanceRecord = async (id, updateData) => {
    return Attendance_1.default.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    }).exec();
};
exports.updateAttendanceRecord = updateAttendanceRecord;
/**
 * Finds and deletes an attendance record by its ID.
 */
const deleteAttendanceRecord = async (id) => {
    return Attendance_1.default.findByIdAndDelete(id).exec();
};
exports.deleteAttendanceRecord = deleteAttendanceRecord;
/**
 * Finds all attendance records, populating employee details.
 */
const findAllAttendance = async () => {
    return Attendance_1.default.find()
        .populate("employeeId", "firstName lastName email department")
        .exec();
};
exports.findAllAttendance = findAllAttendance;
/**
 * Finds all attendance records for a specific employee.
 */
const findAttendanceByEmployeeId = async (employeeId) => {
    return Attendance_1.default.find({ employeeId })
        .populate("employeeId", "firstName lastName email department")
        .exec();
};
exports.findAttendanceByEmployeeId = findAttendanceByEmployeeId;
// --- Aggregation Queries ---
/**
 * Runs an aggregation query to get the daily summary of attendance statuses.
 */
const aggregateDailySummary = async (start, end) => {
    return Attendance_1.default.aggregate([
        { $match: { date: { $gte: start, $lte: end } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
    ]).exec();
};
exports.aggregateDailySummary = aggregateDailySummary;
/**
 * Runs an aggregation query to get the monthly summary for a specific employee.
 */
const aggregateMonthlySummary = async (employeeId, startOfMonth, endOfMonth) => {
    return Attendance_1.default.aggregate([
        {
            $match: {
                employeeId: new mongoose_1.Types.ObjectId(employeeId),
                date: { $gte: startOfMonth, $lte: endOfMonth },
            },
        },
        { $group: { _id: "$status", count: { $sum: 1 } } },
    ]).exec();
};
exports.aggregateMonthlySummary = aggregateMonthlySummary;
