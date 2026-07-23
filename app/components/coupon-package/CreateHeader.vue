<script setup lang="ts">
defineProps<{
  canSave: boolean
}>()

const emit = defineEmits<{
  cancel: []
  save: []
}>()
</script>

<template>
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
        @click="emit('cancel')"
      />
      <UButton
        label="Save & Send Gift Card"
        icon="i-lucide-gift"
        color="primary"
        :disabled="!canSave"
        @click="emit('save')"
      />
    </div>
  </header>
</template>
