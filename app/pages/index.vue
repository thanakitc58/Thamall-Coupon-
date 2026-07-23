<script setup lang="ts">
definePageMeta({
  layout: 'cms'
})

const {
  packageName,
  totalValue,
  description,
  patterns,
  couponOptions,
  packageMode,
  packageModeOptions,
  deliveryMode,
  deliveryOptions,
  mockUsers,
  selectedUserIds,
  memberTiers,
  selectedTiers,
  isPatternModalOpen,
  isDeleteModalOpen,
  draftName,
  draftItems,
  formatNumber,
  itemTotal,
  patternTotal,
  draftTotal,
  draftMatchesParent,
  projectedTotal,
  numberOfPatterns,
  hasParentValue,
  hasPatterns,
  allPatternsMatchParent,
  isFixedNoChild,
  isWithChild,
  hasDeliveryTarget,
  deliverySummary,
  packageModeSummary,
  canSavePackage,
  isEditingPattern,
  deleteTarget,
  openAddPattern,
  openEditPattern,
  addDraftRow,
  removeDraftRow,
  closePatternModal,
  savePattern,
  openDeletePattern,
  closeDeleteModal,
  confirmDeletePattern,
  onPackageModeChange,
  onDeliveryModeChange,
  cancelPackage,
  savePackage
} = useCouponPackageForm()

const toast = useToast()
const isPreviewOpen = ref(false)

function openPreview() {
  if (!hasParentValue.value) {
    toast.add({
      title: 'ยังไม่มีมูลค่าแพ็กเกจ',
      description: 'ตั้งมูลค่า Parent / Fixed ก่อนดู Preview',
      color: 'warning',
      icon: 'i-lucide-alert-triangle'
    })
    return
  }

  if (isWithChild.value && (!hasPatterns.value || !allPatternsMatchParent.value)) {
    toast.add({
      title: 'Child Patterns ยังไม่พร้อม',
      description: 'ต้องมีรูปแบบอย่างน้อย 1 แบบ และมูลค่ารวมเท่า Parent',
      color: 'warning',
      icon: 'i-lucide-alert-triangle'
    })
    return
  }

  isPreviewOpen.value = true
}

function onPreviewConfirm(payload: {
  mode: 'with_child' | 'fixed_no_child'
  patternId?: string
  patternName?: string
  fixedItems?: Array<{ couponValue: number, quantity: number }>
}) {
  if (payload.mode === 'with_child') {
    toast.add({
      title: 'ลูกค้าเลือกรูปแบบแล้ว (preview)',
      description: payload.patternName ?? 'Child Pattern',
      color: 'success',
      icon: 'i-lucide-layers'
    })
    return
  }

  const summary = (payload.fixedItems ?? [])
    .map(item => `${formatNumber(item.couponValue)}×${item.quantity}`)
    .join(' + ')

  toast.add({
    title: 'ลูกค้าแบ่ง Fixed ครบแล้ว (preview)',
    description: summary || `รวม ฿${formatNumber(projectedTotal.value)}`,
    color: 'success',
    icon: 'i-lucide-wallet'
  })
}
</script>

<template>
  <div>
    <CouponPackageCreateHeader
      :can-save="canSavePackage"
      @cancel="cancelPackage"
      @save="savePackage"
    />

    <UContainer class="max-w-7xl space-y-8 py-8">
      <section class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h2 class="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              4.2 Parent-Child & Waterfall
            </h2>
          </div>
          <p class="mt-2 max-w-3xl text-muted">
            เลือกโหมดส่งได้ 2 แบบ: (1) มี Child Patterns ให้ลูกค้าเลือกตามที่แอดมินตั้งไว้
            หรือ (2) ส่งมูลค่า Fixed ไปเลย แล้วให้ลูกค้าไปเลือกแบ่งเองทีหลัง
          </p>
        </div>

        <UButton
          label="Preview (User View)"
          icon="i-lucide-eye"
          color="neutral"
          variant="outline"
          @click="openPreview"
        />
      </section>

      <CouponPackageModeSection
        v-model="packageMode"
        :options="packageModeOptions"
        :is-fixed-no-child="isFixedNoChild"
        :projected-total="projectedTotal"
        :format-number="formatNumber"
        @change="onPackageModeChange"
      />

      <section class="grid grid-cols-12 gap-6">
        <CouponPackageSidebar
          v-model:package-name="packageName"
          v-model:total-value="totalValue"
          v-model:description="description"
          :is-fixed-no-child="isFixedNoChild"
          :is-with-child="isWithChild"
          :projected-total="projectedTotal"
          :number-of-patterns="numberOfPatterns"
          :has-parent-value="hasParentValue"
          :has-patterns="hasPatterns"
          :all-patterns-match-parent="allPatternsMatchParent"
          :has-delivery-target="hasDeliveryTarget"
          :can-save-package="canSavePackage"
          :package-mode-summary="packageModeSummary"
          :delivery-summary="deliverySummary"
          :format-number="formatNumber"
        />

        <CouponPackagePatternsPanel
          :is-with-child="isWithChild"
          :patterns="patterns"
          :number-of-patterns="numberOfPatterns"
          :has-patterns="hasPatterns"
          :all-patterns-match-parent="allPatternsMatchParent"
          :projected-total="projectedTotal"
          :format-number="formatNumber"
          :item-total="itemTotal"
          :pattern-total="patternTotal"
          @add="openAddPattern"
          @edit="openEditPattern"
          @delete="openDeletePattern"
        />
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
    </UContainer>

    <CouponPackagePatternModal
      v-model:open="isPatternModalOpen"
      v-model:draft-name="draftName"
      v-model:draft-items="draftItems"
      :is-editing="isEditingPattern"
      :coupon-options="couponOptions"
      :projected-total="projectedTotal"
      :draft-total="draftTotal"
      :draft-matches-parent="draftMatchesParent"
      :format-number="formatNumber"
      @add-row="addDraftRow"
      @remove-row="removeDraftRow"
      @close="closePatternModal"
      @save="savePattern"
    />

    <CouponPackageDeleteModal
      v-model:open="isDeleteModalOpen"
      :target="deleteTarget"
      @close="closeDeleteModal"
      @confirm="confirmDeletePattern"
    />

    <CouponPackagePreviewUserModal
      v-model:open="isPreviewOpen"
      :package-name="packageName"
      :package-mode="packageMode"
      :total-value="projectedTotal"
      :patterns="patterns"
      :format-number="formatNumber"
      :pattern-total="patternTotal"
      @confirm="onPreviewConfirm"
    />
  </div>
</template>
