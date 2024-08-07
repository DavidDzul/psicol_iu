<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="600px" @keydown.stop.esc="close" :persistent="true">
    <v-card>
      <v-form>
        <v-card-title> Nuevo archivo </v-card-title>
        <v-card-text>
          <v-item-group mandatory class="mt-2 mb-2">
            <v-container>
              <v-row class="mx-auto">
                <!-- <v-col class="mt-0 mb-6" cols="6">
                  <p class="mb-2">Fecha de inicio:</p>
                  <VueDatePicker v-model="startDate" auto-apply :enable-time-picker="false"></VueDatePicker>
                </v-col> -->
                <v-col cols="12" md="12">
                  <v-menu v-model="formMenuStart" :close-on-content-click="false" :close-on-back="true" max-width="400" min-width="200">
                    <template v-slot:activator="{ props }">
                      <v-text-field label="Fecha de inicio" readonly :model-value="startDate" v-bind="props"></v-text-field>
                    </template>
                    <v-date-picker v-model="fromDateStart" no-title @update:model-value="getStartDate($event)" :hide-header="true"></v-date-picker>
                  </v-menu>
                </v-col>
                <!-- <v-col class="mt-0 mb-6" cols="6">
                  <p class="mb-2">Fecha de término:</p>
                  <VueDatePicker v-model="endDate" auto-apply :enable-time-picker="false"></VueDatePicker>
                </v-col> -->
                <v-col cols="12" md="12">
                  <v-menu v-model="formMenuEnd" :close-on-content-click="false" :close-on-back="true" max-width="400" min-width="200">
                    <template v-slot:activator="{ props }">
                      <v-text-field label="Fecha de término" readonly :model-value="endDate" v-bind="props"></v-text-field>
                    </template>
                    <v-date-picker v-model="fromDateEnd" no-title @update:model-value="getDate($event)" :hide-header="true"></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12">
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
import dayjs from "dayjs"
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
const formMenuStart = ref(false)
const fromDateStart = ref(null)

const endDate = ref<string>("")
const formMenuEnd = ref(false)
const fromDateEnd = ref(null)

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
  endDate.value = ""
  startDate.value = ""
  emit("update:modelValue", false)
}

const save = () => {
  if (file.value && fromDateStart.value && fromDateEnd.value) {
    emit("submit", file.value, fromDateStart.value, fromDateEnd.value)
    file.value = null
    validate.value = true
    endDate.value = ""
    startDate.value = ""
    fromDateStart.value = null
    fromDateEnd.value = null
  }
}

const getStartDate = (date: any) => {
  fromDateStart.value = date
  startDate.value = dayjs(fromDateStart.value).format("DD/MM/YYYY")
  formMenuStart.value = false
}

const getDate = (date: any) => {
  fromDateEnd.value = date
  endDate.value = dayjs(fromDateEnd.value).format("DD/MM/YYYY")
  formMenuEnd.value = false
}
</script>
