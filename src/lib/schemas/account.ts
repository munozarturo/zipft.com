import { z } from 'zod';

export const updateNameSchema = z.object({
	firstName: z.string().nonempty("First name can't be empty."),
	lastName: z.string().nonempty("Last name can't be empty.")
});

export const updatePfpSchema = z.object({
	fileSize: z.number().positive(),
	fileSha256Hash: z.string().length(64),
	fileType: z.string()
});
