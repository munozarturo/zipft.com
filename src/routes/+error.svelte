<script>
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>404 Error :: zipft</title>
</svelte:head>

<div>Error: 404 not found '{page.url.pathname}'</div>
