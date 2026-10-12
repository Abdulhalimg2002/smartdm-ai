
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters."),
  firstName: z.string().min(6, "First name is required."),
  lastName: z.string().min(6, "Last name is required."),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
