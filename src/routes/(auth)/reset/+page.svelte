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
	<form method="POST" use:enhance class="card p-4 max-w-[420px] mx-auto space-y-4">
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
			<div class="flex flex-col w-full gap-2">
				<button type="submit" class="btn preset-filled-primary-500 w-full" disabled={$delayed}>
					<span>Reset password</span>
					{#if $delayed}
						<Spinner class="h-4 w-4 animate-spin" />
					{:else}
						<ChevronRight class="h-4 w-4" />
					{/if}
				</button>
				<span class="w-full">
					<a href={`/signin?r=${data.redirectUrl}`} class="anchor">Back to Sign in</a>
				</span>
			</div>
		{/if}
	</form>
</div>
