<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';

	import Account from '$lib/assets/icons/Account.svelte';
	import ChevronRight from '$lib/assets/icons/ChevronRight.svelte';
	import Cross from '$lib/assets/icons/Cross.svelte';
	import Enter from '$lib/assets/icons/Enter.svelte';
	import Exit from '$lib/assets/icons/Exit.svelte';
	import Person from '$lib/assets/icons/Person.svelte';
	import type { Session, User } from '$lib/server/db/schema';
	import Cog from '$lib/assets/icons/Cog.svelte';

	let {
		isOpen,
		toggleOpen,
		close,
		session,
		user
	}: {
		isOpen: boolean;
		toggleOpen: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
		close: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
		session: Session | null;
		user: User | null;
	} = $props();
</script>

<div class="flex flex-row items-center justify-center">
	{#if session}
		<button
			onclick={toggleOpen}
			class="group flex flex-row items-center gap-2 p-2 decoration-2 underline-offset-2 hover:underline focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-2"
			aria-expanded={isOpen}
			aria-controls="account-menu"
			aria-label="Account menu"
		>
			<span class="flex flex-row items-center justify-center gap-2">
				<Account class="h-8 w-8" />
				<p class="hidden text-lg md:flex">
					{user?.firstName}
				</p>
			</span>
		</button>
	{:else}
		<div class="flex flex-row items-center justify-center">
			<a href="/signin" aria-label="Sign in to your account" class="btn hidden md:flex">
				Sign in
			</a>
			<a
				href="/signup"
				aria-label="Sign up for a new account"
				class="btn preset-filled-primary-900-100 group"
			>
				<span>Sign up</span>
				<ChevronRight class="h-3 w-3 group-hover:translate-x-1" />
			</a>
		</div>
	{/if}

	<!-- Account Menu -->
	{#if isOpen}
		<div
			id="account-menu"
			class="fixed right-0 top-20 z-20 flex w-full flex-row items-center justify-center sm:right-5 sm:w-[300px]"
			role="dialog"
			aria-modal="true"
			aria-label="Account options"
		>
			<div
				class="card preset-filled-surface-100-900 border-surface-300-700 w-11/12 overflow-hidden rounded-md border shadow-lg"
				role="menu"
			>
				{#if session}
					<!-- Session Data -->
					<div class="flex flex-col">
						<div
							class="border-surface-300-700 text-md decoration-1.5 flex flex-row items-stretch border-b underline-offset-2"
						>
							<!-- Account Information -->
							<div
								class="border-surface-300-700 bg-surface-100-900 flex w-full flex-row items-center justify-start gap-2 border-r px-4 py-3"
							>
								<Account class="h-10 w-10" aria-hidden="true" />
								<div class="flex flex-col">
									<p class="text-lg">{user?.firstName}&nbsp;{user?.lastName}</p>
									<p class="text-primary-500 -mt-1 text-sm">{user?.email}</p>
								</div>
							</div>
							<!-- Close Button -->
							<button
								onclick={close}
								class="focus-visible:bg-surface-200-800 hover:bg-surface-200-800 flex items-center justify-center px-4 focus:outline-none focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-2"
								aria-label="Close menu"
							>
								<Cross class="h-5 w-5" aria-hidden="true" />
							</button>
						</div>

						<a
							onclick={close}
							href="/account/profile"
							class="border-surface-300-700 text-md decoration-1.5 focus-visible:bg-surface-200-800 hover:bg-surface-200-800 border-b p-4 underline-offset-2 focus:outline-none focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-2"
							role="menuitem"
							tabindex="0"
						>
							<span class="flex flex-row items-center justify-between">
								Profile <Person class="h-6 w-6" aria-hidden="true" />
							</span>
						</a>
						<a
							onclick={close}
							href="/settings"
							class="border-surface-300-700 text-md decoration-1.5 focus-visible:bg-surface-200-800 hover:bg-surface-200-800 border-b p-4 underline-offset-2 focus:outline-none focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-2"
							role="menuitem"
							tabindex="0"
						>
							<span class="flex flex-row items-center justify-between">
								Settings <Cog class="h-6 w-6" aria-hidden="true" />
							</span>
						</a>
						<form action="/signout" method="POST">
							<button
								type="submit"
								class="border-surface-300-700 text-md decoration-1.5 focus-visible:bg-surface-200-800 hover:bg-surface-200-800 w-full p-4 text-left underline-offset-2 focus:outline-none focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-2"
								role="menuitem"
							>
								<span class="flex flex-row items-center justify-between">
									Sign Out <Exit class="h-6 w-6" aria-hidden="true" />
								</span>
							</button>
						</form>
					</div>
				{:else}
					<!-- Account Options -->
					<div class="flex flex-col">
						<a
							onclick={close}
							href="/signup"
							class="border-surface-300-700 text-md decoration-1.5 focus-visible:bg-surface-200-800 hover:bg-surface-200-800 border-b p-4 underline-offset-2 focus:outline-none focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-2"
							role="menuitem"
							tabindex="0"
						>
							<span class="flex flex-row items-center justify-between">
								Sign up <Person class="h-6 w-6" aria-hidden="true" />
							</span>
						</a>
						<a
							onclick={close}
							href="/signin"
							class="border-surface-300-700 text-md decoration-1.5 focus-visible:bg-surface-200-800 hover:bg-surface-200-800 p-4 underline-offset-2 focus:outline-none focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-2"
							role="menuitem"
							tabindex="0"
						>
							<span class="flex flex-row items-center justify-between">
								Sign in <Enter class="h-6 w-6" aria-hidden="true" />
							</span>
						</a>
					</div>
				{/if}
			</div>
		</div>

		<!-- Backdrop to close menu when clicking outside -->
		<button
			class="fixed inset-0 top-20 z-10 md:top-0"
			onclick={close}
			tabindex="-1"
			aria-label="Close menu"
		></button>
	{/if}
</div>
