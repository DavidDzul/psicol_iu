<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="700px" @keydown.stop.esc="close" :persistent="true">
    <v-card>
      <v-form>
        <v-card-title> Crear Autorización </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="12">
              <v-select v-model="status" v-bind="statusProps" label="Estatus" item-title="text" item-value="value" :items="statusAutorizationArray"></v-select>
            </v-col>
            <template v-if="status === StatusAutorizationEmun.Detained">
              <v-col cols="12" md="12">
                <v-checkbox v-model="previousPayment" v-bind="previousPaymentProps" label="¿PAGO DE MESES RETENIDOS?"></v-checkbox>
              </v-col>
              <template v-if="previousPayment">
                <v-col cols="12" md="6">
                  <v-text-field v-model="numberMonths" v-bind="numberMonthsProps" label="Número de meses retenidos"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="previousMonths" v-bind="previousMonthsProps" label="Meses retenido (Especificar cuales son)"></v-text-field>
                </v-col>
              </template>
              <template v-else>
                <v-col cols="12" md="12">
                  <v-select v-model="cause" v-bind="causeProps" label="Motivo" item-title="text" item-value="value" :items="causeArray"></v-select>
                </v-col>
                <v-col cols="12" md="12" v-if="cause === CauseEmun.Other">
                  <v-text-field v-model="otherCause" v-bind="otherCauseProps" label="Especificar motivo"></v-text-field>
                </v-col>
              </template>
            </template>

            <template v-else>
              <v-col cols="12" md="12">
                <v-select v-model="percentage" v-bind="percentageProps" label="Porcentaje" item-title="value" item-value="value" :items="filterPercentage"></v-select>
              </v-col>
            </template>
            <template v-if="status === 'SUSPENDED'">
              <v-col cols="12" md="12">
                <v-select v-model="cause" v-bind="causeProps" label="Motivo" item-title="text" item-value="value" :items="causeArray"></v-select>
              </v-col>
              <v-col cols="12" md="12" v-if="cause === CauseEmun.Other">
                <v-text-field v-model="otherCause" v-bind="otherCauseProps" label="Especificar motivo"></v-text-field>
              </v-col>
            </template>
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
import { computed, PropType, ref, watch } from "vue"
import * as yup from "yup"

import { CauseEmun, CreateAutorizationInput, StatusAutorizationEmun } from "@/grapqhl"
import * as validations from "@/validations"

import { causeArray, statusAutorizationArray } from "../../../constants"

const vuetifyConfig = (state: PublicPathState) => ({
  props: {
    "error-messages": state.errors,
  },
})
const { defineField, meta, values, resetForm, setValues } = useForm<CreateAutorizationInput>({
  validationSchema: toTypedSchema(
    yup.object({
      status: validations.statusAutorization(),
      percentage: validations.percentage(),
      previousPayment: validations.previousPayment(),
      numberMonths: validations.numberMonths(),
      previousMonths: validations.previousMonths(),
      cause: validations.cause(),
      otherCause: validations.otherCause(),
    }),
  ),
})

const [status, statusProps] = defineField("status", vuetifyConfig)
const [percentage, percentageProps] = defineField("percentage", vuetifyConfig)
const [previousPayment, previousPaymentProps] = defineField("previousPayment", vuetifyConfig)
const [numberMonths, numberMonthsProps] = defineField("numberMonths", vuetifyConfig)
const [previousMonths, previousMonthsProps] = defineField("previousMonths", vuetifyConfig)
const [cause, causeProps] = defineField("cause", vuetifyConfig)
const [otherCause, otherCauseProps] = defineField("otherCause", vuetifyConfig)

const props = defineProps({
  modelValue: { type: Boolean, default: () => false },
  loading: { type: Boolean, default: () => false },
})

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
  submit: [value: CreateAutorizationInput]
}>()

watch(
  () => props.modelValue,
  (value) => {
    if (!value) {
      resetForm()
    } else {
      setValues({
        status: StatusAutorizationEmun.Active,
      })
    }
  },
)

const close = () => {
  emit("update:modelValue", false)
}

watch(
  () => status.value,
  (value) => {
    if (value) {
      percentage.value = null
      cause.value = null
      numberMonths.value = null
      previousMonths.value = null
      previousPayment.value = false
    }
  },
)

watch(
  () => previousPayment.value,
  () => {
    percentage.value = null
    cause.value = null
    numberMonths.value = null
    previousMonths.value = null
  },
)

const filterPercentage = computed(() => {
  if (status.value === "ACTIVE") {
    return [{ value: 100 }]
  } else if (status.value === "DETAINED") {
    return [{ value: 0 }, { value: 100 }]
  } else if (status.value === "SUSPENDED" || status.value === "GRADUATE") {
    return [{ value: 100 }, { value: 50 }, { value: 25 }]
  }
  return [{ value: 0 }]
})

const save = () => {
  if (meta.value.valid) {
    emit("submit", values)
  }
}
</script>
