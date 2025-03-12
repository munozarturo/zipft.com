import { deleteSessionTokenCookie } from '$lib/server/auth.js';
import { invalidateSession } from '$lib/server/db/actions.js';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const { session } = event.locals.auth;
	if (!session) return redirect(302, '/');

	try {
		await invalidateSession(session.tokenHash);
		deleteSessionTokenCookie(event);
	} catch (e: any) {}

	return redirect(303, '/');
};

export const actions = {
	default: async (event) => {
		const { session } = event.locals.auth;
		if (!session) return redirect(302, '/');

		try {
			await invalidateSession(session.tokenHash);
			deleteSessionTokenCookie(event);
		} catch (e: any) {}

		return redirect(303, '/');
	}
};
