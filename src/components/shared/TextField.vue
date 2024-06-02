<template>
  <v-text-field v-model="value" :error-messages="errorMessage" :label="label" :hint="hint" @update:model-value="$emit('update:modelValue', $event)" @blur="validate"> </v-text-field>
</template>
<script setup lang="ts">
import { useField } from "vee-validate"
import { toRef } from "vue"

const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, required: true },
  hint: { type: String, required: true },
})

defineEmits<{
  "update:modelValue": [value: string]
}>()

const { value, errorMessage, validate } = useField<string>(toRef(props, "name"))
</script>
