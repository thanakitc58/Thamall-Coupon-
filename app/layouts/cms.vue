<script setup lang="ts">
const route = useRoute()

const navItems = [
  {
    label: 'Flexible Coupon Group Selection',
    to: '/campaigns',
    badge: '4.1'
  },
  {
    label: 'Parent-Child & Waterfall',
    to: '/',
    badge: '4.2'
  }
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
          :to="item.to"
          :color="isActive(item.to) ? 'primary' : 'neutral'"
          :variant="isActive(item.to) ? 'solid' : 'ghost'"
          class="h-auto justify-start whitespace-normal py-2 text-left"
          :ui="isActive(item.to)
            ? undefined
            : { base: 'text-white/70 hover:bg-white/10 hover:text-white' }"
        >
          <UBadge
            :label="item.badge"
            color="neutral"
            variant="subtle"
            size="xs"
            class="shrink-0"
          />
          <span class="min-w-0 flex-1 leading-snug">
            {{ item.label }}
          </span>
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
