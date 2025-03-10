<script>
	import { page } from '$app/state';
	import NavBar from '$lib/components/nav/NavBar.svelte';
</script>

<svelte:head>
	<title>404 Error :: zipft</title>
</svelte:head>

<div>
	<NavBar />
	<div>App Error: 404 not found '{page.url.pathname}'</div>
</div>
