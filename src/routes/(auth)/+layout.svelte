<script lang="ts">
	import LogoCore from '$lib/assets/brand/LogoCore.ts.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Authentication :: zipft</title>
</svelte:head>

<div class="flex flex-col items-center justify-center">
	<nav
		class="flex flex-row items-center justify-center md:justify-between w-full h-20 px-4 md:px-10"
	>
		<a href="/" aria-label="Home page"><LogoCore class="h-auto w-40" /></a>
	</nav>
	{@render children()}
</div>
