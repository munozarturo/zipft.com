<script lang="ts">
	import LogoCore from '$lib/assets/brand/LogoCore.ts.svelte';

	let { children } = $props();
</script>

<div class="flex flex-col items-center justify-center">
	<nav class="flex flex-row w-full h-20">
		<a href="/"><LogoCore className="h-3/4 fm:h-full p-2 ml-4" /></a>
	</nav>
	{@render children()}
</div>
