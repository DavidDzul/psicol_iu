<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="800px" @keydown.stop.esc="close" :persistent="true">
    <v-card>
      <v-form>
        <v-card-title> Generar Asistencia </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="campusName" label="Sede" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select v-model="generationId" label="Generación" item-title="entryName" item-value="id" :items="filterGenerations" :disabled="!campusName"></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select v-model="userId" v-bind="userIdProps" label="Becario" item-title="firstName" item-value="id" :items="filterStudens" :disabled="!generationId"></v-select>
            </v-col>
            <!-- <v-col cols="12" md="12">
              <label>Seleccione una fecha:</label>
              <VueDatePicker v-model="dateData" auto-apply :enable-time-picker="false"></VueDatePicker>
            </v-col> -->
            <v-col cols="12" md="6">
              <v-menu v-model="fromDateMenu" :close-on-content-click="false" :close-on-back="true" max-width="400" min-width="200">
                <template v-slot:activator="{ props }">
                  <v-text-field label="Seleccione una fecha" readonly :model-value="fromDateDisp" v-bind="props"></v-text-field>
                </template>
                <v-date-picker v-model="fromDateVal" no-title @update:model-value="getDate($event)" :hide-header="true"></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="12" md="12" style="padding-top: 0">
              <h3>Estado de asistencia:</h3>
            </v-col>
            <v-col cols="12" md="12" class="py-0">
              <v-checkbox v-model="delay" v-bind="delayProps" label="RETARDO" density="comfortable" :disabled="!!justifiedAbsence || !!justifiedDelay"></v-checkbox>
            </v-col>
            <v-col cols="12" md="12" class="py-0">
              <v-checkbox v-model="justifiedDelay" v-bind="justifiedDelayProps" label="RETARDO JUSTIFICADO" density="comfortable" :disabled="!!justifiedAbsence || !!delay"></v-checkbox>
            </v-col>
            <v-col cols="12" md="12" class="py-0">
              <v-checkbox v-model="justifiedAbsence" v-bind="justifiedAbsenceProps" label="FALTA JUSTIFICADA" density="comfortable" :disabled="!!justifiedDelay || !!delay"></v-checkbox>
            </v-col>
            <v-col cols="12" md="12">
              <v-select
                v-model="reason"
                v-bind="reasonProps"
                label="Razón"
                item-title="text"
                item-value="value"
                :items="ReasonArray"
                :disabled="delay || justifiedAbsence || justifiedDelay ? false : true"
              ></v-select>
            </v-col>
            <v-col>
              <v-text-field v-model="descripcion" v-bind="descripcionProps" label="Descripción del motivo" :disabled="reason === ReasonEmun.Other ? false : true"></v-text-field>
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
import dayjs from "dayjs"
import { PublicPathState, useForm } from "vee-validate"
import { computed, PropType, ref, watch } from "vue"
import * as yup from "yup"

import { Admin, CampusEnum, CreateAttendanceInput, Generation, ReasonEmun, User } from "@/grapqhl"
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
const fromDateMenu = ref(false)
const fromDateVal = ref(null)
const fromDateDisp = ref("")

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
  () => fromDateVal.value,
  (value) => {
    if (value) {
      setValues({
        date: value,
      })
    }
  },
)

watch(
  () => delay.value || justifiedAbsence.value || justifiedDelay.value,
  () => {
    reason.value = null
    descripcion.value = null
  },
)

const close = () => {
  fromDateDisp.value = ""
  emit("update:modelValue", false)
}

const save = () => {
  if (meta.value.valid) {
    emit("submit", values)
  }
}

const getDate = (date: any) => {
  fromDateVal.value = date
  fromDateMenu.value = false
  const formatDate = dayjs(fromDateVal.value)
  fromDateDisp.value = formatDate.format("DD/MM/YYYY")
}

const filterGenerations = computed(() => {
  if (props.generations) {
    const result = props.generations.filter((map) => map.campus === props.campus)
    return result
  }
  return []
})
</script>
