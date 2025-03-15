<script lang="ts">
	import ChevronRight from '$lib/assets/icons/ChevronRight.svelte';
	import Spinner from '$lib/assets/icons/Spinner.svelte';
	import { type PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let allowSubmit = $state(false);
	function toggleAllow() {
		allowSubmit = !allowSubmit;
	}
</script>

<svelte:head>
	<title>Transfer account :: zipft</title>
</svelte:head>

<div class="container mx-auto pt-14 sm:pt-20">
	<form method="POST" class="card mx-auto max-w-[420px] space-y-4 px-8 sm:px-4">
		<div class="space-y-2">
			<h1 class="h1">Transfer account</h1>
			<ul class="text-base">
				<li>You're changing the email address linked to this account</li>
				<li>Access will immediately be revoked from the current owner</li>
				<li>The new owner gets full control of all data and settings</li>
				<li>By checking the box, you confirm your authority to make this transfer</li>
			</ul>
			<label class="flex items-center space-x-2">
				<input class="checkbox" type="checkbox" onclick={toggleAllow} />
				<p>I understand</p>
			</label>
			<button class="btn w-full justify-between bg-red-500" disabled={!allowSubmit}>
				<!-- {$delayed || } -->
				<span>Transfer Account</span>
				<!-- $delayed} -->
				{#if false}
					<Spinner class="h-5 w-5 animate-spin" />
				{:else}
					<ChevronRight
						class="btn-icon h-3 w-3 group-hover:translate-x-1 group-focus-visible:translate-x-1"
					/>
				{/if}
			</button>
		</div>
	</form>
</div>
