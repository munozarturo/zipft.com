<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { signUpSchema } from '$lib/schemas/auth';
	import { zod } from 'sveltekit-superforms/adapters';

	import Spinner from '$lib/assets/icons/Spinner.svelte';
	import ChevronRight from '$lib/assets/icons/ChevronRight.svelte';

	export let data: PageData;

	const { form, errors, enhance, delayed } = superForm(data.form, {
		validators: zod(signUpSchema)
	});
</script>

<svelte:head>
	<title>Sign up :: zipft</title>
</svelte:head>

<div class="mt-20">
	<form method="POST" use:enhance class="xs:w-[360px] flex w-full flex-col gap-4 px-4 md:px-0">
		<div class="flex flex-col gap-1">
			<h1 class="text-4xl font-bold">Welcome</h1>
			<span class="text-primary-700 flex flex-row">
				<p>Have an account?&nbsp;</p>
				<a
					href="/signin"
					class="w-fit underline underline-offset-2 hover:no-underline focus-visible:no-underline"
					>Sign in</a
				>
			</span>
		</div>
		<div class="flex flex-col gap-2">
			<div class="flex flex-row gap-2">
				<div class="flex flex-col gap-2">
					<label for="firstName" class="flex flex-col">
						First Name
						<input
							name="firstName"
							type="text"
							placeholder="John"
							class="w-full"
							bind:value={$form.firstName}
						/>
					</label>
					{#if $errors.firstName}
						<small>{$errors.firstName}</small>
					{/if}
				</div>
				<div class="flex flex-col gap-2">
					<label for="lastName" class="flex flex-col">
						Last Name
						<input
							name="lastName"
							type="text"
							placeholder="Doe"
							class="w-full"
							bind:value={$form.lastName}
						/>
					</label>
					{#if $errors.lastName}
						<small>{$errors.lastName}</small>
					{/if}
				</div>
			</div>
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
			<label for="password" class="flex flex-col">
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
			<p>Sign up</p>
			{#if $delayed}
				<Spinner class="h-5 w-5 animate-spin" />
			{:else}
				<ChevronRight
					class="h-3 w-3 -translate-x-1 group-hover:translate-x-0 group-focus-visible:translate-x-0"
				/>
			{/if}
		</button>
		<span class="text-primary-700">
			<p class="text-sm">
				By creating an account, you agree to zipft's&nbsp;<a
					href="/legal/terms-of-service"
					target="_blank"
					class="w-fit underline underline-offset-2 hover:no-underline focus-visible:no-underline"
					>Terms of Service</a
				>&nbsp;and consent to zipft's&nbsp;<a
					href="/legal/privacy-policy"
					target="_blank"
					class="w-fit underline underline-offset-2 hover:no-underline focus-visible:no-underline"
					>Privacy Policy</a
				>.
			</p>
		</span>
	</form>
</div>
