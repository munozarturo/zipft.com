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

<div class="container mx-auto pt-20">
	<form method="POST" use:enhance class="card mx-auto max-w-[420px] space-y-4 p-4">
		<div class="space-y-1">
			<h1 class="h1">Welcome back</h1>
			<span class="textba-base flex flex-row">
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
					class="w-full"
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
			<button type="submit" class="btn preset-filled-primary-500 w-full" disabled={$delayed}>
				<p>Sign in</p>
				{#if $delayed}
					<Spinner class="h-4 w-4 animate-spin" />
				{:else}
					<ChevronRight class="h-4 w-4" />
				{/if}
			</button>
			<span class="w-full">
				<a href={`/reset/request?r=${data.redirectUrl}`} class="anchor">Forgot password</a>
			</span>
		</div>
	</form>
</div>
