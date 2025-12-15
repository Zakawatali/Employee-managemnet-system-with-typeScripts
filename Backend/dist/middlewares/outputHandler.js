"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputHandler = void 0;
const OutputHandler = (status, req, res, next) => {
    if (res.headersSent)
        return;
    const result = res.result;
    const error = res.error;
    const userAgent = req.headers["user-agent"] || "";
    const isMobile = /mobile|android|iphone/i.test(userAgent);
    // Log error in development
    if ((process.env.NODE_ENV === "development" && error)) {
        console.log(error);
    }
    let resultStatus = true;
    if (result && result.resultHasErrors) {
        resultStatus = false;
        delete result.resultHasErrors;
    }
    // Prepare JSON response
    const prepareResponse = (status, resultStatus, data, errorData) => {
        switch (status) {
            case 200:
                return { success: resultStatus, data, message: findMessage(data) };
            case 201:
                return { success: true, data, message: findMessage(data) };
            case 404:
                return { success: false, error: formatError(errorData || "Resource not found.", isMobile) };
            case 400:
            case 401:
            case 403:
            case 500:
                return { success: false, error: formatError(errorData || data, isMobile) };
            default:
                return { success: false, error: formatError(errorData || "Something went wrong", isMobile) };
        }
    };
    return res.status(status).json(prepareResponse(status, resultStatus, result, error));
};
exports.OutputHandler = OutputHandler;
// ------------------------
// Format error
// ------------------------
const formatError = (error, isMobile = false) => {
    if (!error)
        return "Unknown error";
    if (typeof error === "string")
        return error;
    if (process.env.NODE_ENV === "development" && !isMobile) {
        return {
            message: error.message || "Server error",
            stack: error.stack,
            ...error,
        };
    }
    return error?.message || error?.error || "Something went wrong at the backend.";
};
// ------------------------
// Extract message from data
// ------------------------
const findMessage = (obj) => {
    let result = "";
    function recursiveSearch(value) {
        if (result !== "")
            return;
        if (typeof value === "object" && value !== null) {
            for (const key in value) {
                if (["message", "messages", "error", "errors"].includes(key)) {
                    result = value[key];
                    return;
                }
                else if (key === "data" && typeof value[key] === "object" && value[key] !== null) {
                    recursiveSearch(value[key]);
                }
            }
        }
    }
    recursiveSearch(obj);
    return result || "";
};
