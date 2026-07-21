<script setup lang="ts">
const couponCode = ref('')
const toast = useToast()

function claimCoupon() {
  if (!couponCode.value.trim()) {
    toast.add({
      title: 'กรุณากรอกรหัสคูปอง',
      color: 'warning',
      icon: 'i-lucide-alert-triangle'
    })
    return
  }

  toast.add({
    title: 'รับคูปองสำเร็จ',
    description: `รหัส ${couponCode.value} พร้อมใช้งานแล้ว`,
    color: 'success',
    icon: 'i-lucide-check'
  })
}
</script>

<template>
  <UContainer class="py-10 space-y-10">
    <section class="space-y-3">
      <UBadge label="Nuxt UI ready" color="primary" variant="subtle" />
      <h1 class="text-3xl font-bold text-highlighted sm:text-4xl">
        ThamallCoupon
      </h1>
      <p class="max-w-2xl text-muted">
        โปรเจกต์ถูกตั้งค่าด้วย Nuxt UI แล้ว ใช้ component ได้ทันทีผ่าน auto-import เช่น
        <code class="text-sm">UButton</code>,
        <code class="text-sm">UInput</code>,
        <code class="text-sm">UCard</code>
      </p>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-ticket-percent" class="size-5 text-primary" />
            <h2 class="font-semibold text-highlighted">
              ตัวอย่างฟอร์มคูปอง
            </h2>
          </div>
        </template>

        <div class="space-y-4">
          <UFormField label="รหัสคูปอง">
            <UInput
              v-model="couponCode"
              placeholder="เช่น SAVE20"
              icon="i-lucide-tag"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <div class="flex flex-wrap gap-2">
            <UButton
              label="รับคูปอง"
              icon="i-lucide-gift"
              size="lg"
              @click="claimCoupon"
            />
            <UButton
              label="ล้าง"
              color="neutral"
              variant="outline"
              size="lg"
              @click="couponCode = ''"
            />
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="font-semibold text-highlighted">
            Components ที่ใช้ในหน้านี้
          </h2>
        </template>

        <ul class="space-y-3 text-sm text-muted">
          <li class="flex items-center gap-2">
            <UIcon name="i-lucide-check" class="size-4 text-primary" />
            UApp / UHeader / UMain / UFooter
          </li>
          <li class="flex items-center gap-2">
            <UIcon name="i-lucide-check" class="size-4 text-primary" />
            UButton / UInput / UFormField
          </li>
          <li class="flex items-center gap-2">
            <UIcon name="i-lucide-check" class="size-4 text-primary" />
            UCard / UBadge / UIcon / UToast
          </li>
        </ul>

        <template #footer>
          <UButton
            to="https://ui.nuxt.com/docs/components"
            target="_blank"
            label="ดูคอมโพเนนต์ทั้งหมด"
            trailing-icon="i-lucide-arrow-right"
            color="neutral"
            variant="soft"
            block
          />
        </template>
      </UCard>
    </section>
  </UContainer>
</template>
