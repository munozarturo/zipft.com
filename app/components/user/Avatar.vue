<template>
    <UAvatar :alt="computedAlt" :src="src" :ui="computedUi" v-bind="$attrs" />
</template>

<script setup lang="ts">
interface Props {
    name?: string;
    email?: string;
    src?: string;
    alt?: string;
    ui?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
    name: "",
    email: "",
    src: undefined,
    alt: undefined,
    ui: undefined,
});

// Make component transparent to UAvatar props
defineOptions({
    inheritAttrs: false,
});

const colors = [
    "bg-blue-800",
    "bg-pink-800",
    "bg-green-800",
    "bg-purple-800",
    "bg-yellow-800",
    "bg-red-800",
];

const rootColor = computed(() => {
    const key = props.email || "";

    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        const char = key.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }

    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex];
});

const firstName = computed(() => props.name?.split(" ")[0] || "");

const computedAlt = computed(() => {
    if (props.alt) return props.alt;

    const trimmedName = firstName.value.trim();
    if (trimmedName === "") return props.email || "";
    return trimmedName;
});

const computedUi = computed(() => {
    const defaultUi = {
        root: rootColor.value,
        fallback: "text-white",
    };

    // Merge with provided ui prop
    return props.ui ? { ...defaultUi, ...props.ui } : defaultUi;
});
</script>
