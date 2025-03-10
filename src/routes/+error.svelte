<script>
	import { page } from '$app/state';
	import ChevronRight from '$lib/assets/icons/ChevronRight.svelte';
	import NavBar from '$lib/components/nav/NavBar.svelte';
</script>

<svelte:head>
	<title>404 :: zipft</title>
</svelte:head>

<div>
	<NavBar />
	<div class="w-full flex flex-row items-center justify-center mt-40">
		<div class="flex flex-col w-fit h-fit gap-4">
			<h1 class="font-bold text-5xl">404 Not Found</h1>
			<h2 class="text-3xl">We couldn't find the page you are looking for.</h2>
		</div>
	</div>
</div>
