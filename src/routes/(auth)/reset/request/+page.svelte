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

<div class="mt-20">
	<form method="POST" use:enhance class="xs:w-[360px] flex w-full flex-col gap-4 px-4 md:px-0">
		{#if submitted}
			<div class="flex flex-col gap-1">
				<h1 class="text-4xl font-bold">Password reset</h1>
				<span class="text-primary-700">
					<p>
						If an account with the provided email exists, we will send an email with a link to reset
						your password.
					</p>
				</span>
				<span class="text-primary-700 flex flex-row">
					Proceed to&nbsp;
					<a
						href={`/signin?r=${data.redirectUrl}`}
						class="w-fit underline underline-offset-2 hover:no-underline focus-visible:no-underline"
						>Sign in</a
					>
				</span>
			</div>
		{:else}
			<div class="flex flex-col gap-1">
				<h1 class="text-4xl font-bold">Reset your password</h1>
				<span class="text-primary-700">
					<p>Enter your email address and we'll send you a link to reset your password</p>
				</span>
			</div>
			<div class="flex flex-col gap-2">
				<label for="email" class="flex flex-col">
					Email
					<input
						name="email"
						type="email"
						placeholder="email@example.com"
						class="w-full"
						bind:value={$form.email}
					/>
				</label>
				{#if $errors.email}
					<small>{$errors.email}</small>
				{/if}
				{#if $errors._errors}
					<small>{$errors._errors}</small>
				{/if}
			</div>
			<button
				class="bg-primary-800 text-secondary enabled:hover:bg-accent focus-visible:bg-accent group flex flex-row items-center justify-between p-2.5 transition-all focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-black disabled:opacity-50 md:text-lg"
				disabled={$delayed}
			>
				<p>Reset password</p>
				{#if $delayed}
					<Spinner className="w-5 h-5 animate-spin" />
				{:else}
					<ChevronRight
						class="h-3 w-3 -translate-x-1 group-hover:translate-x-0 group-focus-visible:translate-x-0"
					/>
				{/if}
			</button>
			<span class="text-primary-700">
				<a
					href={`/signin?r=${data.redirectUrl}`}
					class="w-fit underline underline-offset-2 hover:no-underline focus-visible:no-underline"
					>Back to Sign in</a
				>
			</span>
		{/if}
	</form>
</div>
