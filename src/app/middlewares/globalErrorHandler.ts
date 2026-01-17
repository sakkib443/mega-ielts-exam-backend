import { Request, Response, NextFunction } from "express";
import { ZodError, ZodIssue } from "zod";

interface AppError extends Error {
    statusCode?: number;
    status?: string;
    isOperational?: boolean;
}

const globalErrorHandler = (
    err: AppError | ZodError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Handle Zod validation errors
    if (err instanceof ZodError) {
        const validationErrors = err.issues.map((e: ZodIssue) => ({
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
    const statusCode = (err as AppError).statusCode || 500;
    const message = err.message || "Something went wrong!";

    res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === "development" ? err : {},
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

export default globalErrorHandler;
