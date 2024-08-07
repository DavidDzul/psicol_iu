<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="700px" @keydown.stop.esc="close" :persistent="true">
    <v-card>
      <v-form>
        <v-card-title> Nueva Generación </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="12">
              <v-text-field v-model.number="entryName" v-bind="entryNameProps" label="Número de la generación"></v-text-field>
            </v-col>
            <v-col cols="12" md="12">
              <v-select v-model="campus" v-bind="campusProps" label="Sede" item-title="text" item-value="value" :items="campusArray"></v-select>
            </v-col>
            <v-col cols="12" md="12">
              <v-checkbox v-model="inProgress" v-bind="inProgressProps" label="¿Generación activa?" density="comfortable"></v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" :disabled="loading" @click="close">Cancelar</v-btn>
          <v-btn color="primary" variant="text" :disabled="!meta.valid" :loading="loading" @click="save"> Guardar</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/yup"
import { PublicPathState, useForm } from "vee-validate"
import { PropType, ref, watch } from "vue"
import * as yup from "yup"

import { CreateGenerationInput } from "@/grapqhl"
import * as validations from "@/validations"

import { CampusOption } from "../../../constants"

const vuetifyConfig = (state: PublicPathState) => ({
  props: {
    "error-messages": state.errors,
  },
})
const { defineField, meta, values, resetForm } = useForm<CreateGenerationInput>({
  validationSchema: toTypedSchema(
    yup.object({
      entryName: validations.generation(),
      inProgress: validations.active(),
      campus: validations.campus(),
    }),
  ),
})
const [entryName, entryNameProps] = defineField("entryName", vuetifyConfig)
const [inProgress, inProgressProps] = defineField("inProgress", vuetifyConfig)
const [campus, campusProps] = defineField("campus", vuetifyConfig)

const props = defineProps({
  modelValue: { type: Boolean, default: () => false },
  loading: { type: Boolean, default: () => false },
  campusArray: { type: Array as PropType<CampusOption[]>, default: () => [] },
})

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
  submit: [value: CreateGenerationInput]
}>()

watch(
  () => props.modelValue,
  (value) => {
    if (!value) {
      resetForm()
    }
  },
)

const close = () => {
  emit("update:modelValue", false)
}

const save = () => {
  if (meta.value.valid) {
    emit("submit", values)
  }
}
</script>
