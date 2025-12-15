"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindEmployeeId = exports.FindUserIdandEmail = exports.findAllUser = exports.findUserByEmail = void 0;
const EmployeeProfile_1 = __importDefault(require("../models/EmployeeProfile"));
const User_1 = __importDefault(require("../models/User"));
const findUserByEmail = async (email) => {
    return EmployeeProfile_1.default.findOne({ email });
};
exports.findUserByEmail = findUserByEmail;
const findAllUser = async () => {
    return User_1.default.find().select("-password");
};
exports.findAllUser = findAllUser;
const FindUserIdandEmail = async (userId) => {
    return User_1.default.findById(userId);
};
exports.FindUserIdandEmail = FindUserIdandEmail;
const FindEmployeeId = async (employeeId) => {
    return EmployeeProfile_1.default.findById(employeeId);
};
exports.FindEmployeeId = FindEmployeeId;
