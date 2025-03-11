<script lang="ts">
	import Account from '$lib/assets/icons/Account.svelte';
	import ChevronRight from '$lib/assets/icons/ChevronRight.svelte';
	import Cog from '$lib/assets/icons/Cog.svelte';
	import Cross from '$lib/assets/icons/Cross.svelte';
	import Enter from '$lib/assets/icons/Enter.svelte';
	import Exit from '$lib/assets/icons/Exit.svelte';
	import Person from '$lib/assets/icons/Person.svelte';

	let {
		isOpen,
		session
	}: {
		isOpen: boolean;
		session: { user: { first: string; last: string; email: string } } | null;
	} = $props();

	function toggleOpen() {
		isOpen = !isOpen;
	}

	function close() {
		isOpen = false;
	}
</script>

<div class="flex flex-row items-center justify-center">
	{#if session}
		<button
			onclick={toggleOpen}
			class="flex flex-row items-center gap-2 decoration-2 underline-offset-2 hover:underline"
			aria-expanded={isOpen}
			aria-controls="account-menu"
			aria-label="Toggle account menu"
		>
			<span class="flex flex-row items-center justify-center gap-2">
				<Account className="w-8 h-8" />
				<p class="hidden md:flex">{session.user.first}</p>
			</span>
		</button>
	{:else}
		<div class="flex flex-row items-center justify-center">
			<a
				href="/signin"
				class="text-md hidden p-2 px-4 decoration-2 underline-offset-2 transition-all hover:underline md:flex md:text-lg"
				>sign in</a
			>
			<a
				href="/signup"
				class="text-md bg-primary-800 text-secondary hover:bg-primary-700 group p-2 decoration-2 outline transition-all md:text-lg"
				><span class="flex flex-row items-center justify-center gap-2"
					>sign up <ChevronRight
						className="hidden md:flex group-hover:translate-x-1 w-3 h-3"
					/></span
				></a
			>
		</div>
	{/if}

	<!-- Account Menu -->
	{#if isOpen}
		<div
			class="fixed left-0 top-20 z-20 flex w-full flex-row items-center justify-center sm:right-5 sm:w-[300px]"
		>
			<div
				class="bg-secondary border-primary-50 w-11/12 overflow-hidden rounded-md border shadow-lg"
				role="menu"
				aria-label="Mobile account menu"
			>
				{#if session}
					<!-- Session Data -->
					<div class="flex flex-col">
						<div class="flex flex-col">
							<div
								class="border-primary-50 text-md decoration-1.5 flex flex-row items-stretch border-b underline-offset-2"
							>
								<!-- Account Information -->
								<div
									class="border-primary-50 flex w-full flex-row items-center justify-start gap-2 border-r bg-gray-100 px-4 py-3"
								>
									<Account className="w-10 h-10" />
									<div class="flex flex-col">
										<p class="text-lg">{session.user.first}&nbsp;{session.user.last}</p>
										<p class="text-primary-500 -mt-1 text-sm">{session.user.email}</p>
									</div>
								</div>
								<!-- Close Button - Make it stretch to fill the entire height -->
								<button
									onclick={close}
									class="flex items-center justify-center px-4 hover:bg-gray-50"
								>
									<Cross className="w-5 h-5" />
								</button>
							</div>
						</div>
						<a
							href="/account"
							class="border-primary-50 text-md decoration-1.5 border-b p-4 underline-offset-2 hover:bg-gray-50"
							role="menuitem"
						>
							<span class="flex flex-row items-center justify-between"
								>account <Cog className="w-6 h-6" /></span
							>
						</a>
						<a
							href="/signout"
							class="border-primary-50 text-md decoration-1.5 p-4 underline-offset-2 hover:bg-gray-50"
							role="menuitem"
						>
							<span class="flex flex-row items-center justify-between"
								>sign out <Exit className="w-6 h-6" /></span
							>
						</a>
					</div>
				{:else}
					<!-- Account Options -->
					<div class="flex flex-col">
						<a
							href="/signup"
							class="border-primary-50 text-md decoration-1.5 border-b p-4 underline-offset-2"
							role="menuitem"
						>
							<span class="flex flex-row items-center justify-between"
								>sign up <Person className="w-6 h-6" /></span
							>
						</a>
						<a
							href="/signin"
							class="border-primary-50 text-md decoration-1.5 p-4 underline-offset-2"
							role="menuitem"
						>
							<span class="flex flex-row items-center justify-between"
								>sign in <Enter className="w-6 h-6" /></span
							>
						</a>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
