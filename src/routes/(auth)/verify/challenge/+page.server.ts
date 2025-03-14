import type { PageServerLoad } from './$types';
import { validateVerficiationChallenge } from '$lib/server/db/actions';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('t');

	if (!token) {
		return {
			error: true,
			title: 'Error Verifying Account',
			message: 'Missing verification token.'
		};
	}

	try {
		await validateVerficiationChallenge(token);
		return { error: false, title: 'Account Verified', message: 'Your account has been verified.' };
	} catch (e: any) {
		return {
			error: true,
			title: 'Error Verifying Account',
			message: e.message || 'Unknown error while attempting to verify account.'
		};
	}
};
