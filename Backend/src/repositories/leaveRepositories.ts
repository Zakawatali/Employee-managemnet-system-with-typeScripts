// Assuming the following models and types exist and are correctly imported
import Leave, { LeaveDocument } from "../models/Leave";
import EmployeeProfile, { EmployeeProfileDocument } from "../models/EmployeeProfile";
import { Types } from "mongoose";


export const createLeave = async (leaveData: any): Promise<LeaveDocument> => {
  const newLeave = new Leave(leaveData);
  return newLeave.save();
};

/**
 * Finds all leave requests, populating employee and approver details.
 * @returns An array of Leave documents.
 */
export const findAllLeaves = async (): Promise<LeaveDocument[]> => {
  return Leave.find()
    .populate("employee", "firstName lastName email")
    .populate("approver", "firstName lastName email")
    .exec();
};

/**
 * Finds a single leave request by ID, populating employee and approver details.
 * @param id The ID of the leave request.
 * @returns The Leave document or null if not found.
 */
export const findLeaveById = async (id: string | Types.ObjectId): Promise<LeaveDocument | null> => {
  return Leave.findById(id)
    .populate("employee", "firstName lastName email")
    .populate("approver", "firstName lastName email")
    .exec();
};

/**
 * Finds all leave requests for a specific employee ID.
 * @param employeeId The ID of the employee.
 * @returns An array of Leave documents.
 */
export const findLeavesByEmployeeId = async (employeeId: string): Promise<LeaveDocument[]> => {
  return Leave.find({ employee: employeeId })
    .populate("employee", "firstName lastName email")
    .populate("approver", "firstName lastName email")
    .exec();
};

/**
 * Finds and deletes a leave request by ID.
 * @param id The ID of the leave request to delete.
 * @returns The deleted Leave document or null if not found.
 */
export const deleteLeaveById = async (id: string): Promise<LeaveDocument | null> => {
  return Leave.findByIdAndDelete(id).exec();
};

/**
 * Saves a modified Leave document (used for status updates).
 * @param leave The modified Leave document instance.
 * @returns The saved Leave document.
 */
export const saveLeave = async (leave: LeaveDocument): Promise<LeaveDocument> => {
  return leave.save();
};

/**
 * Finds an employee profile by ID (needed for email details).
 * @param employeeId The ID of the employee profile.
 * @returns The EmployeeProfile document or null if not found.
 */
export const findEmployeeProfileById = async (employeeId: Types.ObjectId): Promise<EmployeeProfileDocument | null> => {
  return EmployeeProfile.findById(employeeId).exec();
};