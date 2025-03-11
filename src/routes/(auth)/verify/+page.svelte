<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Verify identity :: zipft</title>
</svelte:head>

<div></div>

<div class="mt-20">
	<form method="POST" class="fm:w-[360px] flex w-full flex-col gap-4 px-4 md:px-0">
		<h1 class="text-4xl font-bold">{data.title}</h1>
		<span class="text-slate-600">
			<p>
				{data.message}
			</p>
			{#if data.status === 'success'}
				<span class="flex flex-row text-slate-600">
					<p>Proceed to&nbsp;</p>
					<a href="/auth/signin" class="w-fit underline underline-offset-2 hover:no-underline"
						>Sign in</a
					>
				</span>
			{/if}
		</span>
	</form>
</div>
