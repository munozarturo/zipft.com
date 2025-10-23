<template>
    <UCard class="w-full" variant="subtle">
        <template #header>
            <p>Request for account deletion</p>
        </template>

        <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-3">
                <p class="text-sm text-muted">
                    Deleting your account is permanent and cannot be undone.
                    Your data will be deleted within 30 days, except we may
                    retain some metadata and logs for longer where required or
                    permitted by law.
                </p>
            </div>
        </div>

        <template #footer>
            <UButton
                color="error"
                variant="solid"
                class="cursor-pointer"
                :loading="submitting"
                :disabled="submitting"
                @click="requestDeletion"
                size="sm"
            >
                <span class="text-left w-full">Request to delete account</span>
            </UButton>
        </template>
    </UCard>
</template>

<script setup lang="ts">
const toast = useToast();
const submitting = ref<boolean>(false);

async function requestDeletion() {
    submitting.value = true;

    try {
        await $fetch("/api/v1/auth/delete/request", {
            method: "POST",
        });

        toast.add({
            title: "Account deletion requested",
            description:
                "A confirmation email has been sent to your email address. Please check your inbox and click the link to complete the account deletion.",
            icon: "i-lucide-mail",
            color: "success",
            duration: 8000,
        });
    } catch (e: any) {
        let title = "Account deletion request failed";
        let description = "An unexpected error occurred. Please try again.";

        if (e.statusCode === 401) {
            title = "Authentication required";
            description = "Please sign in to request account deletion.";
        } else if (e.statusCode === 429) {
            title = "Too many requests";

            // Try to extract the custom message from different possible locations
            const customMessage = e.data?.message || e.message;
            const waitTime = e.data?.waitTime;

            if (customMessage && customMessage !== e.toString()) {
                description = customMessage;
            } else if (waitTime) {
                description = `Please wait ${waitTime} seconds before requesting another deletion email.`;
            } else {
                description =
                    "Please wait before requesting another deletion email.";
            }
        } else if (e.statusCode >= 500) {
            title = "Server error";
            description =
                "Our servers are experiencing issues. Please try again later.";
        }

        toast.add({
            title,
            description,
            icon: "i-lucide-x",
            color: "error",
            duration: 6000,
        });
    } finally {
        submitting.value = false;
    }
}
</script>
