<script setup lang="ts">
import type { ChildPattern, PackageMode } from '~/types/coupon-package'

const open = defineModel<boolean>('open', { required: true })

const props = defineProps<{
  packageName: string
  packageMode: PackageMode
  totalValue: number
  patterns: ChildPattern[]
  formatNumber: (value: number) => string
  patternTotal: (pattern: ChildPattern) => number
}>()

const emit = defineEmits<{
  confirm: [payload: {
    mode: PackageMode
    patternId?: string
    patternName?: string
    fixedItems?: Array<{ couponValue: number, quantity: number }>
  }]
}>()

const fixedDenominations = [50, 100, 500, 1000] as const

const selectedPatternId = ref<string | undefined>(undefined)
const fixedQuantities = ref<Record<number, number>>({
  50: 0,
  100: 0,
  500: 0,
  1000: 0
})

watch(open, (isOpen) => {
  if (!isOpen) {
    return
  }

  selectedPatternId.value = props.patterns[0]?.id
  fixedQuantities.value = {
    50: 0,
    100: 0,
    500: 0,
    1000: 0
  }
})

const isWithChild = computed(() => props.packageMode === 'with_child')

const fixedTotal = computed(() =>
  fixedDenominations.reduce(
    (sum, value) => sum + value * (fixedQuantities.value[value] ?? 0),
    0
  )
)

const fixedRemaining = computed(() => props.totalValue - fixedTotal.value)

const fixedMatches = computed(() => fixedTotal.value === props.totalValue)

const selectedPattern = computed(
  () => props.patterns.find(pattern => pattern.id === selectedPatternId.value) ?? null
)

const canConfirm = computed(() => {
  if (isWithChild.value) {
    return !!selectedPattern.value
  }

  return fixedMatches.value && props.totalValue > 0
})

function adjustFixed(value: number, delta: number) {
  const current = fixedQuantities.value[value] ?? 0
  const next = current + delta

  if (next < 0) {
    return
  }

  const projected = fixedTotal.value - (value * current) + (value * next)
  if (projected > props.totalValue) {
    return
  }

  fixedQuantities.value = {
    ...fixedQuantities.value,
    [value]: next
  }
}

function resetFixed() {
  fixedQuantities.value = {
    50: 0,
    100: 0,
    500: 0,
    1000: 0
  }
}

function confirm() {
  if (!canConfirm.value) {
    return
  }

  if (isWithChild.value && selectedPattern.value) {
    emit('confirm', {
      mode: 'with_child',
      patternId: selectedPattern.value.id,
      patternName: selectedPattern.value.name
    })
    open.value = false
    return
  }

  const fixedItems = fixedDenominations
    .filter(value => (fixedQuantities.value[value] ?? 0) > 0)
    .map(value => ({
      couponValue: value,
      quantity: fixedQuantities.value[value] ?? 0
    }))

  emit('confirm', {
    mode: 'fixed_no_child',
    fixedItems
  })
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Preview — มุมมองผู้ใช้"
    :description="isWithChild
      ? `เลือกรูปแบบที่แอดมินสร้างไว้สำหรับ ${packageName}`
      : `แบ่งมูลค่า Fixed ${formatNumber(totalValue)} บาท ให้ครบด้วยคูปอง 50 / 100 / 500 / 1,000`"
  >
    <template #body>
      <!-- Case 1: Child Patterns -->
      <div
        v-if="isWithChild"
        class="space-y-4"
      >
        <UAlert
          color="info"
          variant="subtle"
          icon="i-lucide-layers"
          title="โหมดมี Child Patterns"
          description="ลูกค้าเลือกได้เฉพาะรูปแบบที่แอดมินสร้างไว้เท่านั้น"
        />

        <div
          v-if="patterns.length === 0"
          class="rounded-lg border border-dashed border-default px-4 py-8 text-center text-sm text-muted"
        >
          ยังไม่มี Child Pattern ให้เลือก
        </div>

        <div
          v-else
          class="space-y-2"
        >
          <button
            v-for="pattern in patterns"
            :key="pattern.id"
            type="button"
            class="w-full rounded-lg border px-3 py-3 text-left transition-colors"
            :class="selectedPatternId === pattern.id
              ? 'border-primary bg-primary/5 ring-1 ring-primary'
              : 'border-default hover:border-accented'"
            @click="selectedPatternId = pattern.id"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="font-semibold">
                  {{ pattern.name }}
                </p>
                <ul class="mt-1 space-y-0.5 text-xs text-muted">
                  <li
                    v-for="(item, index) in pattern.items"
                    :key="`${pattern.id}-${index}`"
                  >
                    {{ formatNumber(item.couponValue) }} บาท × {{ item.quantity }} ใบ
                  </li>
                </ul>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold tabular-nums text-primary">
                  ฿{{ formatNumber(patternTotal(pattern)) }}
                </p>
                <UBadge
                  v-if="selectedPatternId === pattern.id"
                  label="เลือกแล้ว"
                  color="primary"
                  variant="subtle"
                  size="xs"
                  class="mt-1"
                />
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Case 2: Fixed waterfall -->
      <div
        v-else
        class="space-y-4"
      >
        <UAlert
          color="info"
          variant="subtle"
          icon="i-lucide-wallet"
          title="โหมด Fixed — ลูกค้าแบ่งเอง"
          :description="`ต้องเลือกคูปอง 50 / 100 / 500 / 1,000 ให้มูลค่ารวมครบ ฿${formatNumber(totalValue)}`"
        />

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div class="rounded-lg border border-default bg-muted/30 px-3 py-2">
            <p class="text-xs text-muted">
              สิทธิ์รวม
            </p>
            <p class="font-bold tabular-nums">
              ฿{{ formatNumber(totalValue) }}
            </p>
          </div>
          <div class="rounded-lg border border-default bg-muted/30 px-3 py-2">
            <p class="text-xs text-muted">
              เลือกแล้ว
            </p>
            <p class="font-bold tabular-nums">
              ฿{{ formatNumber(fixedTotal) }}
            </p>
          </div>
          <div
            class="rounded-lg border px-3 py-2 sm:col-span-1 col-span-2"
            :class="fixedMatches
              ? 'border-success/40 bg-success/10'
              : 'border-warning/40 bg-warning/10'"
          >
            <p class="text-xs text-muted">
              คงเหลือ
            </p>
            <p
              class="font-bold tabular-nums"
              :class="fixedMatches ? 'text-success' : 'text-warning'"
            >
              ฿{{ formatNumber(fixedRemaining) }}
            </p>
          </div>
        </div>

        <div class="space-y-2">
          <div
            v-for="value in fixedDenominations"
            :key="value"
            class="flex items-center justify-between gap-3 rounded-lg border border-default bg-elevated px-3 py-2"
          >
            <div>
              <p class="font-semibold">
                คูปอง ฿{{ formatNumber(value) }}
              </p>
              <p class="text-xs text-muted">
                รวม ฿{{ formatNumber(value * (fixedQuantities[value] ?? 0)) }}
              </p>
            </div>

            <div class="flex items-center gap-2">
              <UButton
                icon="i-lucide-minus"
                color="neutral"
                variant="soft"
                size="sm"
                :disabled="(fixedQuantities[value] ?? 0) <= 0"
                @click="adjustFixed(value, -1)"
              />
              <span class="w-8 text-center font-bold tabular-nums">
                {{ fixedQuantities[value] ?? 0 }}
              </span>
              <UButton
                icon="i-lucide-plus"
                color="neutral"
                variant="soft"
                size="sm"
                :disabled="fixedRemaining < value"
                @click="adjustFixed(value, 1)"
              />
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <UButton
            label="รีเซ็ต"
            color="neutral"
            variant="ghost"
            size="sm"
            icon="i-lucide-rotate-ccw"
            @click="resetFixed"
          />
        </div>

        <UAlert
          v-if="!fixedMatches"
          color="warning"
          variant="subtle"
          icon="i-lucide-alert-triangle"
          title="ยังรวมไม่ครบ"
          :description="`เลือกเพิ่มอีก ฿${formatNumber(fixedRemaining)} ให้ครบสิทธิ์`"
        />
        <UAlert
          v-else
          color="success"
          variant="subtle"
          icon="i-lucide-check"
          title="ครบตามจำนวนที่แอดมินแจกแล้ว"
          description="กดยืนยันเพื่อจำลองการรับคูปอง"
        />
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
          :disabled="!canConfirm"
          @click="confirm"
        />
      </div>
    </template>
  </UModal>
</template>
