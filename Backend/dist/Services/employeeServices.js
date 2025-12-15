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
exports.getAllEmployeesService = exports.deleteEmployeeService = exports.updateEmployeeService = exports.getEmployeeByIdService = void 0;
const employeeRepository = __importStar(require("../repositories/employeeRepositories"));
// Define a custom error type for predictable HTTP status codes
/**
 * Service to retrieve a single employee profile by ID.
 * @param id The ID of the employee.
 * @returns The EmployeeProfile document.
 * @throws AppError for 404 if the employee is not found.
 */
const getEmployeeByIdService = async (id) => {
    const employee = await employeeRepository.findEmployeeById(id);
    if (!employee) {
        throw new Error("Employee not found");
        return;
    }
    return employee;
};
exports.getEmployeeByIdService = getEmployeeByIdService;
/**
 * Service to update an employee profile.
 * @param id The ID of the employee to update.
 * @param updateData The data to apply.
 * @returns The updated EmployeeProfile document.
 * @throws AppError for 404 if the employee is not found.
 */
const updateEmployeeService = async (id, updateData) => {
    // Business logic: Check if the employee exists and update in one go
    const updatedEmployee = await employeeRepository.updateEmployeeById(id, updateData);
    if (!updatedEmployee) {
        throw new Error("Employee not found");
        return;
    }
    return updatedEmployee;
};
exports.updateEmployeeService = updateEmployeeService;
/**
 * Service to delete an employee profile.
 * @param id The ID of the employee to delete.
 * @returns The deleted EmployeeProfile document.
 * @throws AppError for 404 if the employee is not found.
 */
const deleteEmployeeService = async (id) => {
    const deletedEmployee = await employeeRepository.deleteEmployeeById(id);
    if (!deletedEmployee) {
        throw new Error("Employee not found");
        return;
    }
    return deletedEmployee;
};
exports.deleteEmployeeService = deleteEmployeeService;
/**
 * Service to retrieve all employee profiles.
 * @returns An object containing the array of employees and their count.
 * @throws AppError for 404 if no employees are found.
 */
const getAllEmployeesService = async () => {
    const employees = await employeeRepository.findAllEmployees();
    if (!employees || employees.length === 0) {
        throw new Error("No employees found");
    }
    return { employees, count: employees.length };
};
exports.getAllEmployeesService = getAllEmployeesService;
