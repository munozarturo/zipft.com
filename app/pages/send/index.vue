<template>
    <NuxtLayout name="content">
        <div class="w-full h-full flex flex-col items-center pt-2 pb-4">
            <div class="w-full max-w-2xl">
                <UTabs :items="tabs" variant="link" color="neutral">
                    <template #link>
                        <UForm
                            class="flex flex-col gap-2 pt-2"
                            :schema="schema"
                            :state="state"
                            @submit="onSubmit"
                        >
                            <!-- Title -->
                            <UFormField name="title" :ui="{ label: 'w-full' }">
                                <template #label>
                                    <div
                                        class="flex flex-row w-full items-center justify-between"
                                    >
                                        <span>Title</span>
                                        <div
                                            id="character-count"
                                            :class="[
                                                'text-xs tabular-nums',
                                                (state.title?.length || 0) >
                                                maxTitleLength
                                                    ? 'text-error'
                                                    : 'text-muted',
                                            ]"
                                            aria-live="polite"
                                            role="status"
                                        >
                                            {{ state.title?.length || 0 }}/{{
                                                maxTitleLength
                                            }}
                                        </div>
                                    </div>
                                </template>
                                <UInput
                                    class="w-full"
                                    placeholder="Documents"
                                    :spellcheck="false"
                                    v-model="state.title"
                                />
                            </UFormField>

                            <!-- Message -->
                            <UFormField
                                name="message"
                                :ui="{ label: 'w-full' }"
                            >
                                <template #label>
                                    <div
                                        class="flex flex-row w-full items-center justify-between"
                                    >
                                        <span>Message</span>
                                        <div
                                            id="character-count"
                                            :class="[
                                                'text-xs tabular-nums',
                                                (state.message?.length || 0) >
                                                maxMessageLength
                                                    ? 'text-error'
                                                    : 'text-muted',
                                            ]"
                                            aria-live="polite"
                                            role="status"
                                        >
                                            {{ state.message?.length || 0 }}/{{
                                                maxMessageLength
                                            }}
                                        </div>
                                    </div>
                                </template>
                                <UTextarea
                                    class="w-full"
                                    placeholder="Add a note for the recipient"
                                    :rows="4"
                                    :maxrows="6"
                                    autoresize
                                    v-model="state.message"
                                />
                            </UFormField>

                            <!-- Files -->
                            <UFormField name="files" label="Files">
                                <UFileUpload
                                    multiple
                                    label="Drop your files here"
                                    class="w-full min-h-64"
                                    layout="list"
                                    position="inside"
                                />
                            </UFormField>

                            <!-- Options -->
                            <div v-if="showOptions" class="flex flex-col gap-2">
                                <!-- Beacon -->
                                <UFormField name="beacon" class="w-full">
                                    <template #label>
                                        <span
                                            :class="[
                                                'flex flex-row items-center gap-1',
                                                !$auth.isAuthenticated.value
                                                    ? 'text-muted'
                                                    : '',
                                            ]"
                                            >Beacon
                                            <UTooltip
                                                v-if="
                                                    !$auth.isAuthenticated.value
                                                "
                                                text="You need to be signed in to use this feature."
                                                ><UIcon
                                                    name="i-lucide-triangle-alert" /></UTooltip
                                        ></span>
                                    </template>

                                    <UCheckbox
                                        color="neutral"
                                        description="Transfer will never expire"
                                        v-model="state.isBeacon"
                                        :disabled="!$auth.isAuthenticated.value"
                                    />
                                </UFormField>

                                <!-- Duration -->
                                <UFormField
                                    name="duration"
                                    label="Duration"
                                    description="The period during which the transfer will be active."
                                    v-if="!state.isBeacon"
                                >
                                    <template #label>
                                        <span
                                            class="flex flex-row items-center gap-1"
                                            >Duration
                                            <UTooltip
                                                v-if="
                                                    !$auth.isAuthenticated.value
                                                "
                                                text="Sign in to increase duration limit of 7 days."
                                                ><UIcon
                                                    name="i-lucide-info" /></UTooltip
                                        ></span>
                                    </template>
                                    <UPopover>
                                        <UButton
                                            color="neutral"
                                            variant="subtle"
                                            icon="i-lucide-calendar"
                                        >
                                            <template v-if="modelValue.start">
                                                <template v-if="modelValue.end">
                                                    {{
                                                        df.format(
                                                            modelValue.start.toDate(
                                                                getLocalTimeZone()
                                                            )
                                                        )
                                                    }}
                                                    -
                                                    {{
                                                        df.format(
                                                            modelValue.end.toDate(
                                                                getLocalTimeZone()
                                                            )
                                                        )
                                                    }}
                                                </template>

                                                <template v-else>
                                                    {{
                                                        df.format(
                                                            modelValue.start.toDate(
                                                                getLocalTimeZone()
                                                            )
                                                        )
                                                    }}
                                                    -
                                                    {{
                                                        df.format(
                                                            modelValue.start.toDate(
                                                                getLocalTimeZone()
                                                            )
                                                        )
                                                    }}
                                                </template>
                                            </template>
                                            <template v-else>
                                                Pick a date range
                                            </template>
                                        </UButton>

                                        <template #content>
                                            <UCalendar
                                                v-model="modelValue"
                                                class="p-2"
                                                :number-of-months="1"
                                                range
                                                color="neutral"
                                                :min-value="now"
                                                :max-value="oneWeekFromNow"
                                            />
                                        </template>
                                    </UPopover>
                                </UFormField>

                                <!-- Maximum Downloads -->
                                <UFormField
                                    name="maxDownloads"
                                    label="Download limit"
                                    description="The number of times a transfer can be downloaded."
                                >
                                    <UInputNumber
                                        v-model="state.maxDownloads"
                                        color="neutral"
                                        orientation="vertical"
                                        placeholder="No limit"
                                    />
                                </UFormField>
                            </div>
                            <UButton
                                variant="link"
                                color="neutral"
                                @click="showOptions = !showOptions"
                            >
                                <div
                                    class="flex flex-row w-full items-center justify-center"
                                >
                                    <span
                                        class="flex flex-row gap-1 items-center"
                                        ><UIcon
                                            v-if="showOptions"
                                            name="i-lucide-chevron-up"
                                        /><UIcon
                                            v-else
                                            name="i-lucide-chevron-down"
                                        />{{
                                            showOptions
                                                ? "Hide options"
                                                : "More options"
                                        }}</span
                                    >
                                </div>
                            </UButton>

                            <!-- Submit -->
                            <UButton
                                type="submit"
                                color="neutral"
                                trailing-icon="i-lucide-send-horizontal"
                                class="group cursor-pointer"
                                :ui="{
                                    trailingIcon:
                                        'group-enabled:group-hover:translate-x-1 group-enabled:group-focus-visible:translate-x-1 transition-transform duration-300',
                                }"
                            >
                                <span class="text-left w-full">Send</span>
                            </UButton>
                        </UForm>
                    </template>
                    <template #mail>
                        <UForm class="flex flex-col gap-2 pt-2">
                            <!-- From -->
                            <UFormField label="From" name="from">
                                <UInput
                                    class="w-full"
                                    placeholder="you@mail.com"
                                    v-model="state.from"
                                    :spellcheck="false"
                                    :disabled="$auth.isAuthenticated.value"
                                    :variant="
                                        $auth.isAuthenticated.value
                                            ? 'soft'
                                            : 'outline'
                                    "
                                />
                            </UFormField>

                            <!-- To -->
                            <UFormField name="to" :ui="{ label: 'w-full' }">
                                <template #label>
                                    <div
                                        class="flex flex-row w-full items-center justify-between"
                                    >
                                        <span>To</span>
                                        <div
                                            id="character-count"
                                            :class="[
                                                'text-xs tabular-nums',
                                                (state.to?.length || 0) >
                                                maxRecipients
                                                    ? 'text-error'
                                                    : 'text-muted',
                                            ]"
                                            aria-live="polite"
                                            role="status"
                                        >
                                            {{ state.to?.length || 0 }}/{{
                                                maxRecipients
                                            }}
                                        </div>
                                    </div>
                                </template>
                                <UInputTags
                                    ref="emailInputRef"
                                    class="w-full"
                                    :placeholder="
                                        state.to?.length || 0 > 0
                                            ? ''
                                            : 'recipient@mail.com'
                                    "
                                    :spellcheck="false"
                                    v-model="state.to"
                                />
                            </UFormField>

                            <!-- Title -->
                            <UFormField name="title" :ui="{ label: 'w-full' }">
                                <template #label>
                                    <div
                                        class="flex flex-row w-full items-center justify-between"
                                    >
                                        <span>Title</span>
                                        <div
                                            id="character-count"
                                            :class="[
                                                'text-xs tabular-nums',
                                                (state.title?.length || 0) >
                                                maxTitleLength
                                                    ? 'text-error'
                                                    : 'text-muted',
                                            ]"
                                            aria-live="polite"
                                            role="status"
                                        >
                                            {{ state.title?.length || 0 }}/{{
                                                maxTitleLength
                                            }}
                                        </div>
                                    </div>
                                </template>
                                <UInput
                                    class="w-full"
                                    placeholder="Documents"
                                    :spellcheck="false"
                                    v-model="state.title"
                                />
                            </UFormField>

                            <!-- Message -->
                            <UFormField
                                name="message"
                                :ui="{ label: 'w-full' }"
                            >
                                <template #label>
                                    <div
                                        class="flex flex-row w-full items-center justify-between"
                                    >
                                        <span>Message</span>
                                        <div
                                            id="character-count"
                                            :class="[
                                                'text-xs tabular-nums',
                                                (state.message?.length || 0) >
                                                maxMessageLength
                                                    ? 'text-error'
                                                    : 'text-muted',
                                            ]"
                                            aria-live="polite"
                                            role="status"
                                        >
                                            {{ state.message?.length || 0 }}/{{
                                                maxMessageLength
                                            }}
                                        </div>
                                    </div>
                                </template>
                                <UTextarea
                                    class="w-full"
                                    placeholder="Add a note for the recipient"
                                    :rows="4"
                                    :maxrows="6"
                                    autoresize
                                    v-model="state.message"
                                />
                            </UFormField>

                            <!-- Files -->
                            <UFormField name="files" label="Files">
                                <UFileUpload
                                    multiple
                                    label="Drop your files here"
                                    class="w-full min-h-64"
                                    layout="list"
                                    position="inside"
                                />
                            </UFormField>

                            <!-- Options -->
                            <div v-if="showOptions" class="flex flex-col gap-2">
                                <!-- Beacon -->
                                <UFormField name="beacon" class="w-full">
                                    <template #label>
                                        <span
                                            :class="[
                                                'flex flex-row items-center gap-1',
                                                !$auth.isAuthenticated.value
                                                    ? 'text-muted'
                                                    : '',
                                            ]"
                                            >Beacon
                                            <UTooltip
                                                v-if="
                                                    !$auth.isAuthenticated.value
                                                "
                                                text="You need to be signed in to use this feature."
                                                ><UIcon
                                                    name="i-lucide-triangle-alert" /></UTooltip
                                        ></span>
                                    </template>

                                    <UCheckbox
                                        color="neutral"
                                        description="Transfer will never expire"
                                        v-model="state.isBeacon"
                                        :disabled="!$auth.isAuthenticated.value"
                                    />
                                </UFormField>

                                <!-- Duration -->
                                <UFormField
                                    name="duration"
                                    label="Duration"
                                    description="The period during which the transfer will be active."
                                    v-if="!state.isBeacon"
                                >
                                    <template #label>
                                        <span
                                            class="flex flex-row items-center gap-1"
                                            >Duration
                                            <UTooltip
                                                v-if="
                                                    !$auth.isAuthenticated.value
                                                "
                                                text="Sign in to increase duration limit of 7 days."
                                                ><UIcon
                                                    name="i-lucide-info" /></UTooltip
                                        ></span>
                                    </template>
                                    <UPopover>
                                        <UButton
                                            color="neutral"
                                            variant="subtle"
                                            icon="i-lucide-calendar"
                                        >
                                            <template v-if="modelValue.start">
                                                <template v-if="modelValue.end">
                                                    {{
                                                        df.format(
                                                            modelValue.start.toDate(
                                                                getLocalTimeZone()
                                                            )
                                                        )
                                                    }}
                                                    -
                                                    {{
                                                        df.format(
                                                            modelValue.end.toDate(
                                                                getLocalTimeZone()
                                                            )
                                                        )
                                                    }}
                                                </template>

                                                <template v-else>
                                                    {{
                                                        df.format(
                                                            modelValue.start.toDate(
                                                                getLocalTimeZone()
                                                            )
                                                        )
                                                    }}
                                                    -
                                                    {{
                                                        df.format(
                                                            modelValue.start.toDate(
                                                                getLocalTimeZone()
                                                            )
                                                        )
                                                    }}
                                                </template>
                                            </template>
                                            <template v-else>
                                                Pick a date range
                                            </template>
                                        </UButton>

                                        <template #content>
                                            <UCalendar
                                                v-model="modelValue"
                                                class="p-2"
                                                :number-of-months="1"
                                                range
                                                color="neutral"
                                                :min-value="now"
                                                :max-value="oneWeekFromNow"
                                            />
                                        </template>
                                    </UPopover>
                                </UFormField>

                                <!-- Maximum Downloads -->
                                <UFormField
                                    name="maxDownloads"
                                    label="Download limit"
                                    description="The number of times a transfer can be downloaded."
                                >
                                    <UInputNumber
                                        v-model="state.maxDownloads"
                                        color="neutral"
                                        orientation="vertical"
                                        placeholder="No limit"
                                    />
                                </UFormField>
                            </div>
                            <UButton
                                variant="link"
                                color="neutral"
                                @click="showOptions = !showOptions"
                            >
                                <div
                                    class="flex flex-row w-full items-center justify-center"
                                >
                                    <span
                                        class="flex flex-row gap-1 items-center"
                                        ><UIcon
                                            v-if="showOptions"
                                            name="i-lucide-chevron-up"
                                        /><UIcon
                                            v-else
                                            name="i-lucide-chevron-down"
                                        />{{
                                            showOptions
                                                ? "Hide options"
                                                : "More options"
                                        }}</span
                                    >
                                </div>
                            </UButton>

                            <!-- Submit -->
                            <UButton
                                type="submit"
                                color="neutral"
                                trailing-icon="i-lucide-send-horizontal"
                                class="group cursor-pointer"
                                :ui="{
                                    trailingIcon:
                                        'group-enabled:group-hover:translate-x-1 group-enabled:group-focus-visible:translate-x-1 transition-transform duration-300',
                                }"
                            >
                                <span class="text-left w-full">Send</span>
                            </UButton>
                        </UForm>
                    </template>
                </UTabs>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
import * as y from "yup";
import type { TabsItem } from "@nuxt/ui";
import type { FormSubmitEvent } from "@nuxt/ui";
import {
    DateFormatter,
    getLocalTimeZone,
    today,
} from "@internationalized/date";

useHead({ title: "Send :: zipft" });

const { $auth } = useNuxtApp();

const showOptions = ref<boolean>(true); // false

const tabs: TabsItem[] = [
    {
        label: "Mail",
        icon: "i-lucide-mail",
        slot: "mail",
    },
    {
        label: "Link",
        icon: "i-lucide-link",
        slot: "link",
    },
];

const df = new DateFormatter("en-US", {
    dateStyle: "medium",
});

const now = today(getLocalTimeZone());
const oneWeekFromNow = today(getLocalTimeZone()).add({ days: 7 });

const modelValue = shallowRef({
    start: now,
    end: oneWeekFromNow,
});

const maxRecipients = 5;
const maxTitleLength = 64;
const maxMessageLength = 256;

const schema = y.object({
    from: y.string().email().nullable(),
    to: y
        .array()
        .of(y.string().email().required())
        .min(1, "At least one recipient is required")
        .max(maxRecipients, "Maximum number of recipients exceeded")
        .nullable(),
    title: y.string().max(maxTitleLength).nullable(),
    message: y.string().max(maxMessageLength).nullable(),
    files: y.array().of(y.mixed()),

    isBeacon: y.boolean().default(false),
    maxDownloads: y.number().nullable(),
});
type Schema = y.InferType<typeof schema>;

const state = reactive<Partial<Schema>>({
    from: $auth.user.value?.email,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
    console.log(event.data);
}
</script>
