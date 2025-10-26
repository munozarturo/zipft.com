<template>
    <NuxtLayout name="auth-form">
        <div class="flex flex-col gap-4">
            <h1 class="text-3xl xs:text-4xl font-semibold">
                <span class="flex flex-row">
                    {{ "Welcome" + ` ${firstName}` }}
                    <p
                        v-if="
                            (isNameFieldFocused || !state.name) &&
                            !completedFirstName
                        "
                        class="animate-blink"
                    >
                        _
                    </p>
                </span>
            </h1>

            <span>This is how other people will see you</span>

            <UserCard
                :name="state.name"
                :email="$auth.user?.value?.email"
                :avatar-src="
                    state.avatar
                        ? createObjectUrl(state.avatar)
                        : $auth.user?.value?.avatarUrl || undefined
                "
                :show-verified-badge="!isNameFieldFocused"
            />

            <UForm
                :schema="schema"
                :state="state"
                class="flex flex-col gap-3"
                @submit="onSubmit"
            >
                <UFormField label="Name" name="name">
                    <UInput
                        ref="nameInput"
                        class="w-full"
                        placeholder="John Doe"
                        :spellcheck="false"
                        v-model="state.name"
                        @focus="isNameFieldFocused = true"
                        @blur="isNameFieldFocused = false"
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
                                :label="state.avatar ? 'Change' : 'Upload'"
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
                <UButton
                    type="submit"
                    color="neutral"
                    trailing-icon="i-lucide-arrow-right"
                    class="group cursor-pointer"
                    :loading="submitting"
                    :disabled="submitting"
                    :ui="{
                        trailingIcon:
                            'group-enabled:group-hover:translate-x-1 group-enabled:group-focus-visible:translate-x-1 transition-transform duration-300',
                    }"
                >
                    <span class="text-left w-full">Continue</span>
                </UButton>
                <span class="text-sm text-muted"
                    >Don't worry, you can update these details anytime</span
                >
            </UForm>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as y from "yup";
import useCallback from "~/composables/callback";
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

const { callback } = useCallback();
const toast = useToast();

useHead({ title: "Welcome :: zipft" });

definePageMeta({
    middleware: (to) => {
        const { $auth } = useNuxtApp();
        const { callback, withCallback } = useCallback(to);

        if (!$auth.isAuthenticated.value) {
            return navigateTo(withCallback("/auth/signin", to.fullPath));
        }

        if ($auth.user?.value?.onboarded) {
            return navigateTo(callback.value || "/dashboard");
        }
    },
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
    name: y
        .string()
        .required()
        .min(1, "Please enter a name.")
        .max(20, "Name is too long."),
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

const firstName = computed(() => state.name?.split(" ")[0] || "");

const completedFirstName = computed(() =>
    state.name ? state.name?.split(" ").length > 1 : false
);

const status = ref<"pending" | "success" | "error">("pending");
const submitting = ref<boolean>(false);
const isNameFieldFocused = ref<boolean>(false);

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

        // Navigate to dashboard after successful completion
        window.location.replace(callback.value || "/dashboard");
    } catch (e: any) {
        let title = e.statusMessage || "Upload failed";
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
        console.error("Upload failed:", e);
        status.value = "error";
    } finally {
        submitting.value = false;
    }
}
</script>

<style scoped>
@keyframes blink {
    0%,
    50% {
        opacity: 1;
    }
    51%,
    100% {
        opacity: 0;
    }
}

.animate-blink {
    animation: blink 1s infinite;
}
</style>
