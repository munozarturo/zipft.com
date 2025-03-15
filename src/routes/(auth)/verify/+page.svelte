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

<div class="container mx-auto pt-14 sm:pt-20">
	<form method="POST" class="card mx-auto max-w-[420px] space-y-4 p-4">
		<div class="space-y-2">
			{#if data.verified}
				<!-- Show verified message if account is verified -->
				<h1 class="h1">Account verified</h1>
				<p class="text-base">
					{data.message}
				</p>
				<p class="text-base">
					Proceed to&nbsp;
					<a href={`/signin?r=${data.redirectUrl}`} class="anchor">Sign in</a>
				</p>
			{:else}
				<h1 class="h1">Verify account</h1>
				<p class="text-base">
					{data.message}
				</p>
				<p class="text-base">
					Don't see it?&nbsp;
					<button
						onclick={(e) => {
							e.preventDefault();
							resendVerification();
						}}
						disabled={buttonDisabled}
						class="anchor {buttonDisabled ? 'opacity-50 cursor-not-allowed' : ''}"
					>
						Resend {countdown > 0 ? `in ${countdown}s` : ''}
					</button>
				</p>
			{/if}
		</div>
	</form>
</div>
