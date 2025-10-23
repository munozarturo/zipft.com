<template>
    <NuxtLayout name="settings">
        <div class="flex flex-col w-full gap-6">
            <FormSessionsCard />
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ["require-authenticated"],
});

useHead({ title: "Security :: zipft" });
</script>
