"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordService = exports.ForgetPasswordServices = exports.RejectUserServices = exports.ApproveUserServices = exports.GetAllUserService = exports.RegisterUserService = exports.LoginUserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const EmployeeProfile_1 = __importDefault(require("../models/EmployeeProfile"));
const mailService_1 = require("../utils/mailService");
const emailTemplates_1 = require("../utils/emailTemplates");
const userRepositories_1 = require("../repositories/userRepositories");
const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }
    return secret;
};
const generateEmployeeCode = () => {
    const prefix = "EMP";
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${random}`;
};
const LoginUserService = async (email, password) => {
    const user = await (0, userRepositories_1.findUserByEmail)(email);
    if (!user) {
        throw new Error("User not found");
    }
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid password");
    }
    const payload = {
        id: user._id.toString(),
        role: user.role,
        email: user.email,
    };
    const expiresIn = (process.env.JWT_EXPIRES_IN || "30m");
    const signOptions = {
        expiresIn,
    };
    const token = jsonwebtoken_1.default.sign(payload, getJwtSecret(), signOptions);
    console.log({ ...user });
    return { token, ...user.toObject() };
};
exports.LoginUserService = LoginUserService;
const RegisterUserService = async (userData) => {
    const existingUser = await (0, userRepositories_1.findUserByEmail)(userData.email);
    if (existingUser) {
        throw new Error("User already exists with this email");
    }
    const hashedPassword = await bcryptjs_1.default.hash(userData.password, 10);
    const newUser = new User_1.default({
        ...userData,
        password: hashedPassword,
        role: userData.role ?? "Employee",
        status: userData.status ?? "PENDING",
    });
    await newUser.save();
    return { newUser };
};
exports.RegisterUserService = RegisterUserService;
const GetAllUserService = async () => {
    return (0, userRepositories_1.findAllUser)();
};
exports.GetAllUserService = GetAllUserService;
const ApproveUserServices = async (userId) => {
    const user = await (0, userRepositories_1.FindUserIdandEmail)(userId);
    if (!user) {
        throw new Error("User not found");
    }
    const employeeProfile = new EmployeeProfile_1.default({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        phone: user.phone,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        department: user.department,
        position: user.position,
        experience: user.experience,
        education: user.education,
        role: user.role,
        image: user.image,
        employeeCode: generateEmployeeCode(),
        status: "ACTIVE",
    });
    await employeeProfile.save();
    await user.deleteOne();
    try {
        await (0, mailService_1.sendEmail)({
            to: employeeProfile.email,
            subject: "🎉 Welcome to the Company!",
            html: emailTemplates_1.emailTemplates.welcomeEmployee(employeeProfile),
        });
    }
    catch (emailErr) {
        const message = emailErr instanceof Error ? emailErr.message : "Unknown email error";
        console.error("Error sending email:", message);
    }
    return { user, employeeProfile };
};
exports.ApproveUserServices = ApproveUserServices;
const RejectUserServices = async (userId) => {
    const user = await (0, userRepositories_1.FindUserIdandEmail)(userId);
    if (!user) {
        throw new Error("User not found");
    }
    await user.deleteOne();
    return { user };
};
exports.RejectUserServices = RejectUserServices;
const ForgetPasswordServices = async (email) => {
    const user = await (0, userRepositories_1.findUserByEmail)(email);
    if (!user) {
        throw new Error("User not found");
    }
    const resetTokenOptions = {
        expiresIn: "10m",
    };
    const token = jsonwebtoken_1.default.sign({ userId: user._id.toString() }, getJwtSecret(), resetTokenOptions);
    await (0, mailService_1.sendEmail)({
        to: user.email,
        subject: "Password Reset Request",
        html: `
      <div style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 40px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 30px;">
          <h2 style="color: #333; text-align: center;">🔒 Password Reset Request</h2>
          <p style="font-size: 15px; color: #555;">
            Hi ${user.firstName || "there"},<br><br>
            We received a request to reset your password for your EMS account.
            Click the button below to choose a new password:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:5173/reset-password/${token}" 
               style="background-color: #007bff; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block;">
               Reset Password
            </a>
          </div>

          <p style="font-size: 14px; color: #555;">
            This link will expire in <b>10 minutes</b> for your security.
          </p>
          <p style="font-size: 13px; color: #777;">
            If you didn’t request a password reset, you can safely ignore this email.
          </p>

          <hr style="margin: 25px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #888; text-align: center;">
            © ${new Date().getFullYear()} DevRolin EMS System. All rights reserved.
          </p>
        </div>
      </div>
    `,
    });
    const respose = {
        status: 200,
        message: "Reset email sent successfully",
    };
    return { user, respose };
};
exports.ForgetPasswordServices = ForgetPasswordServices;
const ResetPasswordService = async (newPass, token) => {
    const decoded = jsonwebtoken_1.default.verify(token, getJwtSecret());
    if (!decoded?.userId) {
        throw new Error("Invalid or expired token");
    }
    const Emp = await (0, userRepositories_1.FindEmployeeId)(decoded.userId);
    if (!Emp) {
        throw new Error("Employee not found in the system for the provided reset token");
    }
    const hashedPassword = await bcryptjs_1.default.hash(newPass, 10);
    Emp.password = hashedPassword;
    await Emp.save();
    const response = "Password Reset Successfully";
    return { Emp, response };
};
exports.ResetPasswordService = ResetPasswordService;
