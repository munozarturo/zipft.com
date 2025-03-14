<script lang="ts">
	import { type PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Verify identity :: zipft</title>
</svelte:head>

<div class="mt-20">
	<form method="POST" class="xs:w-[360px] flex w-full flex-col gap-4 px-4 md:px-0">
		<div class="flex flex-col gap-2">
			<!-- Show verified message if account is verified -->
			<h1 class="text-4xl font-bold">{data.title}</h1>
			<span class="text-primary-700 flex flex-row">
				<p>{data.message}</p>
			</span>
			{#if data.error}
				You can restart the verification process by proceeding to&nbsp;
				<a
					href={`/signin?r=${data.redirectUrl}`}
					class="w-fit underline underline-offset-2 hover:no-underline focus-visible:no-underline"
					>Sign in</a
				>
			{:else}
				<span class="text-primary-700 flex flex-row">
					Proceed to&nbsp;
					<a
						href={`/signin?r=${data.redirectUrl}`}
						class="w-fit underline underline-offset-2 hover:no-underline focus-visible:no-underline"
						>Sign in</a
					>
				</span>
			{/if}
		</div>
	</form>
</div>
