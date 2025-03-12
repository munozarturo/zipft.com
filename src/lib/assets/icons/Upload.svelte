<script>
	let { ...props } = $props();
</script>

<div {...props}>
	<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<rect x="10.5" y="4.5" width="3" height="15" fill="currentColor" />
		<path d="M6 9L12 3L18 9" stroke="currentColor" stroke-width="3" />
		<rect x="3" y="21" width="18" height="3" fill="currentColor" />
	</svg>
</div>
