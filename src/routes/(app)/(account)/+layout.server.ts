import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const redirectUrl = event.url.pathname || '/';

	const { session } = event.locals.auth;
	if (!session) return redirect(303, `/signin?r=${redirectUrl}`);
};
