import { z } from "zod";

/**
 * Concept: Password & Form Validation Schema
 * Why:
 * Assignment 8 explicitly mandates strict password rules:
 * - Minimum 6 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 *
 * How:
 * We use Zod's `.regex()` to validate uppercase and lowercase letter presence.
 * These schemas provide instant, user-friendly error messages before sending network requests.
 */

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").trim(),
    email: z.string().email("Please enter a valid email address").trim().toLowerCase(),
    image: z.string().url("Please provide a valid image URL").optional().or(z.literal("")),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
