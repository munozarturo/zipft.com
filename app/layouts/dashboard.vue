<template>
    <UHeader :ui="{ right: 'gap-4' }">
        <template #title>
            <LogoLong class="h-12 xs:h-14" />
        </template>
        <template #right>
            <AuthDropdown />
        </template>
    </UHeader>

    <slot></slot>
</template>

<script setup lang="ts"></script>
