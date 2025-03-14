import { z } from 'zod';

export const signUpSchema = z.object({
	firstName: z.string().nonempty("First name can't be empty."),
	lastName: z.string().nonempty("Last name can't be empty."),
	email: z.string().email("Email can't be empty."),
	password: z.string().min(10, 'Password must be at least 10 characters.')
});

export const signInSchema = z.object({
	email: z.string().email("Email can't be empty."),
	password: z.string().nonempty("Password can't be emtpy.")
});

export const passwordResetRequestSchema = z.object({
	email: z.string().email().nonempty("Email can't be empty.")
});

export const passwordResetSchema = z.object({
	password: z.string().min(10, 'Password must be at least 10 characters.')
});
