export const load = async ({ locals }) => {
	const { auth } = locals;

	return {
		auth
	};
};
