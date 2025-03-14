import { setError, superValidate } from 'sveltekit-superforms/server';

import { fail } from '@sveltejs/kit';
import { passwordResetSchema } from '$lib/schemas/auth';
import { resetPassword } from '$lib/server/db/actions.js';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const redirectUrl = event.url.searchParams.get('r') || '/';

	const form = await superValidate(event, zod(passwordResetSchema));

	return { form, redirectUrl, resetPassword: false };
};

export const actions = {
	default: async (event) => {
		const redirectUrl = event.url.searchParams.get('r') || '/';

		const form = await superValidate(event, zod(passwordResetSchema));

		const { password } = form.data;
		const token = event.url.searchParams.get('t');
		if (!token) {
			setError(form, '', 'Invalid password reset token.');
			return fail(400, { form, redirectUrl });
		}

		try {
			await resetPassword(token, password);
		} catch (e: any) {
			setError(form, '', e.message || 'Unknown error.');
			return fail(400, { form, redirectUrl });
		}

		return { form, redirectUrl, resetPassword: true };
	}
};
