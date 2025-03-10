<script lang="ts">
	import NavBar from '$lib/components/nav/NavBar.svelte';
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>zipft</title>
</svelte:head>

<div>
	<NavBar />
	{@render children()}
</div>
