<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

type PatternItem = {
  couponValue: number
  quantity: number
}

type ChildPattern = {
  id: string
  name: string
  items: PatternItem[]
}

definePageMeta({
  layout: 'cms'
})

const toast = useToast()

const packageName = ref('Summer Package 1000')
const totalValue = ref(1000)
const description = ref('สิทธิ์รวม 1,000 บาท — ลูกค้าเลือกแบ่งเป็น Child Pattern ตามที่กำหนด')

const patterns = ref<ChildPattern[]>([
  {
    id: '1',
    name: 'รูปแบบที่ 1',
    items: [{ couponValue: 1000, quantity: 1 }]
  },
  {
    id: '2',
    name: 'รูปแบบที่ 2',
    items: [{ couponValue: 500, quantity: 2 }]
  },
  {
    id: '3',
    name: 'รูปแบบที่ 3',
    items: [
      { couponValue: 100, quantity: 5 },
      { couponValue: 500, quantity: 1 }
    ]
  }
])

const couponOptions = [
  { label: '20', value: 20 },
  { label: '50', value: 50 },
  { label: '100', value: 100 },
  { label: '500', value: 500 },
  { label: '1000', value: 1000 }
]

type PackageMode = 'with_child' | 'fixed_no_child'
type DeliveryMode = 'everyone' | 'selected' | 'member_tier'

const packageMode = ref<PackageMode>('with_child')

const packageModeOptions = [
  {
    value: 'with_child' as const,
    label: 'ส่งแบบมี Child Patterns',
    description: 'แอดมินกำหนดรูปแบบการแบ่งไว้ล่วงหน้า ลูกค้าเลือกได้เฉพาะรูปแบบที่ตั้งไว้'
  },
  {
    value: 'fixed_no_child' as const,
    label: 'ส่งแบบ Fixed (ไม่มี Child)',
    description: 'ส่งมูลค่าคงที่ไปเลย เช่น 1,000 บาท — ลูกค้าไปเลือกแบ่งเองทีหลัง (ไม่ต้องสร้าง Pattern)'
  }
]

const deliveryMode = ref<DeliveryMode | undefined>(undefined)

const deliveryOptions = [
  {
    value: 'everyone' as const,
    label: '1. ส่งทุกคน',
    description: 'มอบ Gift Card ให้ผู้ใช้งานทั้งหมดในระบบ'
  },
  {
    value: 'selected' as const,
    label: '2. ส่งเฉพาะบางคน',
    description: 'เลือกผู้รับรายบุคคลจากรายชื่อ'
  },
  {
    value: 'member_tier' as const,
    label: '3. ส่งให้เมมเบอร์ตามระดับ',
    description: 'เลือกตามระดับสมาชิก เช่น Bronze, Silver, Gold'
  }
]

const mockUsers = [
  { label: 'สมชาย ใจดี (somchai@example.com)', value: 'u1' },
  { label: 'สมหญิง รักดี (somying@example.com)', value: 'u2' },
  { label: 'วิชัย พาณิชย์ (wichai@example.com)', value: 'u3' },
  { label: 'นภา สุขใจ (napa@example.com)', value: 'u4' },
  { label: 'อารี มีสุข (aree@example.com)', value: 'u5' }
]

const selectedUserIds = ref<string[]>([])

const memberTiers = [
  { label: 'Bronze', value: 'bronze', description: 'สมาชิกระดับบรอนซ์' },
  { label: 'Silver', value: 'silver', description: 'สมาชิกระดับซิลเวอร์' },
  { label: 'Gold', value: 'gold', description: 'สมาชิกระดับโกลด์' }
]

const selectedTiers = ref<string[]>([])

const isPatternModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const editingPatternId = ref<string | null>(null)
const deleteTargetId = ref<string | null>(null)

const draftName = ref('')
const draftItems = ref<PatternItem[]>([
  { couponValue: 100, quantity: 1 }
])

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US').format(value)

const itemTotal = (item: PatternItem) => item.couponValue * item.quantity

const patternTotal = (pattern: ChildPattern) =>
  pattern.items.reduce((sum, item) => sum + itemTotal(item), 0)

const draftTotal = computed(() =>
  draftItems.value.reduce((sum, item) => sum + itemTotal(item), 0)
)

const draftMatchesParent = computed(
  () => draftTotal.value === Number(totalValue.value)
)

const projectedTotal = computed(() => Number(totalValue.value) || 0)

const numberOfPatterns = computed(() => patterns.value.length)

const hasParentValue = computed(() => Number(totalValue.value) > 0)
const hasPatterns = computed(() => patterns.value.length > 0)
const allPatternsMatchParent = computed(() =>
  patterns.value.length > 0
  && patterns.value.every(pattern => patternTotal(pattern) === Number(totalValue.value))
)

const isFixedNoChild = computed(() => packageMode.value === 'fixed_no_child')
const isWithChild = computed(() => packageMode.value === 'with_child')

const patternsReady = computed(() => {
  if (isFixedNoChild.value) {
    return true
  }

  return hasPatterns.value && allPatternsMatchParent.value
})

const hasDeliveryTarget = computed(() => {
  if (!deliveryMode.value) {
    return false
  }

  if (deliveryMode.value === 'everyone') {
    return true
  }

  if (deliveryMode.value === 'selected') {
    return selectedUserIds.value.length > 0
  }

  return selectedTiers.value.length > 0
})

const deliverySummary = computed(() => {
  if (deliveryMode.value === 'everyone') {
    return 'ส่งให้ทุกคนในระบบ'
  }

  if (deliveryMode.value === 'selected') {
    return `ส่งเฉพาะ ${selectedUserIds.value.length} คนที่เลือก`
  }

  if (deliveryMode.value === 'member_tier') {
    const labels = memberTiers
      .filter(tier => selectedTiers.value.includes(tier.value))
      .map(tier => tier.label)

    return labels.length
      ? `ส่งให้เมมเบอร์: ${labels.join(', ')}`
      : 'ยังไม่ได้เลือกระดับสมาชิก'
  }

  return 'ยังไม่ได้เลือกวิธีส่ง'
})

const packageModeSummary = computed(() =>
  isFixedNoChild.value
    ? `Fixed ${formatNumber(projectedTotal.value)} THB — ไม่มี Child (ลูกค้าแบ่งเอง)`
    : 'มี Child Patterns ให้ลูกค้าเลือก'
)

const canSavePackage = computed(
  () =>
    !!packageName.value.trim()
    && hasParentValue.value
    && patternsReady.value
    && hasDeliveryTarget.value
)

const isEditingPattern = computed(() => editingPatternId.value !== null)

const deleteTarget = computed(() =>
  patterns.value.find(pattern => pattern.id === deleteTargetId.value) ?? null
)

const UButton = resolveComponent('UButton')
const UIcon = resolveComponent('UIcon')

const columns: TableColumn<ChildPattern>[] = [
  {
    accessorKey: 'name',
    header: 'Pattern Name',
    cell: ({ row }) => {
      const pattern = row.original

      return h('div', { class: 'flex items-center gap-3' }, [
        h(
          'div',
          {
            class:
              'flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary'
          },
          [h(UIcon, { name: 'i-lucide-ticket', class: 'size-5' })]
        ),
        h('div', undefined, [
          h('p', { class: 'font-semibold text-primary' }, pattern.name),
          h(
            'p',
            { class: 'text-xs text-muted' },
            `${pattern.items.length} item${pattern.items.length === 1 ? '' : 's'}`
          )
        ])
      ])
    }
  },
  {
    accessorKey: 'couponValue',
    header: () => h('div', { class: 'text-right' }, 'Coupon Value'),
    cell: ({ row }) => {
      const items = row.original.items

      return h(
        'div',
        { class: 'text-right font-semibold space-y-0.5' },
        items.map((item, index) =>
          h(
            'p',
            { class: index > 0 ? 'text-xs text-muted' : undefined },
            formatNumber(item.couponValue)
          )
        )
      )
    }
  },
  {
    accessorKey: 'quantity',
    header: () => h('div', { class: 'text-center' }, 'Quantity'),
    cell: ({ row }) => {
      const items = row.original.items

      return h(
        'div',
        { class: 'text-center space-y-0.5' },
        items.map((item, index) =>
          h(
            'p',
            { class: index > 0 ? 'text-xs text-muted' : undefined },
            String(item.quantity)
          )
        )
      )
    }
  },
  {
    accessorKey: 'total',
    header: () => h('div', { class: 'text-right' }, 'Total'),
    cell: ({ row }) => {
      const pattern = row.original
      const matches = patternTotal(pattern) === Number(totalValue.value)

      return h('div', { class: 'text-right space-y-1' }, [
        h(
          'p',
          { class: matches ? 'font-bold text-success' : 'font-bold text-warning' },
          formatNumber(patternTotal(pattern))
        ),
        ...pattern.items.map(item =>
          h(
            'p',
            { class: 'text-xs text-muted' },
            formatNumber(itemTotal(item))
          )
        )
      ])
    }
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-center' }, 'Actions'),
    cell: ({ row }) =>
      h('div', { class: 'flex justify-center gap-1' }, [
        h(UButton, {
          icon: 'i-lucide-pencil',
          color: 'neutral',
          variant: 'ghost',
          size: 'sm',
          onClick: () => openEditPattern(row.original)
        }),
        h(UButton, {
          icon: 'i-lucide-trash-2',
          color: 'error',
          variant: 'ghost',
          size: 'sm',
          onClick: () => openDeletePattern(row.original.id)
        })
      ])
  }
]

function resetDraft() {
  draftName.value = `รูปแบบที่ ${patterns.value.length + 1}`
  draftItems.value = [{ couponValue: 100, quantity: 1 }]
  editingPatternId.value = null
}

function openAddPattern() {
  resetDraft()
  isPatternModalOpen.value = true
}

function openEditPattern(pattern: ChildPattern) {
  editingPatternId.value = pattern.id
  draftName.value = pattern.name
  draftItems.value = pattern.items.map(item => ({
    couponValue: item.couponValue,
    quantity: item.quantity
  }))
  isPatternModalOpen.value = true
}

function addDraftRow() {
  draftItems.value.push({ couponValue: 100, quantity: 1 })
}

function removeDraftRow(index: number) {
  if (draftItems.value.length === 1) {
    return
  }

  draftItems.value.splice(index, 1)
}

function closePatternModal() {
  isPatternModalOpen.value = false
  editingPatternId.value = null
}

function savePattern() {
  if (!draftName.value.trim()) {
    toast.add({
      title: 'Pattern name required',
      color: 'warning',
      icon: 'i-lucide-alert-triangle'
    })
    return
  }

  if (draftItems.value.some(item => !item.quantity || item.quantity < 1)) {
    toast.add({
      title: 'Invalid quantity',
      description: 'Each row needs a quantity of at least 1.',
      color: 'warning',
      icon: 'i-lucide-alert-triangle'
    })
    return
  }

  const payload: ChildPattern = {
    id: editingPatternId.value ?? String(Date.now()),
    name: draftName.value.trim(),
    items: draftItems.value.map(item => ({
      couponValue: Number(item.couponValue),
      quantity: Number(item.quantity)
    }))
  }

  if (editingPatternId.value) {
    const index = patterns.value.findIndex(
      pattern => pattern.id === editingPatternId.value
    )

    if (index !== -1) {
      patterns.value[index] = payload
    }

    toast.add({
      title: 'Pattern updated',
      description: `${payload.name} was updated.`,
      color: 'success',
      icon: 'i-lucide-check'
    })
  } else {
    patterns.value.push(payload)

    toast.add({
      title: 'Pattern added',
      description: `${payload.name} was added to the package.`,
      color: 'success',
      icon: 'i-lucide-plus'
    })
  }

  closePatternModal()
}

function openDeletePattern(id: string) {
  deleteTargetId.value = id
  isDeleteModalOpen.value = true
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false
  deleteTargetId.value = null
}

function confirmDeletePattern() {
  const target = deleteTarget.value

  if (!target) {
    closeDeleteModal()
    return
  }

  patterns.value = patterns.value.filter(pattern => pattern.id !== target.id)

  toast.add({
    title: 'Pattern removed',
    description: `${target.name} was removed.`,
    color: 'warning',
    icon: 'i-lucide-trash-2'
  })

  closeDeleteModal()
}

function onPackageModeChange(mode?: PackageMode) {
  if (mode === 'fixed_no_child') {
    description.value
      = 'ส่งมูลค่าคงที่ให้ลูกค้า — ลูกค้าเลือกแบ่งคูปองเองทีหลัง (ไม่สร้าง Child Pattern)'
  } else {
    description.value
      = 'สิทธิ์รวม — ลูกค้าเลือกแบ่งเป็น Child Pattern ตามที่แอดมินกำหนดไว้'
  }
}

function onDeliveryModeChange(mode?: DeliveryMode) {
  if (mode !== 'selected') {
    selectedUserIds.value = []
  }

  if (mode !== 'member_tier') {
    selectedTiers.value = []
  }
}

function cancelPackage() {
  toast.add({
    title: 'Cancelled',
    description: 'Changes were discarded (mock).',
    color: 'neutral',
    icon: 'i-lucide-x'
  })
}

function savePackage() {
  if (!canSavePackage.value) {
    toast.add({
      title: 'Cannot save package',
      description: isFixedNoChild.value
        ? 'กรุณาตั้งมูลค่า Fixed และวิธีส่ง Gift Card ให้ครบ'
        : 'กรุณาตั้ง Parent, Child Patterns และวิธีส่ง Gift Card ให้ครบ',
      color: 'warning',
      icon: 'i-lucide-alert-triangle'
    })
    return
  }

  toast.add({
    title: 'Package saved & Gift Card queued',
    description: `${packageName.value} — ${packageModeSummary.value} | ${deliverySummary.value} (demo mock)`,
    color: 'success',
    icon: 'i-lucide-gift'
  })
}
</script>

<template>
  <div>
    <header class="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-default bg-default/80 px-4 backdrop-blur-md sm:px-8">
      <div class="flex items-center gap-2 text-sm sm:text-base">
        <span class="font-extrabold text-primary">Coupon Manager</span>
        <span class="text-muted">/</span>
        <span class="text-muted">Create Coupon Package</span>
      </div>

      <div class="flex items-center gap-2 sm:gap-4">
        <div class="hidden items-center gap-1 sm:flex">
          <UTooltip text="Notifications">
            <UButton
              icon="i-lucide-bell"
              color="neutral"
              variant="ghost"
              size="sm"
            />
          </UTooltip>
          <UTooltip text="Help">
            <UButton
              icon="i-lucide-circle-help"
              color="neutral"
              variant="ghost"
              size="sm"
            />
          </UTooltip>
        </div>

        <UButton
          label="Cancel"
          color="neutral"
          variant="ghost"
          @click="cancelPackage"
        />
        <UButton
          label="Save & Send Gift Card"
          icon="i-lucide-gift"
          color="primary"
          :disabled="!canSavePackage"
          @click="savePackage"
        />
      </div>
    </header>

    <UContainer class="max-w-7xl space-y-8 py-8">
        <!-- Page header -->
        <section>
          <div class="flex flex-wrap items-center gap-2">
            <h2 class="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              4.2 Create Coupon Package
            </h2>
          </div>
          <p class="mt-2 max-w-3xl text-muted">
            เลือกโหมดส่งได้ 2 แบบ: (1) มี Child Patterns ให้ลูกค้าเลือกตามที่แอดมินตั้งไว้
            หรือ (2) ส่งมูลค่า Fixed ไปเลย แล้วให้ลูกค้าไปเลือกแบ่งเองทีหลัง
          </p>
        </section>

        <!-- Package mode -->
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
              v-model="packageMode"
              :items="packageModeOptions"
              value-key="value"
              class="gap-3"
              @update:model-value="onPackageModeChange"
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

        <!-- Bento grid -->
        <section class="grid grid-cols-12 gap-6">
          <!-- Left column -->
          <div class="col-span-12 space-y-6 lg:col-span-4">
            <UCard>
              <template #header>
                <div class="flex items-center gap-2 text-primary">
                  <UIcon
                    name="i-lucide-info"
                    class="size-5"
                  />
                  <h3 class="text-lg font-bold">
                    Package Info
                  </h3>
                </div>
              </template>

              <div class="space-y-4">
                <UFormField
                  label="Package Name"
                  class="w-full"
                >
                  <UInput
                    v-model="packageName"
                    placeholder="Enter package name..."
                    class="w-full"
                    size="lg"
                  />
                </UFormField>

                <UFormField
                  label="มูลค่ารวม Parent (THB)"
                  class="w-full"
                >
                  <UInput
                    v-model.number="totalValue"
                    type="number"
                    class="w-full"
                    size="lg"
                    :ui="{ base: 'text-right font-semibold text-primary' }"
                  >
                    <template #trailing>
                      <span class="text-xs font-medium text-muted">บาท</span>
                    </template>
                  </UInput>
                </UFormField>

                <UFormField
                  label="Description"
                  class="w-full"
                >
                  <UTextarea
                    v-model="description"
                    placeholder="Package description for internal use..."
                    :rows="3"
                    class="w-full"
                    autoresize
                  />
                </UFormField>
              </div>
            </UCard>

            <UCard class="overflow-hidden bg-[#1A1A1A] text-white">
              <div class="relative">
                <p class="mb-1 text-xs uppercase tracking-wider text-white/60">
                  {{ isFixedNoChild ? 'Fixed Value' : 'Projected Total' }}
                </p>
                <div class="flex items-baseline gap-2">
                  <span class="text-4xl font-bold tracking-tight text-primary">
                    ฿{{ formatNumber(projectedTotal) }}
                  </span>
                </div>

                <USeparator class="my-4 opacity-20" />

                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-white/80">Number of Patterns</span>
                    <span class="text-xl font-bold">{{ numberOfPatterns }}</span>
                  </div>
                </div>

                <UIcon
                  name="i-lucide-ticket"
                  class="pointer-events-none absolute -right-2 -bottom-2 size-24 text-primary opacity-20"
                />
              </div>
            </UCard>

            <UCard>
              <template #header>
                <div class="flex items-center gap-2 text-primary">
                  <UIcon
                    name="i-lucide-list-checks"
                    class="size-5"
                  />
                  <h3 class="text-lg font-bold">
                    Workflow Validation
                  </h3>
                </div>
              </template>

              <ul class="space-y-3">
                <li class="flex items-start gap-3">
                  <UIcon
                    :name="hasParentValue ? 'i-lucide-check-circle-2' : 'i-lucide-circle'"
                    :class="hasParentValue ? 'text-success' : 'text-muted'"
                    class="mt-0.5 size-5 shrink-0"
                  />
                  <span :class="hasParentValue ? 'text-default' : 'text-muted'">
                    {{ isFixedNoChild ? 'มีมูลค่า Fixed ที่จะส่ง' : 'มีมูลค่า Parent (สิทธิ์รวม)' }}
                  </span>
                </li>
                <li
                  v-if="isWithChild"
                  class="flex items-start gap-3"
                >
                  <UIcon
                    :name="hasPatterns ? 'i-lucide-check-circle-2' : 'i-lucide-circle'"
                    :class="hasPatterns ? 'text-success' : 'text-muted'"
                    class="mt-0.5 size-5 shrink-0"
                  />
                  <span :class="hasPatterns ? 'text-default' : 'text-muted'">
                    มี Child Pattern อย่างน้อย 1 รูปแบบ
                  </span>
                </li>
                <li
                  v-if="isWithChild"
                  class="flex items-start gap-3"
                >
                  <UIcon
                    :name="allPatternsMatchParent ? 'i-lucide-check-circle-2' : 'i-lucide-circle'"
                    :class="allPatternsMatchParent ? 'text-success' : 'text-muted'"
                    class="mt-0.5 size-5 shrink-0"
                  />
                  <span :class="allPatternsMatchParent ? 'text-default' : 'text-muted'">
                    ทุกรูปแบบรวมมูลค่าเท่ากับ Parent
                  </span>
                </li>
                <li
                  v-else
                  class="flex items-start gap-3"
                >
                  <UIcon
                    name="i-lucide-check-circle-2"
                    class="mt-0.5 size-5 shrink-0 text-success"
                  />
                  <span>
                    ข้าม Child Patterns (ลูกค้าแบ่งเองทีหลัง)
                  </span>
                </li>
                <li class="flex items-start gap-3">
                  <UIcon
                    :name="hasDeliveryTarget ? 'i-lucide-check-circle-2' : 'i-lucide-circle'"
                    :class="hasDeliveryTarget ? 'text-success' : 'text-muted'"
                    class="mt-0.5 size-5 shrink-0"
                  />
                  <span :class="hasDeliveryTarget ? 'text-default' : 'text-muted'">
                    เลือกวิธีส่ง Gift Card แล้ว
                  </span>
                </li>
              </ul>

              <UAlert
                v-if="!canSavePackage"
                class="mt-4"
                color="warning"
                variant="subtle"
                icon="i-lucide-alert-triangle"
                title="Save disabled"
                :description="isFixedNoChild
                  ? 'ตั้งมูลค่า Fixed และวิธีส่ง Gift Card ให้ครบก่อนบันทึก'
                  : 'ตั้งค่า Parent, Child Patterns และวิธีส่ง Gift Card ให้ครบก่อนบันทึก'"
              />
              <UAlert
                v-else
                class="mt-4"
                color="success"
                variant="subtle"
                icon="i-lucide-check"
                title="Ready to save"
                :description="`${packageModeSummary} | ${deliverySummary}`"
              />
            </UCard>
          </div>

          <!-- Right column -->
          <div class="col-span-12 lg:col-span-8">
            <UCard
              v-if="isWithChild"
              :ui="{
                body: 'p-0 sm:p-0',
                header: 'bg-elevated',
                footer: 'bg-elevated'
              }"
              class="h-full"
            >
              <template #header>
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div class="flex items-center gap-2 text-primary">
                    <UIcon
                      name="i-lucide-git-branch"
                      class="size-5"
                    />
                    <h3 class="text-lg font-bold">
                      Child Patterns (รูปแบบการแบ่งคูปอง)
                    </h3>
                    <UBadge
                      :label="`${patterns.length}`"
                      color="primary"
                      variant="subtle"
                    />
                  </div>

                  <UButton
                    label="Add Pattern"
                    icon="i-lucide-plus"
                    color="primary"
                    @click="openAddPattern"
                  />
                </div>
              </template>

              <div class="p-4 sm:p-6">
                <UTable
                  :data="patterns"
                  :columns="columns"
                  class="w-full"
                />
              </div>

              <template #footer>
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <p class="font-semibold text-muted">
                    สถานะ Child Patterns
                  </p>
                  <div class="flex flex-wrap items-center gap-2">
                    <UBadge
                      :label="`${numberOfPatterns} รูปแบบ`"
                      color="neutral"
                      variant="subtle"
                    />
                    <UBadge
                      v-if="!hasPatterns"
                      label="ยังไม่มีรูปแบบ"
                      color="warning"
                      variant="subtle"
                      icon="i-lucide-alert-triangle"
                    />
                    <UBadge
                      v-else-if="allPatternsMatchParent"
                      :label="`ทุกอันเท่า Parent ${formatNumber(projectedTotal)}`"
                      color="success"
                      variant="subtle"
                      icon="i-lucide-check"
                    />
                    <UBadge
                      v-else
                      label="ยังมีรูปแบบที่มูลค่าไม่เท่า Parent"
                      color="warning"
                      variant="subtle"
                      icon="i-lucide-alert-triangle"
                    />
                  </div>
                </div>
              </template>
            </UCard>

            <UCard
              v-else
              class="h-full"
            >
              <template #header>
                <div class="flex items-center gap-2 text-primary">
                  <UIcon
                    name="i-lucide-banknote"
                    class="size-5"
                  />
                  <h3 class="text-lg font-bold">
                    Fixed Value Delivery (ไม่มี Child)
                  </h3>
                  <UBadge
                    label="Optional mode"
                    color="warning"
                    variant="subtle"
                  />
                </div>
              </template>

              <div class="space-y-6">
                <p class="text-muted">
                  โหมดนี้ไม่ต้องสร้าง Child Patterns — ส่งมูลค่าคงที่ไปให้ลูกค้า
                  แล้วให้ลูกค้าเลือกแบ่งคูปองเองทีหลังในแอป
                </p>

                <div class="rounded-lg bg-[#1A1A1A] p-6 text-white">
                  <p class="text-xs uppercase tracking-wider text-white/60">
                    มูลค่าที่จะส่งให้ลูกค้า
                  </p>
                  <div class="mt-2 flex items-baseline gap-2">
                    <span class="text-4xl font-bold text-primary">
                      ฿{{ formatNumber(projectedTotal) }}
                    </span>
                  </div>
                  <USeparator class="my-4 opacity-20" />
                  <p class="text-sm text-white/80">
                    ตัวอย่าง: ส่งบัตร 1,000 บาท → ลูกค้าไปเลือกว่าจะแบ่งเป็น 1×1000, 2×500 หรือผสมเอง
                  </p>
                </div>

                <UAlert
                  color="neutral"
                  variant="subtle"
                  icon="i-lucide-info"
                  title="ขอบเขต Demo"
                  description="หน้าจอให้ลูกค้าเลือกแบ่งเองยังไม่ทำใน MVP นี้ — โหมดนี้แสดงเฉพาะฝั่งแอดมินว่าส่ง Fixed ได้โดยไม่ต้องตั้ง Pattern"
                />
              </div>
            </UCard>
          </div>
        </section>

        <!-- Send Gift Card -->
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
                @update:model-value="onDeliveryModeChange"
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
      </UContainer>

    <!-- Add / Edit Pattern Modal -->
    <UModal
      v-model:open="isPatternModalOpen"
      :title="isEditingPattern ? 'Edit Pattern' : 'Add Pattern'"
      description="Build coupon rows so the pattern total matches the parent value."
    >
      <template #body>
        <div class="space-y-4">
          <UFormField
            label="Pattern Name"
            class="w-full"
          >
            <UInput
              v-model="draftName"
              placeholder="e.g. Pattern 4"
              class="w-full"
            />
          </UFormField>

          <USeparator />

          <div class="space-y-3">
            <div class="flex items-center justify-between gap-2">
              <p class="text-sm font-semibold">
                Coupon Rows
              </p>
              <UButton
                label="Add Row"
                icon="i-lucide-plus"
                color="neutral"
                variant="soft"
                size="sm"
                @click="addDraftRow"
              />
            </div>

            <div
              v-for="(item, index) in draftItems"
              :key="index"
              class="grid grid-cols-12 items-end gap-3"
            >
              <UFormField
                label="Coupon Value"
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
                label="Quantity"
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
                  @click="removeDraftRow(index)"
                />
              </div>
            </div>
          </div>

          <USeparator />

          <div class="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-elevated p-4">
            <div class="space-y-1">
              <p class="text-xs uppercase tracking-wider text-muted">
                Parent Value
              </p>
              <p class="text-lg font-bold">
                {{ formatNumber(projectedTotal) }} THB
              </p>
            </div>
            <div class="space-y-1 text-right">
              <p class="text-xs uppercase tracking-wider text-muted">
                Pattern Total
              </p>
              <p class="text-lg font-bold">
                {{ formatNumber(draftTotal) }} THB
              </p>
            </div>
          </div>

          <UAlert
            v-if="draftMatchesParent"
            color="success"
            variant="subtle"
            icon="i-lucide-check-circle-2"
            title="Totals match"
            description="Pattern total equals the parent package value."
          />
          <UAlert
            v-else
            color="warning"
            variant="subtle"
            icon="i-lucide-alert-triangle"
            title="Totals do not match"
            :description="`Pattern total is ${formatNumber(draftTotal)} but parent value is ${formatNumber(projectedTotal)}.`"
          />
        </div>
      </template>

      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton
            label="Cancel"
            color="neutral"
            variant="ghost"
            @click="closePatternModal"
          />
          <UButton
            :label="isEditingPattern ? 'Update Pattern' : 'Save Pattern'"
            color="primary"
            icon="i-lucide-check"
            @click="savePattern"
          />
        </div>
      </template>
    </UModal>

    <!-- Delete confirmation -->
    <UModal
      v-model:open="isDeleteModalOpen"
      title="Delete Pattern"
      description="This action cannot be undone."
    >
      <template #body>
        <UAlert
          color="error"
          variant="subtle"
          icon="i-lucide-trash-2"
          :title="deleteTarget ? `Delete ${deleteTarget.name}?` : 'Delete this pattern?'"
          description="The pattern will be removed from the package table."
        />
      </template>

      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton
            label="Cancel"
            color="neutral"
            variant="ghost"
            @click="closeDeleteModal"
          />
          <UButton
            label="Delete"
            color="error"
            icon="i-lucide-trash-2"
            @click="confirmDeletePattern"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
