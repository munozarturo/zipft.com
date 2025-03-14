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

<div class="mt-20">
	<form method="POST" use:enhance class="xs:w-[360px] flex w-full flex-col gap-4 px-4 md:px-0">
		<div class="flex flex-col gap-1">
			<h1 class="text-4xl font-bold">Welcome back</h1>
			<span class="text-primary-700 flex flex-row">
				<p>Need an account?&nbsp;</p>
				<a
					href="/signup"
					class="w-fit underline underline-offset-2 hover:no-underline focus-visible:no-underline"
					>Sign up</a
				>
			</span>
		</div>
		<div class="flex w-full flex-col gap-2">
			<label for="email" class="flex w-full flex-col">
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
			<label for="password" class="flex w-full flex-col">
				Password
				<input
					name="password"
					type="password"
					placeholder="Password"
					class="w-full"
					bind:value={$form.password}
				/>
			</label>
			{#if $errors.password}
				<small>{$errors.password}</small>
			{/if}
			{#if $errors._errors}
				<small>{$errors._errors}</small>
			{/if}
		</div>
		<button
			class="bg-primary-800 text-secondary enabled:hover:bg-accent focus-visible:bg-accent group flex flex-row items-center justify-between p-2.5 transition-all focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-black disabled:opacity-50 md:text-lg"
			disabled={$delayed}
		>
			<p>Sign in</p>
			{#if $delayed}
				<Spinner class="h-5 w-5 animate-spin" />
			{:else}
				<ChevronRight
					class="h-3 w-3 -translate-x-1 group-hover:translate-x-0 group-focus-visible:translate-x-0"
				/>
			{/if}
		</button>
		<span class="text-primary-700 flex flex-row">
			<a
				href="/reset/request"
				class="w-fit underline underline-offset-2 hover:no-underline focus-visible:no-underline"
				>Forgot password</a
			>
		</span>
	</form>
</div>
