<script lang="ts">
	let { verified } = $props();
</script>

<svelte:head>
	<title>Verify identity :: zipft</title>
</svelte:head>

<div class="mt-20">
	<form method="POST" class="xs:w-[360px] flex w-full flex-col gap-4 px-4 md:px-0">
		<div class="flex flex-col gap-2">
			<h1 class="text-4xl font-bold">Verify Account</h1>
			<span class="text-primary-700 flex flex-row">
				<p>
					We sent a verification link to your email. Please check your inbox and click the link to
					complete your account setup.
				</p>
			</span>
			<!-- For the first minute wait for resend, show text that says "resend in 60s" -->
			<span class="text-primary-700 flex flex-row">
				Don't see it?&nbsp;<button
					class="w-fit underline underline-offset-2 enabled:hover:no-underline enabled:focus-visible:no-underline"
					>Resend</button
				>
			</span>
			<!-- if verified just show a return -->
			<h1 class="text-4xl font-bold">Account Verfied</h1>
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
		</div>
	</form>
</div>
