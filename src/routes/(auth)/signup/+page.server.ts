import { createUser, emailInUse } from '$lib/server/db/actions.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';

import { signUpSchema } from '$lib/schemas/auth';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const form = await superValidate(event, zod(signUpSchema));
	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(signUpSchema));
		if (!form.valid) return fail(400, { form });

		const { firstName, lastName, email, password } = form.data;
		const { error: checkEmailError, data: checkEmailData } = await emailInUse(email);
		if (checkEmailError) {
			setError(form, 'Error checking email.');
			return fail(500, { form });
		}
		if (checkEmailData.used) {
			setError(form, 'email', 'Email already in use.');
			return fail(400, { form });
		}

		const { error: createUserError, data: createUserData } = await createUser(
			email,
			firstName,
			lastName,
			password
		);
		if (createUserError) {
			setError(form, 'Error creating user.');
			return fail(500, { form });
		}
		const { user } = createUserData;

		throw redirect(303, `/verify?e=${user.email}`);
	}
};
