import {
	createCommunication,
	createPasswordReset,
	getLastCommunication,
	getUserByEmail
} from '$lib/server/db/actions.js';
import { setError, superValidate } from 'sveltekit-superforms/server';

import { ROOT_DOMAIN } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import { generateToken } from '$lib/server/auth';
import { passwordResetRequestSchema } from '$lib/schemas/auth';
import { sendPasswordResetEmail } from '$lib/email/send.js';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const redirectUrl = event.url.searchParams.get('r') || '/';

	const form = await superValidate(event, zod(passwordResetRequestSchema));

	return { form, redirectUrl };
};

export const actions = {
	default: async (event) => {
		const redirectUrl = event.url.searchParams.get('r') || '/';

		const form = await superValidate(event, zod(passwordResetRequestSchema));
		if (!form.valid) return fail(400, { form, redirectUrl });

		try {
			const { email } = form.data;
			const user = await getUserByEmail(email);
			if (!user) {
				return { form, redirectUrl };
			}

			const mostRecentCommunication = await getLastCommunication(
				user.id,
				'email',
				'password_reset'
			);
			if (mostRecentCommunication) {
				const lastCommunicationTime = new Date(mostRecentCommunication.createdAt).getTime();
				const oneMinuteAgo = Date.now() - 60 * 1000;

				if (lastCommunicationTime > oneMinuteAgo) {
					const waitTime = lastCommunicationTime - oneMinuteAgo;
					setError(
						form,
						'',
						`Please wait ${Math.ceil(waitTime)} seconds before requesting a password reset.`
					);
					return fail(400, {
						form,
						redirectUrl
					});
				}
			}

			const token = generateToken();
			await createPasswordReset(token, user.id);
			const communication = await createCommunication(user.id, 'email', 'verification');

			await sendPasswordResetEmail(user.email, {
				user,
				communication,
				passwordResetUrl: `https://www.${ROOT_DOMAIN}/reset?t=${token}&r=${redirectUrl}`
			});

			return { form };
		} catch (e: any) {
			setError(form, '', e.message || 'Unknown error.');
			return fail(400, { form, redirectUrl });
		}
	}
};
