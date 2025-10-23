<template>
    <NuxtLayout name="auth-form" content="long">
        <div v-if="pending" class="flex flex-col gap-2">
            <USkeleton class="h-10 xs:h-12 w-[220px] xs:w-[350px] mb-4" />
            <USkeleton class="h-4 w-[300px] mb-6" />
            <USkeleton class="h-32 w-full mb-4" />
            <USkeleton class="h-10 w-32" />
        </div>
        <div v-else-if="error" class="flex flex-col gap-4">
            <h1 class="text-3xl xs:text-4xl font-semibold">
                {{ errorTitle }}
            </h1>

            <span>{{ errorMessage }}</span>

            <UButton
                to="/settings/account"
                label="Request new transfer"
                color="neutral"
                variant="solid"
                icon="i-lucide-mail"
            />
        </div>
        <div v-else class="flex flex-col gap-4">
            <h1 class="text-3xl xs:text-4xl font-semibold">Account Transfer</h1>

            <span>
                Transfer this account to
                {{ data?.transfer?.email }}
            </span>

            <UserCard
                :name="data?.user?.name || ''"
                :email="data?.user?.email || ''"
                :avatar-src="data?.user?.avatarUrl || undefined"
                :show-verified-badge="true"
            />

            <div class="flex flex-col gap-3">
                <h3 class="font-semibold text-lg">What happens next?</h3>
                <div class="flex flex-col gap-2 text-sm text-muted">
                    <div class="flex items-start gap-2">
                        <UIcon name="i-lucide-mail" class="size-4 mt-0.5" />
                        <span
                            >The email address for this account will be changed
                            to {{ data?.transfer?.email }}</span
                        >
                    </div>
                    <div class="flex items-start gap-2">
                        <UIcon name="i-lucide-user" class="size-4 mt-0.5" />
                        <span
                            >Your profile information (name, avatar) will remain
                            the same</span
                        >
                    </div>
                    <div class="flex items-start gap-2">
                        <UIcon name="i-lucide-key" class="size-4 mt-0.5" />
                        <span
                            >You'll need to sign in with your new email address
                            after the transfer</span
                        >
                    </div>
                    <div class="flex items-start gap-2">
                        <UIcon
                            name="i-lucide-shield-check"
                            class="size-4 mt-0.5"
                        />
                        <span
                            >Your account security settings and data will be
                            preserved</span
                        >
                    </div>
                </div>
            </div>

            <UForm
                :schema="transferSchema"
                :state="transferState"
                class="flex flex-col gap-3 mt-2"
                @submit="onTransferSubmit"
            >
                <UButton
                    type="submit"
                    color="neutral"
                    trailing-icon="i-lucide-arrow-right"
                    class="group"
                    :loading="transferSubmitting"
                    :disabled="transferSubmitting"
                    :ui="{
                        trailingIcon:
                            'group-enabled:group-hover:translate-x-1 group-enabled:group-focus-visible:translate-x-1 transition-transform duration-300',
                    }"
                >
                    <span class="text-left w-full">Confirm Transfer</span>
                </UButton>
            </UForm>

            <span class="text-sm text-muted">
                This action cannot be undone.
            </span>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
import * as y from "yup";
import type { FormSubmitEvent } from "@nuxt/ui";

useHead({ title: "Account Transfer :: zipft" });

const route = useRoute();
const token = route.query.t as string | undefined;
const toast = useToast();

interface Transfer {
    user:
        | {
              id: string;
              email: string;
              name: string | null;
              avatarUrl: string | null;
              verified: boolean;
          }
        | undefined;
    transfer: {
        email: string;
        cratedAt: Date;
        expiresAt: Date;
    };
}

const { pending, data, error } = useFetch<Transfer>("/api/v1/auth/transfer", {
    method: "GET",
    query: { token },
});

const errorTitle = computed(() => {
    if (!error.value) return "";

    switch (error.value.statusCode) {
        case 400:
            return "Invalid Transfer Token";
        case 409:
            return "Transfer Already Completed";
        case 410:
            if (error.value.statusMessage === "Token Expired") {
                return "Transfer Token Expired";
            }
            return "Transfer Superseded";
        case 404:
            return "Transfer Not Found";
        default:
            return "Something Went Wrong";
    }
});

const errorMessage = computed(() => {
    if (!error.value) return "";

    switch (error.value.statusCode) {
        case 400:
            return "The transfer link you followed is not valid. Please check the link or request a new transfer.";
        case 409:
            return "This account transfer has already been completed successfully. You can now sign in with your new email address.";
        case 410:
            if (error.value.statusMessage === "Token Expired") {
                return "This transfer link has expired. For security reasons, transfer links are only valid for a limited time.";
            }
            return "This transfer link has been replaced by a newer one. Please check your email for the most recent transfer link.";
        case 404:
            return "The transfer you're looking for could not be found. The link may be incorrect or the transfer may have been cancelled.";
        default:
            return "We encountered an unexpected error while processing your transfer. Please try again or contact support if the problem persists.";
    }
});

// Transfer form
const transferSchema = y.object({});
type TransferSchema = y.InferType<typeof transferSchema>;

const transferState = reactive<TransferSchema>({});

const transferSubmitting = ref<boolean>(false);

async function onTransferSubmit(event: FormSubmitEvent<TransferSchema>) {
    transferSubmitting.value = true;

    try {
        await $fetch("/api/v1/auth/transfer", {
            method: "POST",
            body: { token },
        });

        toast.add({
            title: "Account transfer completed",
            description:
                "Your account has been successfully transferred. You can now sign in with your new email address.",
            icon: "i-lucide-check-circle",
            color: "success",
        });

        await navigateTo("/auth/signin");
    } catch (e: any) {
        let title = "Transfer failed";
        let description = "An error occurred while processing the transfer.";

        if (e.statusCode === 400) {
            title = "Invalid transfer token";
            description = "The transfer token is invalid or malformed.";
        } else if (e.statusCode === 409) {
            title = "Transfer already completed";
            description =
                "This transfer has already been completed successfully.";
        } else if (e.statusCode === 410) {
            if (e.statusMessage === "Token Expired") {
                title = "Transfer token expired";
                description =
                    "This transfer token has expired. Please request a new transfer.";
            } else if (e.statusMessage === "Token Superseded") {
                title = "Transfer token superseded";
                description =
                    "This transfer token has been replaced by a newer one. Please check your email for the latest transfer link.";
            }
        }

        toast.add({
            title,
            description,
            icon: "i-lucide-x",
            color: "error",
        });
    } finally {
        transferSubmitting.value = false;
    }
}
</script>
