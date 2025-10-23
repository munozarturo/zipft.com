<template>
    <NuxtLayout name="auth-form">
        <div v-if="status === 'form'" class="flex flex-col gap-4">
            <h1 class="text-4xl xs:text-5xl font-semibold">Account recovery</h1>

            <span
                >Enter your account's email address and we'll send you a link
                with instructions to recover your account</span
            >

            <UForm
                :schema="schema"
                :state="state"
                class="flex flex-col gap-3"
                @submit="onSubmit"
            >
                <UFormField label="Email" name="email">
                    <UInput
                        class="w-full"
                        placeholder="john@example.com"
                        :spellcheck="false"
                        v-model="state.email"
                    />
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
                    <span class="text-left w-full">Send instructions</span>
                </UButton>
            </UForm>

            <span
                >Back to
                <ULink :to="withCallback('/auth/signin')">Sign in</ULink></span
            >
        </div>

        <div
            v-else-if="
                status === 'success' || (status === 'error' && rateLimited)
            "
            class="flex flex-col gap-4"
        >
            <h1 class="text-4xl xs:text-5xl font-semibold">Account recovery</h1>

            <span>We sent recovery instructions to your email</span>

            <div class="flex flex-col gap-4 p-4 bg-muted/20 rounded-lg border">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <UIcon name="i-lucide-mail" class="text-primary" />
                        <span class="font-medium">{{ email }}</span>
                    </div>
                    <UButton
                        color="gray"
                        variant="ghost"
                        size="2xs"
                        icon="i-lucide-pencil"
                        @click="editEmail"
                    />
                </div>

                <p class="text-sm text-muted">
                    Click the recovery link in the email to reset your password.
                </p>
            </div>

            <UButton
                color="neutral"
                trailing-icon="i-lucide-refresh-cw"
                class="group w-full cursor-pointer"
                :loading="resending"
                :disabled="resending || cooldownRemaining > 0"
                @click="resendEmail"
                :ui="{
                    trailingIcon:
                        'group-enabled:group-hover:rotate-180 group-enabled:group-focus-visible:rotate-180 transition-transform duration-300',
                }"
            >
                <span class="text-left w-full">
                    {{
                        cooldownRemaining > 0
                            ? `Resend in ${cooldownRemaining} seconds`
                            : "Resend instructions"
                    }}
                </span>
            </UButton>
        </div>

        <div v-else-if="status === 'error'" class="flex flex-col gap-4">
            <h1 class="text-4xl xs:text-5xl font-semibold">
                Account recovery error
            </h1>

            <span class="text-muted">{{ error?.message }}</span>

            <UButton
                color="neutral"
                trailing-icon="i-lucide-arrow-left"
                class="group cursor-pointer"
                @click="editEmail"
                :ui="{
                    trailingIcon:
                        'group-enabled:group-hover:-translate-x-1 group-enabled:group-focus-visible:-translate-x-1 transition-transform duration-300',
                }"
            >
                <span class="text-left w-full">Try again</span>
            </UButton>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { H3Error } from "h3";
import { FetchError } from "ofetch";
import * as y from "yup";
import { emailSchema } from "~~/shared/schema/auth";
import useCallback from "~/composables/callback";

useHead({ title: "Account recovery :: zipft" });

const { callback, withCallback } = useCallback();

const toast = useToast();

const schema = y.object({
    email: emailSchema.required("Required"),
});
type Schema = y.InferType<typeof schema>;

const route = useRoute();
const state = reactive<Schema>({
    email: (route.query.email as string) || "",
});

const status = ref<"form" | "success" | "error">("form");
const rateLimited = ref<boolean>(false);
const submitting = ref<boolean>(false);
const resending = ref<boolean>(false);
const error = ref<H3Error | null>(null);
const email = ref<string>("");

const cooldownRemaining = ref<number>(0);
let cooldownInterval: NodeJS.Timeout | null = null;

function startCooldown(seconds: number = 60) {
    cooldownRemaining.value = seconds;

    cooldownInterval = setInterval(() => {
        cooldownRemaining.value--;

        if (cooldownRemaining.value <= 0) {
            if (cooldownInterval) {
                clearInterval(cooldownInterval);
                cooldownInterval = null;
            }
        }
    }, 1000);
}

function editEmail() {
    status.value = "form";
    rateLimited.value = false;
    error.value = null;
}

async function sendResetEmail(emailAddress: string) {
    try {
        await $fetch("/api/v1/auth/recover/request", {
            method: "POST",
            body: { email: emailAddress, callback: callback.value },
        });

        email.value = emailAddress;
        status.value = "success";
        startCooldown();

        toast.add({
            title: "Recovery link sent",
            description:
                "We've sent account recovery instructions to your email.",
            icon: "i-lucide-mail",
            color: "success",
            duration: 10000,
        });
    } catch (e: any) {
        if (!(e instanceof FetchError)) {
            console.log(e);
            toast.add({
                title: "Unknown error",
                description: e?.data?.message || e?.message || "Unknown error",
                color: "error",
            });
            return;
        }

        const err = e.data as H3Error<{ waitTime?: number }>;

        if (err.statusMessage === "Rate Limit Exceeded") {
            email.value = emailAddress;
            status.value = "error";
            rateLimited.value = true;
            startCooldown(err.data?.waitTime);

            toast.add({
                title: "Too many requests",
                description:
                    "We've already sent you recovery instructions recently. Please wait before requesting new ones.",
                icon: "i-lucide-clock",
                color: "warning",
                duration: 10000,
            });
        } else {
            status.value = "error";
            error.value = err;

            toast.add({
                title: "Failed to send recovery email",
                description: err.message || "Please try again later.",
                icon: "i-lucide-x-circle",
                color: "error",
            });
        }
    }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
    submitting.value = true;
    await sendResetEmail(event.data.email);
    submitting.value = false;
}

async function resendEmail() {
    resending.value = true;
    await sendResetEmail(email.value);
    resending.value = false;
}

// Clean up interval on unmount
onUnmounted(() => {
    if (cooldownInterval) {
        clearInterval(cooldownInterval);
    }
});
</script>
