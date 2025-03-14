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
	// if no email provided signin
	const email = url.searchParams.get('e');
	if (!email) return redirect(302, '/signin');

	// if user doesn't exist signup
	const user = await getUserByEmail(email);
	if (!user) return redirect(302, '/signup');

	// if account already verified
	if (user.verified)
		return {
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

	await sendEmail({
		source: `zipft Security <security@auth.${ROOT_DOMAIN}>`,
		destination: { to: email },
		subject: 'Account Verification Token',
		body: {
			text: `https://${ROOT_DOMAIN}/verify/challenge?t=${token}::${communication.id}`,
			html: `<p>https://${ROOT_DOMAIN}/verify/challenge?t=${token}</p><br><p>${communication.id}</p>`
		}
	});

	return {
		error: false,
		verified: false,
		message:
			'We sent a verification link to your email. Please check your inbox and click the link to complete your account setup.'
	};
};
