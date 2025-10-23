<template>
    <UCard class="w-full group" variant="outline">
        <div class="flex flex-col gap-2">
            <div class="flex flex-row gap-2 items-center justify-between">
                <div class="flex flex-row gap-2 items-center">
                    <UIcon
                        v-if="session.isMobile"
                        name="i-lucide-smartphone"
                        class="h-7 w-7"
                    />
                    <UIcon v-else name="i-lucide-monitor" class="h-7 w-7" />
                    <div class="flex flex-col">
                        <div class="flex flex-row gap-1.5">
                            <UChip standalone inset :color="activityColor" />
                            <p>{{ session.ipAddress }}</p>
                        </div>
                        <p class="text-sm text-muted -mt-1.5">
                            {{ session.browser }} on {{ session.platform }}
                        </p>
                    </div>
                </div>
                <UTooltip v-if="!isCurrent" text="Sign out"
                    ><UButton
                        icon="i-lucide-log-out"
                        size="md"
                        color="neutral"
                        variant="ghost"
                        square
                        :loading="pendingClose"
                        :disabled="pendingClose"
                        @click="handleCloseSession"
                        class="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                /></UTooltip>
                <UTooltip v-else text="Current session">
                    <UIcon name="i-lucide-info" class="h-5 w-5 text-muted" />
                </UTooltip>
            </div>
            <div class="flex flex-row gap-3 text-xs text-muted mt-1">
                <div class="flex flex-row gap-1 items-center">
                    <UIcon name="i-lucide-calendar" class="h-3 w-3" />
                    <span
                        >Created
                        {{ formatRelativeTime(session.createdAt) }}</span
                    >
                </div>
                <div class="flex flex-row gap-1 items-center">
                    <UIcon name="i-lucide-activity" class="h-3 w-3" />
                    <span
                        >Last active
                        {{ formatRelativeTime(session.lastUsed) }}</span
                    >
                </div>
            </div>
        </div>
    </UCard>
</template>

<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        isCurrent: boolean;
        session: {
            id: string;
            createdAt: Date;
            lastVerifiedAt: Date;
            lastUsed: Date;
            ipAddress: string | null;
            userAgent: string | null;
            platform: string | null;
            browser: string | null;
            isMobile: boolean | null;
        };
        closeSession?: (id: string) => Promise<void>;
    }>(),
    {
        isCurrent: false,
    }
);

const pendingClose = ref(false);

const handleCloseSession = async () => {
    if (!props.closeSession || pendingClose.value) return;

    try {
        pendingClose.value = true;
        await props.closeSession(props.session.id);
    } catch (error) {
        console.error("Failed to close session:", error);
    } finally {
        pendingClose.value = false;
    }
};

const activityColor = computed(() => {
    const now = new Date();
    const lastVerified = new Date(props.session.lastVerifiedAt);
    const diffMs = now.getTime() - lastVerified.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Active (within 5 minutes)
    if (diffMinutes < 5) {
        return "success" as const;
    }

    // Recent (within 1 hour)
    if (diffMinutes < 60) {
        return "success" as const;
    }

    // Within last day
    if (diffHours < 24) {
        return "warning" as const;
    }

    // Within last week
    if (diffDays < 7) {
        return "warning" as const;
    }

    return "error" as const;
});

const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffWeeks < 4) return `${diffWeeks}w ago`;
    if (diffMonths < 12) return `${diffMonths}mo ago`;

    const diffYears = Math.floor(diffMonths / 12);
    return `${diffYears}y ago`;
};
</script>
