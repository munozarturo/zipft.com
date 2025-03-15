import * as argon2 from 'argon2';

import { createSession, getUserByEmail } from '$lib/server/db/actions.js';
import { fail, redirect } from '@sveltejs/kit';
import { generateToken, setSessionTokenCookie } from '$lib/server/auth.js';
import { setError, superValidate } from 'sveltekit-superforms/server';

import { signInSchema } from '$lib/schemas/auth';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	// redirect url
	const redirectUrl = event.url.searchParams.get('r') || '/';

	const form = await superValidate(event, zod(signInSchema));

	return { form, redirectUrl };
};

export const actions = {
	default: async (event) => {
		const redirectUrl = event.url.searchParams.get('r') || '/';

		const form = await superValidate(event, zod(signInSchema));
		if (!form.valid) return fail(400, { form });

		const { email, password } = form.data;
		const user = await getUserByEmail(email);
		if (!user) {
			setError(form, '', 'Invalid email or password.');
			return fail(400, { form, redirectUrl });
		}

		const valid = await argon2.verify(user.passwordHash, password);
		if (!valid) {
			setError(form, '', 'Invalid email or password.');
			return fail(400, { form, redirectUrl });
		}

		if (!user.verified) {
			return redirect(303, `/verify?e=${user.email}&r=${redirectUrl}`);
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
			return fail(400, { form, redirectUrl });
		}

		return redirect(303, redirectUrl);
	}
};
