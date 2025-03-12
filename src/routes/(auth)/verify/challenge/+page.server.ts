import type { PageServerLoad } from './$types';
import { validateVerficiationChallenge } from '$lib/server/db/actions';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('t');

	if (!token) {
		return { message: 'Missing verification token.' };
	}

	try {
		await validateVerficiationChallenge(token);
	} catch (e: any) {
		return { message: e.message || 'Unknown error.' };
	}
};
