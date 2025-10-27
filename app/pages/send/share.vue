<template>
    <NuxtLayout name="content">
        <div class="w-full h-full flex flex-col items-center pt-20 pb-4">
            <div class="w-full px-4 sm:px-0 sm:max-w-lg lg:max-w-2xl">
                <UCard class="w-fit" variant="subtle">
                    <div class="flex flex-row items-center gap-2">
                        <span class="font-mono text-4xl tracking-widest">{{
                            token
                        }}</span>
                        <UButton
                            v-if="canShare"
                            icon="i-lucide-share"
                            variant="link"
                            color="neutral"
                            size="xl"
                            @click="nativeShare"
                        />
                        <UTooltip
                            v-else
                            :text="copyTooltipText || 'Copy'"
                            :prevent-overflow="false"
                            :delay-duration="0"
                        >
                            <UButton
                                :icon="
                                    copyTooltipText === 'Copied!'
                                        ? 'i-lucide-copy-check'
                                        : 'i-lucide-copy'
                                "
                                variant="link"
                                color="neutral"
                                size="xl"
                                @click="copyShare"
                            />
                        </UTooltip>
                    </div>
                </UCard>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

useHead({ title: "Share :: zipft" });

definePageMeta({
    middleware: (to) => {
        const token = to.query.t;
        if (!token) return navigateTo("/send");
    },
});

const route = useRoute();
const token = route.query.t;

const copyValue = computed(() => `${config.public.baseUrl}/r/${token}`);
const copyTooltipText = ref<string>("Copy");

// Check if native sharing is available
const canShare = computed(() => {
    return import.meta.client && navigator.share;
});

async function copyShare() {
    try {
        await navigator.clipboard.writeText(copyValue.value);
        copyTooltipText.value = "Copied!";
        setTimeout(() => {
            copyTooltipText.value = "Copy";
        }, 2000);
    } catch (error) {
        console.error("Failed to copy:", error);
    }
}

async function nativeShare() {
    try {
        await navigator.share({
            title: "zipft - File Share",
            text: `Access your files with code: ${token}`,
            url: copyValue.value,
        });
    } catch (error) {
        // User cancelled or sharing failedhttp://127.0.0.1:3000/r/x59xmn
        console.log("Share cancelled or failed:", error);
    }
}
</script>
