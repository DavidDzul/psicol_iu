<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="700px" @keydown.stop.esc="close" :persistent="true">
    <v-card>
      <v-form>
        <v-card-title> Actualizar Asistencia </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="12">
              <v-text-field v-model="userName" label="Becario" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="checkIn" label="Entrada" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="checkOut" label="Salida" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="12" style="padding-top: 0">
              <h3>Estado de asistencia:</h3>
            </v-col>
            <v-col cols="12" md="12" class="py-0">
              <v-checkbox v-model="delay" v-bind="delayProps" label="RETARDO" density="comfortable" :disabled="!!justifiedAbsence || !!justifiedDelay" @click="handleCheckboxChange"></v-checkbox>
            </v-col>
            <v-col cols="12" md="12" class="py-0">
              <v-checkbox
                v-model="justifiedDelay"
                v-bind="justifiedDelayProps"
                label="RETARDO JUSTIFICADO"
                density="comfortable"
                :disabled="!!justifiedAbsence || !!delay"
                @click="handleCheckboxChange"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="12" class="py-0">
              <v-checkbox
                v-model="justifiedAbsence"
                v-bind="justifiedAbsenceProps"
                label="FALTA JUSTIFICADA"
                density="comfortable"
                :disabled="!!justifiedDelay || !!delay"
                @click="handleCheckboxChange"
              ></v-checkbox>
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
            <v-col v-if="reason === ReasonEmun.Other">
              <v-text-field v-model="descripcion" v-bind="descripcionProps" label="Descripción del motivo"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" :disabled="loading" @click="close">Cancelar</v-btn>
          <v-btn color="primary" variant="text" :disabled="!meta.valid" :loading="loading" @click="save"> Actualizar</v-btn>
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
import { PropType, ref, watch } from "vue"
import * as yup from "yup"

import { Attendance, ReasonEmun, UpdateAttendanceInput } from "@/grapqhl"
import * as validations from "@/validations"

import { ReasonArray } from "../../../constants"
import "@vuepic/vue-datepicker/dist/main.css"

const vuetifyConfig = (state: PublicPathState) => ({
  props: {
    "error-messages": state.errors,
  },
})
const { defineField, meta, values, resetForm, setValues } = useForm<UpdateAttendanceInput>({
  validationSchema: toTypedSchema(
    yup.object({
      delay: validations.delay(),
      justifiedDelay: validations.justifiedDelay(),
      justifiedAbsence: validations.justifiedAbsence(),
      reason: validations.reason(),
      descripcion: validations.descripcion(),
    }),
  ),
})

const [delay, delayProps] = defineField("delay", vuetifyConfig)
const [justifiedDelay, justifiedDelayProps] = defineField("justifiedDelay", vuetifyConfig)
const [justifiedAbsence, justifiedAbsenceProps] = defineField("justifiedAbsence", vuetifyConfig)
const [reason, reasonProps] = defineField("reason", vuetifyConfig)
const [descripcion, descripcionProps] = defineField("descripcion", vuetifyConfig)
const userName = ref("")
const checkIn = ref("")
const checkOut = ref("")

const props = defineProps({
  modelValue: { type: Boolean, default: () => false },
  loading: { type: Boolean, default: () => false },
  editItem: { type: Object as PropType<Attendance>, required: false },
})

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
  submit: [value: UpdateAttendanceInput]
}>()

watch(
  () => props.editItem,
  (value) => {
    if (!value) {
      resetForm()
    } else {
      userName.value = value.userAttendance?.firstName + " " + value.userAttendance?.lastName
      checkIn.value = value.checkIn || ""
      checkOut.value = value?.checkOut || ""
      setValues({
        justifiedDelay: value.justifiedDelay,
        justifiedAbsence: value.justifiedAbsence,
        delay: value.delay,
        reason: value.reason,
        descripcion: value.descripcion,
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

const handleCheckboxChange = () => {
  reason.value = null
  descripcion.value = null
}

const converTimestamp = (value: string | undefined) => {
  if (value) {
    const timestamp = parseInt(value, 10)
    const date = dayjs(timestamp).add(1, "hour")
    const formattedDate = date.format("DD/MM/YYYY HH:mm:ss")
    return formattedDate
  }
}
</script>
