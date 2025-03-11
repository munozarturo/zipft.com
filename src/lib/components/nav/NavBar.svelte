<script lang="ts">
	import { page } from '$app/state';
	import { twMerge } from 'tailwind-merge';

	import LogoCore from '$lib/assets/brand/LogoCore.ts.svelte';
	import Account from '$lib/assets/icons/Account.svelte';
	import ActionsMenu from './mobile/ActionsMenu.svelte';
	import AccountMenu from './AccountMenu.svelte';

	let user = {
		first: 'John',
		last: 'Doe',
		email: 'john@example.com'
	};
	// let session = { user };
	let session = null;

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

	let actionsMenuOpen = $state(false);
	let accountMenuOpen = $state(false);

	function closeMenus() {
		accountMenuOpen = actionsMenuOpen = false;
	}
</script>

<!-- Navigation -->
<nav
	class="flex h-20 w-full flex-row items-center justify-between px-4 md:px-10"
	aria-label="Main navigation"
>
	<!-- Mobile Actions -->
	<ActionsMenu isOpen={actionsMenuOpen} {isActive} />
	<!-- Logo -->
	<a href="/" aria-label="Home page"><LogoCore className="h-auto w-30 md:w-40" /></a>
	<!-- Actions -->
	<div class="flex flex-row items-center gap-12">
		<!-- Nav Links -->
		<div class="hidden flex-row items-center md:flex">
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
		<AccountMenu isOpen={accountMenuOpen} {session} />
	</div>
	<!-- Close Menu when click out of menu excluding navbar interaction (on mobile) -->
	{#if accountMenuOpen || actionsMenuOpen}
		<button
			class="fixed inset-0 top-20 z-10 md:top-0"
			onclick={closeMenus}
			tabindex="0"
			aria-label="Close mobile menu"
		></button>
	{/if}
</nav>
