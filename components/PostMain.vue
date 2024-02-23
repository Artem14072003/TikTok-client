<script setup lang="ts">
const {$generaleStore, $userStore} = useNuxtApp();
const props = defineProps(['post']);
const {post} = toRefs(props)

const isLiked = computed(() =>
    post?.value.likes.find((like: { user_id: string }) => like.user_id === $userStore.id) || false
)

const router = useRouter()
const isLoggedIn = (user: { id: number }) => {
  if (!$userStore.id) {
    return $generaleStore.isLoginOpen = true
  }
  setTimeout(() => router.push(`/profile/${user.id}`), 200)
}

const displayPost = (post: { id: number }) => {
  if (!$userStore.id) {
    return $generaleStore.isLoginOpen = true
  }

  $generaleStore.setBackUrl('/');
  $generaleStore.selectedPost = null;
  setTimeout(() => router.push(`/post/${post.id}`), 200)
}

const likePost = async (post: { id: string; likes: { user_id: string; id: string; }[]; user: {id: string}}) => {
  if (!$userStore.id) {
    return $generaleStore.isLoginOpen = true
  }

  try {
    await $userStore.likePost(post)
  } catch (e) {
    console.log(e)
  }
}

const unlikePost = async (post: { id: string; likes: { user_id: string; id: string; }[]; user: {id: string}}) => {
  if (!$userStore.id) {
    return $generaleStore.isLoginOpen = true
  }

  try {
    await $userStore.unlikePost(post)
  } catch (e) {
    console.log(e)
  }
}

let video = ref<HTMLVideoElement | null>(null);

onMounted(() => {
  const postMain = document.getElementById(`PostMain-${post?.value.id}`)
  let observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      video.value && video.value.play()
    } else {
      video.value && video.value.pause()
    }
  }, {threshold: [0.6]})

  if (postMain instanceof Element) {
    observer.observe(postMain)
  }
});

onBeforeMount(() => {
  if (video.value) {
    video.value.pause();
    video.value.currentTime = 0
    video.value.src = ''
  }
})
</script>

<template>
  <div :id="`PostMain-${post.id}`" class="flex border-b py-6">
    <div @click="isLoggedIn(post.user)" class="cursor-pinter">
      <img :src="post.user.image" width="60" alt="Art"
           class="rounded-full max-h-[80px]">
    </div>
    <div class="pl-3 w-full px-4">
      <div class="flex items-center justify-between pb-0.5">
        <button>
          <span class="font-bold hover:underline cursor-pointer">
            {{ $generaleStore?.allLowerCaseNoCaps(post.user.name) }}
          </span>
          <span class="text-[13px] text-light text-gray-500 pl-1 cursor-pointer">
            {{ post.user.name }}
          </span>
        </button>

        <button
            class="btn_following"
        >
          Подписаться
        </button>
      </div>

      <div class="text-[15px] pb-0.5 break-words md:max-w-[400px] max-w-[300px]">
        {{ post.text }}
      </div>

      <div class="text-[14px] text-gray-500 pb-0.5">
        #fun #cool #Worthy_of_the_Five
      </div>

      <div class="text-[14px] pb-0.5 flex items-center font-semibold">
        <Icon name="mdi:music" size="17"/>
        <div class="px-1">original sound - {{ $generaleStore?.allLowerCaseNoCaps(post.user.name) }}</div>
        <Icon name="mdi:heart" size="20"/>
      </div>

      <div class="mt-2.5 flex">
        <div
            @click="displayPost(post)"
            class="relative min-h-[480px] max-h-[580px] max-w-[260px] flex items-center bg-black rounded-xl cursor-pointer">
          <video
              v-if="post.video"
              ref="video"
              loop
              muted
              class="rounded-xl object-cover mx-auto h-full"
              :src="post.video"
          >
          </video>

          <img
              src="~/assets/image/tiktok-logo-white.png"
              alt="video_1"
              width="90"
              class="absolute right-2 bottom-14"
          >
        </div>
        <div class="relative mr-[75px]">
          <div class="absolute bottom-0 pl-1">
            <div class="pb-4 text-center">
              <button
                  @click="!isLiked ? likePost(post) : unlikePost(post)"
                  class="rounded-full bg-gray-200 p-2 cursor-pointer"
              >
                <Icon name="mdi:heart" size="25" :color="isLiked ? '#F02C56' : ''"/>
              </button>
              <span class="text-xs text-gray-800 font-semibold">{{ post?.likes.length }}</span>
            </div>

            <div class="pb-4 text-center">
              <button class="rounded-full bg-gray-200 p-2 cursor-pointer">
                <Icon name="bx:bxs-message-rounded-dots" size="25"/>
              </button>
              <span class="text-xs text-gray-800 font-semibold">34</span>
            </div>

            <div class="pb-4 text-center">
              <button class="rounded-full bg-gray-200 p-2 cursor-pointer">
                <Icon name="ri:share-forward-fill" size="25"/>
              </button>
              <span class="text-xs text-gray-800 font-semibold">34</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.btn_following {
  @apply border transition-colors delay-300 ease-in text-[15px] px-[21px] py-0.5
  border-[#F02C56] text-[#F02C56] hover:bg-[#ffeef2] font-semibold rounded-md;
}
</style>
