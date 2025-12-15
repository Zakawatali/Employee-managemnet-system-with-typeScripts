"use strict";
// import { Request, Response } from "express";
// import Employee from "../models/EmployeeProfile";
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
exports.getAllEmployees = exports.deleteEmployee = exports.updateEmployee = exports.getEmployeeById = void 0;
const employeeService = __importStar(require("../Services/employeeServices"));
/**
 * Controller to get a single employee profile by ID.
 */
const getEmployeeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const employee = await employeeService.getEmployeeByIdService(id);
        res.result = { employee };
        next(200);
    }
    catch (err) {
        const message = err.message || "Error fetching employee";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.getEmployeeById = getEmployeeById;
/**
 * Controller to update an employee profile.
 */
const updateEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedEmployee = await employeeService.updateEmployeeService(id, updateData);
        res.result = { employee: updatedEmployee };
        next(200);
    }
    catch (err) {
        const message = err.message || "Error updating employee";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.updateEmployee = updateEmployee;
/**
 * Controller to delete an employee profile.
 */
const deleteEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await employeeService.deleteEmployeeService(id);
        res.result = result;
        next(200);
    }
    catch (err) {
        const message = err.message || "Error deleting employee";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.deleteEmployee = deleteEmployee;
/**
 * Controller to get all employee profiles.
 */
const getAllEmployees = async (_req, res, next) => {
    try {
        const result = await employeeService.getAllEmployeesService();
        res.result = result; // Contains { employees: [], count: N }
        next(200);
    }
    catch (err) {
        const message = err.message || "Server error";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.getAllEmployees = getAllEmployees;
