<template>
    <UCard class="w-full" variant="subtle">
        <template #header>
            <p>Account Identities</p>
        </template>
        <div class="flex flex-col gap-3">
            <div class="flex flex-row items-center justify-between">
                <div class="flex flex-row items-center gap-3">
                    <UIcon name="i-lucide-mail" class="h-6 w-6" />
                    <div class="flex flex-col">
                        <p>Email</p>
                        <span class="text-muted text-sm -mt-1.5">{{
                            $auth.user.value?.email
                        }}</span>
                    </div>
                </div>
                <div class="flex flex-row items-center gap-2">
                    <UButton
                        color="neutral"
                        variant="subtle"
                        class="cursor-pointer hidden xs:flex"
                        :loading="submitting"
                        :disabled="submitting || cooldownRemaining > 0"
                        @click="sendResetRequest"
                        size="sm"
                        :label="
                            cooldownRemaining > 0
                                ? `Send in ${cooldownRemaining} seconds`
                                : 'Reset password'
                        "
                    />
                    <FormEditEmailModal />
                </div>
            </div>
            <div class="flex w-full xs:hidden">
                <UButton
                    color="neutral"
                    variant="subtle"
                    class="cursor-pointer"
                    :loading="submitting"
                    :disabled="submitting || cooldownRemaining > 0"
                    @click="sendResetRequest"
                    size="sm"
                    :label="
                        cooldownRemaining > 0
                            ? `Send in ${cooldownRemaining} seconds`
                            : 'Reset password'
                    "
                />
            </div>
        </div>
    </UCard>
</template>

<script setup lang="ts">
import type { H3Error } from "h3";
import { FetchError } from "ofetch";
import useCallback from "~/composables/callback";

const { $auth } = useNuxtApp();
const { callback } = useCallback();
const toast = useToast();

const submitting = ref<boolean>(false);
const cooldownRemaining = ref<number>(0);
let cooldownInterval: NodeJS.Timeout | null = null;

function sendResetRequest() {
    submitting.value = true;
    const userEmail = $auth.user.value?.email;
    if (userEmail) {
        sendResetEmail(userEmail);
    }
}

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

async function sendResetEmail(emailAddress: string) {
    try {
        await $fetch("/api/v1/auth/recover/request", {
            method: "POST",
            body: { email: emailAddress, callback: callback.value },
        });

        startCooldown();

        toast.add({
            title: "Reset link sent",
            description:
                "We've sent password reset instructions to your email.",
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
            startCooldown(err.data?.waitTime);

            toast.add({
                title: "Too many requests",
                description:
                    "We've already sent you an email with reset instructions recently. Please wait before requesting a new one.",
                icon: "i-lucide-clock",
                color: "warning",
                duration: 10000,
            });
        } else {
            toast.add({
                title: "Failed to send reset email",
                description: err.message || "Please try again later.",
                icon: "i-lucide-x-circle",
                color: "error",
            });
        }
    } finally {
        submitting.value = false;
    }
}

onUnmounted(() => {
    if (cooldownInterval) {
        clearInterval(cooldownInterval);
    }
});
</script>
