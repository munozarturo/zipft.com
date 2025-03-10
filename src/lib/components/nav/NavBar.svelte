<script lang="ts">
	import LogoCore from '$lib/assets/brand/LogoCore.ts.svelte';
	import Account from '$lib/assets/icons/Account.svelte';
	import Menu from '$lib/assets/icons/Menu.svelte';
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

	let mobileActionsMenuOpen = $state(false);
	function toggleMobileActionsMenu() {
		mobileActionsMenuOpen = !mobileActionsMenuOpen;
	}

	let mobileAccountMenuOpen = $state(false);
	function toggleMobileAccountMenu() {
		mobileAccountMenuOpen = !mobileAccountMenuOpen;
	}
</script>

<div>
	{#if mobileActionsMenuOpen}
		<div class="absolute w-full top-20 flex flex-row items-center justify-center">
			<div
				class="w-11/12 bg-secondary shadow-lg rounded-md border border-primary-50 overflow-hidden"
			>
				<!-- Menu Options -->
				<div class="flex flex-col">
					<a
						href="/send"
						class={twMerge(
							'border-b p-4 border-primary-50 text-md underline-offset-2 decoration-1.5',
							isActive('/send') && 'underline'
						)}
					>
						send
					</a>
					<a
						href="/receive"
						class={twMerge(
							'p-4 border-primary-50 text-md underline-offset-2 decoration-1.5',
							isActive(['/receive', '/r'], true) && 'underline'
						)}
					>
						receive
					</a>
				</div>
			</div>
		</div>
	{/if}
	<nav class="flex flex-row items-center justify-between w-full h-20 px-4 md:px-10">
		<!-- Mobile Actions -->
		<div class="flex flex-row items-center justify-center md:hidden">
			<button
				onclick={toggleMobileActionsMenu}
				class="flex flex-row items-center justify-center gap-2 hover:underline underline-offset-2 decoration-2"
			>
				<Menu className="w-7 h-7" />
			</button>
		</div>
		<!-- Mobile Actions Menu -->

		<!-- Logo -->
		<a href="/"><LogoCore className="h-auto w-30 md:w-40" /></a>
		<!-- Mobile Account -->
		<div class="flex flex-row items-center">
			<button
				class="flex flex-row items-center gap-2 hover:underline underline-offset-2 decoration-2"
			>
				<Account className="w-8 h-8" />
			</button>
		</div>
		<!-- Actions -->
		<div class="hidden md:flex flex-row items-center gap-12">
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
</div>
