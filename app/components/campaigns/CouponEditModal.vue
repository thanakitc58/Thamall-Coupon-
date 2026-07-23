<script setup lang="ts">
import type { CouponItem, QuotaLimits } from '~/types/campaign'
import { cloneQuota, COUPON_IMAGE_POOL } from '~/types/campaign'

const open = defineModel<boolean>('open', { required: true })

const props = defineProps<{
  coupon: CouponItem | null
  isEditing: boolean
  parentQuota: QuotaLimits
}>()

const emit = defineEmits<{
  save: [payload: {
    name: string
    description: string
    image: string
    inheritQuota: boolean
    quota: QuotaLimits
  }]
}>()

const draftName = ref('')
const draftDescription = ref('')
const draftImage = ref(COUPON_IMAGE_POOL[0]!)
const draftInherit = ref(true)
const draftQuota = ref<QuotaLimits>({ perCampaign: 0, perDay: 0, perUser: 0 })

watch(open, (isOpen) => {
  if (!isOpen) {
    return
  }

  if (props.isEditing && props.coupon) {
    draftName.value = props.coupon.name
    draftDescription.value = props.coupon.description
    draftImage.value = props.coupon.image
    draftInherit.value = props.coupon.inheritQuota
    draftQuota.value = cloneQuota(
      props.coupon.inheritQuota
        ? props.parentQuota
        : props.coupon.quota
    )
  } else {
    draftName.value = ''
    draftDescription.value = ''
    draftImage.value = COUPON_IMAGE_POOL[
      Math.floor(Math.random() * COUPON_IMAGE_POOL.length)
    ]!
    draftInherit.value = true
    draftQuota.value = cloneQuota(props.parentQuota)
  }
})

watch(draftInherit, (inherit) => {
  if (inherit) {
    draftQuota.value = cloneQuota(props.parentQuota)
  }
})

const canSave = computed(() => !!draftName.value.trim())

function save() {
  if (!canSave.value) {
    return
  }

  emit('save', {
    name: draftName.value.trim(),
    description: draftDescription.value.trim(),
    image: draftImage.value,
    inheritQuota: draftInherit.value,
    quota: cloneQuota(draftQuota.value)
  })
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="isEditing ? 'แก้ไขคูปอง' : 'เพิ่มคูปอง'"
    description="ตั้งรายละเอียดคูปองและ Quota ระดับใบ (Cap Max ≤ Group)"
  >
    <template #body>
      <div class="space-y-4">
        <UFormField
          label="ชื่อคูปอง"
          class="w-full"
        >
          <UInput
            v-model="draftName"
            class="w-full"
            placeholder="เช่น Coupon G"
          />
        </UFormField>

        <UFormField
          label="รายละเอียด"
          class="w-full"
        >
          <UInput
            v-model="draftDescription"
            class="w-full"
            placeholder="เช่น ส่วนลด 50 บาท"
          />
        </UFormField>

        <UFormField
          label="URL รูปภาพ"
          class="w-full"
        >
          <UInput
            v-model="draftImage"
            class="w-full"
          />
        </UFormField>

        <div
          v-if="draftImage"
          class="flex items-center gap-3"
        >
          <img
            :src="draftImage"
            :alt="draftName || 'ตัวอย่างรูปคูปอง'"
            class="size-12 rounded object-cover"
          >
          <p class="text-xs text-muted">
            ตัวอย่างรูป
          </p>
        </div>

        <div class="flex items-center justify-between gap-3 rounded-lg border border-default px-3 py-2">
          <div>
            <p class="text-sm font-medium">
              Inherit Group Quota
            </p>
            <p class="text-xs text-muted">
              ปิดเพื่อ Override Cap Max ของคูปองใบนี้
            </p>
          </div>
          <USwitch v-model="draftInherit" />
        </div>

        <div class="space-y-2">
          <p class="text-sm font-semibold">
            Coupon Quota
          </p>
          <CampaignsQuotaFields
            v-model="draftQuota"
            :disabled="draftInherit"
            :parent-cap="parentQuota"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton
          label="ยกเลิก"
          color="neutral"
          variant="ghost"
          @click="open = false"
        />
        <UButton
          :label="isEditing ? 'อัปเดต' : 'เพิ่มคูปอง'"
          color="primary"
          icon="i-lucide-check"
          :disabled="!canSave"
          @click="save"
        />
      </div>
    </template>
  </UModal>
</template>
