<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';

	import Account from '$lib/assets/icons/Account.svelte';
	import ChevronRight from '$lib/assets/icons/ChevronRight.svelte';
	import Cog from '$lib/assets/icons/Cog.svelte';
	import Cross from '$lib/assets/icons/Cross.svelte';
	import Enter from '$lib/assets/icons/Enter.svelte';
	import Exit from '$lib/assets/icons/Exit.svelte';
	import Person from '$lib/assets/icons/Person.svelte';
	import type { Session, User } from '$lib/server/db/schema';

	let {
		isOpen,
		toggleOpen,
		close,
		session,
		user
	}: {
		isOpen: boolean;
		toggleOpen: MouseEventHandler<HTMLButtonElement>;
		close: MouseEventHandler<HTMLButtonElement>;
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
				<p
					class="group-hover:text-primary-600 group-focus-visible:text-primary-600 hidden text-lg md:flex"
				>
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
				class="btn preset-filled-primary-500 group"
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
				class="bg-secondary border-primary-50 w-11/12 overflow-hidden rounded-md border shadow-lg"
				role="menu"
			>
				{#if session}
					<!-- Session Data -->
					<div class="flex flex-col">
						<div
							class="border-primary-50 text-md decoration-1.5 flex flex-row items-stretch border-b underline-offset-2"
						>
							<!-- Account Information -->
							<div
								class="border-primary-50 flex w-full flex-row items-center justify-start gap-2 border-r bg-gray-100 px-4 py-3"
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
								class="flex items-center justify-center px-4 hover:bg-gray-50 focus:outline-none focus-visible:bg-gray-100 focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-2"
								aria-label="Close menu"
							>
								<Cross class="h-5 w-5" aria-hidden="true" />
							</button>
						</div>

						<a
							href="/account"
							class="border-primary-50 text-md decoration-1.5 border-b p-4 underline-offset-2 hover:bg-gray-50 focus:outline-none focus-visible:bg-gray-100 focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-2"
							role="menuitem"
							tabindex="0"
						>
							<span class="flex flex-row items-center justify-between">
								Account <Cog class="h-6 w-6" aria-hidden="true" />
							</span>
						</a>
						<form action="/signout" method="POST">
							<button
								type="submit"
								class="border-primary-50 text-md decoration-1.5 w-full p-4 text-left underline-offset-2 hover:bg-gray-50 focus:outline-none focus-visible:bg-gray-100 focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-2"
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
							href="/signup"
							class="border-primary-50 text-md decoration-1.5 border-b p-4 underline-offset-2 hover:bg-gray-50 focus:outline-none focus-visible:bg-gray-100 focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-2"
							role="menuitem"
							tabindex="0"
						>
							<span class="flex flex-row items-center justify-between">
								Sign up <Person class="h-6 w-6" aria-hidden="true" />
							</span>
						</a>
						<a
							href="/signin"
							class="border-primary-50 text-md decoration-1.5 p-4 underline-offset-2 hover:bg-gray-50 focus:outline-none focus-visible:bg-gray-100 focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-2"
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
