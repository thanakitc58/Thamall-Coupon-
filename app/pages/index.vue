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
</script>

<template>
  <div>
    <CouponPackageCreateHeader
      :can-save="canSavePackage"
      @cancel="cancelPackage"
      @save="savePackage"
    />

    <UContainer class="max-w-7xl space-y-8 py-8">
      <section>
        <div class="flex flex-wrap items-center gap-2">
          <h2 class="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            4.2 Create Coupon Package
          </h2>
        </div>
        <p class="mt-2 max-w-3xl text-muted">
          เลือกโหมดส่งได้ 2 แบบ: (1) มี Child Patterns ให้ลูกค้าเลือกตามที่แอดมินตั้งไว้
          หรือ (2) ส่งมูลค่า Fixed ไปเลย แล้วให้ลูกค้าไปเลือกแบ่งเองทีหลัง
        </p>
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
  </div>
</template>
