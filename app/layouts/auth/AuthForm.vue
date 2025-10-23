<template>
    <UHeader class="static border-none">
        <template #title> <LogoLong class="h-12 xs:h-14" /> </template>

        <template #right>
            <UColorModeButton />
        </template>
    </UHeader>

    <UMain
        v-if="content === 'long'"
        class="flex flex-col gap-3 py-6 items-center lg:items-start xs:py-12 lg:pl-60"
    >
        <div
            class="flex flex-col gap-3 px-6 xs:px-0 w-full max-w-[400px] xs:w-fit xs:min-w-[400px]"
        >
            <slot></slot>
        </div>
    </UMain>
    <UMain
        v-else
        class="flex flex-col gap-3 py-20 items-center lg:items-start xs:py-28 lg:pl-60"
    >
        <div
            class="flex flex-col gap-3 px-6 xs:px-0 w-full max-w-[400px] xs:w-fit xs:min-w-[400px]"
        >
            <slot></slot>
        </div>
    </UMain>

    <UFooter>
        <template #left>
            <ULink
                to="/"
                class="shrink-0 font-bold text-xl text-highlighted flex items-end gap-1.5"
            >
                <LogoLong class="h-11" />
            </ULink>
        </template>

        <template #right>
            <p class="text-muted text-sm">
                Copyright © {{ new Date().getFullYear() }} zipft
            </p>
        </template>
    </UFooter>
</template>

<script setup lang="ts">
const layoutProps = useAttrs();

const content = layoutProps.content;
</script>
