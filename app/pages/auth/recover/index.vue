<template>
    <NuxtLayout name="auth-form">
        <div class="flex flex-col gap-2" v-if="status === 'pending'">
            <USkeleton class="h-10 xs:h-12 w-[220px] xs:w-[350px] mb-4" />
            <USkeleton class="h-4 w-[300px] mb-6" />
            <USkeleton class="h-32 w-full mb-4" />
            <USkeleton class="h-10 w-32" />
        </div>
        <div v-else-if="status === 'success'" class="flex flex-col gap-4">
            <h1 class="text-4xl xs:text-5xl font-semibold">Account recovery</h1>

            <span>Enter your new password below</span>

            <UForm
                :schema="schema"
                :state="state"
                class="flex flex-col gap-3"
                @submit="onSubmit"
            >
                <UFormField
                    label="New Password"
                    name="password"
                    :ui="{ error: 'hidden' }"
                >
                    <UPasswordInput
                        class="w-full"
                        placeholder="New password"
                        v-model="state.password"
                        :checkStrength="true"
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
                    <span class="text-left w-full">Reset password</span>
                </UButton>

                <span
                    >Changed your mind?
                    <ULink :to="withCallback('/auth/signin')"
                        >Sign in</ULink
                    ></span
                >
            </UForm>
        </div>
        <div v-else-if="status === 'error'" class="flex flex-col gap-4">
            <h1 class="text-4xl xs:text-5xl font-semibold">
                Account recovery error
            </h1>

            <span class="text-muted">{{ error?.message }}</span>

            <span
                ><ULink :to="withCallback('/auth/recover/request')"
                    >Request new link</ULink
                ></span
            >
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { H3Error } from "h3";
import { FetchError } from "ofetch";
import * as y from "yup";
import { passwordSchema } from "~~/shared/schema/auth";
import useCallback from "~/composables/callback";

useHead({ title: "Account recovery :: zipft" });

const { withCallback } = useCallback();

const toast = useToast();

const schema = y.object({
    password: passwordSchema.required("Required"),
});
type Schema = y.InferType<typeof schema>;

const route = useRoute();
const token = route.query.t as string | undefined;

const state = reactive<Schema>({
    password: "",
});

const status = ref<"pending" | "success" | "error">("pending");
const error = ref<H3Error | null>(null);
const submitting = ref<boolean>(false);

const resetPassword = async (token: string | undefined) => {
    if (!token) {
        status.value = "error";
        error.value = {
            statusCode: 400,
            statusMessage: "Invalid Token",
            message: "No recovery token provided.",
        } as H3Error;
        return;
    }

    status.value = "success";
};

async function onSubmit(event: FormSubmitEvent<Schema>) {
    submitting.value = true;

    try {
        await $fetch("/api/v1/auth/recover", {
            method: "POST",
            body: {
                token,
                password: event.data.password,
            },
        });

        toast.add({
            title: "Password changed",
            description: "You successfully changed your password.",
            icon: "i-lucide-check-circle",
            color: "success",
        });

        await navigateTo(withCallback("/auth/signin"));
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

        const err = e.data as H3Error;
        if (err.statusCode === 409) {
            toast.add({
                title: "Token already used",
                description: "This recovery link has already been used.",
                icon: "i-lucide-x-circle",
                color: "error",
            });
        } else if (err.statusCode === 410) {
            toast.add({
                title: "Token expired",
                description:
                    "This recovery link has expired. Please request a new one.",
                icon: "i-lucide-clock",
                color: "error",
            });
        } else {
            toast.add({
                title: "Account recovery failed",
                description: err.message || "Please try again later.",
                icon: "i-lucide-x-circle",
                color: "error",
            });
        }

        status.value = "error";
        error.value = err;
    } finally {
        submitting.value = false;
    }
}

onMounted(async () => {
    await resetPassword(token);
});
</script>
