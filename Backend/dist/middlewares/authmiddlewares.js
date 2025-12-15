"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const EmployeeProfile_1 = __importDefault(require("../models/EmployeeProfile"));
const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }
        const token = authHeader.split(" ")[1];
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET not configured");
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = await EmployeeProfile_1.default.findById(decoded.id).select("-password");
        if (!req.user) {
            return res
                .status(401)
                .json({ message: "User not found or not approved" });
        }
        next();
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Not authorized, invalid token";
        console.error("❌ Protect middleware error:", message);
        return res.status(401).json({ message });
    }
};
exports.protect = protect;
const authorizeRoles = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        const role = req.user?.role ?? "Unknown";
        return res.status(403).json({
            message: `Role (${role}) is not allowed to access this resource`,
        });
    }
    next();
};
exports.authorizeRoles = authorizeRoles;
