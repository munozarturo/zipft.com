<script lang="ts">
	import type { PageProps } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { signInSchema } from '$lib/schemas/auth';
	import { zod } from 'sveltekit-superforms/adapters';

	import Spinner from '$lib/assets/icons/Spinner.svelte';
	import ChevronRight from '$lib/assets/icons/ChevronRight.svelte';

	let { data }: PageProps = $props();

	const { form, errors, enhance, delayed } = superForm(data.form, {
		validators: zod(signInSchema)
	});
</script>

<svelte:head>
	<title>Sign in :: zipft</title>
</svelte:head>

<div class="container mx-auto pt-14 sm:pt-20">
	<form method="POST" use:enhance class="card mx-auto max-w-[420px] space-y-4 px-8">
		<div class="space-y-1">
			<h1 class="h1">Welcome back</h1>
			<span class="flex flex-row text-base">
				<p>Need an account?&nbsp;</p>
				<a href={`/signup?r=${data.redirectUrl}`} class="anchor">Sign up</a>
			</span>
		</div>
		<div class="space-y-2">
			<label class="label">
				<span>Email</span>
				<input
					name="email"
					type="email"
					placeholder="email@example.com"
					class="input"
					spellcheck="false"
					bind:value={$form.email}
				/>
			</label>
			{#if $errors.email}
				<small class="text-error-500">{$errors.email}</small>
			{/if}
			<label class="label" for="password">
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
		<div class="flex w-full flex-col gap-2">
			<button
				class="btn preset-filled-primary-900-100 group w-full justify-between"
				disabled={$delayed}
			>
				<span>Sign in</span>
				{#if $delayed}
					<Spinner class="h-5 w-5 animate-spin" />
				{:else}
					<ChevronRight
						class="btn-icon h-3 w-3 group-hover:translate-x-1 group-focus-visible:translate-x-1"
					/>
				{/if}
			</button>
			<span class="w-full">
				<a href={`/reset/request?r=${data.redirectUrl}`} class="anchor">Forgot password</a>
			</span>
		</div>
	</form>
</div>
