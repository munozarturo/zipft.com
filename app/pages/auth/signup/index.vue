<template>
    <NuxtLayout name="auth-form">
        <h1 class="text-4xl xs:text-5xl font-semibold">Welcome</h1>

        <span
            >Have an account?
            <ULink :to="withCallback('/auth/signin')">Sign in</ULink></span
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
                    v-model="state.email"
                    :spellcheck="false"
                />
            </UFormField>
            <UFormField
                label="Password"
                name="password"
                :ui="{ error: 'hidden' }"
            >
                <UPasswordInput
                    class="w-full"
                    placeholder="password"
                    v-model="state.password"
                    :checkStrength="true"
                />
            </UFormField>
            <UButton
                type="submit"
                color="neutral"
                trailing-icon="i-lucide-arrow-right"
                class="group"
                :loading="submitting"
                :disabled="submitting"
                :ui="{
                    trailingIcon:
                        'group-enabled:group-hover:translate-x-1 group-enabled:group-focus-visible:translate-x-1 transition-transform duration-300',
                }"
            >
                <span class="text-left w-full">Sign up</span>
            </UButton>
        </UForm>

        <span class="text-sm text-muted"
            >By creating an account, you agree to zipft's
            <ULink to="/legal/terms-of-service" target="_blank"
                >Terms of Service</ULink
            >
            and consent to zipft's
            <ULink to="/legal/privacy-policy" target="_blank"
                >Privacy Policy</ULink
            >.</span
        >
    </NuxtLayout>
</template>

<script setup lang="ts">
import * as y from "yup";
import { emailSchema, passwordSchema } from "~~/shared/schema/auth";
import type { FormSubmitEvent } from "@nuxt/ui";
import { FetchError } from "ofetch";
import type { H3Error } from "h3";
import useCallback from "~/composables/callback";

useHead({ title: "Sign up :: zipft" });

const { withCallback } = useCallback();

const toast = useToast();

const schema = y.object({
    email: emailSchema.required("Required"),
    password: passwordSchema.required("Required"),
});
type Schema = y.InferType<typeof schema>;

const route = useRoute();
const state = reactive<Schema>({
    email: (route.query.email as string) || "",
    password: "",
});

const submitting = ref<boolean>(false);
async function onSubmit(event: FormSubmitEvent<Schema>) {
    submitting.value = true;

    try {
        await $fetch("/api/v1/user", {
            method: "POST",
            body: event.data,
        });
        await navigateTo(withCallback(`/auth/verify/request?e=${state.email}`));
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

        const error = e.data as H3Error;
        toast.add({
            title: error.name,
            description: error.message,
            icon: "i-lucide-x",
            color: "error",
        });
    } finally {
        submitting.value = false;
    }
}
</script>
