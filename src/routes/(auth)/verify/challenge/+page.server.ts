import type { PageServerLoad } from './$types';
import { validateVerficiationChallenge } from '$lib/server/db/actions';

export const load: PageServerLoad = async (event) => {
	const redirectUrl = event.url.searchParams.get('r') || '/';

	const token = event.url.searchParams.get('t');

	if (!token) {
		return {
			redirectUrl,
			error: true,
			title: 'Error verifying account',
			message: 'Missing verification token.'
		};
	}

	try {
		await validateVerficiationChallenge(token);
		return {
			redirectUrl,
			error: false,
			title: 'Account verified',
			message: 'Your account has been verified.'
		};
	} catch (e: any) {
		return {
			redirectUrl,
			error: true,
			title: 'Error verifying account',
			message: e.message || 'Unknown error while attempting to verify account.'
		};
	}
};
