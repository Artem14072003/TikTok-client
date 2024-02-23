<script setup lang="ts">
import MainLayout from "~/layout/MainLayout.vue";
import {storeToRefs} from "pinia";

const {$generaleStore, $userStore, $profileStore} = useNuxtApp()
const {posts, allLikes} = storeToRefs($profileStore)
const route = useRoute();

let show = ref(false);

onMounted(async () => {
  try {
    await $profileStore.getProfile(route.params.id);
  } catch (e) {
    console.log(e)
  }
})

definePageMeta({middleware: "auth"})

watch(() => posts.value, () => {
  setTimeout(() => show.value = true, 300)
})
useSeoMeta({
  title: "Profile",
  ogTitle: "Profile",
})
</script>

<template>
  <MainLayout>
    <div class="content" v-if="$profileStore.name">
      <div class="flex w-[calc(100vw-230px)]">
        <img
            class="max-w-[120px] rounded-full"
            :src="$profileStore.image"
            alt="author"
        >
        <div class="ml-5 w-full">
          <div class="text-[30px] font-bold truncate">
            {{ $generaleStore?.allLowerCaseNoCaps($profileStore.name) }}
          </div>
          <p class="text-[18px] truncate">{{ $profileStore.name }}</p>
          <button
              v-if="$profileStore.id === $userStore.id"
              @click="$generaleStore.isEditProfileOpen = true"
              class="btn-control color-transition px-3.5 border hover:bg-gray-100"
          >
            <Icon class="mt-0.5 mr-1" name="mdi:pencil" size="18"/>
            Редактировать
          </button>
          <button
              v-else
              class="btn-control color-transition px-8 text-white bg-red-button hover:bg-red-hover-button"
          >
            Подписаться
          </button>
        </div>
      </div>

      <div class="flex items-center pt-4">
        <div class="mr-4">
          <span class="font-bold"> 10K </span>
          <span class="text-gray-500 font-light text-[15px] pl-1 5"> Подписчиков </span>
        </div>
        <div class="mr-4">
          <span class="font-bold"> 44K </span>
          <span class="text-gray-500 font-light text-[15px] pl-1 5"> Просмотров </span>
        </div>
        <div class="mr-4">
          <span class="font-bold"> {{allLikes}}</span>
          <span class="text-gray-500 font-light text-[15px] pl-1 5"> Лайки </span>
        </div>
      </div>

      <div class="pt-4 mr-4 text-gray-500 font-light text-[15px] pl-1.5 max-w-[500px]">
        {{ $profileStore["bio"] }}
      </div>

      <div class="w-full flex items-center pt-4 border-b">
        <div class="w-60 text-center py-2 text-[17px] font-semibold border-b-2 border-b-black">
          Video
        </div>
        <div class="w-60 text-gray-500 text-center py-2 text-[17px] font-semibold">
          <Icon name="material-symbols:lock-open" class="mb-0.5"/>
          Liked
        </div>
      </div>

      <div class="videos">
        <div v-if="show" v-for="post in $profileStore.posts">
          <PostUser :post="post"/>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.content {
  @apply pt-[90px] 2xl:pl-[185px] lg:pl-[160px] lg:pr-0 pr-2 w-[calc(100%-90px)]
  max-w-[1800px] 2xl:mx-auto;
}

.btn-control {
  @apply flex items-center rounded-md py-1.5 mt-3 text-[15px] font-semibold;
}

.videos {
  @apply mt-4 grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3
}
</style>