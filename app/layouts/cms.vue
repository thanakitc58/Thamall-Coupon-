<script setup lang="ts">
const route = useRoute()

const navItems = [
  { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '#' },
  { label: 'Coupon Packages', icon: 'i-lucide-package', to: '/' },
  {
    label: 'Campaigns',
    icon: 'i-lucide-megaphone',
    to: '/campaigns',
    badge: '4.1'
  },
  { label: 'Coupon Groups', icon: 'i-lucide-folders', to: '#' },
  { label: 'Coupons', icon: 'i-lucide-ticket', to: '#' },
  { label: 'Quota Dashboard', icon: 'i-lucide-gauge', to: '#' },
  { label: 'Users', icon: 'i-lucide-users', to: '#' },
  { label: 'Reports', icon: 'i-lucide-chart-column', to: '#' }
]

function isActive(to: string) {
  if (to === '/') {
    return route.path === '/'
  }

  return route.path.startsWith(to)
}
</script>

<template>
  <div class="flex min-h-screen bg-default">
    <aside class="fixed inset-y-0 left-0 z-50 hidden w-[260px] flex-col bg-[#1A1A1A] text-white lg:flex">
      <div class="px-4 py-8">
        <h1 class="text-xl font-bold tracking-tight">
          THE MALL
        </h1>
        <p class="mt-1 text-xs uppercase tracking-widest text-white/50">
          Coupon Manager
        </p>
      </div>

      <nav class="flex flex-1 flex-col gap-1 px-2">
        <UButton
          v-for="item in navItems"
          :key="item.label"
          :to="item.to === '#' ? undefined : item.to"
          :label="item.label"
          :icon="item.icon"
          :color="isActive(item.to) ? 'primary' : 'neutral'"
          :variant="isActive(item.to) ? 'solid' : 'ghost'"
          class="justify-start"
          :ui="isActive(item.to)
            ? undefined
            : { base: 'text-white/70 hover:bg-white/10 hover:text-white' }"
        >
          <template
            v-if="item.badge"
            #trailing
          >
            <UBadge
              :label="item.badge"
              color="neutral"
              variant="subtle"
              size="xs"
            />
          </template>
        </UButton>
      </nav>

      <div class="mt-auto space-y-3 px-2 pb-6">
        <UButton
          label="Settings"
          icon="i-lucide-settings"
          color="neutral"
          variant="ghost"
          class="w-full justify-start"
          :ui="{ base: 'text-white/70 hover:bg-white/10 hover:text-white' }"
        />

        <USeparator class="opacity-20" />

        <div class="flex items-center gap-3 px-2">
          <UAvatar
            src="https://api.dicebear.com/9.x/avataaars/svg?seed=Admin"
            alt="Admin avatar"
            size="md"
          />
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold">
              Admin
            </p>
            <p class="truncate text-xs text-white/50">
              admin@example.com
            </p>
          </div>
        </div>
      </div>
    </aside>

    <div class="flex min-h-screen flex-1 flex-col lg:ml-[260px]">
      <slot />
    </div>
  </div>
</template>
