import { passwordResetRequestSchema } from '$lib/schemas/auth';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const form = await superValidate(event, zod(passwordResetRequestSchema));
	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(passwordResetRequestSchema));

		return { form };
	}
};
