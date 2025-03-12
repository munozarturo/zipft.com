import { deleteSessionTokenCookie, setSessionTokenCookie } from '$lib/server/auth';

import type { Handle } from '@sveltejs/kit';
import { validateSessionToken } from '$lib/server/db/actions';

export const handle: Handle = async ({ event, resolve }) => {
	// request info
	event.locals.ipAddr = event.getClientAddress();
	event.locals.userAgent = event.request.headers.get('user-agent');

	// auth
	const token = event.cookies.get('session') ?? null;
	if (token === null) {
		event.locals.auth = { user: null, session: null };
		return resolve(event);
	}

	try {
		const { user, session } = await validateSessionToken(token);
		if (session !== null) setSessionTokenCookie(event, token, session.expiresAt);
		else deleteSessionTokenCookie(event);

		if (user !== null) event.locals.auth = { user, session };
		else event.locals.auth = { user: null, session: null };
	} catch (e: any) {
		event.locals.auth = { user: null, session: null };
	}

	return resolve(event);
};
