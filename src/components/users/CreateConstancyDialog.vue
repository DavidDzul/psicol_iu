<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="600px" @keydown.stop.esc="close" :persistent="true">
    <v-card>
      <v-form>
        <v-card-title> Nuevo archivo </v-card-title>
        <v-card-text>
          <v-item-group mandatory class="mt-5 mb-5">
            <v-container>
              <v-row class="mx-auto">
                <v-col class="mt-0 mb-6" cols="6">
                  <p class="mb-2">Fecha de inicio:</p>
                  <VueDatePicker v-model="startDate" auto-apply :enable-time-picker="false"></VueDatePicker>
                </v-col>
                <v-col class="mt-0 mb-6" cols="6">
                  <p class="mb-2">Fecha de término:</p>
                  <VueDatePicker v-model="endDate" auto-apply :enable-time-picker="false"></VueDatePicker>
                </v-col>
                <v-col class="mt-8 mb-10" cols="12">
                  <p class="mb-2">Seleccione el archivo correspondiente a la constancia de estudios:</p>
                  <v-file-input @update:model-value="changeFile" label="Archivo" required> </v-file-input>
                </v-col>
              </v-row>
            </v-container>
          </v-item-group>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="close">Cancelar</v-btn>
          <v-btn color="primary" :disabled="validate" :loading="loading" variant="text" @click="save"> Guardar</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/yup"
import VueDatePicker from "@vuepic/vue-datepicker"
import { PropType, ref } from "vue"
import * as yup from "yup"
import "@vuepic/vue-datepicker/dist/main.css"

defineProps({
  modelValue: { type: Boolean, default: () => false },
  loading: { type: Boolean, default: () => false },
})

const file = ref<null | File>(null)
const validate = ref(true)
const startDate = ref<string>("")
const endDate = ref<string>("")

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
  submit: [file: File, startDate: string, endDate: string]
}>()

const changeFile = (event: File | File[]) => {
  const fileToLoad = Array.isArray(event) ? event[0] : event
  if (fileToLoad) {
    file.value = fileToLoad
    validate.value = false
  } else {
    file.value = null
    validate.value = true
  }
}

const close = () => {
  file.value = null
  validate.value = true
  emit("update:modelValue", false)
}

const save = () => {
  if (file.value) {
    emit("submit", file.value, startDate.value, endDate.value)
    file.value = null
    validate.value = true
  }
}
</script>
