<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	import Cross from '$lib/assets/icons/Cross.svelte';
	import Enter from '$lib/assets/icons/Enter.svelte';
	import Menu from '$lib/assets/icons/Menu.svelte';
	import type { Session } from '$lib/server/db/schema';

	let {
		isOpen,
		toggleOpen,
		close,
		isActive,
		session
	}: {
		isOpen: boolean;
		isActive: Function;
		toggleOpen: MouseEventHandler<HTMLButtonElement>;
		close: MouseEventHandler<HTMLButtonElement>;
		session: Session | null;
	} = $props();
</script>

<!-- Actions Menu (Mobile) -->
<div class="flex flex-row items-center justify-center md:hidden">
	<!-- Toggle Button -->
	<button
		onclick={toggleOpen}
		class="flex flex-row items-center justify-center gap-2 p-2 decoration-2 underline-offset-2"
		aria-expanded={isOpen}
		aria-controls="mobile-actions-menu"
		aria-label="Toggle mobile menu"
	>
		{#if isOpen}
			<div class="flex h-7 w-7 flex-row items-center justify-center">
				<Cross class="h-6 w-6" aria-hidden="true" />
			</div>
		{:else}
			<Menu class="h-7 w-7" aria-hidden="true" />
		{/if}
	</button>

	{#if isOpen}
		<!-- Menu -->
		<div
			id="mobile-actions-menu"
			class="fixed left-0 top-20 z-20 flex w-full flex-row items-center justify-center"
			role="dialog"
			aria-modal="true"
			aria-label="Mobile navigation options"
		>
			<nav
				class="card preset-filled-surface-100-900 border-surface-300-700 w-11/12 overflow-hidden rounded-md border shadow-lg"
			>
				<!-- Options -->
				<div class="flex flex-col">
					<a
						href="/"
						class={twMerge(
							'border-b p-4 border-surface-300-700 text-md underline-offset-2 decoration-2 hover:bg-surface-200-800 focus:outline-none focus-visible:bg-surface-200-800 focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-2',
							isActive('/') && 'underline'
						)}
						role="menuitem"
						tabindex="0"
						aria-current={isActive('/') ? 'page' : undefined}
					>
						Send
					</a>
					<a
						href="/receive"
						class={twMerge(
							'p-4 border-b border-surface-300-700 text-md underline-offset-2 decoration-2 hover:bg-surface-200-800 focus:outline-none focus-visible:bg-surface-200-800 focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-2',
							isActive(['/receive', '/r/'], true) && 'underline'
						)}
						role="menuitem"
						tabindex="0"
						aria-current={isActive(['/receive', '/r/'], true) ? 'page' : undefined}
					>
						Receive
					</a>
					{#if !session}
						<a
							href="/signin"
							class="border-surface-300-700 text-md hover:bg-surface-200-800 focus-visible:bg-surface-200-800 p-4 decoration-2 underline-offset-2 focus:outline-none focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-2"
							role="menuitem"
							tabindex="0"
						>
							<span class="flex flex-row items-center justify-between">
								Sign in <Enter class="h-6 w-6" aria-hidden="true" />
							</span>
						</a>
					{/if}
				</div>
			</nav>
		</div>

		<!-- Backdrop to close menu -->
		<button
			class="fixed inset-0 top-20 z-10 md:top-0"
			onclick={close}
			tabindex="-1"
			aria-label="Close mobile menu"
		></button>
	{/if}
</div>
