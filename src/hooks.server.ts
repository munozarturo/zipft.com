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
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	try {
		const { user, session } = await validateSessionToken(token);
		if (session !== null) setSessionTokenCookie(event, token, session.expiresAt);
		else deleteSessionTokenCookie(event);

		event.locals.session = session;
		event.locals.user = user;
	} catch (e: any) {
		event.locals.user = null;
		event.locals.session = null;
	}

	return resolve(event);
};
