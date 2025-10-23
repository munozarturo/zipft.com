<template>
    <UDropdownMenu
        :items="items"
        :ui="{ content: 'min-w-48' }"
        :content="{
            align: 'center',
            side: 'bottom',
        }"
    >
        <UserAvatar
            size="lg"
            class="cursor-pointer"
            :name="$auth.user?.value?.name"
            :email="$auth.user?.value?.email"
            :src="$auth.user?.value?.avatarUrl"
        />
    </UDropdownMenu>
</template>

<script setup lang="ts">
const toast = useToast();
const { $auth } = useNuxtApp();

const colorMode = useColorMode();

const route = useRoute();

const signOut = async () => {
    try {
        await $fetch("/api/v1/auth/session", {
            method: "DELETE",
            query: { id: [$auth.session.value?.id] },
        });
    } catch (e: any) {
        toast.add({
            title: e.statusMessage || "Update failed",
            description: e.message || "Please try again",
            icon: "i-lucide-x",
            color: "error",
        });
    } finally {
        window.location.replace("/");
    }
};

const items = computed(() => [
    [
        {
            label: $auth.user?.value?.name,
            type: "label",
        },
    ],
    [
        {
            label: "Dashboard",
            icon: "i-lucide-layout-dashboard",
            to: "/dashboard",
        },
    ],
    [
        {
            label: "Theme",
            type: "label",
        },
        {
            label: "System",
            icon: "i-lucide-monitor",
            type: "checkbox",
            checked: colorMode.preference === "auto",
            onUpdateChecked(checked: boolean) {
                if (checked) colorMode.preference = "auto";
            },
        },
        {
            label: "Light",
            icon: "i-lucide-sun",
            type: "checkbox",
            checked: colorMode.preference === "light",
            onUpdateChecked(checked: boolean) {
                if (checked) colorMode.preference = "light";
            },
        },
        {
            label: "Dark",
            icon: "i-lucide-moon",
            type: "checkbox",
            checked: colorMode.preference === "dark",
            onUpdateChecked(checked: boolean) {
                if (checked) colorMode.preference = "dark";
            },
        },
    ],
    [
        {
            label: "Settings",
            icon: "i-lucide-cog",
            to: "/settings",
            active: route.path.startsWith("/settings"),
        },
        {
            label: "Sign out",
            icon: "i-lucide-log-out",
            onClick: signOut,
        },
    ],
]);
</script>
