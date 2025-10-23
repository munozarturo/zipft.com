<template>
    <div class="space-y-2">
        <UInput
            v-model="modelValueProxy"
            :placeholder="placeholder || 'password'"
            :color="checkStrength && color"
            :type="show ? 'text' : 'password'"
            :aria-invalid="score < 4"
            aria-describedby="password-strength"
            :ui="{ trailing: 'pe-1' }"
            class="w-full"
            :spellcheck="false"
        >
            <template #trailing>
                <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    :aria-label="show ? 'Hide password' : 'Show password'"
                    :aria-pressed="show"
                    aria-controls="password"
                    @click="show = !show"
                />
            </template>
        </UInput>

        <UProgress
            v-if="checkStrength"
            :color="color"
            :indicator="text"
            :model-value="score"
            :max="5"
            size="sm"
        />

        <ul
            v-if="checkStrength && score < 5"
            class="space-y-1"
            aria-label="Password requirements"
        >
            <li
                v-for="(req, index) in strength"
                :key="index"
                class="flex items-center gap-1"
                :class="req.met ? 'text-success' : 'text-muted'"
            >
                <UIcon
                    :name="
                        req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'
                    "
                    class="size-4 shrink-0"
                />
                <span class="text-xs font-light">
                    {{ req.text }}
                    <span class="sr-only">
                        {{
                            req.met
                                ? " - Requirement met"
                                : " - Requirement not met"
                        }}
                    </span>
                </span>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: string;
    label?: string;
    placeholder?: string;
    error?: string;
    checkStrength?: boolean;
}>();
const emit = defineEmits(["update:modelValue"]);

const show = ref(false);
const modelValueProxy = computed({
    get: () => props.modelValue,
    set: (val: string) => emit("update:modelValue", val),
});

function computeStrength(str: string) {
    // modeled on ~~/shared/schema/auth.passwordSchema
    const requirements = [
        { regex: /.{8,}/, text: "At least 8 characters" },
        { regex: /[a-z]/, text: "At least 1 lowercase letter" },
        { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
        { regex: /\d/, text: "At least 1 number" },
        {
            regex: /[@$!%*?&]/,
            text: "At least 1 special character (@, $, !, %, *, ?, &)",
        },
    ];
    return requirements.map((req) => ({
        met: req.regex.test(str),
        text: req.text,
    }));
}

const strength = computed(() => computeStrength(props.modelValue));
const score = computed(() => strength.value.filter((req) => req.met).length);

const color = computed(() => {
    if (score.value === 0) return "neutral";
    if (score.value <= 2) return "error";
    if (score.value === 3) return "warning";
    if (score.value === 4) return "warning";
    return "success";
});

const text = computed(() => {
    if (score.value === 0) return "";
    if (score.value <= 2) return "weak";
    if (score.value === 3) return "medium";
    if (score.value === 4) return "medium";
    return "strong";
});
</script>

<style>
/* Hide the password reveal button in Edge */
::-ms-reveal {
    display: none;
}
</style>
