<script setup lang="ts">
const props = defineProps<{
  iconString: string;
  colorString: string;
  sizeString: string
}>();

const {iconString, colorString, sizeString} = toRefs(props);

let icon = ref('');

switch (iconString?.value) {
  case "Рекомендуем":
    icon.value = 'mdi:home';
    break;
  case "Друзья":
    icon.value = 'ci:group';
    break;
  case "LIVE":
    icon.value = 'ri:live-line'
    break;
  default:
    icon.value ="material-symbols:error";
    break
}
</script>

<template>
<div class="w-full cursor-pointer transition-colors duration-300 ease-in flex items-center hover:bg-gray-100 p-2.5 rounded-full">
 <div class="flex items-center lg:mx-0 mx-auto">
    <Icon :name="icon" :color="colorString" :size="sizeString"/>
   <span
       :class="`text-${colorString}`"
       class="lg:block hidden pl-[9px] mt-0.5 font-semibold text-[17px]"
   >
    {{iconString}}
   </span>
 </div>
</div>
</template>

