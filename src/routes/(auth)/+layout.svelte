<script lang="ts">
	import LogoCore from '$lib/assets/brand/LogoCore.ts.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Authentication :: zipft</title>
</svelte:head>

<div class="flex flex-col items-center justify-center">
	<nav
		class="flex h-20 w-full flex-row items-center justify-center px-4 md:justify-between md:px-10"
	>
		<a href="/" aria-label="Home page"><LogoCore class="w-30 h-auto" /></a>
	</nav>
	{@render children()}
</div>
