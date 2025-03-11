import { deleteSessionTokenCookie, setSessionTokenCookie } from '$lib/server/auth';

import type { Handle } from '@sveltejs/kit';
import { validateSessionToken } from '$lib/server/db/actions';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session') ?? null;
	if (token === null) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { error, data } = await validateSessionToken(token);
	if (error) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}
	const { user, session } = data;
	if (session !== null) setSessionTokenCookie(event, token, session.expiresAt);
	else deleteSessionTokenCookie(event);

	event.locals.session = session;
	event.locals.user = user;
	return resolve(event);
};
