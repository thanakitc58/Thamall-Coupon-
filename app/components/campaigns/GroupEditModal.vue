<script setup lang="ts">
import type { CouponGroup, QuotaLimits } from '~/types/campaign'
import { cloneQuota } from '~/types/campaign'

const open = defineModel<boolean>('open', { required: true })

const props = defineProps<{
  group: CouponGroup | null
  isEditing: boolean
  campaignQuota: QuotaLimits
}>()

const emit = defineEmits<{
  save: [payload: {
    name: string
    description: string
    chooseCount: number
    inheritCampaignQuota: boolean
    quota: QuotaLimits
  }]
}>()

const draftName = ref('')
const draftDescription = ref('')
const draftChooseCount = ref(1)
const draftInherit = ref(true)
const draftQuota = ref<QuotaLimits>({ perCampaign: 0, perDay: 0, perUser: 0 })

watch(open, (isOpen) => {
  if (!isOpen) {
    return
  }

  if (props.isEditing && props.group) {
    draftName.value = props.group.name
    draftDescription.value = props.group.description
    draftChooseCount.value = props.group.chooseCount
    draftInherit.value = props.group.inheritCampaignQuota
    draftQuota.value = cloneQuota(
      props.group.inheritCampaignQuota
        ? props.campaignQuota
        : props.group.quota
    )
  } else {
    draftName.value = ''
    draftDescription.value = ''
    draftChooseCount.value = 1
    draftInherit.value = true
    draftQuota.value = cloneQuota(props.campaignQuota)
  }
})

watch(draftInherit, (inherit) => {
  if (inherit) {
    draftQuota.value = cloneQuota(props.campaignQuota)
  }
})

const maxChoose = computed(() => {
  if (props.isEditing && props.group) {
    return Math.max(1, props.group.coupons.length || 1)
  }

  return 1
})

const canSave = computed(() => {
  const nameOk = !!draftName.value.trim()
  const chooseOk = draftChooseCount.value >= 1
    && draftChooseCount.value <= maxChoose.value

  return nameOk && chooseOk
})

function save() {
  if (!canSave.value) {
    return
  }

  emit('save', {
    name: draftName.value.trim(),
    description: draftDescription.value.trim(),
    chooseCount: draftChooseCount.value,
    inheritCampaignQuota: draftInherit.value,
    quota: cloneQuota(draftQuota.value)
  })
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="isEditing ? 'แก้ไขกลุ่มคูปอง' : 'เพิ่มกลุ่มคูปอง'"
    description="กำหนดชื่อกลุ่ม กฎเลือก X จาก Y และ Group Quota"
  >
    <template #body>
      <div class="space-y-4">
        <UFormField
          label="ชื่อกลุ่ม"
          class="w-full"
        >
          <UInput
            v-model="draftName"
            class="w-full"
            placeholder="เช่น Food Coupon"
          />
        </UFormField>

        <UFormField
          label="คำอธิบาย"
          class="w-full"
        >
          <UTextarea
            v-model="draftDescription"
            class="w-full"
            :rows="2"
          />
        </UFormField>

        <UFormField
          :label="`เลือกได้กี่ใบ (จากสูงสุด ${maxChoose})`"
          class="w-full"
        >
          <UInput
            v-model.number="draftChooseCount"
            type="number"
            :min="1"
            :max="maxChoose"
            class="w-full"
          />
        </UFormField>

        <div class="flex items-center justify-between gap-3 rounded-lg border border-default px-3 py-2">
          <div>
            <p class="text-sm font-medium">
              Inherit Campaign Quota
            </p>
            <p class="text-xs text-muted">
              ปิดเพื่อตั้ง Cap Max ของกลุ่มเอง (ต้องไม่เกิน Campaign)
            </p>
          </div>
          <USwitch v-model="draftInherit" />
        </div>

        <div class="space-y-2">
          <p class="text-sm font-semibold">
            Group Quota
          </p>
          <CampaignsQuotaFields
            v-model="draftQuota"
            :disabled="draftInherit"
            :parent-cap="campaignQuota"
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
          :label="isEditing ? 'อัปเดต' : 'เพิ่มกลุ่ม'"
          color="primary"
          icon="i-lucide-check"
          :disabled="!canSave"
          @click="save"
        />
      </div>
    </template>
  </UModal>
</template>
