<template>
    <div class="flex flex-col gap-4">
        <UForm :schema="schema" :state="state" @submit="onSubmit">
            <UCard class="w-full" variant="subtle">
                <template #header>
                    <p>Profile Information</p>
                </template>

                <div class="flex flex-col gap-4">
                    <UCard class="w-full xs:max-w-[400px]">
                        <div class="flex flex-row items-center gap-3">
                            <UAvatar
                                size="3xl"
                                :alt="avatarAlt"
                                :src="
                                    state.avatar
                                        ? createObjectUrl(state.avatar)
                                        : $auth.user?.value?.avatarUrl
                                "
                                :ui="{
                                    root: rootColor,
                                    fallback: 'text-white',
                                }"
                            />
                            <div class="flex flex-col">
                                <div
                                    v-if="state.name"
                                    class="flex flex-row gap-1 items-center -mt-1"
                                >
                                    <p>
                                        <span>{{ state.name }}</span>
                                    </p>
                                    <UTooltip
                                        :delay-duration="0"
                                        text="Email verified"
                                    >
                                        <UIcon
                                            name="i-lucide-badge-check"
                                            class="size-4 text-blue-500"
                                        />
                                    </UTooltip>
                                </div>
                                <div
                                    class="flex flex-row gap-1 items-center -mt-1"
                                >
                                    <p
                                        class="text-muted text-xs sm:text-sm leading-tight"
                                    >
                                        <span>{{
                                            $auth.user?.value?.email
                                        }}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </UCard>

                    <div class="flex flex-col gap-3">
                        <UFormField label="Name" name="name">
                            <UInput
                                ref="nameInput"
                                class="w-full"
                                placeholder="John Doe"
                                :spellcheck="false"
                                v-model="state.name"
                            />
                        </UFormField>
                        <UFormField name="avatar" label="Avatar">
                            <UFileUpload
                                v-slot="{ open, removeFile }"
                                v-model="state.avatar"
                                accept="image/*"
                            >
                                <div class="flex flex-row items-center gap-2">
                                    <UButton
                                        class="w-full"
                                        :label="
                                            state.avatar ? 'Change' : 'Upload'
                                        "
                                        icon="i-lucide-upload"
                                        color="neutral"
                                        variant="outline"
                                        @click="open()"
                                    />
                                    <UButton
                                        v-if="state.avatar"
                                        class="w-fit"
                                        icon="i-lucide-trash-2"
                                        color="error"
                                        variant="solid"
                                        @click="removeFile()"
                                    />
                                </div>
                            </UFileUpload>
                        </UFormField>
                    </div>
                </div>

                <template #footer>
                    <div class="flex flex-row justify-end">
                        <UButton
                            type="submit"
                            color="neutral"
                            class="group cursor-pointer"
                            :loading="submitting"
                            :disabled="submitting || !hasChanges"
                            size="sm"
                        >
                            <span class="text-left w-full">Save</span>
                        </UButton>
                    </div>
                </template>
            </UCard>
        </UForm>
    </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as y from "yup";
import CryptoJS from "crypto-js";

interface UserUpdateResponse {
    path: URL;
    avatar?: {
        key: string;
        path: string;
        method: string;
        url: string;
    } | null;
}

interface UploadResponse {
    path: URL;
    url: string;
    fields: Record<string, string>;
}

const { $auth } = useNuxtApp();
const toast = useToast();

const colors = [
    "bg-blue-800",
    "bg-pink-800",
    "bg-green-800",
    "bg-purple-800",
    "bg-yellow-800",
    "bg-red-800",
];

const rootColor = computed(() => {
    const key = $auth.user?.value?.email || "";

    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        const char = key.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }

    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex];
});

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
        Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
    );
};

const schema = y.object({
    name: y.string().required().min(1, "Please enter a name."),
    avatar: y
        .mixed<File>()
        .test(
            "fileType",
            "Please upload a valid image file (JPEG, PNG, or WebP).",
            (value) => {
                if (!value) return true; // Optional field
                return (
                    value instanceof File &&
                    ACCEPTED_IMAGE_TYPES.includes(value.type)
                );
            }
        )
        .test(
            "fileSize",
            `The image is too large. Please choose an image smaller than ${formatBytes(MAX_FILE_SIZE)}.`,
            (value) => {
                if (!value) return true; // Optional field
                return value instanceof File && value.size <= MAX_FILE_SIZE;
            }
        )
        .optional(),
});

type Schema = y.InferType<typeof schema>;

const state = reactive<Partial<Schema>>({
    name: $auth.user?.value?.name || "",
    avatar: undefined,
});

const originalName = computed(() => $auth.user?.value?.name || "");

const hasChanges = computed(() => {
    return state.name !== originalName.value || state.avatar !== undefined;
});

const firstName = computed(() => state.name?.split(" ")[0] || "");

const avatarAlt = computed(() => {
    const trimmedName = firstName.value.trim();
    if (trimmedName === "") return $auth.user?.value?.email || "";
    return trimmedName;
});

const submitting = ref<boolean>(false);

function createObjectUrl(file: File): string {
    return URL.createObjectURL(file);
}

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

async function onSubmit(event: FormSubmitEvent<Schema>) {
    submitting.value = true;

    try {
        let avatarData = null;

        if (event.data.avatar) {
            const md5Hash = await calculateMD5(event.data.avatar);
            avatarData = {
                name: event.data.avatar.name,
                type: event.data.avatar.type,
                md5: md5Hash,
                size: event.data.avatar.size,
            };
        }

        const response = await $fetch<UserUpdateResponse>("/api/v1/user", {
            method: "PATCH",
            body: {
                name: event.data.name,
                avatar: avatarData,
            },
        });

        // If avatar was uploaded, handle the upload process
        if (response.avatar && event.data.avatar) {
            // Get presigned URL for upload
            const uploadResponse = await $fetch<UploadResponse>(
                "/api/v1/object/upload",
                {
                    method: "POST",
                    body: { key: response.avatar.key },
                }
            );

            // Upload to S3 using presigned URL
            const s3FormData = new FormData();
            Object.entries(uploadResponse.fields).forEach(([key, value]) => {
                s3FormData.append(key, value as string);
            });
            s3FormData.append("file", event.data.avatar);

            await $fetch(uploadResponse.url, {
                method: "POST",
                body: s3FormData,
            });

            // Verify the upload
            await $fetch("/api/v1/object/verify", {
                method: "POST",
                body: { key: response.avatar.key },
            });
        }

        // Show success message
        toast.add({
            title: "Profile updated",
            description:
                "Your profile has been successfully updated. It might take a couple of minutes for updates to be reflected universally.",
            icon: "i-lucide-check",
            color: "success",
        });

        await $auth.fetch();

        state.avatar = undefined;
    } catch (e: any) {
        let title = e.statusMessage || "Update failed";
        let description = "Please try again";

        // Handle specific error cases
        if (e.statusCode === 429) {
            title = "Too many requests";

            // Try to extract the custom message from different possible locations
            const customMessage = e.data?.message || e.message;
            const waitTime = e.data?.waitTime;

            if (customMessage && customMessage !== e.toString()) {
                description = customMessage;
            } else if (waitTime) {
                description = `Please wait ${waitTime} seconds before trying again.`;
            } else {
                description = "Please wait before trying again.";
            }
        } else {
            description = e.message || description;
        }

        toast.add({
            title,
            description,
            icon: "i-lucide-x",
            color: "error",
        });
        console.error("Update failed:", e);
    } finally {
        submitting.value = false;
    }
}
</script>
