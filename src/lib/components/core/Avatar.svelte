<script lang="ts">
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	let { src, name, className }: { src?: string | null; name: string; className?: string | null } =
		$props();

	let imageError = $state(false);
	let initials: string = $state('');

	onMount(() => {
		calculateInitials();
	});

	function calculateInitials() {
		if (name) {
			const nameParts = name.split(' ');
			if (nameParts.length >= 2) {
				initials = `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
			} else {
				initials = nameParts[0][0].toUpperCase();
			}
		}
	}

	function handleImageError() {
		imageError = true;
	}

	let avatarClass = twMerge(
		'inline-flex items-center justify-center rounded-full overflow-hidden bg-gray-200 text-gray-700 font-medium',
		'w-8 h-8 text-xs',
		className
	);
</script>

<div class={avatarClass}>
	{#if src && !imageError}
		<img {src} alt={name} class="h-full w-full object-cover" onerror={handleImageError} />
	{:else}
		<span class="flex h-full w-full items-center justify-center">{initials}</span>
	{/if}
</div>
