<template>
  <div class="input-group input-group-sm">
    <input
      :class="{'form-error': isInvalid}"
      :type="isVisible ? 'text' : 'password'"
      class="form-control"
      v-model="innerValue"
    >
    <button
      :class="{'form-error': isInvalid}"
      class="btn btn-outline-secondary"
      style="border-color: var(--bs-border-color); background: inherit;"
      type="button"
      @click="toggle"
    >
      <i :class="isVisible ? 'bi bi-eye' : 'bi bi-eye-slash'"
      style="color: gray"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  isInvalid: boolean
  modelValue: string | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isVisible = ref(false)
const innerValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  val => {
    if (val !== innerValue.value) innerValue.value = val
  }
)

watch(innerValue, val => {
  emit('update:modelValue', val)
})

function toggle() {
  isVisible.value = !isVisible.value
}
</script>
