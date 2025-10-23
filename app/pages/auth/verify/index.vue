<template>
    <NuxtLayout name="auth-form">
        <div class="flex flex-col gap-2" v-if="status === 'pending'">
            <USkeleton class="h-10 xs:h-12 w-[220px] xs:w-[350px] mb-4" />
            <USkeleton class="h-4 w-[300px] mb-6" />
            <USkeleton class="h-32 w-full mb-4" />
            <USkeleton class="h-10 w-32" />
        </div>
        <div v-else-if="status === 'success'" class="flex flex-col gap-4">
            <h1 class="text-4xl xs:text-5xl font-semibold">Account verified</h1>

            <span>Your account has been successfully verified.</span>

            <UButton
                color="neutral"
                trailing-icon="i-lucide-arrow-right"
                class="group w-full cursor-pointer"
                @click="navigateTo(withCallback('/auth/signin'))"
                :ui="{
                    trailingIcon:
                        'group-enabled:group-hover:translate-x-1 group-enabled:group-focus-visible:translate-x-1 transition-transform duration-300',
                }"
            >
                <span class="text-left w-full"> Sign in </span>
            </UButton>
        </div>
        <div v-else-if="status === 'error'" class="flex flex-col gap-4">
            <h1 class="text-4xl xs:text-5xl font-semibold">
                Verification error
            </h1>

            <span class="text-muted">{{ error?.message }}</span>

            <span
                >Try again?
                <ULink :to="withCallback('/auth/signin')">Sign in</ULink></span
            >
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
import type { H3Error } from "h3";
import { FetchError } from "ofetch";
import useCallback from "~/composables/callback";

useHead({ title: "Verify account :: zipft" });

const { withCallback } = useCallback();

const toast = useToast();

const route = useRoute();
const token = route.query.t as string | undefined;

const status = ref<"pending" | "success" | "error">("pending");
const error = ref<H3Error | null>(null);

const verify = async (token: string | undefined) => {
    try {
        await $fetch("/api/v1/auth/verify", {
            method: "POST",
            body: { token },
        });
        toast.add({
            title: "Account verified",
            description: "Your account has been verified.",
            icon: "i-lucide-check-circle",
            color: "success",
        });
        status.value = "success";
    } catch (e: any) {
        status.value = "error";

        if (!(e instanceof FetchError)) {
            console.log(e);
            toast.add({
                title: "Unknown error",
                description: e?.data?.message || e?.message || "Unknown error",
                color: "error",
            });
            return;
        }

        error.value = e.data as H3Error;
        if (error.value.statusCode === 409) {
            toast.add({
                title: "Account already verified",
                description:
                    "This email address is already verified. Please sign in.",
                icon: "i-lucide-check-circle",
                color: "success",
            });
            navigateTo(withCallback("/auth/signin"));
            status.value = "success";
        }
    }
};

onMounted(async () => {
    await verify(token);
});
</script>
