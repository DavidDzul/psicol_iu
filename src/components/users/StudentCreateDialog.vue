<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="700px" @keydown.stop.esc="close" :persistent="true">
    <v-card>
      <v-form>
        <v-card-title> Nuevo becario </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="firstName" v-bind="firstNameProps" label="Nombre"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="lastName" v-bind="lastNameProps" label="Apellidos"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="email" v-bind="emailProps" label="Email"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select v-model="campus" v-bind="campusProps" label="Sede" item-title="text" item-value="value" :items="campusArray"></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select v-model="generationId" v-bind="generationIdProps" label="Generación" item-title="entryName" item-value="id" :items="campusGenerations" :disabled="!campus"></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="enrollment" v-bind="enrollmentProps" label="Matrícula"> </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-phone-input v-model="phone" v-bind="phoneProps" label="Teléfono" validate-on="blur lazy"> </v-phone-input>
            </v-col>
            <v-col cols="12" md="6">
              <v-select v-model="role" v-bind="roleProps" label="Tipo de usuario" item-title="text" item-value="value" :items="RoleUserArray"></v-select>
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field v-model="password" v-bind="passwordProps" label="Contraseña" readonly></v-text-field>
            </v-col>
            <!-- <v-col cols="12" md="6">
              <v-text-field v-model="confirmation" v-bind="confirmationProps" label="Confirmar Contraseña"></v-text-field>
            </v-col> -->
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
import { VPhoneInput } from "v-phone-input"
import { PublicPathState, useForm } from "vee-validate"
import { computed, PropType, ref, watch } from "vue"
import * as yup from "yup"

import { CampusEnum, CreateUserInput, Generation } from "@/grapqhl"
import * as validations from "@/validations"

import { CampusOption, RoleUserArray } from "../../../constants"

const props = defineProps({
  modelValue: { type: Boolean, default: () => false },
  loading: { type: Boolean, default: () => false },
  campusArray: { type: Array as PropType<CampusOption[]>, default: () => [] },
  generations: { type: Array as PropType<Generation[]>, default: () => [] },
})

const vuetifyConfig = (state: PublicPathState) => ({
  props: {
    "error-messages": state.errors,
  },
})
const { defineField, meta, values, resetForm } = useForm<CreateUserInput>({
  validationSchema: toTypedSchema(
    yup.object({
      firstName: validations.firstName(),
      email: validations.email(),
      lastName: validations.lastName(),
      password: validations.password(),
      phone: validations.phone(),
      enrollment: validations.enrollment(),
      campus: validations.campus(),
      generationId: validations.generation(),
      role: validations.role(),
    }),
  ),
})
const [firstName, firstNameProps] = defineField("firstName", vuetifyConfig)
const [lastName, lastNameProps] = defineField("lastName", vuetifyConfig)
const [email, emailProps] = defineField("email", vuetifyConfig)
const [phone, phoneProps] = defineField("phone")
const [password, passwordProps] = defineField("password", vuetifyConfig)
const [enrollment, enrollmentProps] = defineField("enrollment", vuetifyConfig)
const [campus, campusProps] = defineField("campus", vuetifyConfig)
const [generationId, generationIdProps] = defineField("generationId", vuetifyConfig)
const [role, roleProps] = defineField("role", vuetifyConfig)

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
  submit: [value: CreateUserInput]
}>()

const campusGenerations = computed(() => {
  return props.generations.filter((map) => map.campus === campus.value)
})

watch(
  () => props.modelValue,
  (value) => {
    if (!value) {
      resetForm()
    } else {
      password.value = "Agentedecambio"
    }
  },
)

watch(
  () => campus.value,
  (value) => {
    switch (value) {
      case CampusEnum.Merida:
        enrollment.value = "MER"
        break
      case CampusEnum.Valladolid:
        enrollment.value = "VAL"
        break
      case CampusEnum.Oxkutzcab:
        enrollment.value = "OXK"
        break
      case CampusEnum.Tizimin:
        enrollment.value = "TIZ"
        break
      default:
        break
    }
  },
)

watch(
  () => campus.value,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      generationId.value = null
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
