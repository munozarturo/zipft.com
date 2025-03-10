<script>
	import NavBar from '$lib/components/nav/NavBar.svelte';
</script>

<svelte:head>
	<title>404 :: zipft</title>
</svelte:head>

<div>
	<NavBar />
	<div class="w-full flex flex-row items-center justify-center px-4 mt-20 md:mt-40">
		<div class="flex flex-col w-full max-w-md h-fit gap-6 md:gap-8 text-center">
			<div class="flex flex-col gap-2">
				<h1 class="font-bold text-3xl md:text-5xl">404 Not Found</h1>
				<h2 class="text-xl md:text-3xl">We couldn't find the page you are looking for.</h2>
			</div>
			<div class="flex flex-row items-center justify-center">
				<a
					href="/"
					class="p-2 text-lg md:text-xl transition-all outline w-fit hover:text-secondary hover:bg-primary-800"
					>Go home</a
				>
			</div>
		</div>
	</div>
</div>
