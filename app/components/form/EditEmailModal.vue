<template>
    <UModal
        v-model:open="isOpen"
        title="Update email address"
        close-icon="i-lucide-x"
        :ui="{ footer: 'justify-end', title: 'font-normal' }"
    >
        <UButton
            icon="i-lucide-edit"
            size="md"
            color="neutral"
            variant="ghost"
            square
        />

        <template #body>
            <UForm
                :schema="schema"
                :state="state"
                @submit="onSubmit"
                id="email-form"
            >
                <div class="flex flex-col gap-3">
                    <UFormField
                        label="Provide a new email address"
                        name="email"
                    >
                        <UInput
                            class="w-full"
                            placeholder="john@example.com"
                            :spellcheck="false"
                            v-model="state.email"
                        />
                    </UFormField>
                    <p class="text-muted text-sm">
                        A confirmation email will be sent to the provided email
                        address
                    </p>
                </div>
            </UForm>
        </template>

        <template #footer="{ close }">
            <UButton
                color="neutral"
                variant="subtle"
                class="cursor-pointer hidden xs:flex"
                size="sm"
                label="Cancel"
                @click="close"
            />
            <UButton
                color="neutral"
                variant="solid"
                class="cursor-pointer hidden xs:flex"
                size="sm"
                label="Confirm"
                type="submit"
                form="email-form"
                :loading="submitting"
                :disabled="submitting"
            />
        </template>
    </UModal>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as y from "yup";
import { emailSchema } from "~~/shared/schema/auth";

const toast = useToast();

const schema = y.object({
    email: emailSchema.required("Required"),
});
type Schema = y.InferType<typeof schema>;

const state = reactive<Schema>({
    email: "",
});

const submitting = ref<boolean>(false);
const isOpen = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
    submitting.value = true;

    try {
        await $fetch("/api/v1/auth/transfer/request", {
            method: "POST",
            body: { email: event.data.email },
        });

        toast.add({
            title: "Transfer request sent",
            description:
                "A confirmation email has been sent to the new email address. Please check your inbox to complete the transfer.",
            icon: "i-lucide-mail",
            color: "success",
        });

        // Close modal after successful submission
        isOpen.value = false;

        // Reset form
        state.email = "";
    } catch (e: any) {
        let title = "Transfer request failed";
        let description = "Please try again";

        if (e.statusCode === 400) {
            title = "Invalid email";
            description = "You cannot transfer to your current email address.";
        } else if (e.statusCode === 429) {
            title = "Too many requests";

            // Try to extract the custom message from different possible locations
            const customMessage = e.data?.message || e.message;
            const waitTime = e.data?.waitTime;

            if (customMessage && customMessage !== e.toString()) {
                description = customMessage;
            } else if (waitTime) {
                description = `Please wait ${waitTime} seconds before requesting another transfer.`;
            } else {
                description = "Please wait before requesting another transfer.";
            }
        } else if (e.statusCode === 401) {
            title = "Authentication required";
            description = "Please sign in to transfer your account.";
        }

        toast.add({
            title,
            description,
            icon: "i-lucide-x",
            color: "error",
        });
    } finally {
        submitting.value = false;
    }
}
</script>
