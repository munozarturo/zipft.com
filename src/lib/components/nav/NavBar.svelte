<script>
	import { page } from '$app/state';
	import LogoCore from '$lib/assets/brand/LogoCore.ts.svelte';
	import Account from '$lib/assets/icons/Account.svelte';

	let {} = $props();
</script>

<nav class="flex flex-row items-center justify-between w-full h-20 px-10">
	<!-- Logo -->
	<a href="/"><LogoCore className="h-3/4" /></a>
	<!-- Actions -->
	<div class="flex flex-row items-center gap-12">
		<!-- Nav Links -->
		<div class="flex flex-row items-center">
			<ul class="flex flex-row items-center">
				<li>
					<a href="/send" class="text-lg p-2 hover:underline underline-offset-2 decoration-2">
						send
					</a>
				</li>
				<li>
					<a href="/receive" class="text-lg p-2 hover:underline underline-offset-2 decoration-2">
						receive
					</a>
				</li>
			</ul>
		</div>
		<!-- Account -->
		<div class="flex flex-row items-center">
			<ul class="flex flex-row items-center">
				<li>
					<a
						href="/signin"
						class="flex flex-row items-center gap-2 hover:underline underline-offset-2 decoration-2"
					>
						<Account className="" />
						<p class="text-lg">sign in</p>
					</a>
				</li>
			</ul>
		</div>
	</div>
</nav>
