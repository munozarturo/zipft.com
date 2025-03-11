<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';

	import Account from '$lib/assets/icons/Account.svelte';
	import ChevronRight from '$lib/assets/icons/ChevronRight.svelte';
	import Cog from '$lib/assets/icons/Cog.svelte';
	import Cross from '$lib/assets/icons/Cross.svelte';
	import Enter from '$lib/assets/icons/Enter.svelte';
	import Exit from '$lib/assets/icons/Exit.svelte';
	import Person from '$lib/assets/icons/Person.svelte';

	let {
		isOpen,
		toggleOpen,
		close,
		session
	}: {
		isOpen: boolean;
		toggleOpen: MouseEventHandler<HTMLButtonElement>;
		close: MouseEventHandler<HTMLButtonElement>;
		session: { user: { first: string; last: string; email: string } } | null;
	} = $props();
</script>

<div class="flex flex-row items-center justify-center">
	{#if session}
		<button
			onclick={toggleOpen}
			class="focus-visible:text-primary-500 flex flex-row items-center gap-2 p-2 decoration-2 underline-offset-2 hover:underline focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-2"
			aria-expanded={isOpen}
			aria-controls="account-menu"
			aria-label="Account menu"
		>
			<span class="flex flex-row items-center justify-center gap-2">
				<Account class="h-8 w-8" />
				<p class="hidden md:flex">{session.user.first}</p>
			</span>
		</button>
	{:else}
		<div class="flex flex-row items-center justify-center">
			<a
				href="/signin"
				class="focus-visible:text-primary-500 text-md hover:text-primary-500 hidden p-2 px-4 decoration-2 underline-offset-2 transition-all hover:underline focus:-outline-offset-2 focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-2 md:flex md:text-lg"
				aria-label="Sign in to your account"
			>
				sign in
			</a>
			<a
				href="/signup"
				class="text-md bg-primary-800 text-secondary hover:bg-accent focus-visible:bg-accent group p-2 decoration-2 outline transition-all md:text-lg"
				aria-label="Sign up for a new account"
			>
				<span class="flex flex-row items-center justify-center gap-2">
					sign up <ChevronRight
						class="hidden h-3 w-3 -translate-x-1 group-hover:translate-x-0 group-focus-visible:translate-x-0 md:flex"
					/>
				</span>
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
									<p class="text-lg">{session.user.first}&nbsp;{session.user.last}</p>
									<p class="text-primary-500 -mt-1 text-sm">{session.user.email}</p>
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
								account <Cog class="h-6 w-6" aria-hidden="true" />
							</span>
						</a>
						<a
							href="/signout"
							class="border-primary-50 text-md decoration-1.5 p-4 underline-offset-2 hover:bg-gray-50 focus:outline-none focus-visible:bg-gray-100 focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-2"
							role="menuitem"
							tabindex="0"
						>
							<span class="flex flex-row items-center justify-between">
								sign out <Exit class="h-6 w-6" aria-hidden="true" />
							</span>
						</a>
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
								sign up <Person class="h-6 w-6" aria-hidden="true" />
							</span>
						</a>
						<a
							href="/signin"
							class="border-primary-50 text-md decoration-1.5 p-4 underline-offset-2 hover:bg-gray-50 focus:outline-none focus-visible:bg-gray-100 focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-2"
							role="menuitem"
							tabindex="0"
						>
							<span class="flex flex-row items-center justify-between">
								sign in <Enter class="h-6 w-6" aria-hidden="true" />
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
