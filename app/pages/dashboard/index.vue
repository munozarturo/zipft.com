<template>
    <NuxtLayout name="dashboard"> </NuxtLayout>
</template>

<script setup lang="ts">
useHead({ title: "Dashboard :: zipft" });

definePageMeta({
    middleware: ["require-authenticated"],
});
</script>
