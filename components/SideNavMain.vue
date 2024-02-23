<script setup lang="ts">
const {$generaleStore, $userStore} = useNuxtApp();
const router = useRouter();
const route = useRoute();

console.log($generaleStore.following)
const isLoggedIn = (fol: { id: number }) => {
  console.log(fol)
  if (!$userStore.id) {
    return $generaleStore.isLoginOpen = true
  }
  setTimeout(() => router.push(`/profile/${fol.id}`), 200)
}
</script>

<template>
  <div
      id="SideNavMain"
      :class="route.fullPath === '/' ? 'lg:w-[310px]' : 'lg:w-[220px]'"
      class="fixed z-20 bg-white pt-[70px] h-full lg:border-r-0 border-r w-[75px] overflow-auto"
  >
    <div class="lg:w-full w-[55px] mx-auto">
      <NuxtLink to="/">
        <MenuItem iconString="Рекомендуем" colorString="#F02C56" sizeString="30"/>
      </NuxtLink>
      <MenuItem iconString="Друзья" colorString="#000000" sizeString="27"/>
      <MenuItem iconString="LIVE" colorString="#000000" sizeString="27"/>

      <div class="border-b lg:ml-2 mt-2"/>

      <div class="lg:block hidden text-xs text-gray-600 font-semibold pt-4 pb-2 px-2">
        Подписки на аккаунты
      </div>

      <div class="lg:hidden block pt-3"/>

      <div
          v-if="$generaleStore.suggested"
          v-for="sug in $generaleStore.suggested"
      >
        <div @click="isLoggedIn(sug)" class="cursor-pointer">
          <MenuItemFollow :user="sug"/>
        </div>
      </div>

      <button class="lg:block hidden text-[#F02C56] pt-1.5 pl-2 text-[13px]">
        Показать все
      </button>

      <div class="border-b lg:ml-2 mt-2"/>

      <div class="lg:block hidden text-xs text-gray-600 font-semibold pt-4 pb-2 px-2">
        Предлагаемые аккаунты
      </div>

      <div class="lg:hidden block pt-3"/>

      <div
          v-if="$generaleStore.following"
          v-for="fol in $generaleStore.following"
      >
        <div @click="isLoggedIn(fol)" class="cursor-pointer">
          <MenuItemFollow :user="fol"/>
        </div>
      </div>

      <button class="lg:block hidden text-[#F02C56] pt-1.5 pl-2 text-[13px]">
        Показать все
      </button>

      <div class="lg:block hidden border-b lg:ml-2 mt-2"/>

      <div class="lg:block hidden text-11px text-grey-500">
        <div class="pt-4 px-2">
        </div>
        <div class="pt-4 px-2">Информация Новости Контакт Род занятий
          TikTok for Good Реклама TikTok LIVE Creator Networks Developers Прозрачность TikTok RewardsTikTok Embeds
        </div>
        <div class="pt-4 px-2">Помощь Безопасность Условия Политику конфиденциальности Центр конфиденциальности Портал
          для авторов Правила сообщества Авторское право
        </div>
        <div class="pt-4 px-2">© 2024 TikTok</div>
      </div>
      <div class="pb-14"></div>
    </div>
  </div>
</template>