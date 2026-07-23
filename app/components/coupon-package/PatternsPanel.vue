<script setup lang="ts">
import type { ChildPattern, PatternItem } from '~/types/coupon-package'

defineProps<{
  isWithChild: boolean
  patterns: ChildPattern[]
  numberOfPatterns: number
  hasPatterns: boolean
  allPatternsMatchParent: boolean
  projectedTotal: number
  formatNumber: (value: number) => string
  itemTotal: (item: PatternItem) => number
  patternTotal: (pattern: ChildPattern) => number
}>()

const emit = defineEmits<{
  add: []
  edit: [pattern: ChildPattern]
  delete: [id: string]
}>()
</script>

<template>
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
            label="เพิ่มรูปแบบ"
            icon="i-lucide-plus"
            color="primary"
            @click="emit('add')"
          />
        </div>
      </template>

      <div class="space-y-3 p-4 sm:p-6">
        <article
          v-for="pattern in patterns"
          :key="pattern.id"
          class="flex items-stretch gap-2 sm:gap-3"
        >
          <div
            class="flex shrink-0 items-center text-muted"
            aria-hidden="true"
          >
            <UIcon
              name="i-lucide-grip-vertical"
              class="size-5"
            />
          </div>

          <div class="min-w-0 flex-1 overflow-hidden rounded-xl border border-accented bg-elevated shadow-sm">
            <header class="flex flex-wrap items-center justify-between gap-2 border-b border-accented bg-accented px-4 py-3">
              <h4 class="font-semibold text-highlighted">
                {{ pattern.name }}
              </h4>
              <p class="text-sm font-semibold text-toned">
                รวมมูลค่า {{ formatNumber(patternTotal(pattern)) }} บาท
              </p>
            </header>

            <div class="bg-elevated px-4 py-2">
              <div class="grid grid-cols-3 gap-3 py-2 text-xs font-medium text-toned">
                <span>มูลค่าคูปอง (บาท)</span>
                <span>จำนวน (ใบ)</span>
                <span>รวม (บาท)</span>
              </div>

              <div
                v-for="(item, itemIndex) in pattern.items"
                :key="`${pattern.id}-${itemIndex}`"
                class="grid grid-cols-3 gap-3 border-t border-default py-2.5 text-sm font-medium text-highlighted"
              >
                <span>{{ formatNumber(item.couponValue) }}</span>
                <span>{{ item.quantity }}</span>
                <span>{{ formatNumber(itemTotal(item)) }}</span>
              </div>
            </div>
          </div>

          <div class="flex shrink-0 items-center gap-2">
            <UButton
              icon="i-lucide-pencil"
              color="info"
              variant="outline"
              size="sm"
              square
              aria-label="แก้ไขรูปแบบ"
              @click="emit('edit', pattern)"
            />
            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="outline"
              size="sm"
              square
              aria-label="ลบรูปแบบ"
              @click="emit('delete', pattern.id)"
            />
          </div>
        </article>

        <UAlert
          v-if="patterns.length === 0"
          color="warning"
          variant="subtle"
          icon="i-lucide-alert-triangle"
          title="ยังไม่มีรูปแบบ"
          description="กดปุ่มเพิ่มรูปแบบเพื่อสร้าง Child Pattern อย่างน้อย 1 รายการ"
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
</template>
