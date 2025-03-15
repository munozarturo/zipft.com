import { z } from 'zod';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { updateNameSchema, updatePfpSchema } from '$lib/schemas/account';

export const load: PageServerLoad = async () => {
	// Different schemas, no id required.
	const updateNameForm = await superValidate(zod(updateNameSchema));
	const updatePfpForm = await superValidate(zod(updatePfpSchema));

	// Return them both
	return { updateNameForm, updatePfpForm };
};

export const actions = {
	updateName: async ({ request }) => {
		const updateNameForm = await superValidate(request, zod(updateNameSchema));

		if (!updateNameForm.valid) return fail(400, { updateNameForm });

		// TODO: updateName user
		return message(updateNameForm, 'updateName form submitted');
	},

	updatePfp: async ({ request }) => {
		const updatePfpForm = await superValidate(request, zod(updatePfpSchema));

		if (!updatePfpForm.valid) return fail(400, { updatePfpForm });

		// TODO: updatePfp user
		return message(updatePfpForm, 'updatePfp form submitted');
	}
} satisfies Actions;
