export const load = async (event) => {
	const { auth } = event.locals;

	return { auth };
};
