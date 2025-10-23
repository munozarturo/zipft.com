<template>
    <NuxtLayout name="auth-form">
        <div v-if="status === 'pending'">
            <USkeleton class="h-10 xs:h-12 w-[220px] xs:w-[350px] mb-4" />
            <USkeleton class="h-4 w-[300px] mb-6" />
            <USkeleton class="h-32 w-full mb-4" />
            <USkeleton class="h-10 w-32" />
        </div>
        <div
            v-else-if="
                status === 'success' || (status === 'error' && rateLimited)
            "
            class="flex flex-col gap-4"
        >
            <h1 class="text-4xl xs:text-5xl font-semibold">Verify account</h1>

            <span>We sent a verification link to your email</span>

            <div class="flex flex-col gap-4 p-4 bg-muted/20 rounded-lg border">
                <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-mail" class="text-primary" />
                    <span class="font-medium">{{ email }}</span>
                </div>
                <p class="text-sm text-muted">
                    Click the verification link in the email to activate your
                    account.
                </p>
            </div>

            <UButton
                color="neutral"
                trailing-icon="i-lucide-refresh-cw"
                class="group w-full"
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
                            : "Resend verification email"
                    }}
                </span>
            </UButton>

            <span class="text-sm text-muted"
                >Didn't receive the email?
                <ULink :to="withCallback('/auth/signin')"
                    >try signing in</ULink
                ></span
            >
        </div>
        <div v-else>
            <h1 class="text-4xl xs:text-5xl font-semibold">
                Verification error
            </h1>

            <span>{{ error?.message }}</span>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
import type { H3Error } from "h3";
import { FetchError } from "ofetch";
import useCallback from "~/composables/callback";

useHead({ title: "Verify account :: zipft" });

const { callback, withCallback } = useCallback();

const toast = useToast();

const route = useRoute();
const email = route.query.e;
if (!email) {
    navigateTo("/auth/signin");
}

const status = ref<"pending" | "success" | "error">("pending");
const rateLimited = ref<boolean>(false);

const resending = ref<boolean>(false);
const error = ref<H3Error | null>(null);

const cooldownRemaining = ref<number>(0);
let cooldownInterval: NodeJS.Timeout | null = null;

function startCooldown(seconds: number = 60) {
    cooldownRemaining.value = seconds; // 1 minute

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

async function sendEmail() {
    try {
        await $fetch("/api/v1/auth/verify/request", {
            method: "POST",
            body: { email: email, callback: callback.value },
        });

        status.value = "success";
        startCooldown();
        toast.add({
            title: "Check your inbox",
            description: "We've sent a verification email to your inbox.",
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
            // Rate limited - show success state but with cooldown already active
            status.value = "error";
            rateLimited.value = true;
            startCooldown(err.data?.waitTime);

            toast.add({
                title: "Too many requests",
                description:
                    "We've already sent you a verification email recently. Please wait before requesting a new one.",
                icon: "i-lucide-clock",
                color: "warning",
                duration: 10000,
            });
        } else if (err.statusMessage === "Already Verified") {
            toast.add({
                title: "Account already verified",
                description: "This email address is already verified.",
                icon: "i-lucide-check-circle",
                color: "success",
            });
            navigateTo(withCallback(`/auth/signin?email=${email}`));
        } else if (err.statusMessage === "User Not Found") {
            toast.add({
                title: "Account not found",
                description: `No account found for ${email}.`,
                icon: "i-lucide-user-plus",
                color: "warning",
            });
            navigateTo(withCallback(`/auth/signup?email=${email}`));
        } else {
            status.value = "error";
            error.value = err;
            toast.add({
                title: "Failed to send email",
                description: err.message || "Please try again later.",
                icon: "i-lucide-x-circle",
                color: "error",
            });
        }
    }
}

async function resendEmail() {
    resending.value = true;

    try {
        await $fetch("/api/v1/auth/verify/request", {
            method: "POST",
            body: { email: email, callback: callback.value },
        });

        toast.add({
            title: "Email sent",
            description: "We've sent another verification email to your inbox.",
            icon: "i-lucide-mail-check",
            color: "success",
        });

        startCooldown();
    } catch (e: any) {
        if (!(e instanceof FetchError)) {
            console.log(e);
            toast.add({
                title: "Unknown error",
                description: e?.data?.message || e?.message || "Unknown error",
                icon: "i-lucide-alert-circle",
                color: "error",
            });
            return;
        }

        const err = e.data as H3Error<{ waitTime?: number }>;

        if (err.statusMessage === "Rate Limit Exceeded") {
            toast.add({
                title: "Too many requests",
                description: "Please wait before requesting another email.",
                icon: "i-lucide-clock",
                color: "warning",
            });
            startCooldown();
        } else if (err.statusMessage === "Already Verified") {
            toast.add({
                title: "Account already verified",
                description: "This email address is already verified.",
                icon: "i-lucide-check-circle",
                color: "success",
            });
            navigateTo(withCallback(`/auth/signin?email=${email}`));
        } else if (err.statusMessage === "User Not Found") {
            toast.add({
                title: "Account not found",
                description: `No account found for ${email}.`,
                icon: "i-lucide-user-plus",
                color: "warning",
            });
            navigateTo(withCallback(`/auth/signup?email=${email}`));
        } else {
            toast.add({
                title: "Failed to resend",
                description: err.message || "Please try again later.",
                icon: "i-lucide-x-circle",
                color: "error",
            });
        }
    } finally {
        resending.value = false;
    }
}

// Send email on page load
onMounted(() => {
    sendEmail();
});

// Clean up interval on unmount
onUnmounted(() => {
    if (cooldownInterval) {
        clearInterval(cooldownInterval);
    }
});
</script>
