<script setup lang="ts">
import {Cropper, CircleStencil, type CropperResult} from "vue-advanced-cropper";
import 'vue-advanced-cropper/dist/style.css'
import {storeToRefs} from "pinia";
import {AxiosError} from "axios";

const {$userStore, $generaleStore, $profileStore} = useNuxtApp();
const {name, bio, image} = storeToRefs($userStore);

const file = ref<null | File>(null);
const route = useRoute();
const cropper = ref<null | { getResult: () => CropperResult }>(null);
const userImage = ref<null | string>(null);
const isUpdated = ref(false);
const uploadedImage = ref<string | null>(null);
const userName = ref('');
const userBio = ref('');
const error = ref('')

onMounted(() => {
  userName.value = name.value;
  userBio.value = bio.value;
  userImage.value = image.value
})

const getUploadedImage = (e: InputEvent) => {
  const target = e.target as HTMLInputElement;
  const imageFile = target.files?.[0];
  if (imageFile) {
    file.value = imageFile;
    uploadedImage.value = URL.createObjectURL(file.value)
  }
}

watch(() => userName.value, () => !userName.value || userName.value === name.value
    ? isUpdated.value = false
    : isUpdated.value = true
)

watch(() => userBio.value, () => userBio.value === bio.value
    ? isUpdated.value = false
    : isUpdated.value = true
)

const cropAndUpdateImage = async () => {
  if (cropper.value) {
    const {coordinates} = cropper.value.getResult()
    let data: FormData = new FormData();

    data.append('image', file.value || '')
    data.append('height', `${coordinates.height}` || '')
    data.append('width', `${coordinates.width}` || '')
    data.append('left', `${coordinates.left}` || '')
    data.append('top', `${coordinates.top}` || '')

    try {
      await $userStore.updateUserImage(data)
      await $userStore.getUser()
      await $profileStore.getProfile(route.params.id)

      $generaleStore.updateSideMenuImage($generaleStore.suggested, $userStore)
      $generaleStore.updateSideMenuImage($generaleStore.following, $userStore)

      userImage.value = image.value
      uploadedImage.value = null
    } catch (error) {
      console.log(error)
    }
  }
}

const updateUserInfo = async () => {
  try {
    await $userStore.updateUser(userName.value, userBio.value)
    await $userStore.getUser()
    await $profileStore.getProfile(route.params.id)

    userName.value = name.value
    userBio.value = bio.value

    setTimeout(() => {
      $generaleStore.isEditProfileOpen = false
    }, 100)
  } catch (e) {
    if (e instanceof AxiosError){
      error.value = e.response?.data.errors
      console.log(error.value);
    }

  }
}
</script>

<template>
  <div
      id="EditProfileOverlay"
      class="editProfileOverlay"
      @click="$generaleStore.isEditProfileOpen = false"
  >
    <div
        @click.stop
        class="relative bg-white w-full max-w-[700px] sm:h-[580px] h-[655px] mx-3 p-4 rounded-lg mb-10"
        :class="!uploadedImage ? 'h-[655px]' : 'h-[580px]'"
    >
      <div class="header_content">
        <div class="text-[22px] font-medium">
          Редактировать профиль
        </div>
        <button
            @click="$generaleStore.isEditProfileOpen = false"
        >
          <Icon name="mdi:close" size="25"/>
        </button>
      </div>

      <div
          class="h-[calc(500px-200px)]"
          :class="!uploadedImage ? 'mt-16' : 'mt-[58px]'"
      >
        <div v-if="!uploadedImage">
          <div
              id="ProfilePhotoSection"
              class="flex flex-col border-b sm:h-[118px] h-[145px] px-1.5 py-2 w-full"
          >
            <div class="title_text-h2">
              Фото профиля
            </div>

            <div class="flex items-center justify-center sm:-mt-6">
              <label for="image" class="relative cursor-pointer">
                <img
                    :src="userImage"
                    alt="my avatar"
                    width="95"
                    class="rounded-full"
                >
                <div class="update_photo">
                  <Icon name="ph:pencil-simple-line-bold" size="17" class="-mt-1 ml-0.5"/>
                </div>
              </label>
              <input
                  type="file"
                  class="hidden"
                  id="image"
                  @input="getUploadedImage"
                  accept="image/png, image/jpeg, image/jpg"
              >
            </div>
          </div>
          <div
              id="UsernameSection"
              class="flex flex-col sm:h-[118px] border-b px-1 py-2 mt-1.5 w-full"
          >
            <div
                class="title_text-h2"
            >
              Логин
            </div>

            <div class="flex items-center justify-center sm:-mt-6">
              <div class="sm:w-[60%] w-full max-w-md">
                <TextInput
                    placeholder="Username"
                    v-model:input="userName"
                    inputType="text"
                    max="30"
                    :error="error && error.name ? error?.name[0]: ''"
                />
                <div class="text-[11px] text-gray-500 mt-4">
                  Имя пользователя может содержать только буквы, цифры, символы подчеркивания и точки. Изменение имени
                  пользователя также приведет к изменению ссылки на ваш профиль.
                </div>
              </div>
            </div>
          </div>

          <div
              id="BioSection"
              class="flex flex-col sm:h-[120px] px-1.5 py-2 mt-2 w-full"
          >
            <div class="title_text-h2">
              Ваша биография
            </div>

            <div class="flex items-center justify-center sm:-mt-6">
              <div class="sm:w-[60%] w-full max-w-md">
                <textarea
                    cols="30"
                    rows="4"
                    v-model="userBio"
                    maxlength="80"
                    class="input_bio"
                ></textarea>
                <div
                    v-if="userBio"
                    class="text-[11px] text-gray-500"
                >
                  {{ userBio.length }}/80
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="w-full h-[430px]">
          <Cropper
              class="h-[430px]"
              ref="cropper"
              :stemcil-component="CircleStencil"
              :src="uploadedImage"
          />
        </div>
      </div>

      <div
          id="ButtonSection"
          class="absolute p-5 left-0 bottom-0 border-t border-t-gray-300 w-full"
      >
        <div
            id="UpdateInfoButtons"
            v-if="!uploadedImage"
            class="flex items-center justify-end"
        >
          <button
              @click="$generaleStore.isEditProfileOpen = false"
              class="flex items-center border rounded-sm px-3 py-[6px] hover:bg-gray-100"
          >
            <span class="px-2 font-medium text-[15px]">Назад</span>
          </button>

          <button
              :disabled="!isUpdated"
              @click="updateUserInfo()"
              :class="!isUpdated ? 'bg-gray-200' : 'bg-[#F02C56]'"
              class="flex items-center bg-[#F02C56] text-white border rounded-md ml-3 px-3 py-[6px]"
          >
            <span class="mx-4 font-medium text-[15px]">Сохранить</span>
          </button>
        </div>

        <div
            id="CropperButtons"
            v-else
            class="flex items-center justify-end"
        >
          <button
              @click="uploadedImage = null"
              class="flex items-center border rounded-sm px-3 py-[6px] hover:bg-gray-100"
          >
            <span class="px-2 font-medium text-[15px]">Назад</span>
          </button>

          <button
              @click="cropAndUpdateImage()"
              class="flex items-center bg-[#F02C56] text-white border rounded-md ml-3 px-3 py-[6px]"
          >
            <span class="mx-4 font-medium text-[15px]">Применить</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editProfileOverlay {
  @apply fixed flex justify-center pt-14 md:pt-[105px] z-50 top-0 left-0 w-full h-full
  bg-black bg-opacity-50 overflow-auto;
}

.header_content {
  @apply absolute flex items-center justify-between w-full p-5 left-0 top-0 border-b border-b-gray-300
}

.update_photo {
  @apply absolute bottom-0 right-0 rounded-full bg-white shadow-xl border p-1 border-gray-300 inline-block w-[32px];
}

.title_text-h2 {
  @apply font-semibold text-[15px] sm:mb-0 mb-1 text-gray-700 sm:w-[160px] sm:text-left text-center
}

.input_bio {
  @apply resize-none w-full bg-[#F1F1F2] text-gray-800 border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none
}
</style>