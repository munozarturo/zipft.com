<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>zipft</title>
</svelte:head>

<div class="text-primary-800 bg-secondary min-h-screen transition-all duration-200">
	{@render children()}
</div>
