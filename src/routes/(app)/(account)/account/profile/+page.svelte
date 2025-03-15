<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { updateNameSchema, updatePfpSchema } from '$lib/schemas/account';
	import { zod } from 'sveltekit-superforms/adapters';
	import Spinner from '$lib/assets/icons/Spinner.svelte';

	import { FileUpload } from '@skeletonlabs/skeleton-svelte';
	import CloudUpload from '$lib/assets/icons/CloudUpload.svelte';
	import Avatar from '$lib/components/core/Avatar.svelte';

	let { data } = $props();
	const { user } = data.auth;

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

<div class="flex flex-col gap-4">
	<h1 class="h1">Profile</h1>

	<form
		method="POST"
		action="?/updatePfp"
		use:updatePfpEnhance
		class="card flex max-w-[420px] flex-col gap-4"
	>
		<h2 class="h2">Profile Picture</h2>

		<Avatar name={`${user.firstName} ${user.lastName}`} className="w-20 h-20 text-3xl font-bold" />
		<FileUpload name="example-button" accept="image/*" onFileChange={console.log} maxFiles={2}>
			<button class="btn preset-filled">
				<CloudUpload class="h-6 w-6" />
				<span>Select Image</span>
			</button>
		</FileUpload>

		<input type="hidden" name="fileSize" bind:value={$updatePfpForm.fileSize} />
		<input type="hidden" name="fileSha256Hash" bind:value={$updatePfpForm.fileSha256Hash} />
		<input type="hidden" name="fileType" bind:value={$updatePfpForm.fileType} />

		<button
			class="btn preset-outlined-primary-900-100 group w-full justify-between"
			disabled={$UpadePfpDelayed}
		>
			<span>Update Profile Picture</span>
			{#if $UpadePfpDelayed}
				<Spinner class="h-5 w-5 animate-spin" />
			{/if}
		</button>
	</form>

	<form
		method="POST"
		action="?/updateName"
		class="card flex max-w-[420px] flex-col gap-4"
		use:updateNameEnhance
	>
		<h2 class="h2">Name</h2>

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
</div>
