<script setup lang="ts">
import {AxiosError} from "axios";

interface IError {
  name: string,
  email: string,
  password: string,
  confirmPassword: string
}

const {$userStore, $generaleStore} = useNuxtApp();
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref<IError | null>(null);

const register = async () => {
  error.value = null

  try {
    await $userStore.getToken();
    await $userStore.register(
        name.value,
        email.value,
        password.value,
        confirmPassword.value
    )
    await $userStore.getUser()

    $generaleStore.isLoginOpen = false
  } catch (e) {
    console.log(e)
    if (e instanceof AxiosError)
      error.value = e.response?.data.errors

  }
}
</script>

<template>
  <div class="text-center text-[28px] mb-4 font-bold">Регистрация</div>

  <div class="px-6 pb-2">
    <TextInput
        placeholder="Логин"
        v-model:input="name"
        inputType="text"
        :autoFocus="true"
        :error="error && error.name ? error?.name[0]: '' "
    />
  </div>

  <div class="px-6 pb-2">
    <TextInput
        placeholder="Почта"
        v-model:input="email"
        input-type="email"
        :error="error && error.email ? error?.email[0]: '' "
    />
  </div>

  <div class="px-6 pb-2">
    <TextInput
        placeholder="Пароль"
        v-model:input="password"
        input-type="password"
        :error="error && error.password ? error?.password[0]: '' "
    />
  </div>

  <div class="px-6 pb-2">
    <TextInput
        placeholder="Повтор пароля"
        v-model:input="confirmPassword"
        input-type="password"
        :error="error && error.confirmPassword ? error?.confirmPassword[0]: '' "
    />
  </div>

  <div class="px-6 pb-2 mt-6">
    <button
        :disabled="(!name || !email || !password || !confirmPassword)"
        :class="(!name || !email || !password || !confirmPassword) ? 'bg-gray-200' : 'bg-red-button'"
        @click="register()"
        class="w-full text-[17px] font-semibold text-white py-3 rounded-sm"
    >
      Зарегистрироваться
    </button>
  </div>
</template>

<style scoped>

</style>