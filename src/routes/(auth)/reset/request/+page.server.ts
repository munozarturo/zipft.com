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
import { sendEmail } from '$lib/server/aws/ses';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const form = await superValidate(event, zod(passwordResetRequestSchema));
	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(passwordResetRequestSchema));
		if (!form.valid) return fail(400, { form });

		try {
			const { email } = form.data;
			const user = await getUserByEmail(email);
			if (!user) {
				return { form };
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
						form
					});
				}
			}

			const token = generateToken();
			await createPasswordReset(token, user.id);
			const communication = await createCommunication(user.id, 'email', 'verification');

			await sendEmail({
				source: `zipft Security <security@auth.${ROOT_DOMAIN}>`,
				destination: { to: email },
				subject: 'Password Reset Token',
				body: {
					text: `https://${ROOT_DOMAIN}/reset?t=${token}::${communication.id}`,
					html: `<p>https://${ROOT_DOMAIN}/reset?t=${token}</p><br><p>${communication.id}</p>`
				}
			});

			return { form };
		} catch (e: any) {
			setError(form, '', e.message || 'Unknown error.');
			return fail(400, { form });
		}
	}
};
