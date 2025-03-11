import type { Actions, PageServerLoad } from './$types';
import {
	createCommunication,
	getUserByEmail,
	validateVerficiationChallenge
} from '$lib/server/db/actions.js';

import { ROOT_DOMAIN } from '$env/static/private';
import { generateToken } from '$lib/server/auth.js';
import { redirect } from '@sveltejs/kit';
import { sendEmail } from '$lib/server/aws/ses';

export const load: PageServerLoad = async ({ url }) => {
	// if token is defined then try to validate the token to verify account
	const t = url.searchParams.get('t');
	// if email is defined then this means that a verification request is being made
	const email = url.searchParams.get('e');

	// if neither is defined then there is an issue
	if (!t && !email) throw redirect(302, '/');

	if (t) {
		const {
			error: verificationError,
			message: verificationMessage,
			data
		} = await validateVerficiationChallenge(t);
		if (verificationError) {
			return { message: verificationMessage, verified: false };
		}

		return { verified: true };
	}

	// Return early if no email is provided
	if (!email) {
		return { verified: false, message: 'No email provided' };
	}

	// Get user by email
	const { error: userError, message: userMessage, data } = await getUserByEmail(email);

	if (userError) {
		return { verified: false, message: userMessage || 'User not found' };
	}

	const user = data.user;

	// If user is already verified, redirect to home
	if (user.verified) throw redirect(302, '/');

	// Generate token and create communication record
	const token = generateToken();
	const {
		error: communicationError,
		data: commData,
		message: commMessage
	} = await createCommunication(user.id, 'email', 'verification');

	if (communicationError) return { verified: false, message: commMessage };

	const communication = commData.communication;

	await sendEmail({
		source: `zipft Security <security@auth.${ROOT_DOMAIN}>`,
		destination: { to: email },
		subject: 'Account Verification Token',
		body: { text: `https://${ROOT_DOMAIN}/verify?t=${token}\n${communication.id}` }
	});

	return { verified: false, message: 'Verification email sent' };
};
