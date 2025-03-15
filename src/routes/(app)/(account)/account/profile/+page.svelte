<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { updateNameSchema, updatePfpSchema } from '$lib/schemas/account';
	import { zod } from 'sveltekit-superforms/adapters';
	import Spinner from '$lib/assets/icons/Spinner.svelte';

	let { data } = $props();

	const {
		form: updateNameForm,
		errors: updateNameErrors,
		enhance: updateNameEnhance,
		message: updateNameMessage,
		delayed: updateNameDelayed
	} = superForm(data.updateNameForm, {
		validators: zod(updateNameSchema)
	});

	const {
		form: updatePfpForm,
		errors: updatePfpErrors,
		enhance: updatePfpEnhance,
		message: updatePfpMessage,
		delayed: UpadePfpDelayed
	} = superForm(data.updatePfpForm, {
		validators: zod(updatePfpSchema)
	});
</script>

<form
	method="POST"
	action="?/updateName"
	class="card max-w-[420px] space-y-4"
	use:updateNameEnhance
>
	<div class="grid grid-cols-2 gap-2">
		<label class="label">
			<span>First Name</span>
			<input
				name="firstName"
				type="text"
				placeholder="John"
				class="input"
				spellcheck="false"
				bind:value={$updateNameForm.firstName}
			/>
			{#if $updateNameErrors.firstName}
				<small class="text-error-500">{$updateNameErrors.firstName}</small>
			{/if}
		</label>
		<label class="label">
			<span>Last Name</span>
			<input
				name="lastName"
				type="text"
				placeholder="Doe"
				class="input"
				spellcheck="false"
				bind:value={$updateNameForm.lastName}
			/>
			{#if $updateNameErrors.lastName}
				<small class="text-error-500">{$updateNameErrors.lastName}</small>
			{/if}
		</label>
	</div>
	<button
		class="btn preset-outlined-primary-900-100 group w-full justify-between"
		disabled={$updateNameDelayed}
	>
		<span>Update</span>
		{#if $updateNameDelayed}
			<Spinner class="h-5 w-5 animate-spin" />
		{/if}
	</button>
</form>

<hr class="m-10" />

<form method="POST" action="?/updatePfp" use:updatePfpEnhance>
	E-mail: <input name="email" type="email" bind:value={$updatePfpForm.email} />
	Password:
	<input name="password" type="password" bind:value={$updatePfpForm.password} />
	Confirm password:
	<input name="confirmPassword" type="password" bind:value={$updatePfpForm.confirmPassword} />
	<button>Submit</button>
</form>
