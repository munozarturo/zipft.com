<script lang="ts">
	import FileDropzone from '../../lib/components/FileDropZone.svelte';

	let files = $state<File[]>([]);

	function handleFilesDropped(droppedFiles: File[]) {
		files = [...files, ...droppedFiles];
	}

	function removeFile(index: number) {
		files = files.filter((_, i) => i !== index);
	}
</script>

<div class="container mx-auto p-6">
	<h1 class="text-2xl font-bold mb-6">File Upload</h1>

	<FileDropzone
		onFilesDropped={handleFilesDropped}
		acceptedFileTypes={['image/jpeg', 'image/png', 'application/pdf']}
	/>

	{#if files.length > 0}
		<div class="mt-8">
			<h2 class="text-xl font-semibold mb-4">Uploaded Files</h2>
			<ul class="space-y-2">
				{#each files as file, index}
					<li class="flex items-center justify-between p-3 bg-white rounded shadow">
						<div>
							<span class="font-medium">{file.name}</span>
							<span class="ml-2 text-sm text-gray-500">
								{file.size.toFixed(2)} bytes
							</span>
						</div>
						<button class="text-red-500 hover:text-red-700" onclick={() => removeFile(index)}>
							Remove
						</button>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
