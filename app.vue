<script setup lang="ts">
import {storeToRefs} from "pinia";

const {$userStore, $generaleStore} = useNuxtApp();
const {isLoginOpen, isEditProfileOpen} = storeToRefs($generaleStore)

onMounted(async () => {
  $generaleStore.bodySwitch(false);
  isLoginOpen.value = false;
  isEditProfileOpen.value = false
  try {
    await $generaleStore.hasSessionExpired()
    await $generaleStore.getRandomUser('suggested')
    await $generaleStore.getRandomUser('following')
    if ($userStore.id)
      $userStore.getUser()
  } catch (e) {
    console.error(e)
  }
})

watch(() => isLoginOpen.value, (val) => $generaleStore.bodySwitch(val))
watch(() => isEditProfileOpen.value, (val) => $generaleStore.bodySwitch(val))
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtPage/>

  <AuthOverlay v-if="isLoginOpen"/>
  <EditProfileOverlay v-if="isEditProfileOpen"/>
</template>

<style>
.color-transition {
  @apply transition-colors delay-300 ease-in;
}
</style>