<template>
    <NuxtLayout name="content">
        <div class="w-full h-full flex flex-col items-center pt-2 pb-4">
            <div class="w-full px-4 sm:px-0 sm:max-w-lg lg:max-w-2xl">
                <UForm
                    class="flex flex-col gap-2 pt-2"
                    :schema="schema"
                    :state="state"
                    @submit="onSubmit"
                >
                    <UFormField
                        name="token"
                        label="Transfer token"
                        description="Find a transfer"
                    >
                        <UPinInput
                            color="neutral"
                            v-model="state.token"
                            size="xl"
                            type="text"
                            :length="6"
                        />
                    </UFormField>
                    <UButton
                        type="submit"
                        color="neutral"
                        trailing-icon="i-lucide-chevron-right"
                        class="group cursor-pointer w-fit"
                        :ui="{
                            trailingIcon:
                                'group-enabled:group-hover:translate-x-1 group-enabled:group-focus-visible:translate-x-1 transition-transform duration-300',
                        }"
                    >
                        <span class="text-left w-full">Find</span>
                    </UButton>
                </UForm>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
import * as y from "yup";
import type { FormSubmitEvent } from "@nuxt/ui";
import { transferTokenSchema } from "~~/shared/schema/transfer";

useHead({ title: "Receive :: zipft" });

const schema = y.object({
    token: transferTokenSchema,
});
type Schema = y.InferType<typeof schema>;

const state = reactive({
    token: Array(6).fill("") as string[],
});

async function onSubmit(event: FormSubmitEvent<Schema>) {}
</script>
