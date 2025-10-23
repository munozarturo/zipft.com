<template>
    <UHeader :ui="{ right: 'gap-4' }">
        <template #title> <LogoLong class="h-12 xs:h-14" /> </template>

        <template #right>
            <div
                v-if="!$auth.isAuthenticated.value"
                class="flex flex-row gap-2 items-center"
            >
                <UColorModeButton />
                <UButton
                    color="neutral"
                    trailing-icon="i-lucide-arrow-right"
                    class="group cursor-pointer hidden xs:flex"
                    @click="navigateTo('/auth/signin')"
                    :ui="{
                        trailingIcon:
                            'group-enabled:group-hover:translate-x-1 group-enabled:group-focus-visible:translate-x-1 transition-transform duration-300',
                    }"
                >
                    <span class="text-left w-full">Sign in</span>
                </UButton>
            </div>
            <div v-else>
                <AuthDropdown />
            </div>
        </template>

        <template #body>
            <div
                v-if="!$auth.isAuthenticated.value"
                class="flex xs:hidden flex-row gap-3 px-4 py-3"
            >
                <UButton
                    color="neutral"
                    variant="outline"
                    icon="i-lucide-log-in"
                    class="w-full"
                    @click="navigateTo('/auth/signin')"
                >
                    Sign in
                </UButton>
                <UButton
                    color="neutral"
                    trailing-icon="i-lucide-arrow-right"
                    class="w-full justify-between"
                    @click="navigateTo('/auth/signup')"
                >
                    Sign up
                </UButton>
            </div>
        </template>
    </UHeader>

    <UMain>
        <slot></slot>
    </UMain>

    <USeparator type="solid" class="h-px" />

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

<script setup lang="ts"></script>
