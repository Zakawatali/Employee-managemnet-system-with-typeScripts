import { LeaveDocument, LeaveStatus } from "../models/Leave"; 
import { EmployeeProfileDocument } from "../models/EmployeeProfile";
import * as leaveRepository from "../repositories/leaveRepositories";
import { sendEmail } from "../utils/mailService";
import { emailTemplates } from "../utils/emailTemplates";
import { Types } from "mongoose";

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
      emailStatus = "Employee not found, email not sent.";
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
    throw new Error("Leave not found");
  
    return;
  }

  return deletedLeave;
};

/**
 * Business logic to fetch all leave requests.
 */
export const getAllLeavesService = async (): Promise<LeaveDocument[]> => {
  // Persistence via Repository (with population handled in repo)
  return leaveRepository.findAllLeaves();
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