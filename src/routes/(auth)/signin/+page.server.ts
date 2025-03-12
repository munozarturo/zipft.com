import { fail, isRedirect, redirect } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms/server';

import { signInSchema } from '$lib/schemas/auth';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const form = await superValidate(event, zod(signInSchema));
	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(signInSchema));

		return redirect(303, '/');
	}
};
