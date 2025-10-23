<template>
    <NuxtLayout name="auth-form" :content="deletionComplete ? 'short' : 'long'">
        <div v-if="pending" class="flex flex-col gap-2">
            <USkeleton class="h-10 xs:h-12 w-[220px] xs:w-[350px] mb-4" />
            <USkeleton class="h-4 w-[300px] mb-6" />
            <USkeleton class="h-32 w-full mb-4" />
            <USkeleton class="h-10 w-32" />
        </div>
        <div v-else-if="error && !deletionComplete" class="flex flex-col gap-4">
            <h1 class="text-3xl xs:text-4xl font-semibold">
                {{ errorTitle }}
            </h1>

            <span>{{ errorMessage }}</span>

            <UButton
                to="/settings/account"
                label="Request new deletion"
                color="neutral"
                variant="solid"
                icon="i-lucide-mail"
            />
        </div>
        <div v-else-if="deletionComplete" class="flex flex-col gap-4">
            <h1 class="text-3xl xs:text-4xl font-semibold">Account Deleted</h1>
            <span class="text-muted">
                Your account has been successfully deleted. All your data has
                been removed from our systems.
            </span>
            <span class="text-muted">
                Thank you for using zipft. If you change your mind, you can
                always create a new account.
            </span>
        </div>
        <div v-else class="flex flex-col gap-4">
            <h1 class="text-3xl xs:text-4xl font-semibold">Account Deletion</h1>

            <span> You are about to permanently delete your account. </span>

            <UserCard
                :name="data?.user?.name || ''"
                :email="data?.user?.email || ''"
                :avatar-src="data?.user?.avatarUrl || undefined"
                :show-verified-badge="true"
            />

            <div class="flex flex-col gap-3">
                <h3 class="font-semibold text-lg">What will happen?</h3>
                <div class="flex flex-col gap-2 text-sm text-muted">
                    <div class="flex items-start gap-2">
                        <UIcon name="i-lucide-trash-2" class="size-4 mt-0.5" />
                        <span
                            >Your account and all associated data will be
                            permanently deleted</span
                        >
                    </div>
                    <div class="flex items-start gap-2">
                        <UIcon name="i-lucide-user-x" class="size-4 mt-0.5" />
                        <span
                            >Your profile information, settings, and preferences
                            will be lost</span
                        >
                    </div>
                    <div class="flex items-start gap-2">
                        <UIcon name="i-lucide-mail-x" class="size-4 mt-0.5" />
                        <span
                            >You will no longer be able to access your account
                            or recover your data</span
                        >
                    </div>
                    <div class="flex items-start gap-2">
                        <UIcon name="i-lucide-clock" class="size-4 mt-0.5" />
                        <span
                            >This action cannot be undone and is
                            irreversible</span
                        >
                    </div>
                </div>
            </div>

            <UForm
                :schema="deletionSchema"
                :state="deletionState"
                class="flex flex-col gap-3 mt-2"
                @submit="onDeletionSubmit"
            >
                <UFormField name="confirmation">
                    <UCheckbox
                        v-model="deletionState.confirmation"
                        :ui="{ label: 'text-sm' }"
                    >
                        <template #label>
                            I understand that this action is permanent and
                            cannot be undone. I want to permanently delete my
                            account and all associated data.
                        </template>
                    </UCheckbox>
                </UFormField>

                <UButton
                    type="submit"
                    color="error"
                    trailing-icon="i-lucide-trash-2"
                    class="group"
                    :loading="deletionSubmitting"
                    :disabled="
                        deletionSubmitting || !deletionState.confirmation
                    "
                >
                    <span class="text-left w-full"
                        >Permanently Delete Account</span
                    >
                </UButton>
            </UForm>

            <span class="text-sm text-muted">
                This action is permanent and cannot be undone.
            </span>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
import * as y from "yup";
import type { FormSubmitEvent } from "@nuxt/ui";

useHead({ title: "Account Deletion :: zipft" });

const route = useRoute();
const token = route.query.t as string | undefined;
const toast = useToast();

interface DeletionRequest {
    user: {
        id: string;
        email: string;
        name: string | null;
        avatarUrl: string | null;
        verified: boolean;
    };
    request: {
        createdAt: Date;
        expiresAt: Date;
    };
}

const { pending, data, error } = useFetch<DeletionRequest>(
    "/api/v1/auth/delete",
    {
        method: "GET",
        query: { token },
    }
);

const deletionComplete = ref(false);

const errorTitle = computed(() => {
    if (!error.value) return "";

    switch (error.value.statusCode) {
        case 400:
            return "Invalid Deletion Token";
        case 409:
            // If already used, show success state instead of error
            deletionComplete.value = true;
            return "";
        case 410:
            return "Deletion Token Expired";
        case 404:
            return "User Not Found";
        default:
            return "Something Went Wrong";
    }
});

const errorMessage = computed(() => {
    if (!error.value) return "";

    switch (error.value.statusCode) {
        case 400:
            return "The deletion link you followed is not valid. Please check the link or request a new deletion.";
        case 409:
            return ""; // Handled by success state
        case 410:
            return "This deletion link has expired. For security reasons, deletion links are only valid for a limited time.";
        case 404:
            return "The user account could not be found. The link may be incorrect or the account may have already been deleted.";
        default:
            return "We encountered an unexpected error while processing your deletion request. Please try again or contact support if the problem persists.";
    }
});

// Handle 409 (already used) by showing success state
watch(
    error,
    (newError) => {
        if (newError?.statusCode === 409) {
            deletionComplete.value = true;
        }
    },
    { immediate: true }
);

// Deletion form
const deletionSchema = y.object({
    confirmation: y
        .boolean()
        .oneOf(
            [true],
            "You must confirm that you understand this action is permanent"
        ),
});
type DeletionSchema = y.InferType<typeof deletionSchema>;

const deletionState = reactive<DeletionSchema>({
    confirmation: false,
});

const deletionSubmitting = ref<boolean>(false);

async function onDeletionSubmit(event: FormSubmitEvent<DeletionSchema>) {
    deletionSubmitting.value = true;

    try {
        await $fetch("/api/v1/auth/delete", {
            method: "POST",
            query: { token },
        });

        toast.add({
            title: "Account deleted successfully",
            description:
                "Your account has been permanently deleted. All your data has been removed from our systems.",
            icon: "i-lucide-check-circle",
            color: "success",
            duration: 10000,
        });

        // Show success state
        deletionComplete.value = true;
    } catch (e: any) {
        let title = "Deletion failed";
        let description = "An error occurred while processing the deletion.";

        if (e.statusCode === 400) {
            title = "Invalid deletion token";
            description = "The deletion token is invalid or malformed.";
        } else if (e.statusCode === 409) {
            title = "Account already deleted";
            description = "This account has already been deleted successfully.";
            // Show success state for already deleted
            deletionComplete.value = true;
            return;
        } else if (e.statusCode === 410) {
            title = "Deletion token expired";
            description =
                "This deletion token has expired. Please request a new deletion.";
        } else if (e.statusCode === 404) {
            title = "User not found";
            description =
                "The user account could not be found. It may have already been deleted.";
        } else if (e.statusCode === 429) {
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
        }

        toast.add({
            title,
            description,
            icon: "i-lucide-x",
            color: "error",
        });
    } finally {
        deletionSubmitting.value = false;
    }
}
</script>
