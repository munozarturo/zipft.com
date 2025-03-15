import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const redirectUrl = event.url.searchParams.get('r') || '/';

	const { auth } = event.locals;

	if (auth.session) return redirect(303, redirectUrl);
};
