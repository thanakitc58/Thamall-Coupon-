<script setup lang="ts">
import type { PatternItem } from '~/types/coupon-package'

const open = defineModel<boolean>('open', { required: true })
const draftName = defineModel<string>('draftName', { required: true })
const draftItems = defineModel<PatternItem[]>('draftItems', { required: true })

defineProps<{
  isEditing: boolean
  couponOptions: Array<{ label: string, value: number }>
  projectedTotal: number
  draftTotal: number
  draftMatchesParent: boolean
  formatNumber: (value: number) => string
}>()

const emit = defineEmits<{
  addRow: []
  removeRow: [index: number]
  close: []
  save: []
}>()
</script>

<template>
  <UModal
    v-model:open="open"
    :title="isEditing ? 'แก้ไขรูปแบบ' : 'เพิ่มรูปแบบ'"
    description="กำหนดแถวคูปองให้มูลค่ารวมเท่ากับมูลค่า Parent"
  >
    <template #body>
      <div class="space-y-4">
        <UFormField
          label="ชื่อรูปแบบ"
          class="w-full"
        >
          <UInput
            v-model="draftName"
            placeholder="เช่น รูปแบบที่ 4"
            class="w-full"
          />
        </UFormField>

        <USeparator />

        <div class="space-y-3">
          <div class="flex items-center justify-between gap-2">
            <p class="text-sm font-semibold">
              รายการคูปอง
            </p>
            <UButton
              label="เพิ่มแถว"
              icon="i-lucide-plus"
              color="neutral"
              variant="soft"
              size="sm"
              @click="emit('addRow')"
            />
          </div>

          <div
            v-for="(item, index) in draftItems"
            :key="index"
            class="grid grid-cols-12 items-end gap-3"
          >
            <UFormField
              label="มูลค่าคูปอง (บาท)"
              class="col-span-5"
            >
              <USelect
                v-model="item.couponValue"
                :items="couponOptions"
                value-key="value"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="จำนวน (ใบ)"
              class="col-span-5"
            >
              <UInput
                v-model.number="item.quantity"
                type="number"
                min="1"
                class="w-full"
              />
            </UFormField>

            <div class="col-span-2 flex justify-end pb-0.5">
              <UButton
                icon="i-lucide-trash-2"
                color="error"
                variant="ghost"
                size="sm"
                :disabled="draftItems.length === 1"
                @click="emit('removeRow', index)"
              />
            </div>
          </div>
        </div>

        <USeparator />

        <div class="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-elevated p-4">
          <div class="space-y-1">
            <p class="text-xs uppercase tracking-wider text-muted">
              มูลค่า Parent
            </p>
            <p class="text-lg font-bold">
              {{ formatNumber(projectedTotal) }} บาท
            </p>
          </div>
          <div class="space-y-1 text-right">
            <p class="text-xs uppercase tracking-wider text-muted">
              รวมมูลค่ารูปแบบ
            </p>
            <p class="text-lg font-bold">
              {{ formatNumber(draftTotal) }} บาท
            </p>
          </div>
        </div>

        <UAlert
          v-if="draftMatchesParent"
          color="success"
          variant="subtle"
          icon="i-lucide-check-circle-2"
          title="มูลค่าตรงกัน"
          description="มูลค่ารวมของรูปแบบเท่ากับมูลค่า Parent แล้ว"
        />
        <UAlert
          v-else
          color="warning"
          variant="subtle"
          icon="i-lucide-alert-triangle"
          title="มูลค่าไม่ตรงกัน"
          :description="`รวมมูลค่ารูปแบบคือ ${formatNumber(draftTotal)} แต่ Parent คือ ${formatNumber(projectedTotal)}`"
        />
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton
          label="ยกเลิก"
          color="neutral"
          variant="ghost"
          @click="emit('close')"
        />
        <UButton
          :label="isEditing ? 'อัปเดตรูปแบบ' : 'บันทึกรูปแบบ'"
          color="primary"
          icon="i-lucide-check"
          @click="emit('save')"
        />
      </div>
    </template>
  </UModal>
</template>
