<script setup lang="ts">
import type {
  Campaign,
  CouponGroup,
  CouponItem,
  QuotaLimits
} from '~/types/campaign'
import type { DeliveryMode } from '~/types/coupon-package'
import {
  capQuotaToParent,
  cloneQuota,
  COUPON_IMAGE_POOL,
  createId
} from '~/types/campaign'

definePageMeta({
  layout: 'cms'
})

const toast = useToast()

const campaign = ref<Campaign>({
  name: 'Mid Year Sale',
  description: 'แคมเปญกลางปี เลือกคูปองตามกลุ่มที่กำหนด',
  startDate: '2025-06-01',
  endDate: '2025-06-30',
  status: 'Active',
  quota: {
    perCampaign: 10000,
    perDay: 500,
    perUser: 2
  }
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
        image: COUPON_IMAGE_POOL[0]!,
        inheritQuota: true,
        quota: { perCampaign: 10000, perDay: 500, perUser: 2 }
      },
      {
        id: 'b',
        name: 'Coupon B',
        description: 'ส่วนลด 100 บาท',
        image: COUPON_IMAGE_POOL[1]!,
        inheritQuota: false,
        quota: { perCampaign: 200, perDay: 20, perUser: 1 }
      },
      {
        id: 'c',
        name: 'Coupon C',
        description: 'ซื้อ 1 แถม 1',
        image: COUPON_IMAGE_POOL[2]!,
        inheritQuota: true,
        quota: { perCampaign: 10000, perDay: 500, perUser: 2 }
      },
      {
        id: 'd',
        name: 'Coupon D',
        description: 'ส่วนลด 30%',
        image: COUPON_IMAGE_POOL[3]!,
        inheritQuota: true,
        quota: { perCampaign: 10000, perDay: 500, perUser: 2 }
      },
      {
        id: 'e',
        name: 'Coupon E',
        description: 'ฟรีเครื่องดื่ม',
        image: COUPON_IMAGE_POOL[4]!,
        inheritQuota: false,
        quota: { perCampaign: 100, perDay: 10, perUser: 1 }
      },
      {
        id: 'f',
        name: 'Coupon F',
        description: 'ส่วนลด 80 บาท',
        image: COUPON_IMAGE_POOL[5]!,
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

const effectiveGroupQuota = computed(() => {
  const group = selectedGroup.value
  if (!group) {
    return campaign.value.quota
  }

  return group.inheritCampaignQuota ? campaign.value.quota : group.quota
})

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US').format(value)

const statusColor = computed(() => {
  if (campaign.value.status === 'Active') {
    return 'success' as const
  }
  if (campaign.value.status === 'Draft') {
    return 'warning' as const
  }
  return 'neutral' as const
})

function selectGroup(id: string) {
  selectedGroupId.value = id
}

function clampChooseCount(group: CouponGroup) {
  const max = Math.max(group.coupons.length, 0)
  if (max === 0) {
    group.chooseCount = 0
    return
  }
  if (group.chooseCount < 1) {
    group.chooseCount = 1
  }
  if (group.chooseCount > max) {
    group.chooseCount = max
  }
}

function cascadeQuotaFromCampaign() {
  for (const group of groups.value) {
    if (group.inheritCampaignQuota) {
      group.quota = cloneQuota(campaign.value.quota)
    } else {
      group.quota = capQuotaToParent(group.quota, campaign.value.quota)
    }

    const parent = group.inheritCampaignQuota
      ? campaign.value.quota
      : group.quota

    for (const coupon of group.coupons) {
      if (coupon.inheritQuota) {
        coupon.quota = cloneQuota(parent)
      } else {
        coupon.quota = capQuotaToParent(coupon.quota, parent)
      }
    }
  }
}

function cascadeQuotaFromGroup(group: CouponGroup) {
  const parent = group.inheritCampaignQuota
    ? campaign.value.quota
    : group.quota

  for (const coupon of group.coupons) {
    if (coupon.inheritQuota) {
      coupon.quota = cloneQuota(parent)
    } else {
      coupon.quota = capQuotaToParent(coupon.quota, parent)
    }
  }
}

function onGroupInheritChange(value: boolean) {
  const group = selectedGroup.value
  if (!group) {
    return
  }

  group.inheritCampaignQuota = value
  if (value) {
    group.quota = cloneQuota(campaign.value.quota)
  }
  cascadeQuotaFromGroup(group)
}

function onCouponInheritChange(coupon: CouponItem, value: boolean) {
  coupon.inheritQuota = value
  if (value) {
    coupon.quota = cloneQuota(effectiveGroupQuota.value)
    return
  }

  openEditCoupon(coupon)
}

function updateGroupQuotaField(field: keyof QuotaLimits, raw: number | string) {
  const group = selectedGroup.value
  if (!group || group.inheritCampaignQuota) {
    return
  }

  const next = Number(raw)
  const value = Number.isFinite(next) && next >= 0 ? Math.floor(next) : 0
  group.quota[field] = Math.min(value, campaign.value.quota[field])
  cascadeQuotaFromGroup(group)
}

watch(
  () => selectedGroup.value?.coupons.length,
  () => {
    if (selectedGroup.value) {
      clampChooseCount(selectedGroup.value)
    }
  }
)

watch(
  () => selectedGroup.value?.chooseCount,
  (value) => {
    const group = selectedGroup.value
    if (!group || value === undefined) {
      return
    }
    clampChooseCount(group)
  }
)

// --- Campaign edit ---
const isCampaignModalOpen = ref(false)

function openEditCampaign() {
  isCampaignModalOpen.value = true
}

function saveCampaign(value: Campaign) {
  campaign.value = value
  cascadeQuotaFromCampaign()
  toast.add({
    title: 'อัปเดตแคมเปญแล้ว',
    description: `${value.name} (mock — ยังไม่บันทึก DB)`,
    color: 'success',
    icon: 'i-lucide-check'
  })
}

// --- Group add/edit ---
const isGroupModalOpen = ref(false)
const editingGroupId = ref<string | null>(null)

const editingGroup = computed(
  () => groups.value.find(group => group.id === editingGroupId.value) ?? null
)

const isEditingGroup = computed(() => editingGroupId.value !== null)

function openAddGroup() {
  editingGroupId.value = null
  isGroupModalOpen.value = true
}

function openEditGroup() {
  if (!selectedGroup.value) {
    return
  }
  editingGroupId.value = selectedGroup.value.id
  isGroupModalOpen.value = true
}

function saveGroup(payload: {
  name: string
  description: string
  chooseCount: number
  inheritCampaignQuota: boolean
  quota: QuotaLimits
}) {
  if (editingGroupId.value) {
    const group = groups.value.find(item => item.id === editingGroupId.value)
    if (!group) {
      return
    }

    group.name = payload.name
    group.description = payload.description
    group.chooseCount = payload.chooseCount
    group.inheritCampaignQuota = payload.inheritCampaignQuota
    group.quota = payload.inheritCampaignQuota
      ? cloneQuota(campaign.value.quota)
      : capQuotaToParent(payload.quota, campaign.value.quota)

    clampChooseCount(group)
    cascadeQuotaFromGroup(group)

    toast.add({
      title: 'อัปเดตกลุ่มแล้ว',
      description: group.name,
      color: 'success',
      icon: 'i-lucide-check'
    })
    return
  }

  const newGroup: CouponGroup = {
    id: createId('group'),
    name: payload.name,
    description: payload.description,
    chooseCount: 1,
    inheritCampaignQuota: payload.inheritCampaignQuota,
    quota: payload.inheritCampaignQuota
      ? cloneQuota(campaign.value.quota)
      : capQuotaToParent(payload.quota, campaign.value.quota),
    coupons: []
  }

  groups.value.push(newGroup)
  selectedGroupId.value = newGroup.id

  toast.add({
    title: 'เพิ่มกลุ่มแล้ว',
    description: `${newGroup.name} — เพิ่มคูปองใน Step 4 ได้เลย`,
    color: 'success',
    icon: 'i-lucide-plus'
  })
}

// --- Coupon add/edit/duplicate/remove ---
const isCouponModalOpen = ref(false)
const editingCouponId = ref<string | null>(null)

const editingCoupon = computed(() => {
  if (!selectedGroup.value || !editingCouponId.value) {
    return null
  }
  return selectedGroup.value.coupons.find(item => item.id === editingCouponId.value) ?? null
})

const isEditingCoupon = computed(() => editingCouponId.value !== null)

function openAddCoupon() {
  editingCouponId.value = null
  isCouponModalOpen.value = true
}

function openEditCoupon(coupon: CouponItem) {
  editingCouponId.value = coupon.id
  isCouponModalOpen.value = true
}

function saveCoupon(payload: {
  name: string
  description: string
  image: string
  inheritQuota: boolean
  quota: QuotaLimits
}) {
  const group = selectedGroup.value
  if (!group) {
    return
  }

  const parent = effectiveGroupQuota.value
  const quota = payload.inheritQuota
    ? cloneQuota(parent)
    : capQuotaToParent(payload.quota, parent)

  if (editingCouponId.value) {
    const coupon = group.coupons.find(item => item.id === editingCouponId.value)
    if (!coupon) {
      return
    }

    coupon.name = payload.name
    coupon.description = payload.description
    coupon.image = payload.image
    coupon.inheritQuota = payload.inheritQuota
    coupon.quota = quota

    toast.add({
      title: 'อัปเดตคูปองแล้ว',
      description: coupon.name,
      color: 'success',
      icon: 'i-lucide-check'
    })
    return
  }

  group.coupons.push({
    id: createId('coupon'),
    name: payload.name,
    description: payload.description,
    image: payload.image,
    inheritQuota: payload.inheritQuota,
    quota
  })

  clampChooseCount(group)

  toast.add({
    title: 'เพิ่มคูปองแล้ว',
    description: `${payload.name} ใน ${group.name}`,
    color: 'success',
    icon: 'i-lucide-plus'
  })
}

function duplicateCoupon(coupon: CouponItem) {
  const group = selectedGroup.value
  if (!group) {
    return
  }

  group.coupons.push({
    ...coupon,
    id: createId('coupon'),
    name: `${coupon.name} (copy)`,
    quota: cloneQuota(coupon.quota)
  })
  clampChooseCount(group)

  toast.add({
    title: 'คัดลอกคูปองแล้ว',
    description: `${coupon.name} (copy)`,
    color: 'info',
    icon: 'i-lucide-copy'
  })
}

const isDeleteCouponOpen = ref(false)
const deleteCouponTarget = ref<CouponItem | null>(null)

function openDeleteCoupon(coupon: CouponItem) {
  deleteCouponTarget.value = coupon
  isDeleteCouponOpen.value = true
}

function confirmDeleteCoupon() {
  const group = selectedGroup.value
  const target = deleteCouponTarget.value
  if (!group || !target) {
    isDeleteCouponOpen.value = false
    return
  }

  group.coupons = group.coupons.filter(item => item.id !== target.id)
  clampChooseCount(group)
  isDeleteCouponOpen.value = false
  deleteCouponTarget.value = null

  toast.add({
    title: 'ลบคูปองแล้ว',
    description: target.name,
    color: 'warning',
    icon: 'i-lucide-trash-2'
  })
}

function couponMenuItems(coupon: CouponItem) {
  return [[
    {
      label: 'Edit',
      icon: 'i-lucide-pencil',
      onSelect: () => openEditCoupon(coupon)
    },
    {
      label: 'Duplicate',
      icon: 'i-lucide-copy',
      onSelect: () => duplicateCoupon(coupon)
    },
    {
      label: 'Remove',
      icon: 'i-lucide-trash-2',
      color: 'error' as const,
      onSelect: () => openDeleteCoupon(coupon)
    }
  ]]
}

// --- Preview / draft / publish ---
const isPreviewOpen = ref(false)

function previewUserView() {
  if (!selectedGroup.value || selectedGroup.value.coupons.length === 0) {
    toast.add({
      title: 'ยังไม่มีคูปองในกลุ่ม',
      description: 'เพิ่มคูปองก่อนดู Preview',
      color: 'warning',
      icon: 'i-lucide-alert-triangle'
    })
    return
  }

  if (selectedGroup.value.chooseCount < 1) {
    toast.add({
      title: 'ตั้ง Selection Rule ก่อน',
      description: 'จำนวนที่เลือกได้ต้องอย่างน้อย 1',
      color: 'warning',
      icon: 'i-lucide-alert-triangle'
    })
    return
  }

  isPreviewOpen.value = true
}

function onPreviewConfirm(selectedIds: string[]) {
  const group = selectedGroup.value
  if (!group) {
    return
  }

  const names = group.coupons
    .filter(coupon => selectedIds.includes(coupon.id))
    .map(coupon => coupon.name)

  toast.add({
    title: 'ผู้ใช้เลือกคูปองแล้ว (mock)',
    description: names.join(', '),
    color: 'success',
    icon: 'i-lucide-gift'
  })
}

// --- Delivery (same pattern as 4.2) ---
const deliveryMode = ref<DeliveryMode | undefined>(undefined)

const deliveryOptions = [
  {
    value: 'everyone' as const,
    label: '1. ส่งทุกคน',
    description: 'มอบสิทธิ์คูปองแคมเปญให้ผู้ใช้งานทั้งหมดในระบบ'
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

function onDeliveryModeChange(mode?: DeliveryMode) {
  if (mode !== 'selected') {
    selectedUserIds.value = []
  }

  if (mode !== 'member_tier') {
    selectedTiers.value = []
  }
}

function cancelCampaign() {
  toast.add({
    title: 'Cancelled',
    description: 'Changes were discarded (mock).',
    color: 'neutral',
    icon: 'i-lucide-x'
  })
}

const canSaveCampaign = computed(() => {
  if (!hasDeliveryTarget.value || groups.value.length === 0) {
    return false
  }

  return groups.value.every(
    group => group.coupons.length > 0 && group.chooseCount >= 1
  )
})

function publishCampaign() {
  const invalid = groups.value.find(
    group => group.coupons.length === 0 || group.chooseCount < 1
  )

  if (invalid) {
    toast.add({
      title: 'Publish ไม่ได้',
      description: `กลุ่ม "${invalid.name}" ต้องมีคูปองและ Selection Rule`,
      color: 'warning',
      icon: 'i-lucide-alert-triangle'
    })
    return
  }

  if (!hasDeliveryTarget.value) {
    toast.add({
      title: 'Publish ไม่ได้',
      description: 'กรุณาเลือกวิธีส่งมอบคูปองให้ครบ',
      color: 'warning',
      icon: 'i-lucide-alert-triangle'
    })
    return
  }

  campaign.value.status = 'Active'
  toast.add({
    title: 'Save & Send Gift Card',
    description: `${campaign.value.name} — ${deliverySummary.value}`,
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
        <span class="text-muted">Flexible Coupon Group Selection</span>
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
          @click="cancelCampaign"
        />
        <UButton
          label="Save & Send Gift Card"
          icon="i-lucide-gift"
          color="primary"
          :disabled="!canSaveCampaign"
          @click="publishCampaign"
        />
      </div>
    </header>

    <div class="space-y-6 px-4 py-6 sm:px-8">
      <section class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="flex flex-wrap items-center gap-3">
            <h2 class="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              4.1 Flexible Coupon Group Selection
            </h2>
            <UBadge
              :label="campaign.status"
              :color="statusColor"
              variant="subtle"
            />
          </div>
          <p class="mt-2 max-w-3xl text-muted">
            ตั้งกลุ่มคูปองแบบเลือก X จาก Y พร้อม Quota Cap Max และส่งมอบให้ผู้รับ
            — {{ campaign.name }}{{ selectedGroup ? ` / ${selectedGroup.name}` : '' }}
          </p>
        </div>

        <UButton
          label="Preview (User View)"
          icon="i-lucide-eye"
          color="neutral"
          variant="outline"
          @click="previewUserView"
        />
      </section>

      <section
        class="space-y-4"
        aria-label="Campaign configuration panels"
      >
        <div class="grid gap-4 lg:grid-cols-2">
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
                    @click="openEditCampaign"
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
                      :color="statusColor"
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
                    @click="openAddGroup"
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

              <p
                v-if="groups.length === 0"
                class="text-sm text-muted"
              >
                ยังไม่มีกลุ่ม — กด Add Group เพื่อเริ่ม
              </p>
            </UCard>
          </article>
        </div>

        <div class="grid gap-4 lg:grid-cols-2">
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
                    @click="openEditGroup"
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
                    {{ selectedGroup.description || '—' }}
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
                    :min="selectedGroup.coupons.length ? 1 : 0"
                    :max="Math.max(selectedGroup.coupons.length, 1)"
                    :disabled="selectedGroup.coupons.length === 0"
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

                <div
                  v-if="selectedGroup.inheritCampaignQuota"
                  class="grid grid-cols-3 gap-2"
                >
                  <div class="rounded-md border border-default bg-muted/40 px-3 py-2 opacity-70">
                    <p class="text-xs text-muted">
                      Per Campaign <span class="text-dimmed">(inherited)</span>
                    </p>
                    <p class="font-semibold tabular-nums">
                      {{ formatNumber(effectiveGroupQuota.perCampaign) }}
                    </p>
                  </div>
                  <div class="rounded-md border border-default bg-muted/40 px-3 py-2 opacity-70">
                    <p class="text-xs text-muted">
                      Per Day <span class="text-dimmed">(inherited)</span>
                    </p>
                    <p class="font-semibold tabular-nums">
                      {{ formatNumber(effectiveGroupQuota.perDay) }}
                    </p>
                  </div>
                  <div class="rounded-md border border-default bg-muted/40 px-3 py-2 opacity-70">
                    <p class="text-xs text-muted">
                      Per User <span class="text-dimmed">(inherited)</span>
                    </p>
                    <p class="font-semibold tabular-nums">
                      {{ formatNumber(effectiveGroupQuota.perUser) }}
                    </p>
                  </div>
                </div>

                <div
                  v-else
                  class="space-y-2"
                >
                  <p class="text-xs text-warning">
                    Override — ค่าต้องไม่เกิน Campaign Cap Max
                  </p>
                  <div class="grid grid-cols-3 gap-2">
                    <UFormField label="Per Campaign">
                      <UInput
                        :model-value="selectedGroup.quota.perCampaign"
                        type="number"
                        :min="0"
                        :max="campaign.quota.perCampaign"
                        size="sm"
                        @update:model-value="updateGroupQuotaField('perCampaign', $event as string | number)"
                      />
                    </UFormField>
                    <UFormField label="Per Day">
                      <UInput
                        :model-value="selectedGroup.quota.perDay"
                        type="number"
                        :min="0"
                        :max="campaign.quota.perDay"
                        size="sm"
                        @update:model-value="updateGroupQuotaField('perDay', $event as string | number)"
                      />
                    </UFormField>
                    <UFormField label="Per User">
                      <UInput
                        :model-value="selectedGroup.quota.perUser"
                        type="number"
                        :min="0"
                        :max="campaign.quota.perUser"
                        size="sm"
                        @update:model-value="updateGroupQuotaField('perUser', $event as string | number)"
                      />
                    </UFormField>
                  </div>
                </div>
              </div>
            </UCard>
          </article>

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
                    @click="openAddCoupon"
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
                    Cap: Day {{ coupon.quota.perDay }} · User {{ coupon.quota.perUser }} · Campaign {{ formatNumber(coupon.quota.perCampaign) }}
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

                <UDropdownMenu :items="couponMenuItems(coupon)">
                  <UButton
                    icon="i-lucide-ellipsis-vertical"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                  />
                </UDropdownMenu>
              </div>

              <p
                v-if="selectedGroup.coupons.length === 0"
                class="px-1 py-6 text-center text-sm text-muted"
              >
                ยังไม่มีคูปองในกลุ่มนี้ — กด Add Coupon
              </p>
            </UCard>
          </article>
        </div>
      </section>

      <CouponPackageDeliverySection
        v-model:delivery-mode="deliveryMode"
        v-model:selected-user-ids="selectedUserIds"
        v-model:selected-tiers="selectedTiers"
        :delivery-options="deliveryOptions"
        :mock-users="mockUsers"
        :member-tiers="memberTiers"
        :delivery-summary="deliverySummary"
        @change="onDeliveryModeChange"
      />
    </div>

    <CampaignsCampaignEditModal
      v-model:open="isCampaignModalOpen"
      :campaign="campaign"
      @save="saveCampaign"
    />

    <CampaignsGroupEditModal
      v-model:open="isGroupModalOpen"
      :group="editingGroup"
      :is-editing="isEditingGroup"
      :campaign-quota="campaign.quota"
      @save="saveGroup"
    />

    <CampaignsCouponEditModal
      v-model:open="isCouponModalOpen"
      :coupon="editingCoupon"
      :is-editing="isEditingCoupon"
      :parent-quota="effectiveGroupQuota"
      @save="saveCoupon"
    />

    <CampaignsPreviewUserModal
      v-model:open="isPreviewOpen"
      :group="selectedGroup ?? null"
      @confirm="onPreviewConfirm"
    />

    <UModal
      v-model:open="isDeleteCouponOpen"
      title="ลบคูปอง"
      description="การลบนี้มีผลเฉพาะในหน้านี้ (mock)"
    >
      <template #body>
        <UAlert
          color="error"
          variant="subtle"
          icon="i-lucide-trash-2"
          :title="deleteCouponTarget ? `ลบ ${deleteCouponTarget.name}?` : 'ลบคูปองนี้?'"
          description="Selection Rule จะถูกปรับให้อัตโนมัติถ้าเกินจำนวนคูปองที่เหลือ"
        />
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton
            label="ยกเลิก"
            color="neutral"
            variant="ghost"
            @click="isDeleteCouponOpen = false"
          />
          <UButton
            label="ลบ"
            color="error"
            icon="i-lucide-trash-2"
            @click="confirmDeleteCoupon"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
