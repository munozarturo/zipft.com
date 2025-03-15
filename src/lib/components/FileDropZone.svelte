<script lang="ts">
	import Upload from '../assets/icons/Upload.svelte';

	let {
		onFilesDropped,
		maxSize = 2147483648,
		acceptedFileTypes = []
	} = $props<{
		onFilesDropped: (files: File[]) => void;
		maxSize?: number; // Maximum file size in bytes
		acceptedFileTypes?: string[]; // Array of accepted MIME types
	}>();

	let isDragging = $state(false);
	let errorMessage = $state('');

	function handleDragEnter(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer) {
			isDragging = true;
		}
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		isDragging = false;
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'copy';
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		isDragging = false;

		if (!e.dataTransfer?.files) return;

		const files = Array.from(e.dataTransfer.files);
		validateAndProcessFiles(files);
	}

	function handleFileInputChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (!target.files) return;

		const files = Array.from(target.files);
		validateAndProcessFiles(files);

		target.value = '';
	}

	function validateAndProcessFiles(files: File[]) {
		let isValid = true;

		// Check file types if acceptedFileTypes is provided
		if (acceptedFileTypes.length > 0) {
			isValid = files.every((file) =>
				acceptedFileTypes.some((type: string) => file.type === type || type === '*')
			);

			if (!isValid) {
				errorMessage = 'Invalid file type. Accepted types: ' + acceptedFileTypes.join(', ');
				return;
			}
		}

		// Check file size
		isValid = files.every((file) => file.size <= maxSize);
		if (!isValid) {
			errorMessage = `File too large. Maximum size is ${maxSize} bytes`;
			return;
		}

		errorMessage = '';
		onFilesDropped(files);
	}
</script>

<label
	class="relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer bg-white {isDragging
		? 'border-blue-900'
		: 'border-black'}"
	ondragenter={handleDragEnter}
	ondragleave={handleDragLeave}
	ondragover={handleDragOver}
	ondrop={handleDrop}
	role="form"
>
	<input
		type="file"
		class="hidden"
		onchange={handleFileInputChange}
		accept={acceptedFileTypes.join(',')}
		multiple
	/>
	<div
		class="text-center pointer-events-none transition-colors {isDragging
			? 'text-blue-900'
			: 'text-black'}"
	>
		<Upload class="w-12 h-12 mx-auto" />
		<p class="mt-2 text-sm">click or drag to upload</p>
	</div>

	{#if errorMessage}
		<div class="mt-3 text-sm text-red-500 pointer-events-none">{errorMessage}</div>
	{/if}
</label>
