<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="700px" @keydown.stop.esc="close" :persistent="true">
    <v-card>
      <v-form>
        <v-card-title> Nuevo Usuario </v-card-title>
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
              <v-phone-input v-model="phone" v-bind="phoneProps" label="Teléfono" validate-on="blur lazy"> </v-phone-input>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="password" v-bind="passwordProps" label="Contraseña"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="confirmation" v-bind="confirmationProps" label="Confirmar Contraseña"></v-text-field>
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
import { VPhoneInput } from "v-phone-input"
import { PublicPathState, useForm } from "vee-validate"
import { PropType, watch } from "vue"
import * as yup from "yup"

import { CreateUserInput, User } from "@/grapqhl"
import * as validations from "@/validations"

const vuetifyConfig = (state: PublicPathState) => ({
  props: {
    "error-messages": state.errors,
  },
})
const { defineField, meta, values, resetForm } = useForm<CreateUserInput & { confirmation: string }>({
  validationSchema: toTypedSchema(
    yup.object({
      firstName: validations.firstName(),
      email: validations.email(),
      lastName: validations.lastName(),
      password: validations.password(),
      confirmation: validations.confirmation(),
      phone: validations.phone(),
      planId: validations.planId(),
    }),
  ),
})
const [firstName, firstNameProps] = defineField("firstName", vuetifyConfig)
const [lastName, lastNameProps] = defineField("lastName", vuetifyConfig)
const [email, emailProps] = defineField("email", vuetifyConfig)
const [phone, phoneProps] = defineField("phone")
const [password, passwordProps] = defineField("password", vuetifyConfig)
const [confirmation, confirmationProps] = defineField("confirmation", vuetifyConfig)

const props = defineProps({
  modelValue: { type: Boolean, default: () => false },
  loading: { type: Boolean, default: () => false },
})

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
  submit: [value: CreateUserInput]
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
    const { confirmation: _, ...data } = values
    emit("submit", data)
  }
}
</script>

<style scoped></style>
