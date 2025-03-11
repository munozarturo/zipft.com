<script>
	import { page } from '$app/stores';

	// Using runes-style reactive declarations
	let { verified, message, rateLimited, nextRequestTime } = $props();

	// Format time until next allowed request
	$effect(() => {
		if (rateLimited && nextRequestTime) {
			// Start a counter to update remaining time
			const interval = setInterval(() => {
				const timeRemaining = Math.max(0, nextRequestTime - Date.now());

				if (timeRemaining <= 0) {
					clearInterval(interval);
					rateLimited = false;
				}
			}, 1000);

			return () => clearInterval(interval);
		}
	});

	// Function to handle resend
	function resendVerification() {
		const email = $page.url.searchParams.get('e');
		if (email) {
			window.location.href = `/verify?e=${email}`;
		}
	}

	// Function to calculate remaining time in readable format
	function getTimeRemaining() {
		if (!nextRequestTime) return '';

		const timeRemaining = Math.max(0, nextRequestTime - Date.now());
		const seconds = Math.ceil(timeRemaining / 1000);

		return `(${seconds}s)`;
	}
</script>

<svelte:head>
	<title>Verify identity :: zipft</title>
</svelte:head>

<div class="mt-20">
	<form method="POST" class="xs:w-[360px] flex w-full flex-col gap-4 px-4 md:px-0">
		<div class="flex flex-col gap-2">
			{#if verified}
				<!-- Show verified message if account is verified -->
				<h1 class="text-4xl font-bold">Account Verified</h1>
				<span class="text-primary-700 flex flex-row">
					<p>Your account has been verified.</p>
				</span>
				<span class="text-primary-700 flex flex-row">
					Proceed to&nbsp;
					<a
						href="/signin"
						class="w-fit underline underline-offset-2 hover:no-underline focus-visible:no-underline"
						>Sign in</a
					>
				</span>
			{:else}
				<!-- Show verification instructions if not verified -->
				<h1 class="text-4xl font-bold">Verify Account</h1>

				{#if message}
					<span class="text-red-600">{message}</span>
				{/if}

				<span class="text-primary-700 flex flex-row">
					<p>
						We sent a verification link to your email. Please check your inbox and click the link to
						complete your account setup.
					</p>
				</span>

				<span class="text-primary-700 flex flex-row">
					Don't see it?&nbsp;
					<button
						onclick={(e) => {
							e.preventDefault();
							resendVerification();
						}}
						disabled={rateLimited}
						class="w-fit underline underline-offset-2 enabled:hover:no-underline enabled:focus-visible:no-underline disabled:cursor-not-allowed disabled:opacity-50"
					>
						Resend {#if rateLimited}{getTimeRemaining()}{/if}
					</button>
				</span>
			{/if}
		</div>
	</form>
</div>
