<script setup lang="ts">
import type { QuotaLimits } from '~/types/campaign'

const props = defineProps<{
  modelValue: QuotaLimits
  disabled?: boolean
  parentCap?: QuotaLimits
  labelPrefix?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: QuotaLimits]
}>()

function update(field: keyof QuotaLimits, raw: number | string) {
  const next = Number(raw)
  const value = Number.isFinite(next) && next >= 0 ? Math.floor(next) : 0
  const capped = props.parentCap
    ? Math.min(value, props.parentCap[field])
    : value

  emit('update:modelValue', {
    ...props.modelValue,
    [field]: capped
  })
}
</script>

<template>
  <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
    <UFormField
      :label="`${labelPrefix ?? ''}Per Campaign`.trim()"
      class="w-full"
    >
      <UInput
        :model-value="modelValue.perCampaign"
        type="number"
        :min="0"
        :max="parentCap?.perCampaign"
        :disabled="disabled"
        class="w-full"
        @update:model-value="update('perCampaign', $event as string | number)"
      />
    </UFormField>
    <UFormField
      :label="`${labelPrefix ?? ''}Per Day`.trim()"
      class="w-full"
    >
      <UInput
        :model-value="modelValue.perDay"
        type="number"
        :min="0"
        :max="parentCap?.perDay"
        :disabled="disabled"
        class="w-full"
        @update:model-value="update('perDay', $event as string | number)"
      />
    </UFormField>
    <UFormField
      :label="`${labelPrefix ?? ''}Per User`.trim()"
      class="w-full"
    >
      <UInput
        :model-value="modelValue.perUser"
        type="number"
        :min="0"
        :max="parentCap?.perUser"
        :disabled="disabled"
        class="w-full"
        @update:model-value="update('perUser', $event as string | number)"
      />
    </UFormField>
  </div>
</template>
