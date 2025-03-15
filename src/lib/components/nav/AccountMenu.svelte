<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';

	import type { Session, User } from '$lib/server/db/schema';

	import History from '$lib/assets/icons/History.svelte';
	import Account from '$lib/assets/icons/Account.svelte';
	import ChevronRight from '$lib/assets/icons/ChevronRight.svelte';
	import Cross from '$lib/assets/icons/Cross.svelte';
	import Enter from '$lib/assets/icons/Enter.svelte';
	import Exit from '$lib/assets/icons/Exit.svelte';
	import Person from '$lib/assets/icons/Person.svelte';
	import Cog from '$lib/assets/icons/Cog.svelte';
	import AccountSecurity from '$lib/assets/icons/AccountSecurity.svelte';
	import CloudUpload from '$lib/assets/icons/CloudUpload.svelte';

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
			class="group flex flex-row items-center gap-2 p-2 decoration-2 underline-offset-2 hover:underline"
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
		<div class="item-center flex flex-row justify-center gap-2">
			<a
				href="/signin"
				aria-label="Sign in to your account"
				class="btn preset-outlined-primary-900-100"
			>
				Sign in
			</a>
			<a
				href="/signup"
				aria-label="Sign up for a new account"
				class="btn preset-filled-primary-900-100 group hidden sm:flex"
			>
				<span>Sign up</span>
				<ChevronRight class="hidden h-3 w-3 group-hover:translate-x-1 sm:flex" />
			</a>
		</div>
	{/if}

	<!-- Account Menu -->
	{#if isOpen}
		<div
			id="account-menu"
			class="fixed right-0 top-0 z-20 flex h-full w-fit flex-row items-center justify-end sm:w-[320px]"
			role="dialog"
			aria-modal="true"
			aria-label="Account options"
		>
			<div
				class="card preset-filled-surface-100-900 border-surface-300-700 h-full w-full overflow-hidden rounded-l-md border-l p-3 shadow-lg"
				role="menu"
			>
				{#if session}
					<!-- Session Data -->
					<div class="flex flex-col">
						<div class="flex flex-row items-center">
							<!-- Account Information -->
							<div class="bg-surface-100-900 flex w-full flex-row items-center gap-4 p-3">
								<Account class="h-10 w-10" aria-hidden="true" />
								<div class="flex flex-col">
									<p class="text-lg">{user?.firstName}&nbsp;{user?.lastName}</p>
									<p class="text-primary-500 -mt-1 text-sm">{user?.email}</p>
								</div>
							</div>
							<button
								onclick={close}
								class="hover:bg-surface-200-800 rounded-base flex h-fit items-center justify-center p-2"
								aria-label="Close menu"
							>
								<Cross class="h-5 w-5" aria-hidden="true" />
							</button>
						</div>
						<hr class="hr m-2" />
						<a
							href="/account/profile"
							onclick={close}
							class="hover:bg-surface-200-800 rounded-base p-3"
							role="menuitem"
							tabindex="0"
						>
							<span class="flex w-full flex-row gap-4"><Person class="h-6 w-6" />Profile</span>
						</a>
						<a
							href="/account/security"
							onclick={close}
							class="hover:bg-surface-200-800 rounded-base p-3"
							role="menuitem"
						>
							<span class="flex w-full flex-row gap-4"
								><AccountSecurity aria-hidden="true" class="h-6 w-6" />Security</span
							>
						</a>
						<a
							href="/account/transfers"
							onclick={close}
							class="hover:bg-surface-200-800 rounded-base p-3"
							role="menuitem"
						>
							<span class="flex w-full flex-row gap-4"
								><CloudUpload aria-hidden="true" class="h-6 w-6" />Transfers</span
							>
						</a>
						<a
							href="/account/history"
							onclick={close}
							class="hover:bg-surface-200-800 rounded-base p-3"
							role="menuitem"
						>
							<span class="flex w-full flex-row gap-4"
								><History aria-hidden="true" class="h-6 w-6" />History</span
							>
						</a>
						<a
							href="/account/preferences"
							onclick={close}
							class="hover:bg-surface-200-800 rounded-base p-3"
							role="menuitem"
						>
							<span class="flex w-full flex-row gap-4"
								><Cog aria-hidden="true" class="h-6 w-6" />Preferences</span
							>
						</a>
						<hr class="hr m-2" />
						<form action="/signout" method="POST" class="flex flex-col">
							<button
								type="submit"
								class="hover:bg-surface-200-800 rounded-base p-3"
								role="menuitem"
							>
								<span class="flex w-full flex-row gap-4"
									><Exit aria-hidden="true" class="h-6 w-6" />Sign out</span
								>
							</button>
						</form>
					</div>
				{:else}
					<!-- Account Options -->
					<div class="flex flex-col">
						<a
							onclick={close}
							href="/signup"
							class="text-md decoration-1.5 hover:bg-surface-200-800 p-4 underline-offset-2"
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
							class="text-md decoration-1.5 hover:bg-surface-200-800 p-4 underline-offset-2"
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
			class="bg-surface-100-900 fixed inset-0 top-0 z-10 opacity-50"
			onclick={close}
			tabindex="-1"
			aria-label="Close menu"
		></button>
	{/if}
</div>
