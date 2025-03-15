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

<!-- Needs Mobile Compatible Component -->
<div class="grid h-[calc(100vh-5rem)] w-full grid-cols-[auto_1fr]">
	<!-- Component -->
	<div
		class="preset-filled-surface-100-900 border-surface-300-700 flex w-[320px] flex-col rounded-r-md border-r border-t p-3 shadow-lg"
	>
		<a href="/account/profile" class="hover:bg-surface-200-800 rounded-base p-3">
			<span class="flex w-full flex-row gap-4"><Person class="h-6 w-6" />Profile</span>
		</a>
		<a href="/account/security" class="hover:bg-surface-200-800 rounded-base p-3">
			<span class="flex w-full flex-row gap-4"><AccountSecurity class="h-6 w-6" />Security</span>
		</a>
		<a href="/account/transfers" class="hover:bg-surface-200-800 rounded-base p-3">
			<span class="flex w-full flex-row gap-4"><Send class="h-6 w-6" />Transfers</span>
		</a>
		<a href="/account/history" class="hover:bg-surface-200-800 rounded-base p-3">
			<span class="flex w-full flex-row gap-4"><History class="h-6 w-6" />History</span>
		</a>
		<a href="/account/preferences" class="hover:bg-surface-200-800 rounded-base p-3">
			<span class="flex w-full flex-row gap-4"><Cog class="h-6 w-6" />Preferences</span>
		</a>
	</div>
	<!-- Content -->
	<div class="flex flex-col p-8">
		{@render children()}
	</div>
</div>
