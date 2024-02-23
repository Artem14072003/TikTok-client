<script setup lang="ts">
import {AxiosError} from "axios";

const {$userStore, $generaleStore} = useNuxtApp();
const email = ref('');
const password = ref('');
const error = ref<null | { email: string }>(null);

const login = async () => {
  error.value = null;

  try {

    await $userStore.getToken()
    await $userStore.login(email.value, password.value);
    await $userStore.getUser();

    $generaleStore.isLoginOpen = false
    console.log($generaleStore.isLoginOpen)
  } catch (e) {
    console.log(e)

    if (e instanceof AxiosError)
      error.value = e.response?.data.errors
  }
}
</script>

<template>
  <div class="text-center text-[28px] mb-4 font-bold">Войти</div>

  <div class="px-6 pb-1.6 text-[15px]">Ваша почта</div>

  <div class="px-6 pb-2">
    <TextInput
        placeholder="Почта"
        v-model:input="email"
        inputType="email"
        :autoFocus="true"
        :error="error && error.email ? error?.email[0]: '' "
    />
  </div>

  <div class="px-6 pb-2">
    <TextInput
        placeholder="Пароль"
        v-model:input="password"
        input-type="password"
    />
  </div>

  <div class="px-6 text-[12px] text-gray-600">Забыли пароль?</div>

  <div class="px-6 pb-2 mt-6">

    <button
        :disabled="(!email || !password)"
        :class="(!email || !password) ? 'bg-gray-200' : 'bg-red-button'"
        @click="login()"
        class="w-full text-[17px] bg-red-button font-semibold text-white py-3 rounded-sm"
    >
      Войти
    </button>
  </div>
</template>

<style scoped>

</style>