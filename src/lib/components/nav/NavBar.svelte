<script lang="ts">
	import { page } from '$app/state';
	import { twMerge } from 'tailwind-merge';

	import LogoCore from '$lib/assets/brand/LogoCore.ts.svelte';
	import Account from '$lib/assets/icons/Account.svelte';
	import Menu from '$lib/assets/icons/Menu.svelte';
	import Cog from '$lib/assets/icons/Cog.svelte';
	import Exit from '$lib/assets/icons/Exit.svelte';
	import Enter from '$lib/assets/icons/Enter.svelte';
	import Person from '$lib/assets/icons/Person.svelte';
	import Cross from '$lib/assets/icons/Cross.svelte';

	let user = {
		firstName: 'John',
		lastName: 'Doe',
		email: 'john@example.com'
	};
	// let user: { name: string; email: string } | null = null;

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
		accountMenuOpen = false;
		mobileActionsMenuOpen = !mobileActionsMenuOpen;
	}

	let accountMenuOpen = $state(false);
	function toggleAccountMenu() {
		mobileActionsMenuOpen = false;
		accountMenuOpen = !accountMenuOpen;
	}

	function closeMenus() {
		accountMenuOpen = false;
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
	<!-- Account Menu -->
	{#if accountMenuOpen}
		<div
			class="absolute w-full sm:w-[300px] sm:right-5 top-20 flex flex-row items-center justify-center z-20"
		>
			<div
				class="w-11/12 bg-secondary shadow-lg rounded-md border border-primary-50 overflow-hidden"
				role="menu"
				aria-label="Mobile account menu"
			>
				{#if user}
					<!-- Session Data -->
					<div class="flex flex-col">
						<div class="flex flex-col">
							<div
								class="flex flex-row items-stretch border-b border-primary-50 text-md underline-offset-2 decoration-1.5"
							>
								<!-- Account Information -->
								<div
									class="flex flex-row w-full items-center gap-2 px-4 py-3 justify-start bg-gray-100 border-primary-50 border-r"
								>
									<Account className="w-10 h-10" />
									<div class="flex flex-col">
										<p class="text-lg">{user.firstName}&nbsp;{user.lastName}</p>
										<p class="text-sm text-primary-500 -mt-1">{user.email}</p>
									</div>
								</div>
								<!-- Close Button - Make it stretch to fill the entire height -->
								<button
									onclick={closeMenus}
									class="flex items-center justify-center px-4 hover:bg-gray-50"
								>
									<Cross className="w-5 h-5" />
								</button>
							</div>
						</div>
						<a
							href="/account"
							class="p-4 border-b border-primary-50 text-md underline-offset-2 decoration-1.5 hover:bg-gray-50"
							role="menuitem"
						>
							<span class="flex flex-row justify-between items-center"
								>account <Cog className="w-6 h-6" /></span
							>
						</a>
						<a
							href="/signout"
							class="p-4 border-primary-50 text-md underline-offset-2 decoration-1.5 hover:bg-gray-50"
							role="menuitem"
						>
							<span class="flex flex-row justify-between items-center"
								>sign out <Exit className="w-6 h-6" /></span
							>
						</a>
					</div>
				{:else}
					<!-- Account Options -->
					<div class="flex flex-col">
						<a
							href="/signup"
							class="p-4 border-b border-primary-50 text-md underline-offset-2 decoration-1.5"
							role="menuitem"
						>
							<span class="flex flex-row justify-between items-center"
								>sign up <Person className="w-6 h-6" /></span
							>
						</a>
						<a
							href="/signin"
							class="p-4 border-primary-50 text-md underline-offset-2 decoration-1.5"
							role="menuitem"
						>
							<span class="flex flex-row justify-between items-center"
								>sign in <Enter className="w-6 h-6" /></span
							>
						</a>
					</div>
				{/if}
			</div>
		</div>
	{/if}
	<!-- Close Menu when click out of menu excluding navbar interaction (on mobile) -->
	{#if accountMenuOpen || mobileActionsMenuOpen}
		<button
			class="fixed top-20 md:top-0 inset-0 z-10"
			onclick={closeMenus}
			tabindex="0"
			aria-label="Close mobile menu"
		></button>
	{/if}
	<!-- Navigation -->
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
				{#if mobileActionsMenuOpen}
					<div class="w-7 h-7 flex flex-row items-center justify-center">
						<Cross className="w-6 h-6" />
					</div>
				{:else}
					<Menu className="w-7 h-7" />
				{/if}
			</button>
		</div>
		<!-- Logo -->
		<a href="/" aria-label="Home page"><LogoCore className="h-auto w-30 md:w-40" /></a>
		<!-- Account -->
		<div class="flex flex-row items-center justify-center md:hidden">
			<button
				onclick={toggleAccountMenu}
				class="flex flex-row items-center gap-2 hover:underline underline-offset-2 decoration-2"
				aria-expanded={accountMenuOpen}
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
				{#if user}
					<div class="flex flex-row items-center justify-center">
						<button
							onclick={toggleAccountMenu}
							class="flex flex-row items-center gap-2 hover:underline underline-offset-2 decoration-2"
							aria-expanded={accountMenuOpen}
							aria-controls="mobile-account-menu"
							aria-label="Toggle account menu"
						>
							<span class="flex flex-row items-center justify-center gap-2"
								><Account className="w-8 h-8" /> {user.firstName}</span
							>
						</button>
					</div>
				{:else}
					<a
						href="/signin"
						class="flex flex-row items-center gap-2 hover:underline underline-offset-2 decoration-2"
						role="menuitem"
					>
						<Account className="w-8 h-8" />
						<p class="text-lg">sign in</p>
					</a>
				{/if}
			</div>
		</div>
	</nav>
</div>
