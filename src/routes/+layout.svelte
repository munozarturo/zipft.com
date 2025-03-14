<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>zipft</title>
</svelte:head>

<div class="min-h-screen transition-all duration-200">
	{@render children()}
</div>
