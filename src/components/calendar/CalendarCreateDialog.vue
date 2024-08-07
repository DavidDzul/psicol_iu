<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="700px" @keydown.stop.esc="close" :persistent="true">
    <v-card>
      <v-form>
        <v-card-title> Nueva Fecha </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="12">
              <v-menu v-model="fromDateMenu" :close-on-content-click="false" :close-on-back="true" max-width="400" min-width="200">
                <template v-slot:activator="{ props }">
                  <v-text-field label="Seleccione una fecha" prepend-icon="mdi-calendar" readonly :model-value="fromDateDisp" v-bind="props"></v-text-field>
                </template>
                <v-date-picker v-model="fromDateVal" no-title @update:model-value="getDate($event)" :hide-header="true"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field v-model="name" v-bind="nameProps" label="Nombre del evento"></v-text-field>
            </v-col>
            <v-col cols="12" md="12">
              <v-select v-model="generationId" v-bind="generationIdProps" label="Generación" item-title="entryName" item-value="id" :items="filterGenerations"></v-select>
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
import dayjs from "dayjs"
import { PublicPathState, useForm } from "vee-validate"
import { computed, PropType, ref, watch } from "vue"
import * as yup from "yup"

import { Admin, CreateCalendarInput, Generation } from "@/grapqhl"
import * as validations from "@/validations"

const vuetifyConfig = (state: PublicPathState) => ({
  props: {
    "error-messages": state.errors,
  },
})
const { defineField, meta, values, resetForm, setValues } = useForm<CreateCalendarInput>({
  validationSchema: toTypedSchema(
    yup.object({
      name: validations.calendarName(),
      generationId: validations.calendarGenerationId(),
      date: validations.calendarDate(),
    }),
  ),
})
const [name, nameProps] = defineField("name", vuetifyConfig)
const [generationId, generationIdProps] = defineField("generationId", vuetifyConfig)
const fromDateMenu = ref(false)
const fromDateVal = ref(null)

const props = defineProps({
  modelValue: { type: Boolean, default: () => false },
  loading: { type: Boolean, default: () => false },
  generations: { type: Array as PropType<Generation[]>, default: () => [] },
  admin: { type: Object as PropType<Admin>, required: true },
})

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
  submit: [value: CreateCalendarInput]
}>()

watch(
  () => props.modelValue,
  (value) => {
    if (!value) {
      resetForm()
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

const getDate = (date: any) => {
  fromDateVal.value = date
  fromDateMenu.value = false
}

const fromDateDisp = computed(() => {
  if (!fromDateVal.value) return ""
  const formatDate = dayjs(fromDateVal.value)
  return formatDate.format("DD/MM/YYYY")
})

const close = () => {
  emit("update:modelValue", false)
  fromDateVal.value = null
}

const save = () => {
  if (meta.value.valid) {
    emit("submit", values)
  }
}

const filterGenerations = computed(() => {
  if (props.generations) {
    const result = props.generations.filter((map) => map.campus === props.admin.campus)
    return result
  }
  return []
})
</script>
