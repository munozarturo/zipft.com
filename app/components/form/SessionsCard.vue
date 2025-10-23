<template>
    <UCard class="w-full" variant="subtle">
        <template #header>
            <div class="flex flex-row items-center justify-between">
                <p>Where you're signed in</p>
                <UButton
                    v-if="sessions && sessions?.length > 1"
                    color="neutral"
                    variant="subtle"
                    class="cursor-pointer"
                    :loading="submitting"
                    :disabled="submitting"
                    @click="closeAllSessions"
                    size="sm"
                    label="Close all"
                />
            </div>
        </template>

        <div class="flex flex-col gap-4">
            <div v-if="pending" class="flex flex-col gap-4">
                <USkeleton class="h-26 w-full" />
                <USkeleton class="h-26 w-full" />
                <USkeleton class="h-26 w-full" />
            </div>

            <div v-else-if="error" class="text-sm text-muted">
                Failed to load sessions. {{ error.statusMessage }}.
            </div>

            <div
                v-else-if="sessions?.length === 0"
                class="text-center py-4 text-muted"
            >
                No sessions found
            </div>

            <div v-else class="flex flex-col gap-4">
                <FormSessionCard
                    v-for="session in sessions"
                    :key="session.id"
                    :session="session"
                    :is-current="session.id === $auth.session.value?.id"
                    :close-session="closeSession"
                />
            </div>
        </div>
    </UCard>
</template>

<script setup lang="ts">
type SessionsResponse = {
    sessions: {
        id: string;
        createdAt: Date;
        lastVerifiedAt: Date;
        lastUsed: Date;
        ipAddress: string | null;
        userAgent: string | null;
        platform: string | null;
        browser: string | null;
        isMobile: boolean | null;
    }[];
};

const { $auth } = useNuxtApp();
const { data, pending, error, refresh } = await useFetch<SessionsResponse>(
    "/api/v1/auth/session"
);

const sessions = computed(() => {
    if (error.value || !data.value?.sessions) return undefined;

    const currentSessionId = $auth.session.value?.id;
    if (!currentSessionId) return data.value.sessions;

    const sessions = [...data.value.sessions];
    const currentIndex = sessions.findIndex(
        (session) => session.id === currentSessionId
    );

    if (currentIndex > 0) {
        const [currentSession] = sessions.splice(currentIndex, 1);
        if (currentSession) {
            sessions.unshift(currentSession);
        }
    }

    return sessions;
});

const submitting = ref(false);

async function closeAllSessions() {
    submitting.value = true;

    try {
        if (!sessions.value) return;

        const sessionIdsToClose = sessions.value
            .filter((session) => session.id !== $auth.session.value?.id)
            .map((session) => session.id);

        await $fetch("/api/v1/auth/session", {
            method: "DELETE",
            query: { id: sessionIdsToClose },
        });

        await refresh();
    } finally {
        submitting.value = false;
    }
}

async function closeSession(id: string) {
    await $fetch("/api/v1/auth/session", {
        method: "DELETE",
        query: { id: [id] },
    });

    await refresh();
}

defineExpose({ refresh, closeSession });
</script>
