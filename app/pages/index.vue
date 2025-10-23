<template>
    <NuxtLayout name="content"> </NuxtLayout>
</template>

<script setup lang="ts">
useHead({ title: "zipft" });

definePageMeta({ middleware: ["require-onboarded-if-authenticated"] });
</script>
