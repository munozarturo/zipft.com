import {
	createCommunication,
	createVerificationChallenge,
	getLastCommunication,
	getUserByEmail
} from '$lib/server/db/actions';

import type { PageServerLoad } from './$types';
import { ROOT_DOMAIN } from '$env/static/private';
import { generateToken } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { sendEmail } from '$lib/server/aws/ses';

export const load: PageServerLoad = async ({ url }) => {
	const email = url.searchParams.get('e');
	if (!email) return redirect(302, '/');

	let user;
	try {
		user = await getUserByEmail(email);
	} catch (error) {
		if (error instanceof Error && error.message === 'Invalid email address.') {
			return redirect(302, '/signup');
		}
		return {
			verified: false,
			message: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}

	if (user.verified) return { verified: true, message: 'Account already verified' };

	try {
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
		await createVerificationChallenge(token, user.id);
		const communication = await createCommunication(user.id, 'email', 'verification');

		await sendEmail({
			source: `zipft Security <security@auth.${ROOT_DOMAIN}>`,
			destination: { to: email },
			subject: 'Account Verification Token',
			body: {
				text: `https://${ROOT_DOMAIN}/verify/challenge?t=${token}${communication.id}`,
				html: `<p>https://${ROOT_DOMAIN}/verify/challenge?t=${token}</p><br><p>${communication.id}</p>`
			}
		});

		return {
			verified: false,
			message: 'Verification email sent! Please check your inbox.'
		};
	} catch (error) {
		return {
			verified: false,
			message: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
};
