"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseEnhancer = void 0;
const responseEnhancer = (req, res, next) => {
    // SUCCESS RESPONSE
    res.success = (data, status = 200) => {
        return res.status(status).json({
            success: true,
            data,
            message: extractMessage(data),
        });
    };
    // CREATED (201)
    res.created = (data) => {
        return res.status(201).json({
            success: true,
            data,
            message: extractMessage(data),
        });
    };
    // ERROR HANDLER
    res.error = (error, status = 500) => {
        return res.status(status).json({
            success: false,
            error: formatError(error, isMobileClient(req)),
        });
    };
    next();
};
exports.responseEnhancer = responseEnhancer;
// ------------------------
// Extract message from data
// ------------------------
const extractMessage = (obj) => {
    if (!obj || typeof obj !== "object")
        return "";
    if ("message" in obj)
        return obj.message;
    if ("msg" in obj)
        return obj.msg;
    if ("messages" in obj)
        return obj.messages;
    if ("data" in obj)
        return extractMessage(obj.data);
    return "";
};
// ------------------------
// Detect Mobile Client
// ------------------------
const isMobileClient = (req) => {
    const agent = req.headers["user-agent"] || "";
    return /mobile|android|iphone/i.test(agent);
};
// ------------------------
// Format Error
// ------------------------
const formatError = (error, isMobile) => {
    if (!error)
        return "Unknown error";
    // If string → return as-is
    if (typeof error === "string")
        return error;
    // Development mode → full error
    if (process.env.NODE_ENV === "development" && !isMobile) {
        return {
            message: error.message || "Server error",
            stack: error.stack,
            ...error,
        };
    }
    // Production → safe message
    return error.message || error.error || "Something went wrong";
};
