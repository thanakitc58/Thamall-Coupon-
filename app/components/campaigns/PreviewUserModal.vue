<script setup lang="ts">
import type { CouponGroup } from '~/types/campaign'

const open = defineModel<boolean>('open', { required: true })

const props = defineProps<{
  group: CouponGroup | null
}>()

const emit = defineEmits<{
  confirm: [selectedIds: string[]]
}>()

const selectedIds = ref<string[]>([])

watch(open, (isOpen) => {
  if (isOpen) {
    selectedIds.value = []
  }
})

const limit = computed(() => props.group?.chooseCount ?? 0)

const remaining = computed(() => Math.max(0, limit.value - selectedIds.value.length))

function toggle(id: string) {
  const index = selectedIds.value.indexOf(id)

  if (index >= 0) {
    selectedIds.value.splice(index, 1)
    return
  }

  if (selectedIds.value.length >= limit.value) {
    return
  }

  selectedIds.value.push(id)
}

function isSelected(id: string) {
  return selectedIds.value.includes(id)
}

function confirm() {
  if (selectedIds.value.length !== limit.value) {
    return
  }

  emit('confirm', [...selectedIds.value])
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Preview — มุมมองผู้ใช้"
    :description="group
      ? `เลือก ${group.chooseCount} จาก ${group.coupons.length} คูปองในกลุ่ม ${group.name}`
      : 'ไม่มีกลุ่มที่เลือก'"
  >
    <template #body>
      <div
        v-if="group"
        class="space-y-4"
      >
        <UAlert
          :color="remaining === 0 ? 'success' : 'info'"
          variant="subtle"
          icon="i-lucide-mouse-pointer-click"
          :title="`เลือกแล้ว ${selectedIds.length} / ${limit}`"
          :description="remaining === 0
            ? 'ครบจำนวนแล้ว กดยืนยันได้'
            : `เลือกได้อีก ${remaining} ใบ`"
        />

        <div class="space-y-2">
          <button
            v-for="coupon in group.coupons"
            :key="coupon.id"
            type="button"
            class="flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors"
            :class="isSelected(coupon.id)
              ? 'border-primary bg-primary/5 ring-1 ring-primary'
              : selectedIds.length >= limit
                ? 'border-default opacity-50'
                : 'border-default hover:border-accented'"
            :disabled="!isSelected(coupon.id) && selectedIds.length >= limit"
            @click="toggle(coupon.id)"
          >
            <img
              :src="coupon.image"
              :alt="coupon.name"
              class="size-12 shrink-0 rounded object-cover"
            >
            <div class="min-w-0 flex-1">
              <p class="font-semibold">
                {{ coupon.name }}
              </p>
              <p class="truncate text-xs text-muted">
                {{ coupon.description }}
              </p>
            </div>
            <UCheckbox
              :model-value="isSelected(coupon.id)"
              :disabled="!isSelected(coupon.id) && selectedIds.length >= limit"
              @click.prevent
            />
          </button>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton
          label="ปิด"
          color="neutral"
          variant="ghost"
          @click="open = false"
        />
        <UButton
          label="ยืนยันการเลือก"
          color="primary"
          icon="i-lucide-check"
          :disabled="!group || selectedIds.length !== limit"
          @click="confirm"
        />
      </div>
    </template>
  </UModal>
</template>
