"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllEmployees = exports.deleteEmployeeById = exports.updateEmployeeById = exports.findEmployeeById = void 0;
// Assuming the following types and models are imported from their respective paths
const EmployeeProfile_1 = __importDefault(require("../models/EmployeeProfile"));
/**
 * Finds an employee profile by ID.
 * @param id The ID of the employee to find.
 * @returns The EmployeeProfile document or null if not found.
 */
const findEmployeeById = async (id) => {
    return EmployeeProfile_1.default.findById(id).exec();
};
exports.findEmployeeById = findEmployeeById;
/**
 * Updates an employee profile by ID.
 * @param id The ID of the employee to update.
 * @param updateData The data to apply to the employee profile.
 * @returns The updated EmployeeProfile document or null if not found.
 */
const updateEmployeeById = async (id, updateData) => {
    return EmployeeProfile_1.default.findByIdAndUpdate(id, updateData, {
        new: true, // Return the modified document rather than the original
        runValidators: true, // Ensure schema validators run on update
    }).exec();
};
exports.updateEmployeeById = updateEmployeeById;
/**
 * Finds and deletes an employee profile by ID.
 * @param id The ID of the employee to delete.
 * @returns The deleted EmployeeProfile document or null if not found.
 */
const deleteEmployeeById = async (id) => {
    return EmployeeProfile_1.default.findByIdAndDelete(id).exec();
};
exports.deleteEmployeeById = deleteEmployeeById;
/**
 * Finds all employee profiles in the database.
 * @returns An array of EmployeeProfile documents.
 */
const findAllEmployees = async () => {
    return EmployeeProfile_1.default.find().exec();
};
exports.findAllEmployees = findAllEmployees;
