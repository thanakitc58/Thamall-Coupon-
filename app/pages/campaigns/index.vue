<script setup lang="ts">
definePageMeta({
  layout: 'cms'
})

const toast = useToast()

type QuotaLimits = {
  perCampaign: number
  perDay: number
  perUser: number
}

type CouponItem = {
  id: string
  name: string
  description: string
  image: string
  inheritQuota: boolean
  quota: QuotaLimits
}

type CouponGroup = {
  id: string
  name: string
  description: string
  chooseCount: number
  coupons: CouponItem[]
  inheritCampaignQuota: boolean
  quota: QuotaLimits
}

const campaign = ref({
  name: 'Mid Year Sale',
  description: 'แคมเปญกลางปี เลือกคูปองตามกลุ่มที่กำหนด',
  startDate: '2025-06-01',
  endDate: '2025-06-30',
  status: 'Active' as const,
  quota: {
    perCampaign: 10000,
    perDay: 500,
    perUser: 2
  } satisfies QuotaLimits
})

const groups = ref<CouponGroup[]>([
  {
    id: 'food',
    name: 'Food Coupon',
    description: 'คูปองหมวดอาหารและเครื่องดื่ม',
    chooseCount: 2,
    inheritCampaignQuota: true,
    quota: { perCampaign: 10000, perDay: 500, perUser: 2 },
    coupons: [
      {
        id: 'a',
        name: 'Coupon A',
        description: 'ส่วนลด 50 บาท',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&h=80&fit=crop',
        inheritQuota: true,
        quota: { perCampaign: 10000, perDay: 500, perUser: 2 }
      },
      {
        id: 'b',
        name: 'Coupon B',
        description: 'ส่วนลด 100 บาท',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&h=80&fit=crop',
        inheritQuota: false,
        quota: { perCampaign: 200, perDay: 20, perUser: 1 }
      },
      {
        id: 'c',
        name: 'Coupon C',
        description: 'ซื้อ 1 แถม 1',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=80&h=80&fit=crop',
        inheritQuota: true,
        quota: { perCampaign: 10000, perDay: 500, perUser: 2 }
      },
      {
        id: 'd',
        name: 'Coupon D',
        description: 'ส่วนลด 30%',
        image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=80&h=80&fit=crop',
        inheritQuota: true,
        quota: { perCampaign: 10000, perDay: 500, perUser: 2 }
      },
      {
        id: 'e',
        name: 'Coupon E',
        description: 'ฟรีเครื่องดื่ม',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=80&h=80&fit=crop',
        inheritQuota: false,
        quota: { perCampaign: 100, perDay: 10, perUser: 1 }
      },
      {
        id: 'f',
        name: 'Coupon F',
        description: 'ส่วนลด 80 บาท',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=80&h=80&fit=crop',
        inheritQuota: true,
        quota: { perCampaign: 10000, perDay: 500, perUser: 2 }
      }
    ]
  },
  {
    id: 'fashion',
    name: 'Fashion Coupon',
    description: 'คูปองหมวดแฟชั่น',
    chooseCount: 1,
    inheritCampaignQuota: true,
    quota: { perCampaign: 10000, perDay: 500, perUser: 2 },
    coupons: [
      {
        id: 'f1',
        name: 'Fashion A',
        description: 'ส่วนลด 200 บาท',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=80&h=80&fit=crop',
        inheritQuota: true,
        quota: { perCampaign: 10000, perDay: 500, perUser: 2 }
      },
      {
        id: 'f2',
        name: 'Fashion B',
        description: 'ส่วนลด 15%',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=80&h=80&fit=crop',
        inheritQuota: true,
        quota: { perCampaign: 10000, perDay: 500, perUser: 2 }
      },
      {
        id: 'f3',
        name: 'Fashion C',
        description: 'ส่วนลด 100 บาท',
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=80&h=80&fit=crop',
        inheritQuota: true,
        quota: { perCampaign: 10000, perDay: 500, perUser: 2 }
      },
      {
        id: 'f4',
        name: 'Fashion D',
        description: 'ซื้อครบ 1,000 ลด 150',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=80&h=80&fit=crop',
        inheritQuota: true,
        quota: { perCampaign: 10000, perDay: 500, perUser: 2 }
      }
    ]
  },
  {
    id: 'travel',
    name: 'Travel Coupon',
    description: 'คูปองหมวดท่องเที่ยว',
    chooseCount: 1,
    inheritCampaignQuota: false,
    quota: { perCampaign: 3000, perDay: 100, perUser: 1 },
    coupons: [
      {
        id: 't1',
        name: 'Travel A',
        description: 'ส่วนลดโรงแรม 500',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=80&h=80&fit=crop',
        inheritQuota: true,
        quota: { perCampaign: 3000, perDay: 100, perUser: 1 }
      },
      {
        id: 't2',
        name: 'Travel B',
        description: 'ส่วนลดตั๋วเครื่องบิน',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=80&h=80&fit=crop',
        inheritQuota: true,
        quota: { perCampaign: 3000, perDay: 100, perUser: 1 }
      },
      {
        id: 't3',
        name: 'Travel C',
        description: 'แพ็กเกจทัวร์ลด 10%',
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=80&h=80&fit=crop',
        inheritQuota: false,
        quota: { perCampaign: 50, perDay: 5, perUser: 1 }
      }
    ]
  }
])

const selectedGroupId = ref('food')

const selectedGroup = computed(
  () => groups.value.find(group => group.id === selectedGroupId.value) ?? groups.value[0]
)

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US').format(value)

const effectiveGroupQuota = computed(() => {
  const group = selectedGroup.value
  if (!group) {
    return campaign.value.quota
  }

  return group.inheritCampaignQuota ? campaign.value.quota : group.quota
})

function selectGroup(id: string) {
  selectedGroupId.value = id
}

function onGroupInheritChange(value: boolean) {
  const group = selectedGroup.value
  if (!group) {
    return
  }

  group.inheritCampaignQuota = value
  if (value) {
    group.quota = { ...campaign.value.quota }
  }
}

function onCouponInheritChange(coupon: CouponItem, value: boolean) {
  coupon.inheritQuota = value
  if (value) {
    coupon.quota = { ...effectiveGroupQuota.value }
  }
}

function previewUserView() {
  toast.add({
    title: 'Preview (User View)',
    description: 'เปิดมุมมองผู้ใช้ (demo mock)',
    color: 'info',
    icon: 'i-lucide-eye'
  })
}

function saveDraft() {
  toast.add({
    title: 'Draft saved',
    description: `${campaign.value.name} — ${selectedGroup.value?.name} (demo mock)`,
    color: 'neutral',
    icon: 'i-lucide-save'
  })
}

function publishCampaign() {
  toast.add({
    title: 'Campaign published',
    description: `${campaign.value.name} published (demo mock)`,
    color: 'success',
    icon: 'i-lucide-send'
  })
}

function addGroup() {
  toast.add({
    title: 'Add Group',
    description: 'ฟอร์มเพิ่มกลุ่มจะมาในรอบถัดไป (MVP mock)',
    color: 'info',
    icon: 'i-lucide-plus'
  })
}

function addCoupon() {
  toast.add({
    title: 'Add Coupon',
    description: 'ฟอร์มเพิ่มคูปองจะมาในรอบถัดไป (MVP mock)',
    color: 'info',
    icon: 'i-lucide-plus'
  })
}
</script>

<template>
  <div>
    <header class="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-default bg-default/80 px-4 backdrop-blur-md sm:px-8">
      <nav
        class="flex items-center gap-2 text-sm sm:text-base"
        aria-label="Breadcrumb"
      >
        <span class="font-extrabold text-primary">Campaigns</span>
        <span class="text-muted">/</span>
        <span class="text-muted">{{ campaign.name }}</span>
        <span class="text-muted">/</span>
        <span class="text-muted">{{ selectedGroup?.name }}</span>
      </nav>

      <div class="flex items-center gap-2 sm:gap-3">
        <UTooltip text="Notifications">
          <UChip
            color="error"
            size="3xl"
            :show="true"
            :text="12"
          >
            <UButton
              icon="i-lucide-bell"
              color="neutral"
              variant="ghost"
              size="sm"
            />
          </UChip>
        </UTooltip>

        <div class="hidden items-center gap-2 sm:flex">
          <UAvatar
            src="https://api.dicebear.com/9.x/avataaars/svg?seed=Admin"
            alt="Admin avatar"
            size="xs"
          />
          <span class="text-sm font-medium">Admin</span>
        </div>
      </div>
    </header>

    <div class="space-y-6 px-4 py-6 sm:px-8">
      <section class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="flex flex-wrap items-center gap-3">
            <h2 class="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              {{ selectedGroup?.name }}
            </h2>
            <UBadge
              label="Active"
              color="success"
              variant="subtle"
            />
          </div>
          <p class="mt-1 text-muted">
            Campaign: {{ campaign.name }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <UButton
            label="Preview (User View)"
            icon="i-lucide-eye"
            color="neutral"
            variant="outline"
            @click="previewUserView"
          />
          <UButton
            label="Save Draft"
            icon="i-lucide-save"
            color="neutral"
            variant="outline"
            @click="saveDraft"
          />
          <UButton
            label="Publish"
            icon="i-lucide-send"
            color="primary"
            @click="publishCampaign"
          />
        </div>
      </section>

      <!-- Top-to-bottom workflow: 1–2 then 3–4 -->
      <section
        class="space-y-4"
        aria-label="Campaign configuration panels"
      >
        <div class="grid gap-4 lg:grid-cols-2">
          <!-- 1. Campaign Information -->
          <article class="min-w-0">
            <UCard
              :ui="{
                root: 'h-full',
                body: 'space-y-4'
              }"
            >
              <template #header>
                <div class="flex items-center justify-between gap-2">
                  <h3 class="flex items-center gap-2 text-sm font-bold text-primary">
                    <span class="flex size-6 items-center justify-center rounded bg-primary text-xs text-white">1</span>
                    Campaign Information
                  </h3>
                  <UButton
                    label="Edit"
                    color="primary"
                    variant="link"
                    size="xs"
                  />
                </div>
              </template>

              <dl class="space-y-3 text-sm">
                <div>
                  <dt class="text-xs font-medium uppercase tracking-wide text-muted">
                    Campaign Name
                  </dt>
                  <dd class="mt-0.5 font-semibold">
                    {{ campaign.name }}
                  </dd>
                </div>
                <div>
                  <dt class="text-xs font-medium uppercase tracking-wide text-muted">
                    Description
                  </dt>
                  <dd class="mt-0.5 text-toned">
                    {{ campaign.description }}
                  </dd>
                </div>
                <div>
                  <dt class="text-xs font-medium uppercase tracking-wide text-muted">
                    Period
                  </dt>
                  <dd class="mt-0.5 font-medium">
                    {{ campaign.startDate }} — {{ campaign.endDate }}
                  </dd>
                </div>
                <div>
                  <dt class="text-xs font-medium uppercase tracking-wide text-muted">
                    Status
                  </dt>
                  <dd class="mt-1">
                    <UBadge
                      :label="campaign.status"
                      color="success"
                      variant="subtle"
                    />
                  </dd>
                </div>
              </dl>

              <USeparator />

              <div class="space-y-3">
                <h4 class="text-xs font-bold uppercase tracking-wide text-muted">
                  Campaign Quota
                </h4>
                <div class="grid grid-cols-3 gap-2">
                  <div class="rounded-md border border-default bg-muted/40 px-3 py-2">
                    <p class="text-xs text-muted">
                      Per Campaign
                    </p>
                    <p class="font-semibold tabular-nums">
                      {{ formatNumber(campaign.quota.perCampaign) }}
                    </p>
                  </div>
                  <div class="rounded-md border border-default bg-muted/40 px-3 py-2">
                    <p class="text-xs text-muted">
                      Per Day
                    </p>
                    <p class="font-semibold tabular-nums">
                      {{ formatNumber(campaign.quota.perDay) }}
                    </p>
                  </div>
                  <div class="rounded-md border border-default bg-muted/40 px-3 py-2">
                    <p class="text-xs text-muted">
                      Per User
                    </p>
                    <p class="font-semibold tabular-nums">
                      {{ formatNumber(campaign.quota.perUser) }}
                    </p>
                  </div>
                </div>
              </div>
            </UCard>
          </article>

          <!-- 2. Coupon Groups -->
          <article class="min-w-0">
            <UCard
              :ui="{
                root: 'h-full',
                body: 'space-y-3'
              }"
            >
              <template #header>
                <div class="flex items-center justify-between gap-2">
                  <h3 class="flex items-center gap-2 text-sm font-bold text-primary">
                    <span class="flex size-6 items-center justify-center rounded bg-primary text-xs text-white">2</span>
                    Coupon Groups
                  </h3>
                  <UButton
                    label="Add Group"
                    icon="i-lucide-plus"
                    color="primary"
                    variant="link"
                    size="xs"
                    @click="addGroup"
                  />
                </div>
              </template>

              <button
                v-for="group in groups"
                :key="group.id"
                type="button"
                class="w-full rounded-lg border px-3 py-3 text-left transition-colors"
                :class="selectedGroupId === group.id
                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                  : 'border-default bg-elevated hover:border-accented'"
                @click="selectGroup(group.id)"
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <p class="font-semibold">
                      {{ group.name }}
                    </p>
                    <p class="mt-0.5 text-xs text-muted">
                      เลือก {{ group.chooseCount }} จาก {{ group.coupons.length }} คูปอง
                    </p>
                  </div>
                  <UBadge
                    :label="`${group.coupons.length} Coupons`"
                    color="neutral"
                    variant="subtle"
                    size="sm"
                  />
                </div>
              </button>
            </UCard>
          </article>
        </div>

        <div class="grid gap-4 lg:grid-cols-2">
          <!-- 3. Group Detail -->
          <article class="min-w-0">
            <UCard
              v-if="selectedGroup"
              :ui="{
                root: 'h-full',
                body: 'space-y-5'
              }"
            >
              <template #header>
                <div class="flex items-center justify-between gap-2">
                  <h3 class="flex min-w-0 items-center gap-2 text-sm font-bold text-primary">
                    <span class="flex size-6 shrink-0 items-center justify-center rounded bg-primary text-xs text-white">3</span>
                    <span class="truncate">Group Detail : {{ selectedGroup.name }}</span>
                  </h3>
                  <UButton
                    label="Edit"
                    color="primary"
                    variant="link"
                    size="xs"
                  />
                </div>
              </template>

              <dl class="space-y-3 text-sm">
                <div>
                  <dt class="text-xs font-medium uppercase tracking-wide text-muted">
                    Group Name
                  </dt>
                  <dd class="mt-0.5 font-semibold">
                    {{ selectedGroup.name }}
                  </dd>
                </div>
                <div>
                  <dt class="text-xs font-medium uppercase tracking-wide text-muted">
                    Description
                  </dt>
                  <dd class="mt-0.5 text-toned">
                    {{ selectedGroup.description }}
                  </dd>
                </div>
              </dl>

              <div class="space-y-3 rounded-lg border border-default bg-muted/30 p-3">
                <h4 class="text-xs font-bold uppercase tracking-wide text-muted">
                  Selection Rule
                </h4>
                <div class="flex flex-wrap items-center gap-2 text-sm font-medium">
                  <span>Choose</span>
                  <UInput
                    v-model.number="selectedGroup.chooseCount"
                    type="number"
                    :min="1"
                    :max="selectedGroup.coupons.length"
                    class="w-16"
                    size="sm"
                  />
                  <span>Coupons from</span>
                  <UInput
                    :model-value="selectedGroup.coupons.length"
                    type="number"
                    disabled
                    class="w-16"
                    size="sm"
                  />
                  <span>Coupons</span>
                </div>
                <p class="text-xs text-muted">
                  ผู้ใช้เลือกได้ {{ selectedGroup.chooseCount }} จาก {{ selectedGroup.coupons.length }} คูปองในกลุ่มนี้
                </p>
              </div>

              <div class="space-y-3">
                <div class="flex items-center justify-between gap-3">
                  <h4 class="text-xs font-bold uppercase tracking-wide text-muted">
                    Group Quota
                  </h4>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-muted">Inherit Campaign Quota</span>
                    <USwitch
                      :model-value="selectedGroup.inheritCampaignQuota"
                      @update:model-value="onGroupInheritChange"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-2">
                  <div
                    class="rounded-md border px-3 py-2"
                    :class="selectedGroup.inheritCampaignQuota
                      ? 'border-default bg-muted/40 opacity-70'
                      : 'border-default bg-elevated'"
                  >
                    <p class="text-xs text-muted">
                      Per Campaign
                      <span
                        v-if="selectedGroup.inheritCampaignQuota"
                        class="text-dimmed"
                      >(inherited)</span>
                    </p>
                    <p class="font-semibold tabular-nums">
                      {{ formatNumber(effectiveGroupQuota.perCampaign) }}
                    </p>
                  </div>
                  <div
                    class="rounded-md border px-3 py-2"
                    :class="selectedGroup.inheritCampaignQuota
                      ? 'border-default bg-muted/40 opacity-70'
                      : 'border-default bg-elevated'"
                  >
                    <p class="text-xs text-muted">
                      Per Day
                      <span
                        v-if="selectedGroup.inheritCampaignQuota"
                        class="text-dimmed"
                      >(inherited)</span>
                    </p>
                    <p class="font-semibold tabular-nums">
                      {{ formatNumber(effectiveGroupQuota.perDay) }}
                    </p>
                  </div>
                  <div
                    class="rounded-md border px-3 py-2"
                    :class="selectedGroup.inheritCampaignQuota
                      ? 'border-default bg-muted/40 opacity-70'
                      : 'border-default bg-elevated'"
                  >
                    <p class="text-xs text-muted">
                      Per User
                      <span
                        v-if="selectedGroup.inheritCampaignQuota"
                        class="text-dimmed"
                      >(inherited)</span>
                    </p>
                    <p class="font-semibold tabular-nums">
                      {{ formatNumber(effectiveGroupQuota.perUser) }}
                    </p>
                  </div>
                </div>
              </div>
            </UCard>
          </article>

          <!-- 4. Coupons in Group -->
          <article class="min-w-0">
            <UCard
              v-if="selectedGroup"
              :ui="{
                root: 'h-full',
                body: 'space-y-2 p-3 sm:p-4'
              }"
            >
              <template #header>
                <div class="flex items-center justify-between gap-2">
                  <h3 class="flex items-center gap-2 text-sm font-bold text-primary">
                    <span class="flex size-6 items-center justify-center rounded bg-primary text-xs text-white">4</span>
                    Coupons in Group ({{ selectedGroup.coupons.length }})
                  </h3>
                  <UButton
                    label="Add Coupon"
                    icon="i-lucide-plus"
                    color="primary"
                    variant="link"
                    size="xs"
                    @click="addCoupon"
                  />
                </div>
              </template>

              <div
                v-for="coupon in selectedGroup.coupons"
                :key="coupon.id"
                class="flex items-center gap-3 rounded-lg border border-default bg-elevated px-2 py-2"
              >
                <img
                  :src="coupon.image"
                  :alt="coupon.name"
                  class="size-10 shrink-0 rounded object-cover"
                >

                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-semibold">
                    {{ coupon.name }}
                  </p>
                  <p class="truncate text-xs text-muted">
                    {{ coupon.description }}
                  </p>
                  <p
                    v-if="!coupon.inheritQuota"
                    class="mt-0.5 text-[11px] text-warning"
                  >
                    Per Day: {{ coupon.quota.perDay }} · Per User: {{ coupon.quota.perUser }}
                  </p>
                </div>

                <div class="flex shrink-0 flex-col items-end gap-1">
                  <span
                    class="text-[10px] font-medium uppercase"
                    :class="coupon.inheritQuota ? 'text-success' : 'text-warning'"
                  >
                    {{ coupon.inheritQuota ? 'Inherit' : 'Override' }}
                  </span>
                  <USwitch
                    :model-value="coupon.inheritQuota"
                    size="sm"
                    @update:model-value="(value: boolean) => onCouponInheritChange(coupon, value)"
                  />
                </div>

                <UDropdownMenu
                  :items="[[
                    { label: 'Edit', icon: 'i-lucide-pencil' },
                    { label: 'Duplicate', icon: 'i-lucide-copy' },
                    { label: 'Remove', icon: 'i-lucide-trash-2', color: 'error' as const }
                  ]]"
                >
                  <UButton
                    icon="i-lucide-ellipsis-vertical"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                  />
                </UDropdownMenu>
              </div>
            </UCard>
          </article>
        </div>
      </section>

      <section>
        <UAlert
          color="info"
          variant="subtle"
          icon="i-lucide-info"
          title="4.1 Flexible Coupon Group Selection — MVP"
          description="โครง UI สำหรับเลือก X จาก Y คูปองในกลุ่มเดียวกัน และควบคุม Quota (Per Day / Per User / Per Campaign) ระดับ Campaign → Group → Coupon พร้อม Inherit / Override — ยังไม่เชื่อมฐานข้อมูล"
        />
      </section>
    </div>
  </div>
</template>
