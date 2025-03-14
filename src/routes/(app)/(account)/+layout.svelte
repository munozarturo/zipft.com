<script lang="ts">
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import Person from '$lib/assets/icons/Person.svelte';
	import History from '$lib/assets/icons/History.svelte';
	import Cog from '$lib/assets/icons/Cog.svelte';
	import Send from '$lib/assets/icons/Send.svelte';
	import AccountSecurity from '$lib/assets/icons/AccountSecurity.svelte';
	import SidebarLeft from '$lib/assets/icons/SidebarLeft.svelte';
	import SidebarRight from '$lib/assets/icons/SidebarRight.svelte';

	let isExpansed = $state(true);

	function toggleExpanded() {
		isExpansed = !isExpansed;
	}

	let { children } = $props();
</script>

<svelte:head>
	<title>Account :: zipft</title>
</svelte:head>

<div class="grid h-[calc(100vh-5rem)] w-full grid-cols-[auto_1fr]">
	<!-- Component -->
	<Navigation.Rail expanded={isExpansed}>
		{#snippet header()}
			<Navigation.Tile labelExpanded="Menu" onclick={toggleExpanded} title="Close Menu"
				>{#if isExpansed}
					<SidebarLeft class="h-6 w-6" />
				{:else}
					<SidebarRight class="h-6 w-6" />
				{/if}</Navigation.Tile
			>
		{/snippet}
		{#snippet tiles()}
			<Navigation.Tile labelExpanded="Profile" href="/account/profile">
				<Person class="h-6 w-6" />
			</Navigation.Tile>
			<Navigation.Tile labelExpanded="Security" href="/account/security">
				<AccountSecurity class="h-6 w-6" />
			</Navigation.Tile>
			<Navigation.Tile labelExpanded="Transfers" href="/account/transfers">
				<Send class="h-6 w-6" />
			</Navigation.Tile>
			<Navigation.Tile labelExpanded="History" href="/account/history">
				<History class="h-6 w-6" />
			</Navigation.Tile>
		{/snippet}
		{#snippet footer()}
			<Navigation.Tile labelExpanded="Settings" href="/settings" title="Settings"
				><Cog class="h-6 w-6" /></Navigation.Tile
			>
		{/snippet}
	</Navigation.Rail>
	<!-- Content -->
	<div class="flex flex-col p-8">
		{@render children()}
	</div>
</div>
