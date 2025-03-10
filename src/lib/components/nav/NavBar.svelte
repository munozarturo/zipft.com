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
		mobileAccountMenuOpen = false;
		mobileActionsMenuOpen = !mobileActionsMenuOpen;
	}

	let mobileAccountMenuOpen = $state(false);
	function toggleMobileAccountMenu() {
		mobileActionsMenuOpen = false;
		mobileAccountMenuOpen = !mobileAccountMenuOpen;
	}

	function closeMobileMenus() {
		mobileAccountMenuOpen = false;
		mobileActionsMenuOpen = false;
	}
</script>

<div>
	<!-- Mobile Actions Menu -->
	{#if mobileActionsMenuOpen}
		<div class="absolute w-full top-20 flex flex-row items-center justify-center z-20">
			<div
				class="w-11/12 bg-secondary shadow-lg rounded-md border border-primary-50 overflow-hidden"
				role="menu"
				aria-label="Mobile actions menu"
			>
				<!-- Menu Options -->
				<div class="flex flex-col">
					<a
						href="/send"
						class={twMerge(
							'border-b p-4 border-primary-50 text-md underline-offset-2 decoration-1.5',
							isActive('/send') && 'underline'
						)}
						role="menuitem"
					>
						send
					</a>
					<a
						href="/receive"
						class={twMerge(
							'p-4 border-primary-50 text-md underline-offset-2 decoration-1.5',
							isActive(['/receive', '/r'], true) && 'underline'
						)}
						role="menuitem"
					>
						receive
					</a>
				</div>
			</div>
		</div>
	{/if}
	<!-- Mobile Account Menu -->
	{#if mobileAccountMenuOpen}
		<div class="absolute w-full top-20 flex flex-row items-center justify-center z-20">
			<div
				class="w-11/12 bg-secondary shadow-lg rounded-md border border-primary-50 overflow-hidden"
				role="menu"
				aria-label="Mobile account menu"
			>
				<!-- Account Options -->
				<div class="flex flex-col">
					<a
						href="/send"
						class={twMerge(
							'border-b p-4 border-primary-50 text-md underline-offset-2 decoration-1.5',
							isActive('/send') && 'underline'
						)}
						role="menuitem"
					>
						sign in
					</a>
					<a
						href="/receive"
						class={twMerge(
							'p-4 border-primary-50 text-md underline-offset-2 decoration-1.5',
							isActive(['/receive', '/r'], true) && 'underline'
						)}
						role="menuitem"
					>
						sign up
					</a>
				</div>
			</div>
		</div>
	{/if}
	<!-- Close Menu when click out of menu excluding navbar interaction -->
	{#if mobileAccountMenuOpen || mobileActionsMenuOpen}
		<button
			class="fixed top-20 inset-0 z-10"
			onclick={closeMobileMenus}
			tabindex="0"
			aria-label="Close mobile menu"
		></button>
	{/if}
	<nav
		class="flex flex-row items-center justify-between w-full h-20 px-4 md:px-10"
		aria-label="Main navigation"
	>
		<!-- Mobile Actions -->
		<div class="flex flex-row items-center justify-center md:hidden">
			<button
				onclick={toggleMobileActionsMenu}
				class="flex flex-row items-center justify-center gap-2 hover:underline underline-offset-2 decoration-2"
				aria-expanded={mobileActionsMenuOpen}
				aria-controls="mobile-actions-menu"
				aria-label="Toggle mobile menu"
			>
				<Menu className="w-7 h-7" />
			</button>
		</div>
		<!-- Logo -->
		<a href="/" aria-label="Home page"><LogoCore className="h-auto w-30 md:w-40" /></a>
		<!-- Mobile Account -->
		<div class="flex flex-row items-center">
			<button
				onclick={toggleMobileAccountMenu}
				class="flex flex-row items-center gap-2 hover:underline underline-offset-2 decoration-2"
				aria-expanded={mobileAccountMenuOpen}
				aria-controls="mobile-account-menu"
				aria-label="Toggle account menu"
			>
				<Account className="w-8 h-8" />
			</button>
		</div>
		<!-- Actions -->
		<div class="hidden md:flex flex-row items-center gap-12">
			<!-- Nav Links -->
			<div class="flex flex-row items-center">
				<ul class="flex flex-row items-center" role="menubar" aria-label="Main navigation">
					<li role="none">
						<a
							href="/"
							class={twMerge(
								'text-lg p-1.5 hover:underline underline-offset-2 decoration-2',
								isActive('/') && 'underline'
							)}
							role="menuitem"
						>
							send
						</a>
					</li>
					<li role="none">
						<a
							href="/receive"
							class={twMerge(
								'text-lg p-2 hover:underline underline-offset-2 decoration-2',
								isActive(['/receive', '/r'], true) && 'underline'
							)}
							role="menuitem"
						>
							receive
						</a>
					</li>
				</ul>
			</div>
			<!-- Account -->
			<div class="flex flex-row items-center">
				<ul class="flex flex-row items-center" role="menubar" aria-label="Account navigation">
					<li role="none">
						<a
							href="/signin"
							class="flex flex-row items-center gap-2 hover:underline underline-offset-2 decoration-2"
							role="menuitem"
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
