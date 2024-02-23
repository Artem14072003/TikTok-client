<script setup lang="ts">

defineProps(['post']);

const route = useRoute();
const router = useRouter();
const video = ref<HTMLVideoElement | null>(null);
let isLoading = ref(false);
const {$generaleStore} = useNuxtApp()

onBeforeMount(() => {
  if (!video.value) return

  video.value.pause();
  video.value.currentTime = 0;
  video.value.src = '';
})

const isHover = (bool: boolean) => bool ?
    video.value && video.value.play() :
    video.value && video.value.pause()

const displayPost = (post) => {
  $generaleStore.setBackUrl("/profile/" + route.params.id)
  $generaleStore.selectedPost = null;
  setTimeout(() => router.push(`/post/${post.id} `), 300)
}

onMounted(() => {
  if (video.value) {
    video.value.addEventListener('loadeddata', (e) => {
      if (e.target) {
        setTimeout(() => {
          isLoading.value = true
        }, 200)
      console.log("Видео загрузилось")
      }
    })
  }
});
</script>

<template>
  <div
      @click="displayPost(post)"
      @mouseenter="isHover(true)"
      @mouseleave="isHover(false)"
      class="relative brightness-90 hover:brightness-[1.1] cursor-pointer"
  >
    <div
        v-if="!isLoading"
        class="absolute flex items-center justify-center top-0 left-0 aspect-[3/4] w-full object-cover rounded-md bg-black"
    >
      <Icon class="animate-spin ml-1" name="mingcute:loading-line" size="100" color="#FFFFFF"/>
    </div>

    <div>
      <video
          ref="video"
          muted
          loop
          class="aspect-[3/4] object-cover rounded-md"
          :src="post.video"
      />
    </div>

    <div class="px-1">
      <div class="text-gray-700 text-[15px] pt-1 break-words">
        {{post.text}}
      </div>
      <div class="flex items-center -ml-1 text-gray-600 font-bold text-xs">
        <Icon name="gg:loadbar-sound" size="20"/>
        <Icon class="ml-1" name="tabler:alert-circle" size="16"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>