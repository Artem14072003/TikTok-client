<script setup lang="ts">

useSeoMeta({
  title: 'TikTok',
  ogTitle: 'TikTok',
  description: 'This is my amazing site, let me tell you all about it.',
  ogDescription: 'This is my amazing site, let me tell you all about it.',
})

const route = useRoute();

</script>

<template>
  <TopNav/>
  <div
      :class="route.fullPath === '/' ? 'max-w-[1140px]' : ''"
      class="flex justify-between mx-auto w-full lg:px2.5 px-0"
  >
    <div>
      <SideNavMain/>
    </div>

    <slot />
  </div>
</template>
