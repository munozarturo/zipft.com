import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('e');
	if (!token) {
		return {};
	}
};
