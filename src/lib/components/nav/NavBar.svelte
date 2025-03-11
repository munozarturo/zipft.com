<script lang="ts">
	import { page } from '$app/state';
	import { twMerge } from 'tailwind-merge';

	import LogoCore from '$lib/assets/brand/LogoCore.ts.svelte';
	import ActionsMenu from './mobile/ActionsMenu.svelte';
	import AccountMenu from './AccountMenu.svelte';

	let user = {
		first: 'John',
		last: 'Doe',
		email: 'john@example.com'
	};
	let session = { user };
	// session = null;

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
	function toggleActionsMenu() {
		accountMenuOpen = false;
		actionsMenuOpen = !actionsMenuOpen;
	}

	let accountMenuOpen = $state(false);
	function toggleAccountMenu() {
		actionsMenuOpen = false;
		accountMenuOpen = !accountMenuOpen;
	}

	function close() {
		accountMenuOpen = actionsMenuOpen = false;
	}
</script>

<!-- Navigation -->
<nav
	class="flex h-20 w-full flex-row items-center justify-between px-4 md:px-10"
	aria-label="Main navigation"
>
	<!-- Mobile Actions -->
	<ActionsMenu
		isOpen={actionsMenuOpen}
		toggleOpen={toggleActionsMenu}
		{isActive}
		{session}
		{close}
	/>

	<!-- Logo -->
	<a
		href="/"
		aria-label="Home page"
		class="focus:outline-primary-500 flex items-center focus:outline-2"
	>
		<LogoCore class="w-30 h-auto md:w-40" aria-hidden="true" />
	</a>

	<!-- Actions -->
	<div class="flex flex-row items-center gap-12">
		<!-- Nav Links (Desktop) -->
		<div class="hidden flex-row items-center md:flex">
			<ul class="flex flex-row items-center" role="menu" aria-label="Main navigation">
				<li role="none">
					<a
						href="/"
						class={twMerge(
							'text-lg p-1.5 hover:underline underline-offset-2 decoration-2 hover:text-primary-500',
							'focus-visible:text-primary-500 focus:outline-none focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-2',
							isActive('/') && 'underline'
						)}
						role="menuitem"
						aria-current={isActive('/') ? 'page' : undefined}
					>
						send
					</a>
				</li>
				<li role="none">
					<a
						href="/receive"
						class={twMerge(
							'text-lg p-2 hover:underline underline-offset-2 decoration-2 hover:text-primary-500',
							'focus-visible:text-primary-500 focus:outline-none focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-2',
							isActive(['/receive', '/r'], true) && 'underline'
						)}
						role="menuitem"
						aria-current={isActive(['/receive', '/r'], true) ? 'page' : undefined}
					>
						receive
					</a>
				</li>
			</ul>
		</div>

		<!-- Account Menu -->
		<AccountMenu isOpen={accountMenuOpen} toggleOpen={toggleAccountMenu} {session} {close} />
	</div>
</nav>
