<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

type PatternLine = {
  value: number
  quantity: number
}

type ChildPattern = {
  id: string
  name: string
  subtitle: string
  lines: PatternLine[]
}

const toast = useToast()

const packageName = ref('Summer Package 1000')
const totalValue = ref(1000)
const description = ref('')

const patterns = ref<ChildPattern[]>([
  {
    id: '1',
    name: 'Pattern 1',
    subtitle: 'High Value',
    lines: [{ value: 1000, quantity: 1 }]
  },
  {
    id: '2',
    name: 'Pattern 2',
    subtitle: 'Medium Value',
    lines: [{ value: 500, quantity: 2 }]
  },
  {
    id: '3',
    name: 'Pattern 3',
    subtitle: 'Micro Vouchers',
    lines: [
      { value: 100, quantity: 5 },
      { value: 500, quantity: 1 }
    ]
  }
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

const patternRowTotal = (pattern: ChildPattern) =>
  pattern.lines.reduce((sum, line) => sum + line.value * line.quantity, 0)

const projectedTotal = computed(() => totalValue.value || 0)

const totalCoupons = computed(() =>
  patterns.value.reduce(
    (sum, pattern) =>
      sum + pattern.lines.reduce((lineSum, line) => lineSum + line.quantity, 0),
    0
  )
)

const patternsSumTotal = computed(() =>
  patterns.value.reduce((sum, pattern) => sum + patternRowTotal(pattern), 0)
)

const UButton = resolveComponent('UButton')
const UIcon = resolveComponent('UIcon')

const columns: TableColumn<ChildPattern>[] = [
  {
    accessorKey: 'name',
    header: 'Pattern',
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
          h('p', { class: 'text-xs text-muted' }, pattern.subtitle)
        ])
      ])
    }
  },
  {
    accessorKey: 'value',
    header: () => h('div', { class: 'text-right' }, 'Value (THB)'),
    cell: ({ row }) => {
      const lines = row.original.lines

      return h(
        'div',
        { class: 'text-right font-semibold space-y-0.5' },
        lines.map((line, index) =>
          h(
            'p',
            { class: index > 0 ? 'text-xs text-muted' : undefined },
            formatNumber(line.value)
          )
        )
      )
    }
  },
  {
    accessorKey: 'quantity',
    header: () => h('div', { class: 'text-center' }, 'Quantity'),
    cell: ({ row }) => {
      const lines = row.original.lines

      return h(
        'div',
        { class: 'text-center space-y-0.5' },
        lines.map((line, index) =>
          h(
            'p',
            { class: index > 0 ? 'text-xs text-muted' : undefined },
            String(line.quantity)
          )
        )
      )
    }
  },
  {
    accessorKey: 'total',
    header: () => h('div', { class: 'text-right' }, 'Total'),
    cell: ({ row }) => {
      const lines = row.original.lines

      return h(
        'div',
        { class: 'text-right font-bold text-primary space-y-0.5' },
        lines.map((line, index) =>
          h(
            'p',
            { class: index > 0 ? 'text-xs text-muted font-semibold' : undefined },
            formatNumber(line.value * line.quantity)
          )
        )
      )
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
          onClick: () => editPattern(row.original)
        }),
        h(UButton, {
          icon: 'i-lucide-trash-2',
          color: 'error',
          variant: 'ghost',
          size: 'sm',
          onClick: () => removePattern(row.original.id)
        })
      ])
  }
]

function addPattern() {
  const next = patterns.value.length + 1

  patterns.value.push({
    id: String(Date.now()),
    name: `Pattern ${next}`,
    subtitle: 'New Pattern',
    lines: [{ value: 100, quantity: 1 }]
  })

  toast.add({
    title: 'Pattern added',
    description: `Pattern ${next} was added to the package.`,
    color: 'success',
    icon: 'i-lucide-plus'
  })
}

function editPattern(pattern: ChildPattern) {
  toast.add({
    title: 'Edit pattern',
    description: `${pattern.name} (mock — no editor yet)`,
    color: 'info',
    icon: 'i-lucide-pencil'
  })
}

function removePattern(id: string) {
  const target = patterns.value.find(pattern => pattern.id === id)
  patterns.value = patterns.value.filter(pattern => pattern.id !== id)

  toast.add({
    title: 'Pattern removed',
    description: target ? `${target.name} was removed.` : 'Pattern removed.',
    color: 'warning',
    icon: 'i-lucide-trash-2'
  })
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
  if (!packageName.value.trim()) {
    toast.add({
      title: 'Package name required',
      color: 'warning',
      icon: 'i-lucide-alert-triangle'
    })
    return
  }

  if (patternsSumTotal.value !== projectedTotal.value) {
    toast.add({
      title: 'Totals do not match',
      description: `Child patterns sum to ${formatNumber(patternsSumTotal.value)} but package total is ${formatNumber(projectedTotal.value)}.`,
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
    return
  }

  toast.add({
    title: 'Package saved',
    description: `${packageName.value} is ready (mock).`,
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

            <div class="relative overflow-hidden rounded-xl bg-primary p-6 text-inverted shadow-lg">
              <div class="relative z-10">
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

                <div class="flex items-center justify-between">
                  <span class="opacity-90">Total Coupons</span>
                  <span class="text-xl font-bold">{{ totalCoupons }}</span>
                </div>
              </div>

              <UIcon
                name="i-lucide-ticket"
                class="pointer-events-none absolute -right-6 -bottom-6 size-28 opacity-10"
              />
            </div>
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
                    @click="addPattern"
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

        <!-- Workflow tip -->
        <UAlert
          color="primary"
          variant="subtle"
          icon="i-lucide-lightbulb"
          title="Workflow Tip"
          description="The total value of all child patterns must equal the Parent Package total value. Any discrepancy will prevent the package from being published for assignment."
        />
      </UContainer>
    </div>
  </div>
</template>
