<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<title>Account :: zipft</title>
</svelte:head>

<div class="flex w-full flex-col p-8">
	{@render children()}
</div>
