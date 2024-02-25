<script setup lang="ts">
import {AxiosError} from "axios";
import {definePageMeta} from "#imports";

const route = useRoute();
const router = useRouter();

const {$generaleStore, $userStore, $profileStore} = useNuxtApp();
const video = ref<null | HTMLVideoElement>(null);
const commit = ref('');
let isLoading = ref(false);
const isLiked = computed(() =>
    $generaleStore.selectedPost?.likes.find((like: { user_id: string }) => like.user_id === $userStore.id) || false
)
const inputFocused = ref(false);

definePageMeta({middleware: "auth"})

const likePost = async () => {
  try {
    if ($generaleStore.selectedPost) {
      await $userStore.likePost($generaleStore.selectedPost, true)
    }
  } catch (e) {
    console.log(e)
  }
}

const unlikePost = async () => {
  try {
    if ($generaleStore.selectedPost) {
      await $userStore.unlikePost($generaleStore.selectedPost, true)
    }
  } catch (e) {
    console.log(e)
  }
}

const icons = reactive({
  heart: {
    img: "mdi:heart",
    count: "heart",
    color: true,
    click: true
  },
  message: {
    img: "bx:bxs-message-rounded-dots",
    count: "comment",
    color: false,
    click: false
  },
  share: {
    img: "ri:share-forward-fill",
    count: 100,
    color: false,
    click: false
  }
});

const loopThroughPostsDown = () => {
  setTimeout(() => {
    if ($generaleStore.ids) {
      let idArrayReversed = $generaleStore.ids.reverse()
      let isBreak = false

      for (let i = 0; i < idArrayReversed.length; i++) {
        const id = idArrayReversed[i];
        if (id < route.params.id) {
          router.push(`/post/${id}`)
          isBreak = true
          return
        }
      }

      if (!isBreak) {
        router.push(`/post/${idArrayReversed[0]}`)
      }
    }
  }, 300)
}


const loopThroughPostsUp = () => {
  setTimeout(() => {
    let isBreak = false

    if ($generaleStore.ids) {
      for (let i = 0; i < $generaleStore.ids.length; i++) {
        const id = $generaleStore?.ids[i];
        if (id > route.params.id) {
          router.push(`/post/${id}`)
          isBreak = true
          return
        }
      }

      if (!isBreak) {
        router.push(`/post/${$generaleStore.ids[0]}`)
      }
    }
  }, 300)
}


onMounted(async () => {
  $generaleStore.selectedPost = null

  try {
    await $generaleStore.getPostById(route.params.id)
  } catch (e: AxiosError | unknown) {
    if (e instanceof AxiosError && e?.response?.status === 400) {
      router?.push('/')
    }
  }


  video.value?.addEventListener('loadeddata', () => {
    console.log(isLoading.value);
    isLoading.value = true
  });

})

onBeforeMount(() => {
  if (!video.value) return

  video.value.pause();
  video.value.currentTime = 0;
  video.value.src = '';
})

watch(() => isLoading.value, () => {
  setTimeout(() => video.value && video.value.play(), 500)
})

const deleteComment = async (
    post: { id: string, likes: { user_id: string, id: string }[]; user: { id: string } },
    commentId: string
) => {
  let res = confirm('Вы уверены, что хотите удалить этот комментарий?')
  try {
    if (res) {
      await $userStore.deleteComment(post, commentId)
    }
  } catch (error) {
    console.log(error)
  }
}
const deletePost = async () => {
  let res = confirm('Вы уверены, что хотите удалить этот пост?')
  try {
    if (res && $generaleStore.selectedPost) {
      await $userStore.deletePost($generaleStore.selectedPost)
      await $profileStore.getProfile($userStore.id)
      router.push(`/profile/${$userStore.id}`)
    }
  } catch (error) {
    console.log(error)
  }
}

const addCommit = async () => {
  try {
    if ($generaleStore.selectedPost) {
      await $userStore.addComment($generaleStore.selectedPost, commit.value);
      commit.value = "";
      document.getElementById('Comments')?.scroll({top: 0, behavior: "smooth"})
    }
  } catch (e) {
    console.log(e)
  }
}

useSeoMeta({
  title: `Видео ${$generaleStore.selectedPost?.id}`
})
</script>

<template>
  <div id="PostPage" class="post_page">
    <div v-if="$generaleStore.selectedPost" class="lg:w-[calc(100%-540px)] h-full relative">
      <NuxtLink
          :to="$generaleStore.isBackUrl"
          class="absolute color-transition cursor-pointer z-20 m-5 rounded-full bg-gray-700 p-1.5 hover:bg-gray-800"
      >
        <Icon name="material-symbols:close" color="#FFFFFF" size="27"/>
      </NuxtLink>

      <div v-if="$generaleStore.ids.length > 1">
        <button
            :disabled="!isLoading"
            @click="loopThroughPostsUp()"
            class="post_btn-arrows color-transition top-4"
        >
          <Icon name="mdi:chevron-up" size="30" color="#FFFFFF"/>
        </button>
        <button
            :disabled="!isLoading"
            @click="loopThroughPostsDown()"
            class="post_btn-arrows color-transition top-24"
        >
          <Icon name="mdi:chevron-down" size="30" color="#FFFFFF"/>
        </button>
      </div>

      <img
          class="absolute top-[18px] left-[70px] rounded-full lg:mx-0 mx-auto"
          width="45"
          src="~/assets/image/tiktok-logo-small.png"
          alt="tiktok-small"
      >

      <video
          v-if="$generaleStore.selectedPost.video"
          class="absolute object-cover w-full my-auto z-[-1] h-screen"
          :src="$generaleStore.selectedPost.video"
      />

      <div
          v-if="!isLoading"
          class="flex items-center justify-center bg-black bg-opacity-70 h-screen lg:min-w-[480px]"
      >
        <Icon class="animate-spin ml-1" name="mingcute:loading-line" size="100" color="#FFFFFF"/>
      </div>

      <div class="bg-black bg-opacity-70 lg:min-w-[480px]">
        <video
            v-if="$generaleStore.selectedPost.video"
            ref="video"
            loop
            class="h-screen mx-auto"
            :src="$generaleStore.selectedPost.video"
        />
      </div>
    </div>

    <div
        id="InfoSection"
        v-if="$generaleStore.selectedPost"
        class="lg:max-w-[550px] relative w-full h-full bg-white"
    >
      <div class="py-7">
        <div class="flex items-center justify-between px-8">
          <div class="flex items-center">
            <NuxtLink :to="`/profile/${$generaleStore.selectedPost.user.id}`">
              <img
                  class="rounded-full lg:mx-0 mx-auto"
                  width="40"
                  :src="$generaleStore.selectedPost.user.image"
                  alt="user_name"
              >
            </NuxtLink>
            <div class="ml-3 pt-0.5">
              <div class="text-[17px] font-semibold">
                {{ $generaleStore?.allLowerCaseNoCaps($generaleStore?.selectedPost.user.name) }}
              </div>
              <div class="text-[13px] -mt-5 font-light">
                {{ $generaleStore?.selectedPost.user.name }}
                <span class="relative -top-[2px] text-[30px] pr-0.5">.</span>
                <span class="font-medium">{{ $generaleStore?.selectedPost.created_at }}</span>
              </div>
            </div>
          </div>

          <button
              v-if="$userStore.id === $generaleStore.selectedPost.user.id"
              @click="deletePost()"
              class="cursor-pointer p-2 rounded-full color-transition lg:hover:bg-gray-200"
          >
            <Icon
                name="material-symbols:delete-outline-sharp"
                size="25"
            />
          </button>

        </div>

        <p class="px-8 mt-4 text-sm">
          {{ $generaleStore?.selectedPost.text }}
        </p>

        <div class="px-8 mt-4 text-sm font-bold">
          <Icon name="mdi:music" size="17"/>
          original sound - {{ $generaleStore?.allLowerCaseNoCaps($generaleStore?.selectedPost.user.name) }}
        </div>

        <div class="flex items-center px-8 mt-8">
          <div v-for="icon in icons" class="pb-4 text-center flex items-center" :key="icon">
            <button
                v-if="icon === icons.heart"
                @click="icon.click && isLiked ? unlikePost() : likePost()"
                class="rounded-full bg-gray-200 color-transition p-2 cursor-pointer lg:hover:bg-gray-300">
              <Icon
                  :name="icon.img"
                  size="25"
                  :color="icon.color && isLiked ? '#F02C56' : '' "
              />
            </button>
            <button v-else class="rounded-full bg-gray-200 color-transition p-2 cursor-pointer lg:hover:bg-gray-300">
              <Icon
                  :name="icon.img"
                  size="25"
              />
            </button>
            <span class="text-sm pl-2 pr-4 text-gray-800 font-semibold">
              {{
                icon.count === "heart" ? $generaleStore?.selectedPost.likes.length :
                    icon.count === "comment" ? $generaleStore?.selectedPost?.comments.length : icon.count
              }}
            </span>
          </div>
        </div>

      </div>
      <div
          id="Comments"
          class="bg-[#F8F8F8] z-0 w-full h-[calc(100%-273px)] border-t-2 overflow-auto"
      >
        <div class="pt-2"/>

        <div
            v-if="$generaleStore.selectedPost.comments.length < 1"
            class="text-center mt-6 text-xl text-gray-500"
        >
          Нет комментариев...
        </div>

        <div
            v-else
            v-for="comment in $generaleStore.selectedPost.comments"
            :key="comment"
            class="flex-col items-center justify-between px-8 mt-4"
        >
          <div class="flex items-center relative w-full mb-4">
            <NuxtLink :to="`/profile/${comment.user.id}`">
              <img
                  :src="comment.user.image"
                  width="40"
                  class="absolute top-[12px] rounded-full lg:mx-0 mx-auto"
                  alt="user name"
              />
            </NuxtLink>
            <div class="ml-14 pt-0.5 w-full">
              <div class="text-[18px] font-semibold flex items-center justify-between">
                {{ comment.user.name }}
                <button
                    v-if="$userStore.id === comment.user.id"
                    @click="deleteComment($generaleStore.selectedPost, comment.id)"
                    class="cursor-pointer p-2 rounded-full color-transition lg:hover:bg-gray-200"
                >
                  <Icon
                      name="material-symbols:delete-outline-sharp"
                      size="25"
                  />
                </button>
              </div>
              <div class="text-[15px] font-light">
                {{ comment.text }}
              </div>
            </div>
          </div>
        </div>

        <div class="mb-28"/>

        <div
            id="CreateComment"
            v-if="$userStore.id"
            class="create_commit-content"
        >
          <div
              :class="inputFocused ? 'border-2 border-gray-400' : 'border-2 bg-[#F1F2F2]'"
              class="bg-[#F1F2F2] flex items-center rounded-lg w-full lg:max-w-[420px]"
          >
            <input
                type="text"
                v-model="commit"
                class="bg-[#F1F2F2] text-[14px] focus:outline-none w-full lg:max-w-[420px] p-2 rounded-lg"
                @focus="inputFocused = true"
                @blur="inputFocused = false"
                placeholder="Добавить комментарий..."
            >
          </div>
          <button
              :disabled="!commit"
              @click="addCommit()"
              :class="commit ?
                'bg-red-button text-white color-transition cursor-pointer lg:hover:bg-red-hover-button':
                'bg-[#F1F2F2] text-gray-600'"
              class="font-semibold transition-colors duration-[50] ease-in-out text-sm ml-5 py-1 px-2.5 rounded-lg"
          >
            <Icon
                name="typcn:arrow-right-thick"
                size="30"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post_page {
  @apply fixed lg:flex justify-between z-50 top-0 left-0 w-full h-full bg-black lg:overflow-hidden overflow-auto
}

.post_btn-arrows {
  @apply absolute z-20 right-4 flex items-center justify-center rounded-full bg-gray-700 p-1.5 hover:bg-gray-800
  cursor-pointer
}

.create_commit-content {
  @apply absolute flex items-center justify-between bottom-0 bg-white h-[85px] lg:max-w-[550px] w-full py-5
  px-8 border-t-2
}
</style>