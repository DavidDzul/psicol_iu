<template>
  <v-card>
    <v-form>
      <v-card-title class="mb-3"> Editar mi perfil</v-card-title>
      <v-card-text>
        <!-- <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="firstName" v-bind="firstNameProps" label="Nombre"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="lastName" v-bind="lastNameProps" label="Apellidos"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="email" :readonly="true" label="Email"></v-text-field>
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
        </v-row> -->
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <!-- <v-btn color="primary" variant="text" :disabled="!meta.valid" @click="save"> Actualizar</v-btn> -->
        <v-btn color="primary" variant="text"> Actualizar</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts" setup></script>
