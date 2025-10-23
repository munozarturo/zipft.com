<template>
    <UHeader :ui="{ right: 'gap-4' }">
        <template #title>
            <LogoLong class="h-12 xs:h-14" />
        </template>
        <template #right>
            <AuthDropdown />
        </template>
    </UHeader>

    <UMain
        class="flex flex-col md:flex-row h-[calc(100vh-var(--ui-header-height))]"
    >
        <div
            class="flex flex-col md:w-[196px] lg:w-[256px] border-default md:border-r border-b md:h-full"
        >
            <div class="w-full h-full hidden md:block md:p-4">
                <UNavigationMenu
                    orientation="vertical"
                    color="neutral"
                    highlight
                    :items="settingsItems"
                    class="w-full"
                />
            </div>
            <div class="px-8 md:hidden">
                <UNavigationMenu
                    orientation="horizontal"
                    color="neutral"
                    highlight
                    :items="settingsItems"
                    class="w-full"
                />
            </div>
        </div>

        <div class="flex-1 overflow-auto flex flex-col items-center">
            <div class="w-full lg:w-[768px] p-6 md:p-8 md:py-16">
                <slot></slot>
            </div>
        </div>
    </UMain>
</template>

<script setup lang="ts">
const settingsItems = [
    {
        label: "Settings",
        type: "label",
    },
    {
        label: "Account",
        icon: "i-lucide-user",
        to: "/settings/account",
    },
    {
        label: "Security",
        icon: "i-lucide-shield",
        to: "/settings/security",
    },
];
</script>
