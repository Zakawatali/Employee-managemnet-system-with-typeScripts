"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const documentSchema = new mongoose_1.Schema({
    employee: { type: mongoose_1.Schema.Types.ObjectId, ref: "EmployeeProfile" },
    kind: {
        type: String,
        enum: ["CONTRACT", "LETTER", "PAYSLIP", "POLICY", "OTHER"],
        default: "OTHER",
    },
    title: { type: String, required: true },
    storageKey: { type: String, required: true },
    mimeType: { type: String },
    originalName: { type: String, required: true },
    uploadedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "EmployeeProfile" },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Document", documentSchema);
