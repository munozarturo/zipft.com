<template>
    <NuxtLayout name="auth-form">
        <h1 class="text-4xl xs:text-5xl font-semibold">Welcome back</h1>

        <span
            >Need an account?
            <ULink :to="withCallback('/auth/signup')">Sign up</ULink></span
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
            <UFormField label="Password" name="password">
                <UPasswordInput
                    class="w-full"
                    placeholder="password"
                    :checkStrength="false"
                    v-model="state.password"
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
                <span class="text-left w-full">Sign in</span>
            </UButton>
        </UForm>

        <span
            ><ULink :to="withCallback('/auth/recover/request')"
                >Forgot password?</ULink
            ></span
        >
    </NuxtLayout>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as y from "yup";
import { emailSchema } from "~~/shared/schema/auth";
import { FetchError } from "ofetch";
import type { H3Error } from "h3";
import useCallback from "~/composables/callback";

useHead({ title: "Sign in :: zipft" });

const { callback, withCallback } = useCallback();

const route = useRoute();

const toast = useToast();

const schema = y.object({
    email: emailSchema.required("Required"),
    password: y.string().required("Required"),
});
type Schema = y.InferType<typeof schema>;

const state = reactive<Schema>({
    email: route.query.email as string,
    password: "",
});

const submitting = ref<boolean>(false);
async function onSubmit(event: FormSubmitEvent<Schema>) {
    submitting.value = true;

    try {
        await $fetch("/api/v1/auth/session", {
            method: "POST",
            body: event.data,
        });
        window.location.replace(callback.value || "/");
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
        if (error.statusMessage === "Account not verified") {
            await navigateTo(
                withCallback(`/auth/verify/request?e=${state.email}`)
            );
        } else {
            toast.add({
                title: error.name,
                description: error.message,
                icon: "i-lucide-x",
                color: "error",
            });
        }
    } finally {
        submitting.value = false;
    }
}
</script>
