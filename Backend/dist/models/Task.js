"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "EmployeeProfile",
        required: true,
    },
    priority: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
        default: "MEDIUM",
    },
    dueDate: { type: Date },
    assignTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "EmployeeProfile",
        required: true,
    },
    status: {
        type: String,
        enum: ["PENDING", "IN_PROGRESS", "DONE", "COMPLETED", "BLOCKED", "DELAYED"],
        default: "PENDING",
    },
    assignedAt: { type: Date, default: Date.now },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Task", taskSchema);
