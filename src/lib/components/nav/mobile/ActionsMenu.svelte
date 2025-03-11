<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	import Cross from '$lib/assets/icons/Cross.svelte';
	import Enter from '$lib/assets/icons/Enter.svelte';
	import Menu from '$lib/assets/icons/Menu.svelte';

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
		session: { user: { first: string; last: string; email: string } } | null;
	} = $props();
</script>

<!-- Actions Menu (Mobile) -->
<div class="flex flex-row items-center justify-center md:hidden">
	<!-- Toggle Button -->
	<button
		onclick={toggleOpen}
		class="flex flex-row items-center justify-center gap-2 decoration-2 underline-offset-2 hover:underline"
		aria-expanded={isOpen}
		aria-controls="mobile-actions-menu"
		aria-label="Toggle mobile menu"
	>
		{#if isOpen}
			<div class="flex h-7 w-7 flex-row items-center justify-center">
				<Cross className="w-6 h-6" />
			</div>
		{:else}
			<Menu className="w-7 h-7" />
		{/if}
	</button>
	{#if isOpen}
		<!-- Menu -->
		<div class="fixed left-0 top-20 z-20 flex w-full flex-row items-center justify-center">
			<div
				class="bg-secondary border-primary-50 w-11/12 overflow-hidden rounded-md border shadow-lg"
				role="menu"
				aria-label="Mobile actions menu"
			>
				<!-- Options -->
				<div class="flex flex-col">
					<a
						href="/"
						class={twMerge(
							'border-b p-4 border-primary-50 text-md underline-offset-2 decoration-1.5',
							isActive('/') && 'underline'
						)}
						role="menuitem"
					>
						send
					</a>
					<a
						href="/receive"
						class={twMerge(
							'p-4 border-b border-primary-50 text-md underline-offset-2 decoration-1.5',
							isActive(['/receive', '/r'], true) && 'underline'
						)}
						role="menuitem"
					>
						receive
					</a>
					{#if !session}
						<a
							href="/signin"
							class="border-primary-50 text-md decoration-1.5 p-4 underline-offset-2"
							role="menuitem"
						>
							<span class="flex flex-row items-center justify-between"
								>sign in <Enter className="w-6 h-6" /></span
							>
						</a>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- Close Menu when click out of menu excluding navbar interaction (on mobile) -->
	{#if isOpen}
		<button
			class="fixed inset-0 top-20 z-10 md:top-0"
			onclick={close}
			tabindex="0"
			aria-label="Close menu"
		></button>
	{/if}
</div>
