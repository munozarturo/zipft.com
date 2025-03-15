<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';

	import Cross from '$lib/assets/icons/Cross.svelte';
	import Menu from '$lib/assets/icons/Menu.svelte';
	import Send from '$lib/assets/icons/Send.svelte';
	import Receive from '$lib/assets/icons/Receive.svelte';

	let {
		isOpen,
		toggleOpen,
		close,
		isActive
	}: {
		isOpen: boolean;
		isActive: Function;
		toggleOpen: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
		close: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
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
			<Cross class="h-6 w-6" aria-hidden="true" />
		{:else}
			<Menu class="h-6 w-6" aria-hidden="true" />
		{/if}
	</button>

	{#if isOpen}
		<!-- Menu -->
		<div
			id="mobile-actions-menu"
			class="min-w-60 fixed left-0 top-0 z-20 flex h-full w-fit flex-row items-center justify-end sm:w-[320px]"
			role="dialog"
			aria-modal="true"
			aria-label="Mobile navigation options"
		>
			<div
				class="card preset-filled-surface-100-900 border-surface-300-700 h-full w-full overflow-hidden rounded-l-md border-r p-3 shadow-lg"
				role="menu"
			>
				<!-- Options -->
				<div class="flex flex-col">
					<a
						href="/"
						onclick={close}
						class="hover:bg-surface-200-800 rounded-base p-3"
						aria-current={isActive('/') ? 'page' : undefined}
						role="menuitem"
						tabindex="0"
					>
						<span class="flex w-full flex-row gap-4"><Send class="h-6 w-6" />Send</span>
					</a>
					<a
						href="/receive"
						onclick={close}
						class="hover:bg-surface-200-800 rounded-base p-3"
						aria-current={isActive(['/receive', '/r/'], true) ? 'page' : undefined}
						role="menuitem"
						tabindex="0"
					>
						<span class="flex w-full flex-row gap-4"><Receive class="h-6 w-6" />Receive</span>
					</a>
				</div>
			</div>
		</div>

		<!-- Backdrop to close menu -->
		<button
			class="fixed inset-0 top-0 z-10"
			onclick={close}
			tabindex="-1"
			aria-label="Close mobile menu"
		></button>
	{/if}
</div>
