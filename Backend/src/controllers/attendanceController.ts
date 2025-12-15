// import { Request, Response } from "express";
// import { Types } from "mongoose";
// import Attendance from "../models/Attendance";

// const startOfDay = (date: Date): Date => {
//   const normalized = new Date(date);
//   normalized.setHours(0, 0, 0, 0);
//   return normalized;
// };

// export const checkIn = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { employeeId } = req.params;
//     const now = new Date();
//     const dateOnly = startOfDay(now);

//     let attendance = await Attendance.findOne({ employeeId, date: dateOnly });

//     if (attendance && attendance.checkIn) {
//       res.error("Already checked in today", {}, 400);
//       return;
//     }

//     if (!attendance) {
//       attendance = new Attendance({
//         employeeId,
//         date: dateOnly,
//         checkIn: now,
//       });
//     } else {
//       attendance.checkIn = now;
//     }

//     await attendance.save();
//     res.success("Check-in successful", { attendance }, 200);
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Error during check-in";
//     res.error("Error during check-in", { error: message }, 500);
//   }
// };

// export const checkOut = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { employeeId } = req.params;
//     const now = new Date();
//     const today = startOfDay(now);

//     const attendance = await Attendance.findOne({ employeeId, date: today });

//     if (!attendance || !attendance.checkIn) {
//       res.error("Cannot check out without check-in", {}, 400);
//       return;
//     }

//     if (attendance.checkOut) {
//       res.error("Already checked out today", {}, 400);
//       return;
//     }

//     attendance.checkOut = now;
//     await attendance.save();

//     res.success("Check-out successful", { attendance }, 200);
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Error during check-out";
//     res.error("Error during check-out", { error: message }, 500);
//   }
// };

// export const updateAttendance = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const updatedAttendance = await Attendance.findByIdAndUpdate(id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedAttendance) {
//       res.error("Attendance not found", {}, 404);
//       return;
//     }

//     res.success("Attendance updated successfully", { attendance: updatedAttendance }, 200);
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Error updating attendance";
//     res.error("Error updating attendance", { error: message }, 500);
//   }
// };

// export const deleteAttendance = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const deletedAttendance = await Attendance.findByIdAndDelete(id);

//     if (!deletedAttendance) {
//       res.error("Attendance not found", {}, 404);
//       return;
//     }

//     res.success("Attendance deleted successfully", { attendance: deletedAttendance }, 200);
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Error deleting attendance";
//     res.error("Error deleting attendance", { error: message }, 500);
//   }
// };

// export const getAllattendance = async (
//   _req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const attendance = await Attendance.find().populate(
//       "employeeId",
//       "firstName lastName email department"
//     );
//     res.success(
//       "Attendance fetched successfully",
//       { records: attendance, count: attendance.length },
//       200
//     );
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Error fetching attendance";
//     res.error("Error fetching attendance", { error: message }, 500);
//   }
// };

// export const getAttendanceById = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { Id } = req.params;
//     const employeeId = Id || req.params.employeeId;

//     if (!employeeId) {
//       res.error("Employee ID is required", {}, 400);
//       return;
//     }

//     const attendance = await Attendance.find({ employeeId }).populate(
//       "employeeId",
//       "firstName lastName email department"
//     );

//     if (!attendance || attendance.length === 0) {
//       res.error("No attendance record found for this employee", {}, 404);
//       return;
//     }

//     const totalDays = attendance.length;
//     const presentDays = attendance.filter((rec) => rec.status === "present").length;
//     const percentage = totalDays
//       ? `${((presentDays / totalDays) * 100).toFixed(2)}%`
//       : "0%";

//     res.success("Attendance fetched successfully", {
//       employee: attendance[0].employeeId,
//       totalDays,
//       presentDays,
//       percentage,
//       records: attendance,
//     }, 200);
//   } catch (error) {
//     const message =
//       error instanceof Error ? error.message : "Error fetching attendance by ID";
//     res.error("Error fetching attendance by ID", { error: message }, 500);
//   }
// };

// export const getDailySummary = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { date } = req.query;

//     if (!date || typeof date !== "string") {
//       res.error("Date is required", {}, 400);
//       return;
//     }

//     const start = startOfDay(new Date(date));
//     const end = new Date(start);
//     end.setHours(23, 59, 59, 999);

//     const summary = await Attendance.aggregate([
//       { $match: { date: { $gte: start, $lte: end } } },
//       { $group: { _id: "$status", count: { $sum: 1 } } },
//     ]);

//     const result: Record<string, number> = {
//       present: 0,
//       late: 0,
//       "half-day": 0,
//       absent: 0,
//     };

//     summary.forEach((item) => {
//       result[item._id as string] = item.count;
//     });

//     res.success("Daily summary fetched successfully", { date, summary: result }, 200);
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Server error";
//     res.error("Server error", { message }, 500);
//   }
// };

// export const getMonthlySummary = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { employeeId, year, month } = req.query;

//     if (
//       typeof employeeId !== "string" ||
//       typeof year !== "string" ||
//       typeof month !== "string"
//     ) {
//       res.error("employeeId, year, and month are required", {}, 400);
//       return;
//     }

//     const yearNum = parseInt(year, 10);
//     const monthNum = parseInt(month, 10);

//     if (Number.isNaN(yearNum) || Number.isNaN(monthNum)) {
//       res.error("Invalid month or year", {}, 400);
//       return;
//     }

//     const startOfMonth = new Date(yearNum, monthNum - 1, 1);
//     const endOfMonth = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

//     const summary = await Attendance.aggregate([
//       {
//         $match: {
//           employeeId: new Types.ObjectId(employeeId),
//           date: { $gte: startOfMonth, $lte: endOfMonth },
//         },
//       },
//       { $group: { _id: "$status", count: { $sum: 1 } } },
//     ]);

//     const result: Record<string, number> = {
//       present: 0,
//       late: 0,
//       "half-day": 0,
//       absent: 0,
//     };

//     summary.forEach((item) => {
//       result[item._id as string] = item.count;
//     });

//     res.success(
//       "Monthly summary fetched successfully",
//       { employeeId, month: monthNum, year: yearNum, summary: result },
//       200
//     );
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Server error";
//     res.error("Server error", { message }, 500);
//   }
// };





import { Request, Response, NextFunction } from "express";
import * as attendanceService from "../Services/attendanceServices";
import { AuthenticatedRequest } from "../middlewares/authmiddlewares";
// Helper interface to properly type errors that might contain a statusCode


/**
 * Controller to handle employee check-in.
 */
export const checkIn = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { employeeId } = req.params;

    const attendance = await attendanceService.checkInService(employeeId);

    res.result = { attendance };
    next(200);
  } catch (err) {
  
    const message = err.message || "Error during check-in";
    const statusCode = err.statusCode || 500;

    res.error = message;
    next(statusCode);
  }
};

/**
 * Controller to handle employee check-out.
 */
export const checkOut = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { employeeId } = req.params;

    const attendance = await attendanceService.checkOutService(employeeId);

    res.result = { attendance };
    next(200);
  } catch (err) {

    const message = err.message || "Error during check-out";
    const statusCode = err.statusCode || 500;

    res.error = message;
    next(statusCode);
  }
};

/**
 * Controller to update an attendance record manually.
 */
export const updateAttendance = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedAttendance = await attendanceService.updateAttendanceService(
      id,
      updateData
    );

    res.result = { attendance: updatedAttendance };
    next(200);
  } catch (err) {
    
    const message = err.message || "Error updating attendance";
    const statusCode = err.statusCode || 500;

    res.error = message;
    next(statusCode);
  }
};

/**
 * Controller to delete an attendance record.
 */
export const deleteAttendance = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedAttendance = await attendanceService.deleteAttendanceService(id);

    res.result = { attendance: deletedAttendance };
    next(200);
  } catch (err) {
    
    const message = err.message || "Error deleting attendance";
    const statusCode = err.statusCode || 500;

    res.error = message;
    next(statusCode);
  }
};

/**
 * Controller to get all attendance records.
 */
export const getAllattendance = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await attendanceService.getAllAttendanceService();

    res.result = result; // { records, count }
    next(200);
  } catch (err) {
   
    const message = err.message || "Error fetching attendance";
    const statusCode = err.statusCode || 500;

    res.error = message;
    next(statusCode);
  }
};

/**
 * Controller to get attendance history and stats for a specific employee.
 */
export const getAttendanceById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
  } catch (err) {
   
    const message = err.message || "Error fetching attendance by ID";
    const statusCode = err.statusCode || 500;

    res.error = message;
    next(statusCode);
  }
};

/**
 * Controller to get a daily attendance summary.
 */
export const getDailySummary = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const dateQuery = req.query.date as string | undefined;

    const result = await attendanceService.getDailySummaryService(dateQuery || "");

    res.result = result;
    next(200);
  } catch (err) {
    
    const message = err.message || "Server error";
    const statusCode = err.statusCode || 500;

    res.error = message;
    next(statusCode);
  }
};

/**
 * Controller to get a monthly attendance summary for an employee.
 */
export const getMonthlySummary = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { employeeId, year, month } = req.query;

    const result = await attendanceService.getMonthlySummaryService(
      employeeId as string,
      year as string,
      month as string
    );

    res.result = result;
    next(200);
  } catch (err) {
    
    const message = err.message || "Server error";
    const statusCode = err.statusCode || 500;

    res.error = message;
    next(statusCode);
  }
};