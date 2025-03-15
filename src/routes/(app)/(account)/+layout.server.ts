import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const redirectUrl = event.url.pathname || '/';

	const { auth } = event.locals;

	const { session } = auth;
	if (!session) return redirect(303, `/signin?r=${redirectUrl}`);

	return { auth };
};
