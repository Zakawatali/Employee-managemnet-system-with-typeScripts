"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const achievementSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "EmployeeProfile",
        required: true,
        index: true,
    },
    title: { type: String },
    body: { type: String },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Achievement", achievementSchema);
