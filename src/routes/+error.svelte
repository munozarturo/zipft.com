<script>
	import NavBar from '$lib/components/nav/NavBar.svelte';
</script>

<svelte:head>
	<title>404 :: zipft</title>
</svelte:head>

<div>
	<NavBar />
	<div class="mt-40 flex w-full flex-row items-center justify-center px-4 text-center">
		<div class="flex h-fit w-fit flex-col gap-2 md:gap-8">
			<div class="flex flex-col gap-2">
				<h1 class="text-4xl font-bold md:text-5xl">404 Not Found</h1>
				<h2 class="text-xl md:text-3xl">We couldn't find the page you are looking for.</h2>
			</div>
			<div class="flex flex-row items-center justify-center">
				<a href="/" class="btn btn-lg preset-filled">Go home</a>
			</div>
		</div>
	</div>
</div>
