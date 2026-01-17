import { z } from "zod";

export const registerValidation = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        phone: z.string().min(10, "Phone must be at least 10 digits"),
        nid: z.string().min(10, "NID must be at least 10 characters"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    }),
});

export const loginValidation = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
    }),
});
