<script setup lang="ts">
import UploadLayout from "~/layout/UploadLayout.vue";
import {type AxiosError, isAxiosError} from "axios";

const {$userStore} = useNuxtApp();
const router = useRouter()
let file = ref<null | File>(null);
let fileDisplay = ref<string | null>(null);
let errorType = ref<null | string>(null);
let caption = ref<string>("");
let fileData = ref<File | null>(null);
let errors = ref<null | {
  video: string[],
  text: string[]
}>(null);
let isUploading = ref(false);

definePageMeta({middleware: "auth"})

const onChange = (e: InputEvent) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    fileDisplay.value = URL.createObjectURL(file);
    fileData.value = file;
  }
}

const discard = () => {
  file.value = null;
  fileDisplay.value = null;
  fileData.value = null;
  caption.value = ""
}

const clearVideo = () => {
  file.value = null;
  fileDisplay.value = null;
  fileData.value = null;
}

const onDrop = (e: DragEvent) => {
  errorType.value = "";
  file.value = e.dataTransfer?.files[0] ?? null
  fileData.value = e.dataTransfer?.files[0] ?? null;

  if (file.value) {
    let extention = file.value.name.substring(file.value.name.lastIndexOf('.') + 1);
    if (extention !== 'mp4') return errorType.value = 'file';
    fileDisplay.value = e.dataTransfer ? URL.createObjectURL(e.dataTransfer.files[0]) : null
  }
}

const createPost = async () => {
  errors.value = null;

  let data = new FormData();

  data.append('video', fileData.value || "");
  data.append('text', caption.value || "");

  if (fileData.value && caption.value)
    isUploading.value = true

  try {
    let res = await $userStore.createPost(data);
    if (res.status === 200) {
      setTimeout(() => {
        router.push('/profile/' + $userStore.id);
        isUploading.value = false
      })
    }

  } catch (e: AxiosError | unknown) {
    errors.value = isAxiosError(e) && e.response?.data.errors
    isUploading.value = false
  }
}

watch(() => caption.value, (caption) => {
  if (caption.length >= 150) {
    return errorType.value = "caption";
  }

  errorType.value = null;
})

useSeoMeta({
  title: 'Upload',
  ogTitle: 'Upload',
  description: 'Download the video here.',
  ogDescription: 'Download the video here.',
})
</script>

<template>
  <UploadError :error-type="errorType"/>

  <div
      v-if="isUploading"
      class="fixed flex items-center justify-center top-0 left-0 w-full h-screen bg-black z-50 bg-opacity-50"
  >
    <Icon class="animate-spin ml-1" name="mingcute:loading-line" size="100" color="#FFFFFF"/>
  </div>

  <UploadLayout>
    <div class="w-full mt-[80px] mb-[40px] bg-white shadow-lg rounded-md py-6 md:px-10 px-4">
      <div>
        <div class="text-[23px] font-semibold">Загрузка видео</div>
        <div class="text-gray-500 mt-1">Разместите видео в своем аккаунте</div>
      </div>

      <div class="mt-8 md:flex gap-6">
        <label
            v-if="!fileDisplay"
            @drop.prevent="onDrop"
            @dragover.prevent="$event"
            for="fileInput"
            class="md:mx-0 mx-auto mt-4 mb-6 flex flex-col items-center justify-center w-full max-w-[260px] h-[470px]
            text-center color-transition p-3 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer"
        >
          <Icon name="majesticons:cloud-upload" size="40" color="#b3b3b1"/>
          <div class="mt-4 text-[17px]">Выберите видео для загрузки</div>
          <div class="mt-1.5 text-gray-500 text-[13px]">Или перетащите файл</div>
          <div class="mt-12 text-gray-400 text-sm">MP4</div>
          <div class="mt-2 text-gray-400 text-[13px]">До 30 минут</div>
          <div class="mt-2 text-gray-400 text-[13px]">Менее 2 ГБ</div>
          <div class="px-2 py-1.5 mt-8 text-white text-[15px] w-[80%] bg-[#F02C56] rounded-sm">
            Выберите файл
          </div>
          <input
              type="file"
              ref="file"
              id="fileInput"
              @input="onChange"
              hidden
              accept=".mp4"
          >
        </label>
        <div
            v-else
            class="video_success"
        >
          <div class="bg-black h-full w-full">
            <img
                class="absolute z-20 pointer-events-none left-0 top-0"
                src="~/assets/image/mobile-case.png"
                alt="Mobile-case"
            >
            <img
                src="~/assets/image/tiktok-logo-white.png"
                alt="tiktok"
                width="90"
                class="absolute right-4 bottom-6 z-20"
            >
            <video
                autoplay
                loop
                muted
                class="absolute rounded-xl object-cover top-0 left-0 z-10 p-[13px] w-full h-full"
                :src="fileDisplay"
            />

            <div class="create_name-video">
              <div class="flex items-center truncate">
                <Icon name="clarity:success-standard-line" size="16" class="min-w-[16px]"/>
                <div class="text-[11px] pl-2 truncate text-ellipsis">
                  {{ fileData?.name }}
                </div>
              </div>
              <button @click="$event => clearVideo()" class='text-[11px] ml-2 font-semibold cursor-pointer'>Change
              </button>
            </div>
          </div>
        </div>
        <div class="mt-4 mb-6">
          <div class="flex bg-[#F8F8F8] py-4 px-6">
            <div>
              <Icon name="mdi:box-cutter-off" class="mr-4" size="20"/>
            </div>
            <div>
              <div class="text-semibold text-[15px] mb-1.5">
                Разделяйте видео и редактируйте
              </div>
              <div class="text-semibold text-[13px] text-gray-400">
                Вы можете быстро разделить видео на несколько частей,
                удалить лишние части и превратить альбомные видео в портретные
              </div>
            </div>
            <div class="flex justify-end max-w-[130px] w-full h-full text-center my-auto">
              <button class="button_edit">
                Редактировать
              </button>
            </div>
          </div>
          <div class="mt-5">
            <div class="flex items-center justify-between">
              <div class="mb-1 text-[15px]">Подпись</div>
              <div class="text-gray-400 text-[12px]">{{ caption.length }}/150</div>
            </div>
            <input
                type="text"
                v-model="caption"
                maxlength="150"
                class="w-full border p-2.5 rounded-md focus:outline-none"
            >
          </div>

          <div class="flex gap-3">
            <button
                @click="discard"
                class="btn-control color-transition hover:bg-gray-100 rounded-sm"
            >
              Назад
            </button>
            <button
                @click="createPost()"
                class="btn-control text-white color-transition bg-[#F02C56] rounded-sm hover:bg-[#F02C56CB]"
            >
              Создать
            </button>
          </div>
          <div v-if="errors" class="mt-4">
            <div class="text-red-600" v-if="errors && errors.video">
              {{ errors.video[0] }}
            </div>
            <div class="text-red-600" v-if="errors && errors.text">
              {{ errors.text[0] }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </UploadLayout>
</template>

<style scoped>
.video_success {
  @apply md:mx-0 mx-auto mt-4 md:mb-12 mb-16
  flex items-center justify-center w-full max-w-[260px] h-[540px]
  p-3 rounded-2xl cursor-pointer relative;
}

.create_name-video {
  @apply absolute left-0 -bottom-12 flex items-center
  justify-between z-50 rounded-xl border w-full p-2
  border-gray-300
}

.button_edit {
  @apply px-8 py-1.5 transition-colors delay-300 ease-in text-white text-[15px] bg-[#F02C56] rounded-sm hover:bg-[#F02C56CB];
}

.btn-control {
  @apply px-10 py-2.5 mt-8 border text-[16px];
}
</style>