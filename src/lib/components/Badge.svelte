<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import type { MouseEventHandler } from 'svelte/elements';

	type Variant = 'primary' | 'outline';
	type Size = 'sm' | 'lg';

	let {
		variant = 'primary',
		size = 'sm',
		class: className = '',
		leadingContent = undefined,
		trailingContent = undefined,
		children,
		...props
	}: {
		variant?: Variant;
		size?: Size;
		class?: string;
		leadingContent?: any;
		trailingContent?: any;
		children: any;
		[key: string]: any;
	} = $props();

	const baseStyles =
		'inline-flex justify-between items-center rounded-md border font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2';

	const variantStyles = {
		primary: 'bg-primary-500 text-white border-transparent hover:bg-primary-600',
		outline: 'border-primary-200 text-primary-800 hover:bg-primary-50'
	};

	const sizeStyles = {
		sm: 'px-2 py-0.5 text-xs',
		lg: 'px-3 py-1 text-sm'
	};

	// Compute final class
	const badgeClass = twMerge(baseStyles, variantStyles[variant], sizeStyles[size], className);
</script>

<div class={badgeClass} {...props}>
	{#if leadingContent}
		<span class="-ml-0.5 mr-1.5">
			{@render leadingContent()}
		</span>
	{/if}

	<span>{@render children()}</span>

	{#if trailingContent}
		<span class="inline-flex items-center justify-center ml-1">
			{@render trailingContent()}
		</span>
	{/if}
</div>
