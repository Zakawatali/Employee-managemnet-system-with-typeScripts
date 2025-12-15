"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponsemiddleware = void 0;
const ApiResponsemiddleware = (_req, res, next) => {
    res.success = (message = "Success", data = {}, statusCode = 200) => {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            error: {},
        });
    };
    res.error = (message = "Something went wrong", error = {}, statusCode = 500) => {
        return res.status(statusCode).json({
            success: false,
            message,
            data: {},
            error,
        });
    };
    next();
};
exports.ApiResponsemiddleware = ApiResponsemiddleware;
