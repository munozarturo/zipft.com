<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageProps } from './$types';
	import { zod } from 'sveltekit-superforms/adapters';
	import { passwordResetRequestSchema } from '$lib/schemas/auth';
	import Spinner from '$lib/assets/icons/Spinner.svelte';
	import ChevronRight from '$lib/assets/icons/ChevronRight.svelte';

	let { data }: PageProps = $props();

	let submitted = $state(false);

	const { form, errors, enhance, delayed } = superForm(data.form, {
		validators: zod(passwordResetRequestSchema),
		multipleSubmits: 'prevent',
		onResult: ({ result }) => {
			if (result.type === 'success') submitted = true;
		}
	});
</script>

<svelte:head>
	<title>Reset password :: zipft</title>
</svelte:head>

<div class="container h-full flex justify-center items-start">
	<form method="POST" use:enhance class="card p-4 max-w-sm space-y-4 w-full">
		{#if submitted}
			<div class="space-y-2">
				<h1 class="h1">Password reset</h1>
				<p class="text-base">
					If an account with the provided email exists, we will send an email with a link to reset
					your password.
				</p>
				<p class="text-base">
					Proceed to&nbsp;
					<a href={`/signin?r=${data.redirectUrl}`} class="anchor">Sign in</a>
				</p>
			</div>
		{:else}
			<div class="space-y-2">
				<h1 class="h1">Reset your password</h1>
				<p class="text-base">
					Enter your email address and we'll send you a link to reset your password
				</p>
			</div>
			<div class="space-y-2">
				<label class="label">
					<span>Email</span>
					<input
						name="email"
						type="email"
						placeholder="email@example.com"
						class="input"
						bind:value={$form.email}
					/>
				</label>
				{#if $errors.email}
					<div class="error">{$errors.email}</div>
				{/if}
				{#if $errors._errors}
					<div class="error">{$errors._errors}</div>
				{/if}
			</div>
			<button
				class="btn preset-filled-primary-500 w-full flex justify-between items-center"
				disabled={$delayed}
			>
				<span>Reset password</span>
				{#if $delayed}
					<Spinner className="w-5 h-5 animate-spin" />
				{:else}
					<ChevronRight class="w-3 h-3 btn-icon-right" />
				{/if}
			</button>
			<a href={`/signin?r=${data.redirectUrl}`} class="anchor">Back to Sign in</a>
		{/if}
	</form>
</div>
