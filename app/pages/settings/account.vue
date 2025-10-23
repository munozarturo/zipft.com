<template>
    <NuxtLayout name="settings">
        <div class="flex flex-col w-full gap-6">
            <FormProfileCard />

            <FormIdentitiesCard />

            <FormAccountDeletionCard />
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ["require-authenticated"],
});

useHead({ title: "Account :: zipft" });
</script>
