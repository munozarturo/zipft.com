<script lang="ts">
	import Upload from '../assets/icons/Upload.svelte';
	import Cog from '../assets/icons/Cog.svelte';
	import Cross from '../assets/icons/Cross.svelte';
	import Plus from '../assets/icons/Plus.svelte';
	import { fly, scale, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	let {
		onFilesDropped,
		maxSize = 2147483648,
		acceptedFileTypes = [],
		files = [],
		onFileRemove = (index: number) => {}
	} = $props<{
		onFilesDropped: (files: File[]) => void;
		maxSize?: number; // Maximum file size in bytes
		acceptedFileTypes?: string[]; // Array of accepted MIME types
		files?: File[]; // Array of uploaded files
		onFileRemove?: (index: number) => void; // Callback to remove a file
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

	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes';

		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}
</script>

<div
	class="relative w-full border-2 border-dashed rounded-lg transition-colors {isDragging
		? 'border-blue-900'
		: 'border-black'}"
	ondragenter={handleDragEnter}
	ondragleave={handleDragLeave}
	ondragover={handleDragOver}
	ondrop={handleDrop}
	role="form"
>
	{#if files.length === 0}
		<label
			class="flex flex-col items-center justify-center w-full p-2 rounded-lg cursor-pointer bg-white"
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
		</label>
	{:else}
		<div class="w-full p-2">
			<div
				class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 {isDragging
					? 'pointer-events-none'
					: 'pointer-events-auto'}"
			>
				<label
					class="cursor-pointer flex items-center justify-center bg-gray-100 rounded-lg p-3 {isDragging
						? 'text-blue-900'
						: 'text-black'}"
					in:scale={{ duration: 200, start: 0.9, opacity: 0 }}
				>
					<input
						type="file"
						class="hidden"
						onchange={handleFileInputChange}
						accept={acceptedFileTypes.join(',')}
						multiple
					/>
					<Plus class="w-6 h-6" />
				</label>

				{#each files as file, index (file.name + file.size)}
					<div
						class="flex flex-col items-center bg-gray-100 p-3 rounded-lg relative group"
						in:scale={{ duration: 200, delay: index * 50, start: 0.9, opacity: 0 }}
						out:scale={{ duration: 200, start: 1, opacity: 0 }}
						animate:flip={{ duration: 300 }}
					>
						<button
							class="absolute top-1 right-1 p-1 bg-red-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
							onclick={() => onFileRemove(index)}
						>
							<Cross class="w-3.5 h-3.5 text-red-600" />
						</button>
						<Cog class="w-8 h-8 text-black" />
						<p class="mt-2 text-black text-sm font-medium text-center truncate w-full">
							{file.name}
						</p>
						<p class="text-xs text-gray-500">{formatFileSize(file.size)}</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

{#if errorMessage}
	<div class="mt-3 text-sm text-red-500 pointer-events-none">
		{errorMessage}
	</div>
{/if}
