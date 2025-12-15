"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgetPassword = exports.rejectUser = exports.approveUser = exports.getAllUsers = exports.loginUser = exports.registerUser = void 0;
const userServices_1 = require("../Services/userServices");
const registerUser = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, phone, address, dateOfBirth, department, position, experience, education, image, role, status, } = req.body;
        if (!firstName ||
            !lastName ||
            !email ||
            !password ||
            !department ||
            !position) {
            // res.error("Please fill all required fields", {}, 400);
            res.error = "Please fill all required fields";
            next(400);
            return;
        }
        const { newUser } = await (0, userServices_1.RegisterUserService)({
            firstName,
            lastName,
            email,
            password,
            phone,
            address,
            dateOfBirth,
            department,
            position,
            experience,
            education,
            image,
            role,
            status,
        });
        res.result = newUser;
        next(201);
    }
    catch (err) {
        res.error = err;
        next(500);
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.error = "Please provide email and password";
            next(400);
            return; // ✅ stops execution here
        }
        const result = await (0, userServices_1.LoginUserService)(email, password);
        // res.success("Login successful", { user, token }, 200);
        // Success response
        //  const result = {user,token};
        res.result = result;
        next(200); // output middleware sends success response
    }
    catch (err) {
        // const message = error instanceof Error ? error.message : "Login error";
        // res.error(message, { message }, 400);
        res.error = err;
        next(500);
    }
};
exports.loginUser = loginUser;
const getAllUsers = async (_req, res, next) => {
    try {
        const users = await (0, userServices_1.GetAllUserService)();
        res.result = users;
        next(200);
        // res.success("Users fetched successfully", { users }, 200);
    }
    catch (err) {
        // const message = error instanceof Error ? error.message : "Error fetching users";
        // res.error("Error fetching users", { message }, 500);
        res.error = err;
        next(500);
    }
};
exports.getAllUsers = getAllUsers;
const approveUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { employeeProfile } = await (0, userServices_1.ApproveUserServices)(userId);
        res.result = employeeProfile;
        next(200);
        // res.success("User approved and added as Employee", { employeeProfile }, 200);
    }
    catch (err) {
        // const message = error instanceof Error ? error.message : "Error approving user";
        // res.error("Error approving user", { error: message }, 500);
        res.error = err;
        next(500);
    }
};
exports.approveUser = approveUser;
const rejectUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { user } = await (0, userServices_1.RejectUserServices)(userId);
        // res.success("User has been rejected and removed from pending list", { user }, 200);
        res.result = user;
        next(200);
    }
    catch (err) {
        //const message = error instanceof Error ? error.message : "Error rejecting user";
        // res.error("Error rejecting user", { error: message }, 500);
        res.error = err;
        next(500);
    }
};
exports.rejectUser = rejectUser;
const forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const { user, respose } = await (0, userServices_1.ForgetPasswordServices)(email);
        // res.success(respose.message, { user }, respose.status);
        res.result = user;
        next(200);
    }
    catch (err) {
        // const message = error instanceof Error ? error.message : "Error resetting password";
        // res.error("Error while forgetting password", { message }, 500);
        res.error = err;
        next(500);
    }
};
exports.forgetPassword = forgetPassword;
const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        if (!newPassword) {
            // res.error("New password is required", {}, 400);
            res.error = "New password is required";
            next(400);
            return;
        }
        const { Emp, response } = await (0, userServices_1.ResetPasswordService)(newPassword, token);
        // res.success(response, { Emp }, 200);
        res.result = Emp;
        next(200);
    }
    catch (err) {
        // const message = error instanceof Error ? error.message : "Error resetting password";
        // res.error("Error while resetting password", { message }, 500);
        res.error = err;
        next(500);
    }
};
exports.resetPassword = resetPassword;
