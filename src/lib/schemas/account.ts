import { z } from 'zod';

export const updateNameSchema = z.object({
	firstName: z.string().nonempty("First name can't be empty."),
	lastName: z.string().nonempty("Last name can't be empty.")
});

export const updatePfpSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	confirmPassword: z.string().min(8)
});
