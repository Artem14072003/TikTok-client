<script setup lang="ts">
const props = defineProps<{
  errorType: string | null,
}>()
const {errorType} = toRefs(props);

let error = ref<string>('');

watch(() => errorType.value, () => {
  console.log(errorType.value === "caption")
  switch (errorType.value) {
    case "caption":
      return error.value = 'Maximum 150 characters.';
    case "bio":
      return error.value = 'Maximum 80 characters.';
    case "file":
      return error.value = 'Unsupported file. Use MP4 instead.'
    default:
      return error.value = '';
  }

})
</script>

<template>
<div class="w-[100%] fixed top-[50px] flex justify-center">
  <div
      class="validate-text"
      :class="errorType ? 'visible' : 'invisible'"
  >
    {{error}}
  </div>
</div>
</template>

<style scoped>
.validate-text {
  @apply absolute top-6 z-50 mx-auto bg-black bg-opacity-70 text-white px-14 py-3 rounded-sm
}
</style>