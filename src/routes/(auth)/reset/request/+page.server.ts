import {
	createCommunication,
	createPasswordReset,
	getLastCommunication,
	getUserByEmail
} from '$lib/server/db/actions.js';

import { ROOT_DOMAIN } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import { generateToken } from '$lib/server/auth';
import { passwordResetRequestSchema } from '$lib/schemas/auth';
import { sendEmail } from '$lib/server/aws/ses';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const form = await superValidate(event, zod(passwordResetRequestSchema));
	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(passwordResetRequestSchema));
		if (!form.valid) return fail(400, { form });

		const { email } = form.data;
		try {
			const user = await getUserByEmail(email);

			const mostRecentCommunication = await getLastCommunication(user.id);

			if (mostRecentCommunication) {
				const oneMinuteAgo = Date.now() - 60 * 1000;
				if (mostRecentCommunication.createdAt.getTime() > oneMinuteAgo) {
					return {
						verified: false,
						message: 'Please wait one minute before requesting another verification email',
						rateLimited: true,
						nextRequestTime: new Date(mostRecentCommunication.createdAt.getTime() + 60 * 1000)
					};
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
			// user doesn't exist or any other errors
			return { form };
		}

		return { form };
	}
};
