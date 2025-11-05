import { z } from 'zod';

/**
 * User management validation schemas
 * Implements input validation to prevent injection attacks and ensure data integrity
 */

export const userCreationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  phone: z
    .string()
    .trim()
    .regex(/^\+92\s?\d{3}\s?\d{7}$/, { message: "Phone must be in format: +92 300 1234567" })
    .optional()
    .or(z.literal('')),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password must be less than 100 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  role: z.enum(['owner', 'manager', 'staff'], {
    errorMap: () => ({ message: "Role must be owner, manager, or staff" }),
  }),
});

export type UserCreationFormData = z.infer<typeof userCreationSchema>;
