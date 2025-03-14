<script lang="ts">
	import type { PageProps } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { signUpSchema } from '$lib/schemas/auth';
	import { zod } from 'sveltekit-superforms/adapters';

	import Spinner from '$lib/assets/icons/Spinner.svelte';
	import ChevronRight from '$lib/assets/icons/ChevronRight.svelte';

	let { data }: PageProps = $props();

	const { form, errors, enhance, delayed } = superForm(data.form, {
		validators: zod(signUpSchema)
	});
</script>

<svelte:head>
	<title>Sign up :: zipft</title>
</svelte:head>

<div class="container h-full pt-20">
	<form method="POST" use:enhance class="card w-full max-w-[360px] mx-auto p-4 space-y-4">
		<header class="space-y-1">
			<h1 class="h2">Welcome</h1>
			<span>
				<p class="text-sm">Have an account?&nbsp;</p>
				<a href={`/signin?r=${data.redirectUrl}`} class="anchor text-sm">Sign in</a>
			</span>
		</header>
		<div class="space-y-2">
			<div class="grid grid-cols-2 gap-2">
				<label class="label">
					<span>First Name</span>
					<input
						name="firstName"
						type="text"
						placeholder="John"
						class="input"
						bind:value={$form.firstName}
					/>
					{#if $errors.firstName}
						<small class="text-error-500">{$errors.firstName}</small>
					{/if}
				</label>
				<label class="label">
					<span>Last Name</span>
					<input
						name="lastName"
						type="text"
						placeholder="Doe"
						class="input"
						bind:value={$form.lastName}
					/>
					{#if $errors.lastName}
						<small class="text-error-500">{$errors.lastName}</small>
					{/if}
				</label>
			</div>
			<label class="label">
				<span>Email</span>
				<input
					name="email"
					type="email"
					placeholder="email@example.com"
					class="input"
					bind:value={$form.email}
				/>
				{#if $errors.email}
					<small class="text-error-500">{$errors.email}</small>
				{/if}
			</label>
			<label class="label">
				<span>Password</span>
				<input
					name="password"
					type="password"
					placeholder="Password"
					class="input"
					bind:value={$form.password}
				/>
				{#if $errors.password}
					<small class="text-error-500">{$errors.password}</small>
				{/if}
			</label>
			{#if $errors._errors}
				<small class="text-error-500">{$errors._errors}</small>
			{/if}
		</div>
		<button class="btn preset-filled-primary-500 w-full justify-between" disabled={$delayed}>
			<span>Sign up</span>
			{#if $delayed}
				<Spinner class="w-5 h-5 animate-spin" />
			{:else}
				<ChevronRight class="w-3 h-3" />
			{/if}
		</button>
		<footer class="text-sm">
			<p>
				By creating an account, you agree to zipft's&nbsp;<a
					href="/legal/terms-of-service"
					target="_blank"
					class="anchor">Terms of Service</a
				>&nbsp;and consent to zipft's&nbsp;<a
					href="/legal/privacy-policy"
					target="_blank"
					class="anchor">Privacy Policy</a
				>.
			</p>
		</footer>
	</form>
</div>
