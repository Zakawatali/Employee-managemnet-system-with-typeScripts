"use strict";
// import { Request, Response } from "express";
// import Leave from "../models/Leave";
// import EmployeeProfile from "../models/EmployeeProfile";
// import { sendEmail } from "../utils/mailService";
// import { emailTemplates } from "../utils/emailTemplates";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelLeave = exports.rejectLeave = exports.approveLeave = exports.getLeaveByEmployeeId = exports.getAllLeaves = exports.deleteLeave = exports.applyLeave = void 0;
const leaveServices_1 = require("../Services/leaveServices");
// Assuming the following interface is available to handle custom errors
/**
 * Controller to apply for a new leave request.
 */
const applyLeave = async (req, res, next) => {
    try {
        const leaveData = {
            ...req.body,
            employee: req.user.id,
        };
        const newLeave = await (0, leaveServices_1.applyLeaveService)(leaveData);
        res.result = newLeave;
        next(201);
    }
    catch (err) {
        const message = err.message || "Error applying leave";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.applyLeave = applyLeave;
/**
 * Controller to delete a leave request by ID.
 */
const deleteLeave = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedLeave = await (0, leaveServices_1.deleteLeaveService)(id);
        res.result = deletedLeave;
        next(200);
    }
    catch (err) {
        const message = err.message || "Error deleting leave";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.deleteLeave = deleteLeave;
/**
 * Controller to get all leave requests.
 */
const getAllLeaves = async (_req, res, next) => {
    try {
        const leaves = await (0, leaveServices_1.getAllLeavesService)();
        res.result = { leaves };
        next(200);
    }
    catch (err) {
        const message = err.message || "Error fetching leaves";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.getAllLeaves = getAllLeaves;
/**
 * Controller to get leave requests by an employee ID.
 */
const getLeaveByEmployeeId = async (req, res, next) => {
    try {
        const { employeeId } = req.params;
        const result = await (0, leaveServices_1.getLeavesByEmployeeService)(employeeId);
        res.result = result;
        next(200);
    }
    catch (err) {
        const message = err.message || "Error fetching leave";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.getLeaveByEmployeeId = getLeaveByEmployeeId;
/**
 * Controller to approve a leave request.
 */
const approveLeave = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await (0, leaveServices_1.updateLeaveStatusService)(id, "APPROVED");
        res.result = result;
        next(200);
    }
    catch (err) {
        const message = err.message || "Error approving leave";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.approveLeave = approveLeave;
/**
 * Controller to reject a leave request.
 */
const rejectLeave = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await (0, leaveServices_1.updateLeaveStatusService)(id, "REJECTED");
        res.result = result;
        next(200);
    }
    catch (err) {
        const message = err.message || "Error rejecting leave";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.rejectLeave = rejectLeave;
/**
 * Controller to cancel a leave request (by employee).
 */
const cancelLeave = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { leave } = await (0, leaveServices_1.updateLeaveStatusService)(id, "CANCELLED");
        res.result = leave;
        next(200);
    }
    catch (err) {
        const message = err.message || "Error cancelling leave";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.cancelLeave = cancelLeave;
