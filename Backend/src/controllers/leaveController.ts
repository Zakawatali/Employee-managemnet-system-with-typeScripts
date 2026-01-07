// import { Request, Response } from "express";
// import Leave from "../models/Leave";
// import EmployeeProfile from "../models/EmployeeProfile";
// import { sendEmail } from "../utils/mailService";
// import { emailTemplates } from "../utils/emailTemplates";

// export const applyLeave = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { employee, leaveType, startDate, endDate, reason } = req.body;

//     const newLeave = new Leave({
//       employee,
//       leaveType,
//       startDate,
//       endDate,
//       reason,
//     });

//     await newLeave.save();

//     res.success("Leave applied successfully", { leave: newLeave }, 201);
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Error applying leave";
//     res.error("Error applying leave", { message }, 400);
//   }
// };

// export const deleteLeave = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;

//     const deletedLeave = await Leave.findByIdAndDelete(id);

//     if (!deletedLeave) {
//       res.error("Leave not found", {}, 404);
//       return;
//     }

//     res.success("Leave deleted successfully", {}, 200);
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Error deleting leave";
//     res.error("Error deleting leave", { message }, 500);
//   }
// };

// export const getAllLeaves = async (_req: Request, res: Response): Promise<void> => {
//   try {
//     const leaves = await Leave.find()
//       .populate("employee", "firstName lastName email")
//       .populate("approver", "firstName lastName email");

//     res.success("Leaves fetched successfully", { leaves }, 200);
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Error fetching leaves";
//     res.error("Error fetching leaves", { message }, 500);
//   }
// };

// export const getLeaveById = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { employeeId } = req.params;

//     const leaves = await Leave.find({ employee: employeeId })
//       .populate("employee", "firstName lastName email")
//       .populate("approver", "firstName lastName email");

//     if (!leaves || leaves.length === 0) {
//       res.error("No leaves found for this employee", {}, 404);
//       return;
//     }

//     res.success(
//       "Leaves fetched successfully",
//       { totalLeaves: leaves.length, data: leaves },
//       200
//     );
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Error fetching leave";
//     res.error("Error fetching leave", { message }, 500);
//   }
// };

// export const approveLeave = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const leave = await Leave.findById(id);

//     if (!leave) {
//       res.error("Leave not found", {}, 404);
//       return;
//     }

//     leave.status = "APPROVED";
//     await leave.save();

//     let emailStatus = "Email sent successfully";

//     try {
//       const employeeProfile = await EmployeeProfile.findById(leave.employee);
//       if (!employeeProfile) {
//         emailStatus = "Employee not found, email not sent.";
//       } else {
//         await sendEmail({
//           to: employeeProfile.email,
//           subject: "✅ Leave Approved",
//           html: emailTemplates.leaveApproved(employeeProfile, leave),
//         });
//       }
//     } catch (emailErr) {
//       const message =
//         emailErr instanceof Error ? emailErr.message : "Failed to send email";
//       console.error("Error sending email:", message);
//       emailStatus = "Leave approved, but email could not be sent.";
//     }

//     res.success(
//       "Leave approved successfully",
//       { leave, emailStatus },
//       200
//     );
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Error approving leave";
//     res.error("Error approving leave", { message }, 500);
//   }
// };

// export const rejectLeave = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const leave = await Leave.findById(req.params.id);
//     if (!leave) {
//       res.error("Leave not found", {}, 404);
//       return;
//     }

//     leave.status = "REJECTED";
//     await leave.save();

//     try {
//       const employeeProfile = await EmployeeProfile.findById(leave.employee);
//       if (employeeProfile) {
//         await sendEmail({
//           to: employeeProfile.email,
//           subject: "❌ Leave Rejected",
//           html: emailTemplates.leaveRejected(employeeProfile, leave),
//         });
//       }
//     } catch (emailErr) {
//       const message =
//         emailErr instanceof Error ? emailErr.message : "Failed to send email";
//       console.error("Error sending email:", message);
//     }

//     res.success("Leave rejected", { leave }, 200);
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Error rejecting leave";
//     res.error("Error rejecting leave", { message }, 500);
//   }
// };

// export const cancelLeave = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const leave = await Leave.findById(req.params.id);
//     if (!leave) {
//       res.error("Leave not found", {}, 404);
//       return;
//     }

//     leave.status = "CANCELLED";
//     await leave.save();

//     res.success("Leave cancelled", { leave }, 200);
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Error cancelling leave";
//     res.error("Error cancelling leave", { message }, 500);
//   }
// };

import { Request, Response, NextFunction } from "express";
// import * as leaveService from "../Services/leaveServices";
import { AuthenticatedRequest } from "../middlewares/authmiddlewares";
import {getAllLeavesService,deleteLeaveService,applyLeaveService,updateLeaveStatusService,getLeavesByEmployeeService} from "../Services/leaveServices";
import { ApiError } from "../utils/ApiError";

// Assuming the following interface is available to handle custom errors

/**
 * Controller to apply for a new leave request.
 */
export const applyLeave = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const leaveData = {
      ...req.body,
      employee: req.user.id,
    };
    const newLeave = await applyLeaveService(leaveData);

    res.result = newLeave;
    next(201);
  } catch (err) {
    
    const message = err.message || "Error applying leave";
    const statusCode = err.statusCode || 500;
    
    res.error = message;
    next(statusCode);
  }
};

/**
 * Controller to delete a leave request by ID.
 */
export const deleteLeave = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const deletedLeave = await deleteLeaveService(id);

    res.result =  deletedLeave;
    next(200);
  } catch (err) {
   
    const message = err.message || "Error deleting leave";
    const statusCode = err.statusCode || 500;
    
    res.error = message;
    next(statusCode);
  }
};

/**
 * Controller to get all leave requests.
 */
// export const getAllLeaves = async (
//   _req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const leaves = await getAllLeavesService();

//     res.result = leaves ;
//     next(200);
//   } catch (err) {
   
//     const message = err.message || "Error fetching leaves";
//     const statusCode = err.statusCode || 500;
    
//     res.error = message;
//     next(statusCode);
//   }
// };
// controller/leaveController.ts
// export const getAllLeaves = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     // Get page & limit from query params
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;

//     const result = await getAllLeavesService(page, limit);

//     res.result = result; // { leaves: [], count, page, limit, totalPages }
//     next(200);
//   } catch (err) {
//     const message = err.message || "Error fetching leaves";
//     const statusCode = err.statusCode || 500;

//     res.error = message;
//     next(statusCode);
//   }
// };



export const getAllLeaves = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const search = (req.query.search as string) || "";
    const leaveType = (req.query.leaveType as string) || "";

    const result = await getAllLeavesService(page, limit, search, leaveType);

    res.result = result;
    next(200) ;
 
  } catch (err: any) {
    res.error = err.message || "Error fetching leaves";
    console.log("the errr is",err.message )
    const statuscode = err.statusCode || 500;
    next(statuscode);
  }
};

/**
 * Controller to get leave requests by an employee ID.
 */
export const getLeaveByEmployeeId = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { employeeId } = req.params as { employeeId: string };
    const result = await getLeavesByEmployeeService(employeeId);

    res.result = result;
    next(200);
  } catch (err) {
   
    const message = err.message || "Error fetching leave";
    const statusCode = err.statusCode || 500;

    res.error = message;
    next(statusCode);
  }
};

/**
 * Controller to approve a leave request.
 */
export const approveLeave = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params ;
    const result = await updateLeaveStatusService(
      id,
      "APPROVED"
    );

    res.result = result;
    next(200);
  } catch (err) {
    
    const message = err.message || "Error approving leave";
    const statusCode = err.statusCode || 500;
    
    res.error = message;
    next(statusCode);
  }
};

/**
 * Controller to reject a leave request.
 */
export const rejectLeave = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const result = await updateLeaveStatusService(
      id,
      "REJECTED"
    );

    res.result = result;
    next(200);
  } catch (err) {
   
    const message = err.message || "Error rejecting leave";
    const statusCode = err.statusCode || 500;
    
    res.error = message;
    next(statusCode);
  }
};

/**
 * Controller to cancel a leave request (by employee).
 */
export const cancelLeave = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { leave } = await updateLeaveStatusService(
      id,
      "CANCELLED"
    );

    res.result =  leave ;
    next(200);
  } catch (err) {
    
    const message = err.message || "Error cancelling leave";
    const statusCode = err.statusCode || 500;
    
    res.error = message;
    next(statusCode);
  }
};