import { createUser, emailInUse } from '$lib/server/db/actions.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';

import { signUpSchema } from '$lib/schemas/auth';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const redirectUrl = event.url.searchParams.get('r') || '/';

	const form = await superValidate(event, zod(signUpSchema));
	return { form, redirectUrl };
};

export const actions = {
	default: async (event) => {
		const redirectUrl = event.url.searchParams.get('r') || '/';

		const form = await superValidate(event, zod(signUpSchema));
		if (!form.valid) return fail(400, { form, redirectUrl });

		const { firstName, lastName, email, password } = form.data;

		let user;
		try {
			const emailCheck = await emailInUse(email);
			if (emailCheck.used) {
				setError(form, 'email', 'Email already in use.');
				return fail(400, { form, redirectUrl });
			}

			user = await createUser(email, firstName, lastName, password);
		} catch (e: any) {
			setError(form, '', e.message || 'Unknown error.');
			return fail(400, { form, redirectUrl });
		}

		return redirect(303, `/verify?e=${user.email}&r=${redirectUrl}`);
	}
};
