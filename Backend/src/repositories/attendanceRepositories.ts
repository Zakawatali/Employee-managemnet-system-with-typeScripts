import Attendance, { AttendanceDocument } from "../models/Attendance"; // Assuming AttendanceDocument type exists
import { Types } from "mongoose";

// --- CRUD Operations ---

/**
 * Finds today's attendance record for a specific employee.
 * @param employeeId Employee ID.
 * @param dateOnly Date object representing the start of the day (normalized).
 * @returns Attendance document or null.
 */
export const findTodayAttendance = async (
  employeeId: string,
  dateOnly: Date
): Promise<AttendanceDocument | null> => {
  return Attendance.findOne({ employeeId, date: dateOnly }).exec();
};

/**
 * Creates and saves a new Attendance record.
 */
export const createAttendance = async (data: any): Promise<AttendanceDocument> => {
  const newAttendance = new Attendance(data);
  return newAttendance.save();
};

/**
 * Saves an existing Attendance document (used for check-in/out updates).
 * @param attendanceDoc The Mongoose document to save.
 * @returns The saved document.
 */
export const saveAttendanceDocument = async (
  attendanceDoc: AttendanceDocument
): Promise<AttendanceDocument> => {
  return attendanceDoc.save();
};

/**
 * Finds and updates an attendance record by its ID.
 */
export const updateAttendanceRecord = async (
  id: string,
  updateData: any
): Promise<AttendanceDocument | null> => {
  return Attendance.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).exec();
};

/**
 * Finds and deletes an attendance record by its ID.
 */
export const deleteAttendanceRecord = async (id: string): Promise<AttendanceDocument | null> => {
  return Attendance.findByIdAndDelete(id).exec();
};

/**
 * Finds all attendance records, populating employee details.
 */
export const findAllAttendance = async (): Promise<AttendanceDocument[]> => {
  return Attendance.find()
    .populate("employeeId", "firstName lastName email department")
    .exec();
};

/**
 * Finds all attendance records for a specific employee.
 */
export const findAttendanceByEmployeeId = async (
  employeeId: string
): Promise<AttendanceDocument[]> => {
  return Attendance.find({ employeeId })
    .populate("employeeId", "firstName lastName email department")
    .exec();
};

// --- Aggregation Queries ---

/**
 * Runs an aggregation query to get the daily summary of attendance statuses.
 */
export const aggregateDailySummary = async (
  start: Date,
  end: Date
): Promise<Array<{ _id: string; count: number }>> => {
  return Attendance.aggregate([
    { $match: { date: { $gte: start, $lte: end } } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]).exec();
};

/**
 * Runs an aggregation query to get the monthly summary for a specific employee.
 */
export const aggregateMonthlySummary = async (
  employeeId: string,
  startOfMonth: Date,
  endOfMonth: Date
): Promise<Array<{ _id: string; count: number }>> => {
  return Attendance.aggregate([
    {
      $match: {
        employeeId: new Types.ObjectId(employeeId),
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]).exec();
};