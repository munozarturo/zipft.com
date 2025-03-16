<script lang="ts">
	import ChevronLeft from '$lib/assets/icons/ChevronLeft.svelte';
	import ChevronRight from '$lib/assets/icons/ChevronRight.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import FileDropzone from '$lib/components/FileDropZone.svelte';
	import Cross from '$lib/assets/icons/Cross.svelte';
	import Send from '../../lib/assets/icons/Send.svelte';

	const tabs = ['files', 'details'] as const;
	type TabType = (typeof tabs)[number];

	let currentTab = $state<TabType>('files');
	let files = $state<File[]>([]);
	let name = $state<string>('');
	let recipient = $state<string>('');
	let recipients = $state<string[]>([]);

	function handleFilesDropped(droppedFiles: File[]) {
		files = [...files, ...droppedFiles];
	}

	function removeFile(index: number) {
		files = files.filter((_, i) => i !== index);
	}

	function goToPreviousTab() {
		const currentIndex = tabs.indexOf(currentTab);
		if (currentIndex > 0) {
			currentTab = tabs[currentIndex - 1];
		}
	}

	function goToNextTab() {
		const currentIndex = tabs.indexOf(currentTab);
		if (currentIndex < tabs.length - 1) {
			currentTab = tabs[currentIndex + 1];
		}
	}

	function addRecipient() {
		if (recipient) {
			recipients = [...recipients, recipient];
			recipient = '';
		}
	}

	function removeRecipient(recipient: string) {
		recipients = recipients.filter((r) => r !== recipient);
	}

	function handleNameSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (name) {
			goToNextTab();
		}
	}

	function handleRecipientSubmit(event: SubmitEvent) {
		event.preventDefault();
		addRecipient();
	}

	function send() {
		console.log('send');
	}
</script>

<div class="container mx-auto p-6 pb-20">
	<div class="flex justify-center items-center gap-3 w-full p-8">
		{#each tabs as tab}
			<button
				onclick={() => (currentTab = tab)}
				class="relative flex items-center justify-center rounded-full group px-3 {currentTab === tab
					? 'bg-black text-white h-7'
					: 'bg-gray-300 text-black h-6'}"
			>
				<span
					class="overflow-hidden whitespace-nowrap transition-all {currentTab === tab
						? 'max-w-xs duration-300 ease-in'
						: 'max-w-0 duration-150 ease-out group-hover:max-w-xs group-hover:duration-300 group-hover:ease-in'}"
					>{tab}</span
				>
			</button>
		{/each}
	</div>

	{#if currentTab === 'files'}
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
	{:else if currentTab === 'details'}
		<div class="mt-8 flex flex-col items-center">
			<form onsubmit={handleNameSubmit} class="w-full max-w-md">
				<div class="flex items-center">
					<label for="name" class="text-sm font-medium w-full">
						<span class="text-gray-500">Name</span>
						<input
							type="text"
							id="name"
							class="p-2 border border-gray-300 rounded w-full"
							bind:value={name}
							placeholder="Enter a name"
						/>
					</label>
				</div>
			</form>

			<form onsubmit={handleRecipientSubmit} class="w-full max-w-md mt-4">
				<div class="flex items-center gap-2">
					<label for="recipient" class="text-sm font-medium w-full">
						<span class="text-gray-500">Recipient</span>
						<div class="flex items-center gap-2">
							<input
								type="email"
								id="recipient"
								class="p-2 border border-gray-300 rounded w-full"
								bind:value={recipient}
								placeholder="example@email.com"
							/>
							<button type="submit" class="bg-black text-white px-4 py-2 rounded"> Add </button>
						</div>
					</label>
				</div>
			</form>
			<div class="flex flex-wrap gap-2 mt-4">
				{#each recipients as recipient}
					<Badge size="lg">
						{recipient}
						{#snippet trailingContent()}
							<button
								class="flex items-center justify-center"
								onclick={() => removeRecipient(recipient)}
							>
								<Cross class="w-3.5 h-3.5 text-white" />
							</button>
						{/snippet}
					</Badge>
				{/each}
			</div>
		</div>
	{/if}

	<div class="mt-8 flex justify-between items-center">
		<button
			onclick={goToPreviousTab}
			class="flex items-center justify-center gap-2 hover:bg-gray-200 rounded-full px-2 py-1"
			disabled={tabs.indexOf(currentTab) === 0}
		>
			<ChevronLeft class="w-5 h-5" /> Back
		</button>

		{#if currentTab !== 'details'}
			<button
				onclick={goToNextTab}
				class="flex items-center justify-center gap-2 hover:bg-gray-200 rounded-full px-2 py-1"
				disabled={tabs.indexOf(currentTab) === tabs.length - 1}
			>
				Next
				<ChevronRight class="w-5 h-5" />
			</button>
		{:else}
			<button
				onclick={send}
				class="flex items-center justify-center gap-2 hover:bg-gray-200 rounded-full px-2 py-1"
			>
				Submit
				<Send class="w-5 h-5" />
			</button>
		{/if}
	</div>
</div>
