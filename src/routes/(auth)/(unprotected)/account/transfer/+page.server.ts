import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const token = event.url.searchParams.get('t');
	if (!token) {
		return {
			error: true,
			title: 'Account transfer failed',
			message: 'No account transfer token was provided.'
		};
	}

	const { session } = event.locals.auth;
	if (!session)
		return {
			error: true,
			title: 'Account transfer failed',
			message: 'You must be signed in to complete an account transfer.'
		};

	return {
		error: false,
		title: 'Account transfer complete',
		message: 'Your account has been transferred.'
	};
};
