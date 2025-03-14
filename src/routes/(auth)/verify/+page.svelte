<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { type PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Countdown state
	let countdown = $state(data.error && data.wait ? data.wait : 60);
	let buttonDisabled = $state(true);

	// Start countdown on mount
	onMount(() => {
		const interval = setInterval(() => {
			countdown--;

			if (countdown <= 0) {
				clearInterval(interval);
				buttonDisabled = false;
				countdown = 0;
			}
		}, 1000);

		return () => clearInterval(interval);
	});

	// Function to handle resend
	function resendVerification() {
		const email = page.url.searchParams.get('e');
		if (email) {
			// Restart the countdown and disable button
			countdown = 60;
			buttonDisabled = true;

			// Start a new countdown
			const interval = setInterval(() => {
				countdown--;

				if (countdown <= 0) {
					clearInterval(interval);
					buttonDisabled = false;
					countdown = 0;
				}
			}, 1000);

			// Navigate to reload the page and trigger server load
			window.location.href = `/verify?e=${email}&r=${data.redirectUrl}`;
		}
	}
</script>

<svelte:head>
	<title>Verify account :: zipft</title>
</svelte:head>

<div class="mt-20">
	<form method="POST" class="xs:w-[360px] flex w-full flex-col gap-4 px-4 md:px-0">
		<div class="flex flex-col gap-2">
			{#if data.verified}
				<!-- Show verified message if account is verified -->
				<h1 class="text-4xl font-bold">Account verified</h1>
				<span class="text-primary-700 flex flex-row">
					<p>{data.message}</p>
				</span>
				<span class="text-primary-700 flex flex-row">
					Proceed to&nbsp;
					<a
						href={`/signin?r=${data.redirectUrl}`}
						class="w-fit underline underline-offset-2 hover:no-underline focus-visible:no-underline"
						>Sign in</a
					>
				</span>
			{:else}
				<!-- Show verification instructions if not verified -->
				<h1 class="text-4xl font-bold">Verify account</h1>

				<span class="text-primary-700 flex flex-row">
					<p>
						{data.message}
					</p>
				</span>

				<span class="text-primary-700 flex flex-row">
					Don't see it?&nbsp;
					<button
						onclick={(e) => {
							e.preventDefault();
							resendVerification();
						}}
						disabled={buttonDisabled}
						class="w-fit underline underline-offset-2 enabled:hover:no-underline enabled:focus-visible:no-underline disabled:cursor-not-allowed"
					>
						Resend {countdown > 0 ? `in ${countdown}s` : ''}
					</button>
				</span>
			{/if}
		</div>
	</form>
</div>
