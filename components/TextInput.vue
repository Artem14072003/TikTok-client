<script setup lang="ts">
const emit = defineEmits([`update:input`]);

const props = defineProps<{
  placeholder: string;
  input: string;
  inputType: string;
  autoFocus: boolean;
  error: string;
  max: number;
}>();

const {input, placeholder, inputType, max, autoFocus, error} = toRefs(props);

onMounted(() => {
  if (autoFocus.value) {
    return document.getElementById(`input-${placeholder.value}`)?.focus()
  }
})

const inputComputed = computed({
  get: () => input.value,
  set: (val) => emit('update:input', val)
})

</script>

<template>
  <div>
    <input
        :id="`input-${placeholder}`"
        :placeholder="placeholder"
        class="input"
        :type="inputType"
        v-model="inputComputed"
        autocomplete="off"
        :maxlength="max"
    />

    <span v-if="error" class="text-red-500 text-[14px] font-semibold">
      {{error}}
    </span>
  </div>
</template>

<style scoped>
.input {
  @apply block w-full bg-[#F1F1F2] text-gray-800 border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none;
}
</style>