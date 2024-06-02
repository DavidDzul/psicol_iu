<template>
  <v-overlay class="d-flex loading-overlay" scrim="white" :persistent="true" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <v-img height="150" width="150" src="@/assets/img/GeoFile_LogoTransition.gif" rel="prefetch"></v-img>
  </v-overlay>
</template>
<script setup lang="ts">
defineProps({
  modelValue: { type: Boolean, default: () => false },
})

defineEmits<{
  "update:modelValue": [value: boolean]
}>()
</script>
<style lang="scss">
.loading-overlay {
  justify-content: center;
  align-items: center;
}
</style>
