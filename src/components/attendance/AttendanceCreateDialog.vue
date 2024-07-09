<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="700px" @keydown.stop.esc="close" :persistent="true">
    <v-card>
      <v-form>
        <v-card-title> Generar Asistencia </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="12">
              <v-text-field v-model="campusName" label="Sede" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="12">
              <v-select v-model="generationId" label="Generación" item-title="generation" item-value="id" :items="generations" :disabled="!campusName"></v-select>
            </v-col>
            <v-col cols="12" md="12">
              <v-select v-model="userId" v-bind="userIdProps" label="Becario" item-title="firstName" item-value="id" :items="filterStudens" :disabled="!generationId"></v-select>
            </v-col>
            <v-col cols="12" md="12">
              <VueDatePicker v-model="dateData" auto-apply :enable-time-picker="false"></VueDatePicker>
            </v-col>
            <v-col cols="12" md="3">
              <v-checkbox v-model="delay" v-bind="delayProps" label="Retardo" density="comfortable" :disabled="!!justifiedAbsence"></v-checkbox>
            </v-col>
            <v-col cols="12" md="4">
              <v-checkbox v-model="justifiedDelay" v-bind="justifiedDelayProps" label="Retardo justificado" density="comfortable" :disabled="!!justifiedAbsence"></v-checkbox>
            </v-col>
            <v-col cols="12" md="4">
              <v-checkbox v-model="justifiedAbsence" v-bind="justifiedAbsenceProps" label="Falta justificada" density="comfortable" :disabled="!!justifiedDelay"></v-checkbox>
            </v-col>
            <v-col cols="12" md="12">
              <v-select v-model="reason" v-bind="reasonProps" label="Razón" item-title="text" item-value="value" :items="ReasonArray"></v-select>
            </v-col>
            <v-col v-if="reason === ReasonEmun.Other">
              <v-text-field v-model="descripcion" v-bind="descripcionProps" label="Descripción del motivo"></v-text-field>
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
import VueDatePicker from "@vuepic/vue-datepicker"
import { PublicPathState, useForm } from "vee-validate"
import { computed, PropType, ref, watch } from "vue"
import * as yup from "yup"

import { CampusEnum, CreateAttendanceInput, Generation, ReasonEmun, User } from "@/grapqhl"
import * as validations from "@/validations"

import { CampusTypeMap, ReasonArray } from "../../../constants"
import "@vuepic/vue-datepicker/dist/main.css"

const vuetifyConfig = (state: PublicPathState) => ({
  props: {
    "error-messages": state.errors,
  },
})
const { defineField, meta, values, resetForm, setValues } = useForm<CreateAttendanceInput>({
  validationSchema: toTypedSchema(
    yup.object({
      userId: validations.userId(),
      justifiedDelay: validations.justifiedDelay(),
      justifiedAbsence: validations.justifiedAbsence(),
      reason: validations.reason(),
      date: validations.date(),
      descripcion: validations.descripcion(),
      delay: validations.delay(),
    }),
  ),
})

const [userId, userIdProps] = defineField("userId", vuetifyConfig)
const [delay, delayProps] = defineField("delay", vuetifyConfig)
const [justifiedDelay, justifiedDelayProps] = defineField("justifiedDelay", vuetifyConfig)
const [justifiedAbsence, justifiedAbsenceProps] = defineField("justifiedAbsence", vuetifyConfig)
const [reason, reasonProps] = defineField("reason", vuetifyConfig)
const [descripcion, descripcionProps] = defineField("descripcion", vuetifyConfig)
const generationId = ref(undefined)
const dateData = ref<string>("")

const props = defineProps({
  modelValue: { type: Boolean, default: () => false },
  loading: { type: Boolean, default: () => false },
  campus: { type: String as PropType<CampusEnum>, default: () => "" },
  students: { type: Array as PropType<User[]>, default: () => [] },
  generations: { type: Array as PropType<Generation[]>, default: () => [] },
})

const campusMap = computed(() => CampusTypeMap)
const campusName = computed(() => campusMap.value.get(props.campus)?.text)
const filterStudens = computed(() => props.students.filter((map) => map.generationId === generationId.value))

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
  submit: [value: CreateAttendanceInput]
}>()

watch(
  () => props.modelValue,
  (value) => {
    if (!value) {
      generationId.value = undefined
      resetForm()
    }
  },
)

watch(
  () => generationId.value,
  (value) => {
    if (value) {
      userId.value = undefined
    }
  },
)

watch(
  () => dateData.value,
  (value) => {
    if (value) {
      setValues({
        date: value,
      })
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
