<script setup lang="ts">
import type { Campaign, CampaignStatus } from '~/types/campaign'
import { cloneQuota } from '~/types/campaign'

const open = defineModel<boolean>('open', { required: true })

const props = defineProps<{
  campaign: Campaign
}>()

const emit = defineEmits<{
  save: [value: Campaign]
}>()

const draft = ref<Campaign>({
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  status: 'Draft',
  quota: { perCampaign: 0, perDay: 0, perUser: 0 }
})

const statusOptions: Array<{ label: string, value: CampaignStatus }> = [
  { label: 'Active', value: 'Active' },
  { label: 'Draft', value: 'Draft' },
  { label: 'Inactive', value: 'Inactive' }
]

watch(open, (isOpen) => {
  if (isOpen) {
    draft.value = {
      ...props.campaign,
      quota: cloneQuota(props.campaign.quota)
    }
  }
})

const canSave = computed(
  () =>
    !!draft.value.name.trim()
    && !!draft.value.startDate
    && !!draft.value.endDate
    && draft.value.endDate >= draft.value.startDate
)

function save() {
  if (!canSave.value) {
    return
  }

  emit('save', {
    ...draft.value,
    name: draft.value.name.trim(),
    description: draft.value.description.trim(),
    quota: cloneQuota(draft.value.quota)
  })
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="แก้ไขแคมเปญ"
    description="ตั้งค่าข้อมูลแคมเปญและ Campaign Quota (mock — ไม่บันทึก DB)"
  >
    <template #body>
      <div class="space-y-4">
        <UFormField
          label="ชื่อแคมเปญ"
          class="w-full"
        >
          <UInput
            v-model="draft.name"
            class="w-full"
            placeholder="เช่น Mid Year Sale"
          />
        </UFormField>

        <UFormField
          label="คำอธิบาย"
          class="w-full"
        >
          <UTextarea
            v-model="draft.description"
            class="w-full"
            :rows="3"
          />
        </UFormField>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <UFormField
            label="วันเริ่ม"
            class="w-full"
          >
            <UInput
              v-model="draft.startDate"
              type="date"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="วันสิ้นสุด"
            class="w-full"
          >
            <UInput
              v-model="draft.endDate"
              type="date"
              class="w-full"
            />
          </UFormField>
        </div>

        <UFormField
          label="สถานะ"
          class="w-full"
        >
          <USelect
            v-model="draft.status"
            :items="statusOptions"
            value-key="value"
            class="w-full"
          />
        </UFormField>

        <USeparator />

        <div class="space-y-2">
          <p class="text-sm font-semibold">
            Campaign Quota (Cap Max)
          </p>
          <CampaignsQuotaFields v-model="draft.quota" />
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
          label="บันทึก"
          color="primary"
          icon="i-lucide-check"
          :disabled="!canSave"
          @click="save"
        />
      </div>
    </template>
  </UModal>
</template>
