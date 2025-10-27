<template>
    <NuxtLayout name="content">
        <div class="w-full h-full flex flex-col items-center pt-2 pb-4">
            <div class="w-full px-4 sm:px-0 sm:max-w-lg lg:max-w-2xl">
                <UTabs :items="tabs" variant="link" color="neutral">
                    <template #link>
                        <UForm
                            class="flex flex-col gap-2 pt-2"
                            :schema="linkSchema"
                            :state="linkState"
                            @submit="onLinkSubmit"
                        >
                            <!-- Title -->
                            <UFormField name="title" :ui="{ label: 'w-full' }">
                                <template #label>
                                    <div
                                        class="flex flex-row w-full items-center justify-between"
                                    >
                                        <span>Title</span>
                                        <div
                                            id="character-count"
                                            :class="[
                                                'text-xs tabular-nums',
                                                (state.title?.length || 0) >
                                                maxTransferTitleLength
                                                    ? 'text-error'
                                                    : 'text-muted',
                                            ]"
                                            aria-live="polite"
                                            role="status"
                                        >
                                            {{ state.title?.length || 0 }}/{{
                                                maxTransferTitleLength
                                            }}
                                        </div>
                                    </div>
                                </template>
                                <UInput
                                    class="w-full"
                                    placeholder="Documents"
                                    :spellcheck="false"
                                    v-model="state.title"
                                />
                            </UFormField>

                            <!-- Message -->
                            <UFormField
                                name="message"
                                :ui="{ label: 'w-full' }"
                            >
                                <template #label>
                                    <div
                                        class="flex flex-row w-full items-center justify-between"
                                    >
                                        <span>Message</span>
                                        <div
                                            id="character-count"
                                            :class="[
                                                'text-xs tabular-nums',
                                                (state.message?.length || 0) >
                                                maxTransferMessageLength
                                                    ? 'text-error'
                                                    : 'text-muted',
                                            ]"
                                            aria-live="polite"
                                            role="status"
                                        >
                                            {{ state.message?.length || 0 }}/{{
                                                maxTransferMessageLength
                                            }}
                                        </div>
                                    </div>
                                </template>
                                <UTextarea
                                    class="w-full"
                                    placeholder="Add a note for the recipient"
                                    :rows="4"
                                    :maxrows="6"
                                    autoresize
                                    v-model="state.message"
                                />
                            </UFormField>

                            <!-- Files -->
                            <UFormField name="files" label="Files">
                                <UFileUpload
                                    v-model="state.files"
                                    multiple
                                    label="Drop your files here"
                                    class="w-full min-h-64"
                                    layout="list"
                                    position="inside"
                                />
                            </UFormField>

                            <!-- Options -->
                            <div v-if="showOptions" class="flex flex-col gap-2">
                                <!-- Anonimize -->
                                <UCheckbox
                                    color="neutral"
                                    v-if="$auth.isAuthenticated.value"
                                    label="Anonymous transfer"
                                    description="The transfer will not be linked to your profile"
                                    v-model="state.anonimize"
                                />

                                <!-- Beacon -->
                                <UCheckbox
                                    color="neutral"
                                    description="Transfer will never expire"
                                    v-model="state.isBeacon"
                                    :disabled="!$auth.isAuthenticated.value"
                                >
                                    <template #label>
                                        <span
                                            :class="[
                                                'flex flex-row items-center gap-1',
                                                !$auth.isAuthenticated.value
                                                    ? 'text-muted'
                                                    : '',
                                            ]"
                                            >Beacon
                                            <UTooltip
                                                v-if="
                                                    !$auth.isAuthenticated.value
                                                "
                                                text="You need to be signed in to use this feature."
                                                ><UIcon
                                                    name="i-lucide-triangle-alert" /></UTooltip
                                        ></span>
                                    </template>
                                </UCheckbox>

                                <!-- Duration -->
                                <UFormField
                                    name="duration"
                                    label="Duration"
                                    description="The period during which the transfer will be active"
                                    v-if="!state.isBeacon"
                                >
                                    <template #label>
                                        <span
                                            class="flex flex-row items-center gap-1"
                                            >Duration
                                            <UTooltip
                                                v-if="
                                                    !$auth.isAuthenticated.value
                                                "
                                                text="Sign in to increase duration limit of 7 days."
                                                ><UIcon
                                                    name="i-lucide-info" /></UTooltip
                                        ></span>
                                    </template>
                                    <UPopover>
                                        <UButton
                                            color="neutral"
                                            variant="subtle"
                                            icon="i-lucide-calendar"
                                        >
                                            <template v-if="modelValue.start">
                                                <template v-if="modelValue.end">
                                                    {{
                                                        df.format(
                                                            modelValue.start.toDate(
                                                                getLocalTimeZone()
                                                            )
                                                        )
                                                    }}
                                                    -
                                                    {{
                                                        df.format(
                                                            modelValue.end.toDate(
                                                                getLocalTimeZone()
                                                            )
                                                        )
                                                    }}
                                                </template>

                                                <template v-else>
                                                    {{
                                                        df.format(
                                                            modelValue.start.toDate(
                                                                getLocalTimeZone()
                                                            )
                                                        )
                                                    }}
                                                    -
                                                    {{
                                                        df.format(
                                                            modelValue.start.toDate(
                                                                getLocalTimeZone()
                                                            )
                                                        )
                                                    }}
                                                </template>
                                            </template>
                                            <template v-else>
                                                Pick a date range
                                            </template>
                                        </UButton>

                                        <template #content>
                                            <UCalendar
                                                v-model="modelValue"
                                                class="p-2"
                                                :number-of-months="1"
                                                range
                                                color="neutral"
                                                :min-value="now"
                                                :max-value="oneWeekFromNow"
                                            />
                                        </template>
                                    </UPopover>
                                </UFormField>

                                <!-- Maximum Downloads -->
                                <UFormField
                                    name="downloadLimit"
                                    label="Download limit"
                                    description="Limit the number of times a transfer can be downloaded"
                                >
                                    <UInputNumber
                                        v-model="state.downloadLimit"
                                        :min="1"
                                        color="neutral"
                                        orientation="vertical"
                                        placeholder="No limit"
                                    />
                                </UFormField>
                            </div>
                            <UButton
                                variant="link"
                                color="neutral"
                                @click="showOptions = !showOptions"
                            >
                                <div
                                    class="flex flex-row w-full items-center justify-center"
                                >
                                    <span
                                        class="flex flex-row gap-1 items-center"
                                        ><UIcon
                                            v-if="showOptions"
                                            name="i-lucide-chevron-up"
                                        /><UIcon
                                            v-else
                                            name="i-lucide-chevron-down"
                                        />{{
                                            showOptions
                                                ? "Hide options"
                                                : "More options"
                                        }}</span
                                    >
                                </div>
                            </UButton>

                            <!-- Submit -->
                            <div class="flex flex-row justify-end gap-2 w-full">
                                <div class="flex flex-row gap-2">
                                    <UButton
                                        type="submit"
                                        color="neutral"
                                        trailing-icon="i-lucide-send-horizontal"
                                        class="group cursor-pointer"
                                        :loading="submitting"
                                        :disabled="submitting"
                                        :ui="{
                                            trailingIcon:
                                                'group-enabled:group-hover:translate-x-1 group-enabled:group-focus-visible:translate-x-1 transition-transform duration-300',
                                        }"
                                    >
                                        <span class="text-left w-full"
                                            >Send</span
                                        >
                                    </UButton>
                                </div>
                            </div>
                        </UForm>
                    </template>
                    <template #mail>
                        <UForm
                            class="flex flex-col gap-2 pt-2"
                            :schema="mailSchema"
                            :state="mailState"
                            @submit="onMailSubmit"
                        >
                            <!-- From -->
                            <UFormField label="From" name="from">
                                <UInput
                                    class="w-full"
                                    placeholder="you@mail.com"
                                    v-model="state.from"
                                    :spellcheck="false"
                                    :disabled="$auth.isAuthenticated.value"
                                    :variant="
                                        $auth.isAuthenticated.value
                                            ? 'soft'
                                            : 'outline'
                                    "
                                />
                            </UFormField>

                            <!-- To -->
                            <UFormField name="to" :ui="{ label: 'w-full' }">
                                <template #label>
                                    <div
                                        class="flex flex-row w-full items-center justify-between"
                                    >
                                        <span>To</span>
                                        <div
                                            id="character-count"
                                            :class="[
                                                'text-xs tabular-nums',
                                                (state.to?.length || 0) >
                                                maxTransferRecipients
                                                    ? 'text-error'
                                                    : 'text-muted',
                                            ]"
                                            aria-live="polite"
                                            role="status"
                                        >
                                            {{ state.to?.length || 0 }}/{{
                                                maxTransferRecipients
                                            }}
                                        </div>
                                    </div>
                                </template>
                                <UInputTags
                                    ref="emailInputRef"
                                    class="w-full"
                                    :placeholder="
                                        state.to?.length || 0 > 0
                                            ? ''
                                            : 'recipient@mail.com'
                                    "
                                    :spellcheck="false"
                                    v-model="state.to"
                                />
                            </UFormField>

                            <!-- Title -->
                            <UFormField name="title" :ui="{ label: 'w-full' }">
                                <template #label>
                                    <div
                                        class="flex flex-row w-full items-center justify-between"
                                    >
                                        <span>Title</span>
                                        <div
                                            id="character-count"
                                            :class="[
                                                'text-xs tabular-nums',
                                                (state.title?.length || 0) >
                                                maxTransferTitleLength
                                                    ? 'text-error'
                                                    : 'text-muted',
                                            ]"
                                            aria-live="polite"
                                            role="status"
                                        >
                                            {{ state.title?.length || 0 }}/{{
                                                maxTransferTitleLength
                                            }}
                                        </div>
                                    </div>
                                </template>
                                <UInput
                                    class="w-full"
                                    placeholder="Documents"
                                    :spellcheck="false"
                                    v-model="state.title"
                                />
                            </UFormField>

                            <!-- Message -->
                            <UFormField
                                name="message"
                                :ui="{ label: 'w-full' }"
                            >
                                <template #label>
                                    <div
                                        class="flex flex-row w-full items-center justify-between"
                                    >
                                        <span>Message</span>
                                        <div
                                            id="character-count"
                                            :class="[
                                                'text-xs tabular-nums',
                                                (state.message?.length || 0) >
                                                maxTransferMessageLength
                                                    ? 'text-error'
                                                    : 'text-muted',
                                            ]"
                                            aria-live="polite"
                                            role="status"
                                        >
                                            {{ state.message?.length || 0 }}/{{
                                                maxTransferMessageLength
                                            }}
                                        </div>
                                    </div>
                                </template>
                                <UTextarea
                                    class="w-full"
                                    placeholder="Add a note for the recipient"
                                    :rows="4"
                                    :maxrows="6"
                                    autoresize
                                    v-model="state.message"
                                />
                            </UFormField>

                            <!-- Files -->
                            <UFormField name="files" label="Files">
                                <UFileUpload
                                    v-model="state.files"
                                    multiple
                                    label="Drop your files here"
                                    class="w-full min-h-64"
                                    layout="list"
                                    position="inside"
                                />
                            </UFormField>

                            <!-- Options -->
                            <div v-if="showOptions" class="flex flex-col gap-2">
                                <!-- Beacon -->
                                <UCheckbox
                                    color="neutral"
                                    description="Transfer will never expire"
                                    v-model="state.isBeacon"
                                    :disabled="!$auth.isAuthenticated.value"
                                >
                                    <template #label>
                                        <span
                                            :class="[
                                                'flex flex-row items-center gap-1',
                                                !$auth.isAuthenticated.value
                                                    ? 'text-muted'
                                                    : '',
                                            ]"
                                            >Beacon
                                            <UTooltip
                                                v-if="
                                                    !$auth.isAuthenticated.value
                                                "
                                                text="You need to be signed in to use this feature."
                                                ><UIcon
                                                    name="i-lucide-triangle-alert" /></UTooltip
                                        ></span>
                                    </template>
                                </UCheckbox>

                                <!-- Duration -->
                                <UFormField
                                    name="duration"
                                    label="Duration"
                                    description="The period during which the transfer will be active"
                                    v-if="!state.isBeacon"
                                >
                                    <template #label>
                                        <span
                                            class="flex flex-row items-center gap-1"
                                            >Duration
                                            <UTooltip
                                                v-if="
                                                    !$auth.isAuthenticated.value
                                                "
                                                text="Sign in to increase duration limit of 7 days."
                                                ><UIcon
                                                    name="i-lucide-info" /></UTooltip
                                        ></span>
                                    </template>
                                    <UPopover>
                                        <UButton
                                            color="neutral"
                                            variant="subtle"
                                            icon="i-lucide-calendar"
                                        >
                                            <template v-if="modelValue.start">
                                                <template v-if="modelValue.end">
                                                    {{
                                                        df.format(
                                                            modelValue.start.toDate(
                                                                getLocalTimeZone()
                                                            )
                                                        )
                                                    }}
                                                    -
                                                    {{
                                                        df.format(
                                                            modelValue.end.toDate(
                                                                getLocalTimeZone()
                                                            )
                                                        )
                                                    }}
                                                </template>

                                                <template v-else>
                                                    {{
                                                        df.format(
                                                            modelValue.start.toDate(
                                                                getLocalTimeZone()
                                                            )
                                                        )
                                                    }}
                                                    -
                                                    {{
                                                        df.format(
                                                            modelValue.start.toDate(
                                                                getLocalTimeZone()
                                                            )
                                                        )
                                                    }}
                                                </template>
                                            </template>
                                            <template v-else>
                                                Pick a date range
                                            </template>
                                        </UButton>

                                        <template #content>
                                            <UCalendar
                                                v-model="modelValue"
                                                class="p-2"
                                                :number-of-months="1"
                                                range
                                                color="neutral"
                                                :min-value="now"
                                                :max-value="oneWeekFromNow"
                                            />
                                        </template>
                                    </UPopover>
                                </UFormField>

                                <!-- Maximum Downloads -->
                                <UFormField
                                    name="downloadLimit"
                                    label="Download limit"
                                    description="Limit the number of times a transfer can be downloaded"
                                >
                                    <UInputNumber
                                        v-model="state.downloadLimit"
                                        :min="1"
                                        color="neutral"
                                        orientation="vertical"
                                        placeholder="No limit"
                                    />
                                </UFormField>
                            </div>
                            <UButton
                                variant="link"
                                color="neutral"
                                @click="showOptions = !showOptions"
                            >
                                <div
                                    class="flex flex-row w-full items-center justify-center"
                                >
                                    <span
                                        class="flex flex-row gap-1 items-center"
                                        ><UIcon
                                            v-if="showOptions"
                                            name="i-lucide-chevron-up"
                                        /><UIcon
                                            v-else
                                            name="i-lucide-chevron-down"
                                        />{{
                                            showOptions
                                                ? "Hide options"
                                                : "More options"
                                        }}</span
                                    >
                                </div>
                            </UButton>

                            <!-- Submit -->
                            <div class="flex flex-row justify-end gap-2 w-full">
                                <div class="flex flex-row gap-2">
                                    <UButton
                                        type="submit"
                                        color="neutral"
                                        trailing-icon="i-lucide-send-horizontal"
                                        class="group cursor-pointer"
                                        :loading="submitting"
                                        :disabled="submitting"
                                        :ui="{
                                            trailingIcon:
                                                'group-enabled:group-hover:translate-x-1 group-enabled:group-focus-visible:translate-x-1 transition-transform duration-300',
                                        }"
                                    >
                                        <span class="text-left w-full">{{
                                            submitting ? "Sending..." : "Send"
                                        }}</span>
                                    </UButton>
                                </div>
                            </div>
                        </UForm>
                    </template>
                </UTabs>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
import * as y from "yup";
import type { TabsItem } from "@nuxt/ui";
import type { FormSubmitEvent } from "@nuxt/ui";
import {
    DateFormatter,
    getLocalTimeZone,
    today,
} from "@internationalized/date";
import {
    maxTransferMessageLength,
    maxTransferTitleLength,
    linkSchema,
    mailSchema,
    maxTransferRecipients,
} from "~~/shared/schema/transfer";
import JSZip from "jszip";
import CryptoJS from "crypto-js";

useHead({ title: "Send :: zipft" });

const { $auth } = useNuxtApp();

const showOptions = ref<boolean>(false);

const tabs: TabsItem[] = [
    {
        label: "Mail",
        icon: "i-lucide-mail",
        slot: "mail",
    },
    {
        label: "Link",
        icon: "i-lucide-link",
        slot: "link",
    },
];

const df = new DateFormatter("en-US", {
    dateStyle: "medium",
});

const now = today(getLocalTimeZone());
const oneWeekFromNow = today(getLocalTimeZone()).add({ days: 7 });

const modelValue = shallowRef({
    start: now,
    end: oneWeekFromNow,
});

// API response interfaces
interface LinkTransferResponse {
    token: string;
    file: {
        key: string;
        path: string;
        method: string;
    };
}

interface UploadResponse {
    url: string;
    fields: Record<string, string>;
}

// Shared state type that works with both forms
interface FormState {
    // Shared fields
    title?: string | null;
    message?: string | null;
    files?: any[];
    isBeacon?: boolean;
    downloadLimit?: number | null;

    // Mail-specific fields
    from?: string | null;
    to?: string[];

    // Link-specific fields
    anonimize?: boolean;
}

type LinkSchema = y.InferType<typeof linkSchema>;
type MailSchema = y.InferType<typeof mailSchema>;

const state = reactive<FormState>({
    from: $auth.user.value?.email || null,
    title: null,
    message: null,
    files: [],
    isBeacon: false,
    downloadLimit: null,
    to: [],
    anonimize: false,
});

// Create properly typed states for each form
const linkState = computed(() => ({
    title: state.title,
    message: state.message,
    files: state.files || [],
    isBeacon: state.isBeacon || false,
    downloadLimit: state.downloadLimit,
    anonimize: state.anonimize || false,
}));

const mailState = computed(() => ({
    title: state.title,
    message: state.message,
    files: state.files || [],
    isBeacon: state.isBeacon || false,
    downloadLimit: state.downloadLimit,
    from: state.from || "",
    to: state.to || [],
}));

// Helper functions
async function calculateMD5(file: File): Promise<string> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);

            // Calculate MD5 hash and convert to base64
            const hash = CryptoJS.MD5(wordArray);
            const base64Hash = CryptoJS.enc.Base64.stringify(hash);

            resolve(base64Hash);
        };
        reader.readAsArrayBuffer(file);
    });
}

async function createZipFile(files: File[]): Promise<File> {
    const zip = new JSZip();

    // Add all files to the zip
    for (const file of files) {
        zip.file(file.name, file);
    }

    // Generate the zip file
    const zipBlob = await zip.generateAsync({ type: "blob" });

    // Create a File object from the blob
    const zipFile = new File([zipBlob], "transfer.zip", {
        type: "application/zip",
    });

    return zipFile;
}

// State management
const toast = useToast();
const submitting = ref<boolean>(false);

async function onLinkSubmit(event: FormSubmitEvent<LinkSchema>) {
    if (!event.data.files || event.data.files.length === 0) {
        toast.add({
            title: "No files selected",
            description: "Please select at least one file to share",
            icon: "i-lucide-x",
            color: "error",
        });
        return;
    }

    submitting.value = true;

    try {
        // Create zip file from all selected files
        const zipFile = await createZipFile(event.data.files as File[]);

        // Calculate MD5 hash for the zip file
        const md5Hash = await calculateMD5(zipFile);

        // Prepare the request data for the transfer API
        const transferData = {
            title: event.data.title,
            message: event.data.message,
            isBeacon: event.data.isBeacon,
            downloadLimit: event.data.downloadLimit,
            anonimize: event.data.anonimize,
            file: {
                name: zipFile.name,
                type: zipFile.type,
                md5: md5Hash,
                size: zipFile.size,
            },
            duration: event.data.isBeacon
                ? null
                : {
                      start: modelValue.value.start.toDate(getLocalTimeZone()),
                      end: modelValue.value.end.toDate(getLocalTimeZone()),
                  },
        };

        // Create the transfer
        const transferResponse = await $fetch<LinkTransferResponse>(
            "/api/v1/transfer/link",
            {
                method: "POST",
                body: transferData,
            }
        );

        // Get presigned URL for upload
        const uploadResponse = await $fetch<UploadResponse>(
            "/api/v1/object/upload",
            {
                method: "POST",
                body: { key: transferResponse.file.key },
            }
        );

        // Upload to S3 using presigned URL
        const s3FormData = new FormData();

        // Add all presigned fields first
        Object.entries(uploadResponse.fields).forEach(([key, value]) => {
            s3FormData.append(key, value as string);
        });

        // Add the file last (S3 requires this)
        s3FormData.append("file", zipFile);

        // Use fetch directly for S3 upload instead of $fetch to handle non-JSON responses
        const s3Response = await fetch(uploadResponse.url, {
            method: "POST",
            body: s3FormData,
        });

        if (!s3Response.ok) {
            const responseText = await s3Response.text();
            console.error("S3 response body:", responseText);
            throw new Error(
                `S3 upload failed: ${s3Response.status} ${s3Response.statusText} - ${responseText}`
            );
        }

        // Verify the upload
        await $fetch("/api/v1/object/verify", {
            method: "POST",
            body: { key: transferResponse.file.key },
        });

        // Show success message
        toast.add({
            title: "Transfer created successfully",
            description: "Your files have been uploaded and are ready to share",
            icon: "i-lucide-check",
            color: "success",
        });

        navigateTo(`/send/share?t=${transferResponse.token}`);

        // Reset form
        state.title = null;
        state.message = null;
        state.files = [];
        state.downloadLimit = null;
        state.anonimize = false;
    } catch (e: any) {
        console.error("Transfer creation failed:", e);

        let title = e.statusMessage || "Transfer failed";
        let description = "Please try again";

        // Handle specific error cases
        if (e.statusCode === 413) {
            title = "File too large";
            description = e.message || "Please reduce file size and try again";
        } else if (e.statusCode === 429) {
            title = "Too many requests";
            const customMessage = e.data?.message || e.message;
            const waitTime = e.data?.waitTime;

            if (customMessage && customMessage !== e.toString()) {
                description = customMessage;
            } else if (waitTime) {
                description = `Please wait ${waitTime} seconds before trying again.`;
            } else {
                description = "Please wait before trying again.";
            }
        } else if (e.message && e.message.includes("S3 upload failed")) {
            title = "Upload failed";
            description =
                "Failed to upload file to storage. Please check your internet connection and try again.";
        } else {
            description = e.message || description;
        }
        toast.add({
            title,
            description,
            icon: "i-lucide-x",
            color: "error",
        });
    } finally {
        submitting.value = false;
    }
}

async function onMailSubmit(event: FormSubmitEvent<MailSchema>) {
    submitting.value = true;

    try {
        // TODO: Implement mail transfer functionality
        toast.add({
            title: "Mail transfer not implemented",
            description: "This feature is coming soon",
            icon: "i-lucide-info",
            color: "info",
        });
    } catch (e: any) {
        console.error("Mail transfer failed:", e);

        toast.add({
            title: "Transfer failed",
            description: e.message || "Please try again",
            icon: "i-lucide-x",
            color: "error",
        });
    } finally {
        submitting.value = false;
    }
}
</script>
