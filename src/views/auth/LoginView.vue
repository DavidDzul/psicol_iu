<template>
  <v-form class="login__screen-form mx-auto text-center">
    <v-text-field v-model="email" label="Usuario" prepend-inner-icon="mdi-account"></v-text-field>
    <v-text-field v-model="password" label="Contraseña" type="password" prepend-inner-icon="mdi-lock"></v-text-field>
    <!-- <v-btn size="small" variant="text" class="text-left d-block px-0 text-disabled"> <router-link to="/auth/recuperar">Recuperar contraseña</router-link> </v-btn> -->
    <v-btn class="mt-3" color="blue-darken-4" @click="onLogin" :loading="loading">INICIAR SESIÓN</v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"

import { useLoginPageStore } from "@/store/views/loginPage"

const { onLogin } = useLoginPageStore()

const { password, loading, email } = storeToRefs(useLoginPageStore())
</script>
<style scoped lang="scss"></style>
