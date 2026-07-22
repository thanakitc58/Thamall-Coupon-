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

const toast = useToast()

const packageName = ref('Summer Package 1000')
const totalValue = ref(1000)
const description = ref('')

const patterns = ref<ChildPattern[]>([
  {
    id: '1',
    name: 'Pattern 1',
    items: [{ couponValue: 1000, quantity: 1 }]
  },
  {
    id: '2',
    name: 'Pattern 2',
    items: [{ couponValue: 500, quantity: 2 }]
  },
  {
    id: '3',
    name: 'Pattern 3',
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

const isPatternModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const editingPatternId = ref<string | null>(null)
const deleteTargetId = ref<string | null>(null)

const draftName = ref('')
const draftItems = ref<PatternItem[]>([
  { couponValue: 100, quantity: 1 }
])

const navItems = [
  { label: 'Dashboard', icon: 'i-lucide-layout-dashboard' },
  { label: 'Coupon Packages', icon: 'i-lucide-package', active: true },
  { label: 'Coupon Assignment', icon: 'i-lucide-user-check' },
  { label: 'Coupons', icon: 'i-lucide-ticket' },
  { label: 'Users', icon: 'i-lucide-users' },
  { label: 'Reports', icon: 'i-lucide-chart-column' }
]

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

const totalCoupons = computed(() =>
  patterns.value.reduce(
    (sum, pattern) =>
      sum + pattern.items.reduce((lineSum, item) => lineSum + item.quantity, 0),
    0
  )
)

const numberOfPatterns = computed(() => patterns.value.length)

const patternsSumTotal = computed(() =>
  patterns.value.reduce((sum, pattern) => sum + patternTotal(pattern), 0)
)

const hasParentValue = computed(() => Number(totalValue.value) > 0)
const hasPatterns = computed(() => patterns.value.length > 0)
const allPatternsMatchParent = computed(() =>
  patterns.value.length > 0
  && patterns.value.every(pattern => patternTotal(pattern) === Number(totalValue.value))
)

const canSavePackage = computed(
  () =>
    !!packageName.value.trim()
    && hasParentValue.value
    && hasPatterns.value
    && allPatternsMatchParent.value
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
  draftName.value = `Pattern ${patterns.value.length + 1}`
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
      description: 'Complete all workflow checklist items first.',
      color: 'warning',
      icon: 'i-lucide-alert-triangle'
    })
    return
  }

  toast.add({
    title: 'Package saved',
    description: `${packageName.value} saved successfully.`,
    color: 'success',
    icon: 'i-lucide-check'
  })
}
</script>

<template>
  <div class="flex min-h-screen bg-default">
    <!-- Sidebar -->
    <aside class="fixed inset-y-0 left-0 z-50 hidden w-[260px] flex-col bg-inverted text-inverted lg:flex">
      <div class="px-4 py-8">
        <h1 class="text-xl font-bold tracking-tight">
          COUPON SYSTEM
        </h1>
        <p class="mt-1 text-xs uppercase tracking-widest text-inverted/60">
          Management Console
        </p>
      </div>

      <nav class="flex flex-1 flex-col gap-1 px-2">
        <UButton
          v-for="item in navItems"
          :key="item.label"
          :label="item.label"
          :icon="item.icon"
          :color="item.active ? 'primary' : 'neutral'"
          :variant="item.active ? 'solid' : 'ghost'"
          class="justify-start"
          :ui="item.active
            ? undefined
            : { base: 'text-inverted/70 hover:bg-white/10 hover:text-inverted' }"
        />
      </nav>

      <div class="mt-auto space-y-3 px-2 pb-6">
        <UButton
          label="Settings"
          icon="i-lucide-settings"
          color="neutral"
          variant="ghost"
          class="w-full justify-start"
          :ui="{ base: 'text-inverted/70 hover:bg-white/10 hover:text-inverted' }"
        />

        <USeparator class="opacity-20" />

        <div class="flex items-center gap-3 px-2">
          <UAvatar
            src="https://api.dicebear.com/9.x/avataaars/svg?seed=Admin"
            alt="Admin avatar"
            size="md"
          />
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold">
              Admin
            </p>
            <p class="truncate text-xs text-inverted/60">
              admin@example.com
            </p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex min-h-screen flex-1 flex-col lg:ml-[260px]">
      <!-- Top bar -->
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
            label="Save Package"
            icon="i-lucide-save"
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
              Create Coupon Package (Parent)
            </h2>
            <UBadge
              label="MVP"
              color="primary"
              variant="subtle"
            />
          </div>
          <p class="mt-2 text-muted">
            Define the primary package details and its associated coupon patterns.
          </p>
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
                  label="Total Value (THB)"
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

            <UCard class="overflow-hidden bg-primary text-inverted">
              <div class="relative">
                <p class="mb-1 text-xs uppercase tracking-wider opacity-80">
                  Projected Total
                </p>
                <div class="flex items-baseline gap-2">
                  <span class="text-4xl font-bold tracking-tight">
                    {{ formatNumber(projectedTotal) }}
                  </span>
                  <span class="text-base">THB</span>
                </div>

                <USeparator class="my-4 opacity-20" />

                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="opacity-90">Total Coupons</span>
                    <span class="text-xl font-bold">{{ totalCoupons }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="opacity-90">Number of Patterns</span>
                    <span class="text-xl font-bold">{{ numberOfPatterns }}</span>
                  </div>
                </div>

                <UIcon
                  name="i-lucide-ticket"
                  class="pointer-events-none absolute -right-2 -bottom-2 size-24 opacity-10"
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
                    Parent Value exists
                  </span>
                </li>
                <li class="flex items-start gap-3">
                  <UIcon
                    :name="hasPatterns ? 'i-lucide-check-circle-2' : 'i-lucide-circle'"
                    :class="hasPatterns ? 'text-success' : 'text-muted'"
                    class="mt-0.5 size-5 shrink-0"
                  />
                  <span :class="hasPatterns ? 'text-default' : 'text-muted'">
                    At least one Pattern
                  </span>
                </li>
                <li class="flex items-start gap-3">
                  <UIcon
                    :name="allPatternsMatchParent ? 'i-lucide-check-circle-2' : 'i-lucide-circle'"
                    :class="allPatternsMatchParent ? 'text-success' : 'text-muted'"
                    class="mt-0.5 size-5 shrink-0"
                  />
                  <span :class="allPatternsMatchParent ? 'text-default' : 'text-muted'">
                    Every Pattern Total equals Parent Total
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
                description="Fix checklist items before saving the package."
              />
              <UAlert
                v-else
                class="mt-4"
                color="success"
                variant="subtle"
                icon="i-lucide-check"
                title="Ready to save"
                description="All workflow checks passed."
              />
            </UCard>
          </div>

          <!-- Right column -->
          <div class="col-span-12 lg:col-span-8">
            <UCard
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
                      Child Patterns
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
                    Total Package Value Calculation
                  </p>
                  <div class="flex items-center gap-2">
                    <span class="text-xs uppercase tracking-wider text-muted">
                      Sum Total:
                    </span>
                    <span class="text-xl font-bold text-primary">
                      {{ formatNumber(patternsSumTotal) }} บาท
                    </span>
                    <UKbd value="THB" />
                  </div>
                </div>
              </template>
            </UCard>
          </div>
        </section>

        <UAlert
          color="primary"
          variant="subtle"
          icon="i-lucide-lightbulb"
          title="Workflow Tip"
          description="Each child pattern total must equal the Parent Package total value. Save stays disabled until every checklist item passes."
        />
      </UContainer>
    </div>

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
