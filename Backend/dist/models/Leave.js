"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const leaveSchema = new mongoose_1.Schema({
    employee: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "EmployeeProfile",
        required: true,
        index: true,
    },
    leaveType: {
        type: String,
        enum: ["SICK", "CASUAL", "ANNUAL", "UNPAID"],
        required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    days: { type: Number },
    reason: { type: String },
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"],
        default: "PENDING",
    },
    approver: { type: mongoose_1.Schema.Types.ObjectId, ref: "EmployeeProfile" },
}, { timestamps: true });
leaveSchema.pre("save", function (next) {
    if (this.startDate > this.endDate) {
        return next(new Error("startDate cannot be after endDate"));
    }
    const msPerDay = 24 * 60 * 60 * 1000;
    const startTime = this.startDate.getTime();
    const endTime = this.endDate.getTime();
    this.days = Math.round((endTime - startTime) / msPerDay) + 1;
    if (this.leaveType === "SICK") {
        this.status = "APPROVED";
    }
    next();
});
exports.default = (0, mongoose_1.model)("Leave", leaveSchema);
