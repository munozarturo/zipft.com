<template>
    <UCard variant="outline">
        <div class="flex flex-row items-center gap-3">
            <UserAvatar
                size="3xl"
                :name="name"
                :email="email"
                :src="avatarSrc"
            />
            <div class="flex flex-col">
                <div v-if="name" class="flex flex-row gap-1 items-center -mt-1">
                    <p>
                        <span>{{ name }}</span>
                    </p>
                    <UTooltip
                        v-if="showVerifiedBadge"
                        :delay-duration="0"
                        text="Email verified"
                    >
                        <UIcon
                            name="i-lucide-badge-check"
                            class="size-4 text-blue-500"
                        />
                    </UTooltip>
                </div>
                <div class="flex flex-row gap-1 items-center -mt-1">
                    <p class="text-muted text-xs sm:text-sm leading-tight">
                        <span>{{ email }}</span>
                    </p>
                </div>
            </div>
        </div>
    </UCard>
</template>

<script setup lang="ts">
interface Props {
    name?: string;
    email?: string;
    avatarSrc?: string;
    showVerifiedBadge?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    name: "",
    email: "",
    avatarSrc: undefined,
    showVerifiedBadge: true,
});
</script>
