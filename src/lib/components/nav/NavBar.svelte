<script lang="ts">
	import LogoCore from '$lib/assets/brand/LogoCore.ts.svelte';
	import Account from '$lib/assets/icons/Account.svelte';
	import { page } from '$app/state';
	import { twMerge } from 'tailwind-merge';

	let {} = $props();

	function isActive(path: string | string[], children: boolean = false): boolean {
		const checkActive = (path: string): boolean => {
			return page.url.pathname === path || (children && page.url.pathname.startsWith(path));
		};

		if (typeof path === 'string') {
			return checkActive(path);
		} else {
			return path.some((p) => checkActive(p));
		}
	}
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
					<a
						href="/"
						class={twMerge(
							'text-lg p-1.5 hover:underline underline-offset-2 decoration-2',
							isActive('/') && 'underline'
						)}
					>
						send
					</a>
				</li>
				<li>
					<a
						href="/receive"
						class={twMerge(
							'text-lg p-2 hover:underline underline-offset-2 decoration-2',
							isActive(['/receive', '/r'], true) && 'underline'
						)}
					>
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
						<Account className="w-8 h-8" />
						<p class="text-lg">sign in</p>
					</a>
				</li>
			</ul>
		</div>
	</div>
</nav>
