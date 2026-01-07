import * as attendanceRepository from "../repositories/attendanceRepositories";
import { AttendanceDocument } from "../models/Attendance";
import { Types } from "mongoose";
import {ERROR_MESSAGES} from "../constants/errorMessages"
import {SUCCESS_MESSAGES } from "../constants/successMessages"
import { ApiError } from "../utils/ApiError";
// Helper function moved from controller to service layer (business logic)
const startOfDay = (date: Date): Date => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};



// --- Check-in/Check-out Services ---

/**
 * Handles the employee check-in process.
 */
export const checkInService = async (employeeId: string): Promise<AttendanceDocument> => {
  const now = new Date();
  const dateOnly = startOfDay(now);

  let attendance = await attendanceRepository.findTodayAttendance(employeeId, dateOnly);

  if (attendance && attendance.checkIn) {
    throw new ApiError(ERROR_MESSAGES.USER_ALREADY_CHECKIN,401)
    return;
  }

  if (!attendance) {
    attendance = await attendanceRepository.createAttendance({
      employeeId,
      date: dateOnly,
      checkIn: now,
    });
  } else {
    attendance.checkIn = now;
    // Update the existing record and save
    attendance = await attendanceRepository.saveAttendanceDocument(attendance);
  }

  return attendance;
};

/**
 * Handles the employee check-out process.
 */
export const checkOutService = async (employeeId: string): Promise<AttendanceDocument> => {
  const now = new Date();
  const today = startOfDay(now);

  const attendance = await attendanceRepository.findTodayAttendance(employeeId, today);

  if (!attendance || !attendance.checkIn) {
    throw new ApiError("Cannot check out without check-in",401);
    return;
  }

  if (attendance.checkOut) {
    throw new ApiError(ERROR_MESSAGES.USER_ALREADY_CHECKOUT,401);
    return;
  }

  attendance.checkOut = now;
  // Update the existing record and save
  return attendanceRepository.saveAttendanceDocument(attendance);
};

// --- CRUD Services ---

/**
 * Service to update an attendance record manually.
 */
export const updateAttendanceService = async (
  id: string,
  updateData: any
): Promise<AttendanceDocument> => {
  const updatedAttendance = await attendanceRepository.updateAttendanceRecord(id, updateData);

  if (!updatedAttendance) {
    throw new ApiError(ERROR_MESSAGES.ATTENDANCE_NOT_FOUND,404);
    return;
  }

  return updatedAttendance;
};

/**
 * Service to delete an attendance record.
 */
export const deleteAttendanceService = async (id: string): Promise<AttendanceDocument> => {
  const deletedAttendance = await attendanceRepository.deleteAttendanceRecord(id);

  if (!deletedAttendance) {
    throw new ApiError(ERROR_MESSAGES.ATTENDANCE_NOT_FOUND,404);
    return;
  }

  return deletedAttendance;
};

/**
 * Service to retrieve all attendance records.
 */
export const getAllAttendanceService = async (): Promise<{
  records: AttendanceDocument[];
  count: number;
}> => {
  const records = await attendanceRepository.findAllAttendance();
  return { records, count: records.length };
};

/**
 * Service to retrieve attendance history and stats for a single employee.
 */
export const getAttendanceByEmployeeIdService = async (
  employeeId: string
): Promise<{
  employee: any;
  totalDays: number;
  presentDays: number;
  percentage: string;
  records: AttendanceDocument[];
}> => {

  const attendance = await attendanceRepository.findAttendanceByEmployeeId(employeeId);

  if (!attendance || attendance.length === 0) {
    throw new ApiError(ERROR_MESSAGES.ATTENDANCE_NOT_FOUND,404);
    return;
  }

  // Calculate statistics (Business Logic)
  const totalDays = attendance.length;
  // Assuming 'present' status is set during an automated job or upon check-out validation
  const presentDays = attendance.filter((rec) => (rec as any).status === "present").length;
  const percentage = totalDays
    ? `${((presentDays / totalDays) * 100).toFixed(2)}%`
    : "0%";

  return {
    employee: attendance[0].employeeId, // Populated field
    totalDays,
    presentDays,
    percentage,
    records: attendance,
  };
};

// --- Summary Services ---

/**
 * Service to generate the daily attendance summary.
 */
export const getDailySummaryService = async (dateString: string): Promise<{ date: string; summary: Record<string, number> }> => {
  if (!dateString) {
    throw new Error("Date is required");
    return;
  }

  const start = startOfDay(new Date(dateString));
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);

  const summary = await attendanceRepository.aggregateDailySummary(start, end);

  const result: Record<string, number> = {
    present: 0,
    late: 0,
    "half-day": 0,
    absent: 0,
  };

  summary.forEach((item) => {
    result[item._id as string] = item.count;
  });

  return { date: dateString, summary: result };
};

/**
 * Service to generate the monthly attendance summary for an employee.
 */
export const getMonthlySummaryService = async (
    employeeId: string,
    yearStr: string,
    monthStr: string
  ): Promise<{ employeeId: string; month: number; year: number; summary: Record<string, number> }> => {
  
  
    const yearNum = parseInt(yearStr, 10);
    const monthNum = parseInt(monthStr, 10); // 1-indexed month
  
    if (Number.isNaN(yearNum) || Number.isNaN(monthNum)) {
      throw new ApiError("Invalid month or year format",404);
      return;
    }
  
    const startOfMonth = new Date(yearNum, monthNum - 1, 1);
    const endOfMonth = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);
  
    const summary = await attendanceRepository.aggregateMonthlySummary(
      employeeId,
      startOfMonth,
      endOfMonth
    );
  
    const result: Record<string, number> = {
      present: 0,
      late: 0,
      "half-day": 0,
      absent: 0,
    };
  
    summary.forEach((item) => {
      result[item._id as string] = item.count;
    });
  
    return { employeeId, month: monthNum, year: yearNum, summary: result };
  };