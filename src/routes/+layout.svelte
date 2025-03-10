<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>zipft</title>
</svelte:head>

<div class="min-h-screen text-primary bg-secondary">
	{@render children()}
</div>
