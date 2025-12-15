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
exports.getMonthlySummaryService = exports.getDailySummaryService = exports.getAttendanceByEmployeeIdService = exports.getAllAttendanceService = exports.deleteAttendanceService = exports.updateAttendanceService = exports.checkOutService = exports.checkInService = void 0;
const attendanceRepository = __importStar(require("../repositories/attendanceRepositories"));
// Helper function moved from controller to service layer (business logic)
const startOfDay = (date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
};
// --- Check-in/Check-out Services ---
/**
 * Handles the employee check-in process.
 */
const checkInService = async (employeeId) => {
    const now = new Date();
    const dateOnly = startOfDay(now);
    let attendance = await attendanceRepository.findTodayAttendance(employeeId, dateOnly);
    if (attendance && attendance.checkIn) {
        throw new Error("Already checked in today");
        return;
    }
    if (!attendance) {
        attendance = await attendanceRepository.createAttendance({
            employeeId,
            date: dateOnly,
            checkIn: now,
        });
    }
    else {
        attendance.checkIn = now;
        // Update the existing record and save
        attendance = await attendanceRepository.saveAttendanceDocument(attendance);
    }
    return attendance;
};
exports.checkInService = checkInService;
/**
 * Handles the employee check-out process.
 */
const checkOutService = async (employeeId) => {
    const now = new Date();
    const today = startOfDay(now);
    const attendance = await attendanceRepository.findTodayAttendance(employeeId, today);
    if (!attendance || !attendance.checkIn) {
        throw new Error("Cannot check out without check-in");
        return;
    }
    if (attendance.checkOut) {
        throw new Error("Already checked out today");
        return;
    }
    attendance.checkOut = now;
    // Update the existing record and save
    return attendanceRepository.saveAttendanceDocument(attendance);
};
exports.checkOutService = checkOutService;
// --- CRUD Services ---
/**
 * Service to update an attendance record manually.
 */
const updateAttendanceService = async (id, updateData) => {
    const updatedAttendance = await attendanceRepository.updateAttendanceRecord(id, updateData);
    if (!updatedAttendance) {
        throw new Error("Attendance not found");
        return;
    }
    return updatedAttendance;
};
exports.updateAttendanceService = updateAttendanceService;
/**
 * Service to delete an attendance record.
 */
const deleteAttendanceService = async (id) => {
    const deletedAttendance = await attendanceRepository.deleteAttendanceRecord(id);
    if (!deletedAttendance) {
        throw new Error("Attendance not found");
        return;
    }
    return deletedAttendance;
};
exports.deleteAttendanceService = deleteAttendanceService;
/**
 * Service to retrieve all attendance records.
 */
const getAllAttendanceService = async () => {
    const records = await attendanceRepository.findAllAttendance();
    return { records, count: records.length };
};
exports.getAllAttendanceService = getAllAttendanceService;
/**
 * Service to retrieve attendance history and stats for a single employee.
 */
const getAttendanceByEmployeeIdService = async (employeeId) => {
    // Input validation (optional, but good practice if not checked in controller)
    if (!employeeId) {
        throw new Error("Employee ID is required");
        return;
    }
    const attendance = await attendanceRepository.findAttendanceByEmployeeId(employeeId);
    if (!attendance || attendance.length === 0) {
        throw new Error("No attendance record found for this employee");
        return;
    }
    // Calculate statistics (Business Logic)
    const totalDays = attendance.length;
    // Assuming 'present' status is set during an automated job or upon check-out validation
    const presentDays = attendance.filter((rec) => rec.status === "present").length;
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
exports.getAttendanceByEmployeeIdService = getAttendanceByEmployeeIdService;
// --- Summary Services ---
/**
 * Service to generate the daily attendance summary.
 */
const getDailySummaryService = async (dateString) => {
    if (!dateString) {
        throw new Error("Date is required");
        return;
    }
    const start = startOfDay(new Date(dateString));
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    const summary = await attendanceRepository.aggregateDailySummary(start, end);
    const result = {
        present: 0,
        late: 0,
        "half-day": 0,
        absent: 0,
    };
    summary.forEach((item) => {
        result[item._id] = item.count;
    });
    return { date: dateString, summary: result };
};
exports.getDailySummaryService = getDailySummaryService;
/**
 * Service to generate the monthly attendance summary for an employee.
 */
const getMonthlySummaryService = async (employeeId, yearStr, monthStr) => {
    if (!employeeId || !yearStr || !monthStr) {
        throw new Error("employeeId, year, and month are required");
        return;
    }
    const yearNum = parseInt(yearStr, 10);
    const monthNum = parseInt(monthStr, 10); // 1-indexed month
    if (Number.isNaN(yearNum) || Number.isNaN(monthNum)) {
        throw new Error("Invalid month or year format");
        return;
    }
    const startOfMonth = new Date(yearNum, monthNum - 1, 1);
    const endOfMonth = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);
    const summary = await attendanceRepository.aggregateMonthlySummary(employeeId, startOfMonth, endOfMonth);
    const result = {
        present: 0,
        late: 0,
        "half-day": 0,
        absent: 0,
    };
    summary.forEach((item) => {
        result[item._id] = item.count;
    });
    return { employeeId, month: monthNum, year: yearNum, summary: result };
};
exports.getMonthlySummaryService = getMonthlySummaryService;
