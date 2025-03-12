import * as argon2 from 'argon2';

import { createSession, getUserByEmail } from '$lib/server/db/actions.js';
import { fail, isRedirect, redirect } from '@sveltejs/kit';
import { generateToken, setSessionTokenCookie } from '$lib/server/auth.js';
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
		if (!form.valid) return fail(400, { form });

		const { email, password } = form.data;
		const user = await getUserByEmail(email);

		const valid = await argon2.verify(user.passwordHash, password);
		if (!valid) {
			setError(form, '', 'Invalid email or password.');
			return fail(400, { form });
		}

		const token = generateToken();
		try {
			const session = await createSession(
				token,
				user.id,
				event.locals.ipAddr,
				event.locals.userAgent
			);
			setSessionTokenCookie(event, token, session.expiresAt);
		} catch (e: any) {
			setError(form, '', e.message || 'Unknown error.');
			return fail(400, { form });
		}

		return redirect(303, '/');
	}
};
