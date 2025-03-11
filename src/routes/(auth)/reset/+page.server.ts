import { setError, superValidate } from 'sveltekit-superforms/server';

import { passwordResetSchema } from '$lib/schemas/auth';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const form = await superValidate(event, zod(passwordResetSchema));

	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(passwordResetSchema));

		return { form };
	}
};
