<script setup lang="ts">
import type { DeliveryMode } from '~/types/coupon-package'

const deliveryMode = defineModel<DeliveryMode | undefined>('deliveryMode', { required: true })
const selectedUserIds = defineModel<string[]>('selectedUserIds', { required: true })
const selectedTiers = defineModel<string[]>('selectedTiers', { required: true })

defineProps<{
  deliveryOptions: Array<{
    value: DeliveryMode
    label: string
    description: string
  }>
  mockUsers: Array<{ label: string, value: string }>
  memberTiers: Array<{ label: string, value: string, description: string }>
  deliverySummary: string
}>()

const emit = defineEmits<{
  change: [mode?: DeliveryMode]
}>()

function onDeliveryUpdate(value?: DeliveryMode) {
  emit('change', value)
}
</script>

<template>
  <section>
    <UCard>
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2 text-primary">
            <UIcon
              name="i-lucide-gift"
              class="size-5"
            />
            <h3 class="text-lg font-bold">
              ส่งมอบ Gift Card
            </h3>
            <UBadge
              label="Delivery"
              color="primary"
              variant="subtle"
            />
          </div>
          <UBadge
            v-if="deliveryMode"
            :label="deliverySummary"
            color="success"
            variant="subtle"
          />
        </div>
      </template>

      <div class="space-y-6">
        <p class="text-sm text-muted">
          เลือกวิธีส่งมอบแพ็กเกจคูปองให้ผู้รับ (demo — ไม่เชื่อมหลังบ้าน)
        </p>

        <URadioGroup
          v-model="deliveryMode"
          :items="deliveryOptions"
          value-key="value"
          class="gap-3"
          @update:model-value="onDeliveryUpdate"
        />

        <div
          v-if="deliveryMode === 'everyone'"
          class="rounded-lg border border-default bg-elevated p-4"
        >
          <div class="flex items-start gap-3">
            <UIcon
              name="i-lucide-users"
              class="mt-0.5 size-5 text-primary"
            />
            <div>
              <p class="font-semibold">
                ส่งทุกคน
              </p>
              <p class="mt-1 text-sm text-muted">
                Gift Card จะถูกมอบให้ผู้ใช้งานทั้งหมดในระบบทันทีหลังบันทึกแพ็กเกจ
              </p>
            </div>
          </div>
        </div>

        <div
          v-else-if="deliveryMode === 'selected'"
          class="space-y-3"
        >
          <UFormField
            label="เลือกผู้รับ"
            description="ค้นหาและเลือกได้หลายคน"
            class="w-full"
          >
            <USelectMenu
              v-model="selectedUserIds"
              :items="mockUsers"
              multiple
              placeholder="เลือกผู้ใช้งาน..."
              class="w-full"
              value-key="value"
            />
          </UFormField>

          <UAlert
            v-if="selectedUserIds.length === 0"
            color="warning"
            variant="subtle"
            icon="i-lucide-alert-triangle"
            title="ยังไม่ได้เลือกผู้รับ"
            description="ต้องเลือกอย่างน้อย 1 คนก่อนบันทึก"
          />
          <UAlert
            v-else
            color="success"
            variant="subtle"
            icon="i-lucide-check"
            :title="`เลือกแล้ว ${selectedUserIds.length} คน`"
            description="จะส่ง Gift Card เฉพาะรายชื่อที่เลือก"
          />
        </div>

        <div
          v-else-if="deliveryMode === 'member_tier'"
          class="space-y-3"
        >
          <UFormField
            label="ระดับสมาชิก"
            description="เลือกอย่างน้อย 1 ระดับ"
            class="w-full"
          >
            <UCheckboxGroup
              v-model="selectedTiers"
              :items="memberTiers"
              value-key="value"
              class="gap-3"
            />
          </UFormField>

          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="tier in memberTiers.filter(t => selectedTiers.includes(t.value))"
              :key="tier.value"
              :label="tier.label"
              color="primary"
              variant="subtle"
              icon="i-lucide-award"
            />
          </div>

          <UAlert
            v-if="selectedTiers.length === 0"
            color="warning"
            variant="subtle"
            icon="i-lucide-alert-triangle"
            title="ยังไม่ได้เลือกระดับ"
            description="เลือก Bronze, Silver หรือ Gold อย่างน้อย 1 ระดับ"
          />
          <UAlert
            v-else
            color="success"
            variant="subtle"
            icon="i-lucide-check"
            title="พร้อมส่งตามระดับสมาชิก"
            :description="deliverySummary"
          />
        </div>
      </div>
    </UCard>
  </section>
</template>
