"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findEmployeeProfileById = exports.saveLeave = exports.deleteLeaveById = exports.findLeavesByEmployeeId = exports.findLeaveById = exports.findAllLeaves = exports.createLeave = void 0;
// Assuming the following models and types exist and are correctly imported
const Leave_1 = __importDefault(require("../models/Leave"));
const EmployeeProfile_1 = __importDefault(require("../models/EmployeeProfile"));
const createLeave = async (leaveData) => {
    const newLeave = new Leave_1.default(leaveData);
    return newLeave.save();
};
exports.createLeave = createLeave;
/**
 * Finds all leave requests, populating employee and approver details.
 * @returns An array of Leave documents.
 */
const findAllLeaves = async () => {
    return Leave_1.default.find()
        .populate("employee", "firstName lastName email")
        .populate("approver", "firstName lastName email")
        .exec();
};
exports.findAllLeaves = findAllLeaves;
/**
 * Finds a single leave request by ID, populating employee and approver details.
 * @param id The ID of the leave request.
 * @returns The Leave document or null if not found.
 */
const findLeaveById = async (id) => {
    return Leave_1.default.findById(id)
        .populate("employee", "firstName lastName email")
        .populate("approver", "firstName lastName email")
        .exec();
};
exports.findLeaveById = findLeaveById;
/**
 * Finds all leave requests for a specific employee ID.
 * @param employeeId The ID of the employee.
 * @returns An array of Leave documents.
 */
const findLeavesByEmployeeId = async (employeeId) => {
    return Leave_1.default.find({ employee: employeeId })
        .populate("employee", "firstName lastName email")
        .populate("approver", "firstName lastName email")
        .exec();
};
exports.findLeavesByEmployeeId = findLeavesByEmployeeId;
/**
 * Finds and deletes a leave request by ID.
 * @param id The ID of the leave request to delete.
 * @returns The deleted Leave document or null if not found.
 */
const deleteLeaveById = async (id) => {
    return Leave_1.default.findByIdAndDelete(id).exec();
};
exports.deleteLeaveById = deleteLeaveById;
/**
 * Saves a modified Leave document (used for status updates).
 * @param leave The modified Leave document instance.
 * @returns The saved Leave document.
 */
const saveLeave = async (leave) => {
    return leave.save();
};
exports.saveLeave = saveLeave;
/**
 * Finds an employee profile by ID (needed for email details).
 * @param employeeId The ID of the employee profile.
 * @returns The EmployeeProfile document or null if not found.
 */
const findEmployeeProfileById = async (employeeId) => {
    return EmployeeProfile_1.default.findById(employeeId).exec();
};
exports.findEmployeeProfileById = findEmployeeProfileById;
