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
	if (!email) throw redirect(302, '/');

	const { error: userError, data: userData } = await getUserByEmail(email);
	if (userError) throw redirect(302, '/signup');

	const { user } = userData;
	if (user.verified) return { verified: true, message: 'Account already verified' };

	const {
		error: commCheckError,
		data: commCheckData,
		message: commCheckMessage
	} = await getLastCommunication(user.id);

	if (commCheckError) return { verified: false, message: commCheckMessage };

	const { communication: mostRecentCommunication } = commCheckData;
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
	const { error: verifError, message: verifMessage } = await createVerificationChallenge(
		token,
		user.id
	);
	if (verifError) return { verified: false, message: verifMessage };

	const {
		error: commError,
		data: commData,
		message: commMessage
	} = await createCommunication(user.id, 'email', 'verification');

	if (commError) return { verified: false, message: commMessage };

	const { communication } = commData;

	await sendEmail({
		source: `zipft Security <security@auth.${ROOT_DOMAIN}>`,
		destination: { to: email },
		subject: 'Account Verification Token',
		body: {
			text: `Please verify your zipft account by clicking this link: https://${ROOT_DOMAIN}/verify/challenge?t=${token}${communication.id}`,
			html: `<p>Please verify your zipft account by clicking this link: https://${ROOT_DOMAIN}/verify/challenge?t=${token}${communication.id}</p>`
		}
	});

	return {
		verified: false,
		message: 'Verification email sent! Please check your inbox.'
	};
};
