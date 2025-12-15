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
exports.updateLeaveStatusService = exports.getLeavesByEmployeeService = exports.getAllLeavesService = exports.deleteLeaveService = exports.applyLeaveService = void 0;
const leaveRepository = __importStar(require("../repositories/leaveRepositories"));
const mailService_1 = require("../utils/mailService");
const emailTemplates_1 = require("../utils/emailTemplates");
// Define a custom error type for predictable HTTP status codes
// Helper to handle email sending logic, which is complex business logic
const sendLeaveStatusEmail = async (leave, status) => {
    let emailStatus = "Email sent successfully";
    try {
        const employeeProfile = await leaveRepository.findEmployeeProfileById(leave.employee);
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
                emailConfig.html = emailTemplates_1.emailTemplates.leaveApproved(employeeProfile, leave);
                break;
            case "REJECTED":
                emailConfig.subject = "❌ Leave Rejected";
                emailConfig.html = emailTemplates_1.emailTemplates.leaveRejected(employeeProfile, leave);
                break;
            // Add other statuses if needed, though typically only approval/rejection needs notifications
            default:
                return "No notification required for this status change.";
        }
        await (0, mailService_1.sendEmail)(emailConfig);
        return emailStatus;
    }
    catch (emailErr) {
        const message = emailErr instanceof Error ? emailErr.message : "Failed to send email";
        console.error("Error sending email:", message);
        return `Leave status updated, but email could not be sent: ${message}`;
    }
};
/**
 * Business logic to apply for a new leave request.
 */
const applyLeaveService = async (leaveData) => {
    // Add any complex validation/business rules here before saving
    // Persistence via Repository
    const newLeave = await leaveRepository.createLeave(leaveData);
    return newLeave;
};
exports.applyLeaveService = applyLeaveService;
/**
 * Business logic to delete a leave request by ID.
 */
const deleteLeaveService = async (id) => {
    // Persistence via Repository
    const deletedLeave = await leaveRepository.deleteLeaveById(id);
    if (!deletedLeave) {
        throw new Error("Leave not found");
        return;
    }
    return deletedLeave;
};
exports.deleteLeaveService = deleteLeaveService;
/**
 * Business logic to fetch all leave requests.
 */
const getAllLeavesService = async () => {
    // Persistence via Repository (with population handled in repo)
    return leaveRepository.findAllLeaves();
};
exports.getAllLeavesService = getAllLeavesService;
/**
 * Business logic to fetch leaves by an employee ID.
 */
const getLeavesByEmployeeService = async (employeeId) => {
    // Persistence via Repository
    const leaves = await leaveRepository.findLeavesByEmployeeId(employeeId);
    if (!leaves || leaves.length === 0) {
        throw new Error("No leaves found for this employee");
        return;
    }
    return { totalLeaves: leaves.length, data: leaves };
};
exports.getLeavesByEmployeeService = getLeavesByEmployeeService;
/**
 * Business logic to update a leave request's status (approve, reject, cancel).
 */
const updateLeaveStatusService = async (id, newStatus) => {
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
    }
    else {
        emailStatus = "Status updated. No email notification required.";
    }
    return { leave: updatedLeave, emailStatus };
};
exports.updateLeaveStatusService = updateLeaveStatusService;
