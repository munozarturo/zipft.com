<template></template>

<script setup lang="ts">
import useCallback from "~/composables/callback";

const { $auth } = useNuxtApp();
const toast = useToast();

const { callback } = useCallback();

const signOut = async () => {
    try {
        await $fetch("/api/v1/auth/session", {
            method: "DELETE",
            query: { id: [$auth.session.value?.id] },
        });
    } catch (e: any) {
    } finally {
        window.location.replace(callback.value || "/");
    }
};

onMounted(() => {
    signOut();
});
</script>
