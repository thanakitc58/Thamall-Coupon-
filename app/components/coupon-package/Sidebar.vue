<script setup lang="ts">
const packageName = defineModel<string>('packageName', { required: true })
const totalValue = defineModel<number>('totalValue', { required: true })
const description = defineModel<string>('description', { required: true })

defineProps<{
  isFixedNoChild: boolean
  isWithChild: boolean
  projectedTotal: number
  numberOfPatterns: number
  hasParentValue: boolean
  hasPatterns: boolean
  allPatternsMatchParent: boolean
  hasDeliveryTarget: boolean
  canSavePackage: boolean
  packageModeSummary: string
  deliverySummary: string
  formatNumber: (value: number) => string
}>()
</script>

<template>
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
</template>
