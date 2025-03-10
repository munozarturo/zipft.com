<script lang="ts">
	import LogoCore from '$lib/assets/brand/LogoCore.ts.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Authentication :: zipft</title>
</svelte:head>

<div class="flex flex-col items-center justify-center">
	<nav class="flex flex-row items-center justify-between w-full h-20 px-10">
		<a href="/"><LogoCore className="h-3/4" /></a>
	</nav>
	{@render children()}
</div>
