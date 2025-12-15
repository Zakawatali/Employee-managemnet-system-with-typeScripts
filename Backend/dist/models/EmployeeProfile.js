"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const employeeProfileSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    dateOfBirth: { type: Date },
    department: {
        type: String,
        enum: ["HR", "IT", "Finance", "Marketing", "Sales"],
        required: true,
    },
    position: {
        type: String,
        enum: ["Manager", "Team Lead", "Developer", "Designer", "Intern", "HR"],
        required: true,
    },
    experience: { type: String },
    education: { type: String },
    role: {
        type: String,
        enum: ["HR", "Employee", "Admin"],
        default: "Employee",
        required: true,
    },
    employeeCode: { type: String, unique: true, required: true, index: true },
    image: { type: String },
    status: {
        type: String,
        enum: ["PENDING", "ACTIVE", "SUSPENDED", "TERMINATED"],
        default: "PENDING",
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("EmployeeProfile", employeeProfileSchema);
