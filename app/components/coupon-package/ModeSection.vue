<script setup lang="ts">
import type { PackageMode } from '~/types/coupon-package'

defineProps<{
  modelValue: PackageMode
  options: Array<{
    value: PackageMode
    label: string
    description: string
  }>
  isFixedNoChild: boolean
  projectedTotal: number
  formatNumber: (value: number) => string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: PackageMode]
  'change': [mode?: PackageMode]
}>()

function onModeUpdate(value: PackageMode) {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <section>
    <UCard>
      <template #header>
        <div class="flex items-center gap-2 text-primary">
          <UIcon
            name="i-lucide-layers"
            class="size-5"
          />
          <h3 class="text-lg font-bold">
            โหมดการส่งแพ็กเกจ
          </h3>
        </div>
      </template>

      <URadioGroup
        :model-value="modelValue"
        :items="options"
        value-key="value"
        class="gap-3"
        @update:model-value="onModeUpdate"
      />

      <UAlert
        v-if="isFixedNoChild"
        class="mt-4"
        color="warning"
        variant="subtle"
        icon="i-lucide-sparkles"
        title="โหมด Fixed — ไม่สร้าง Child Pattern"
        :description="`จะส่งสิทธิ์ ${formatNumber(projectedTotal)} บาท ให้ลูกค้าโดยตรง ลูกค้าเลือกแบ่งเองทีหลัง (ไม่ต้องตั้งรูปแบบด้านล่าง)`"
      />
      <UAlert
        v-else
        class="mt-4"
        color="primary"
        variant="subtle"
        icon="i-lucide-git-branch"
        title="โหมด Parent-Child"
        description="ต้องสร้าง Child Patterns ให้ครบ และทุกรูปแบบต้องรวมมูลค่าเท่ากับ Parent"
      />
    </UCard>
  </section>
</template>
