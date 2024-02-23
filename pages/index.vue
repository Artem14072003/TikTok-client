<script setup lang="ts">

import MainLayout from "~/layout/MainLayout.vue";

const {$generaleStore} = useNuxtApp();

onMounted(async () => {
  try {
    await $generaleStore.getAllUserAndPost();
  } catch (e) {
    console.log(e)
  }
})
</script>

<template>
  <MainLayout>
    <div class="pt-[80px] w-[calc(100%-90px)] max-w-[690px]">
      <div v-for="post in $generaleStore.posts">
        <PostMain v-if="post" :post="post"/>
      </div>
    </div>
  </MainLayout>
</template>
