<script setup lang="ts">
import type { ChildPattern } from '~/types/coupon-package'

const open = defineModel<boolean>('open', { required: true })

defineProps<{
  target: ChildPattern | null
}>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()
</script>

<template>
  <UModal
    v-model:open="open"
    title="ลบรูปแบบ"
    description="การกระทำนี้ไม่สามารถย้อนกลับได้"
  >
    <template #body>
      <UAlert
        color="error"
        variant="subtle"
        icon="i-lucide-trash-2"
        :title="target ? `ลบ ${target.name}?` : 'ลบรูปแบบนี้?'"
        description="รูปแบบนี้จะถูกลบออกจากแพ็กเกจ"
      />
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton
          label="ยกเลิก"
          color="neutral"
          variant="ghost"
          @click="emit('close')"
        />
        <UButton
          label="ลบ"
          color="error"
          icon="i-lucide-trash-2"
          @click="emit('confirm')"
        />
      </div>
    </template>
  </UModal>
</template>
