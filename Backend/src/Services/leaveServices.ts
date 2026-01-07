import { LeaveDocument, LeaveStatus } from "../models/Leave"; 
import { EmployeeProfileDocument } from "../models/EmployeeProfile";
import * as leaveRepository from "../repositories/leaveRepositories";
import { sendEmail } from "../utils/mailService";
import { emailTemplates } from "../utils/emailTemplates";
import { Types } from "mongoose";
import { ERROR_MESSAGES} from "../constants/errorMessages";
import {SUCCESS_MESSAGES}  from "../constants/successMessages"
import { ApiError } from "../utils/ApiError";

// Define a custom error type for predictable HTTP status codes


// Helper to handle email sending logic, which is complex business logic
const sendLeaveStatusEmail = async (
  leave: LeaveDocument,
  status: LeaveStatus
): Promise<string> => {
  let emailStatus = "Email sent successfully";
  try {
    const employeeProfile = await leaveRepository.findEmployeeProfileById(
      leave.employee as Types.ObjectId
    );

    if (!employeeProfile) {
      emailStatus = ERROR_MESSAGES.EMPLOYEE_NOT_FOUND;
      return emailStatus;
    }

    const emailConfig = {
      to: employeeProfile.email,
      subject: "",
      html: "",
    };

    switch (status) {
      case "APPROVED":
        emailConfig.subject = "✅ Leave Approved";
        emailConfig.html = emailTemplates.leaveApproved(employeeProfile, leave);
        break;
      case "REJECTED":
        emailConfig.subject = "❌ Leave Rejected";
        emailConfig.html = emailTemplates.leaveRejected(employeeProfile, leave);
        break;
      // Add other statuses if needed, though typically only approval/rejection needs notifications
      default:
        return "No notification required for this status change.";
    }

    await sendEmail(emailConfig);
    return emailStatus;

  } catch (emailErr) {
    const message =
      emailErr instanceof Error ? emailErr.message : "Failed to send email";
    console.error("Error sending email:", message);
    return `Leave status updated, but email could not be sent: ${message}`;
  }
};


/**
 * Business logic to apply for a new leave request.
 */
export const applyLeaveService = async (leaveData: any): Promise<LeaveDocument> => {
  // Add any complex validation/business rules here before saving
  
  // Persistence via Repository
  const newLeave = await leaveRepository.createLeave(leaveData);
  return newLeave;
};

/**
 * Business logic to delete a leave request by ID.
 */
export const deleteLeaveService = async (id: string): Promise<LeaveDocument> => {
  // Persistence via Repository
  const deletedLeave = await leaveRepository.deleteLeaveById(id);

  if (!deletedLeave) {
    throw new ApiError(ERROR_MESSAGES.NOT_FOUND,404);
  
    return;
  }

  return deletedLeave;
};

/**
 * Business logic to fetch all leave requests.
 */
// services/leaveService.ts
// export const getAllLeavesService = async (page: number, limit: number): Promise<{
//   leaves: LeaveDocument[],
//   count: number,
//   page: number,
//   limit: number,
//   totalPages: number
// }> => {
//   const leaves = await leaveRepository.findAllLeaves(page, limit);

//   const count = await leaveRepository.countLeaves() // Total leaves in DB
//   const totalPages = Math.ceil(count / limit);

//   return {
//     leaves,
//     count,
//     page,
//     limit,
//     totalPages,
//   };
// };




export const getAllLeavesService = async (
  page?: number,
  limit?: number,
  search?: string,
  leaveType?: string
): Promise<{
  leaves: LeaveDocument[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}> => {
  try {
    const leaves = await leaveRepository.findAllLeaves(page, limit, search, leaveType);
    const count = await leaveRepository.countLeaves();
    console.log("Total leave documents:", count);
    
    console.log("leave",leaves)
    console.log("count",count)
   
    if (!leaves.length) {
      throw new ApiError("No leaves found", 404);
    }

    return {
      leaves,
      count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err.message || "Error fetching leaves", 500);
  }
};

/**
 * Business logic to fetch leaves by an employee ID.
 */
export const getLeavesByEmployeeService = async (
  employeeId: string
): Promise<LeaveDocument[]> => {

  const leaves = await leaveRepository.findLeavesByEmployeeId(employeeId);

  if (!leaves || leaves.length === 0) {
    throw new Error("No leaves found for this employee");
  }

  return leaves;  // ✅ correctly typed
};


/**
 * Business logic to update a leave request's status (approve, reject, cancel).
 */
export const updateLeaveStatusService = async (
  id: string,
  newStatus: LeaveStatus
): Promise<{ leave: LeaveDocument; emailStatus: string }> => {
  // 1. Fetch Leave
  const leave = await leaveRepository.findLeaveById(id);

  if (!leave) {
    throw new Error("Leave not found");
    return;
  }

  // 2. Update Status and Save
  leave.status = newStatus;
  
  // Persistence via Repository
  const updatedLeave = await leaveRepository.saveLeave(leave);
   
  // 3. Send Email (Business Rule)
  let emailStatus = "";
  if (newStatus === "APPROVED" || newStatus === "REJECTED") {
    emailStatus = await sendLeaveStatusEmail(updatedLeave, newStatus);
  } else {
    emailStatus = "Status updated. No email notification required.";
  }
  
  return { leave: updatedLeave, emailStatus };
};