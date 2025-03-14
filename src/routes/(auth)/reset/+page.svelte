<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import { zod } from 'sveltekit-superforms/adapters';
	import { passwordResetSchema } from '$lib/schemas/auth';
	import Spinner from '$lib/assets/icons/Spinner.svelte';
	import ChevronRight from '$lib/assets/icons/ChevronRight.svelte';

	let { data }: { data: PageData } = $props();
	let passwordReset = $state(false);

	const { form, errors, enhance, delayed } = superForm(data.form, {
		validators: zod(passwordResetSchema),
		onResult: ({ result }) => {
			if (result && result.type === 'success') passwordReset = true;
		}
	});
</script>

<svelte:head>
	<title>Reset password :: zipft</title>
</svelte:head>

<div class="container mx-auto pt-20">
	<form method="POST" use:enhance class="card mx-auto max-w-[420px] space-y-4 p-4">
		{#if passwordReset}
			<div class="space-y-2">
				<h1 class="h1">Password reset</h1>
				<p>Your password has been reset.</p>
				<div>
					Proceed to&nbsp;
					<a href={`/signin?r=${data.redirectUrl}`} class="anchor">Sign in</a>
				</div>
			</div>
		{:else}
			<div class="space-y-1">
				<h1 class="h1">Reset your password</h1>
				<p>Enter a new password</p>
			</div>
			<div class="space-y-2">
				<label class="label">
					<span>Password</span>
					<input
						name="password"
						type="password"
						placeholder="Password"
						class="input"
						spellcheck="false"
						bind:value={$form.password}
					/>
				</label>
				{#if $errors.password}
					<small class="text-error-500">{$errors.password}</small>
				{/if}
				{#if $errors._errors}
					<small class="text-error-500">{$errors._errors}</small>
				{/if}
			</div>
			<button
				class="btn preset-filled-primary-900-100 group w-full justify-between"
				disabled={$delayed}
			>
				<span>Reset password</span>
				{#if $delayed}
					<Spinner class="h-5 w-5 animate-spin" />
				{:else}
					<ChevronRight
						class="btn-icon h-3 w-3 group-hover:translate-x-1 group-focus-visible:translate-x-1"
					/>
				{/if}
			</button>
			<span>
				Back to&nbsp;<a href={`/signin?r=${data.redirectUrl}`} class="anchor">Sign in</a>
			</span>
		{/if}
	</form>
</div>
