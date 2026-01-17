"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const globalErrorHandler = (err, req, res, next) => {
    // Handle Zod validation errors
    if (err instanceof zod_1.ZodError) {
        const validationErrors = err.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
            code: e.code,
            path: e.path,
        }));
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: validationErrors,
        });
    }
    // Handle other errors
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong!";
    res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === "development" ? err : {},
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};
exports.default = globalErrorHandler;
