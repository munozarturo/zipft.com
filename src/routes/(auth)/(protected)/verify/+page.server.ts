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
import { sendVerificationEmail } from '$lib/email/send';

export const load: PageServerLoad = async (event) => {
	const redirectUrl = event.url.searchParams.get('r') || '/';

	// if no email provided signin
	const email = event.url.searchParams.get('e');
	if (!email) return redirect(303, `/signin?r=${redirectUrl}`);

	try {
		// if user doesn't exist signup
		const user = await getUserByEmail(email);
		if (!user) return redirect(303, `/signup?r=${redirectUrl}`);

		// if account already verified
		if (user.verified)
			return {
				redirectUrl,
				error: false,
				verified: true,
				message: 'Account has already been verified.'
			};

		// check most recent email sent
		const mostRecentCommunication = await getLastCommunication(user.id, 'email', 'verification');
		if (mostRecentCommunication) {
			const lastCommunicationTime = new Date(mostRecentCommunication.createdAt).getTime();
			const oneMinuteAgo = Date.now() - 60 * 1000;

			if (lastCommunicationTime > oneMinuteAgo) {
				const waitTime = lastCommunicationTime - oneMinuteAgo;
				return {
					redirectUrl,
					error: true,
					verified: false,
					message: 'Please wait before requesting another verification email.',
					wait: Math.ceil(waitTime / 1000)
				};
			}
		}

		// generate challenge
		const token = generateToken();
		await createVerificationChallenge(token, user.id);
		const communication = await createCommunication(user.id, 'email', 'verification');

		await sendVerificationEmail(user.email, {
			user,
			communication,
			verificationUrl: `https://www.${ROOT_DOMAIN}/verify/challenge?t=${token}&r=${redirectUrl}`
		});

		return {
			redirectUrl,
			error: false,
			verified: false,
			message:
				'We sent a verification link to your email. Please check your inbox and click the link to complete your account setup.'
		};
	} catch (e: any) {
		return {
			redirectUrl,
			error: false,
			verified: false,
			message: e.message || 'An unknown error occured while trying to create a verification link.'
		};
	}
};
