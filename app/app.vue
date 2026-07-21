<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'th'
  }
})

const title = 'ThamallCoupon'
const description = 'โปรเจกต์ Nuxt ที่พร้อมใช้ Nuxt UI components'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink to="/" class="flex items-center gap-2 font-semibold text-highlighted">
          <UIcon name="i-lucide-ticket" class="size-5 text-primary" />
          ThamallCoupon
        </NuxtLink>
      </template>

      <template #right>
        <UColorModeButton />

        <UButton
          to="https://ui.nuxt.com/docs/components"
          target="_blank"
          label="Nuxt UI Docs"
          icon="i-lucide-book-open"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Built with Nuxt UI • © {{ new Date().getFullYear() }} ThamallCoupon
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
