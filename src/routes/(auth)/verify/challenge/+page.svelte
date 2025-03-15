<script lang="ts">
	import { type PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Verify identity :: zipft</title>
</svelte:head>

<div class="container mx-auto pt-14 sm:pt-20">
	<form method="POST" class="card mx-auto max-w-[420px] space-y-4 p-4">
		<div class="flex flex-col gap-2">
			<!-- Show verified message if account is verified -->
			<h1 class="text-4xl font-bold">{data.title}</h1>
			<p>{data.message}</p>
			{#if data.error}
				You can restart the verification process by proceeding to&nbsp;
				<a href={`/signin?r=${data.redirectUrl}`} class="anchor">Sign in</a>
			{:else}
				<span class="flex flex-row">
					Proceed to&nbsp;
					<a href={`/signin?r=${data.redirectUrl}`} class="anchor">Sign in</a>
				</span>
			{/if}
		</div>
	</form>
</div>
