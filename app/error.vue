<template>
    <NuxtLayout name="content">
        <div
            class="flex flex-col gap-4 py-20 items-center md:items-start xs:py-32 md:px-32 lg:px-60"
        >
            <div class="flex flex-col gap-1 items-center md:items-start">
                <p class="text-4xl md:text-5xl">{{ error?.statusCode }}</p>
                <h1 class="text-4xl md:text-5xl font-semibold">
                    {{ error?.statusMessage }}
                </h1>
            </div>
            <p
                class="text-3xl"
                v-if="error?.message && error.message !== error.statusMessage"
            >
                {{ error?.message }}
            </p>
            <UButton
                type="submit"
                color="neutral"
                variant="outline"
                trailing-icon="i-lucide-arrow-right"
                class="group w-fit cursor-pointer"
                :ui="{
                    trailingIcon:
                        'group-enabled:group-hover:translate-x-1 group-enabled:group-focus-visible:translate-x-1 transition-transform duration-300',
                }"
                size="xl"
                @click="navigateTo('/')"
            >
                <span class="text-left w-full">Go home</span>
            </UButton>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

const { error } = defineProps<{
    error: NuxtError;
}>();

useHead({ title: `${error.statusCode || "500"} :: zipft` });
</script>
