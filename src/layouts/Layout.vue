<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-layout id="app">
    <v-app-bar color="blue-darken-4" :order="0">
      <v-app-bar-nav-icon @click="onClick"></v-app-bar-nav-icon>
      <v-toolbar-title>Dpto. Psicopedagogía</v-toolbar-title>
      <v-spacer></v-spacer>
      <ProfileMenu v-if="userProfile" :user="userProfile" :initials="userInitials" :full-name="fullName" @logout="logout" />
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" :permanent="!mobile" :width="256">
      <NavMenu />
    </v-navigation-drawer>
    <v-main>
      <LoadingOverlay v-model="loading" />
      <v-container class="container__main" :fluid="true">
        <router-view />
      </v-container>
    </v-main>
    <v-snackbar v-model="show" :timeout="7000" :location="'right top'" :close-on-content-click="true" :color="config.status" :vertical="true">
      <div class="d-flex">
        <v-icon class="mt-1 mr-2" v-if="config?.icon" :icon="config.icon"></v-icon>
        <div>
          <div class="text-subtitle-1 font-weight-bold">{{ config.title }}</div>
          <p>{{ config?.body }}</p>
        </div>
      </div>
    </v-snackbar>
  </v-layout>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { ref } from "vue"
import { useDisplay } from "vuetify"

import LoadingOverlay from "@/components/shared/LoadingOverlay.vue"
import NavMenu from "@/layouts/NavMenu.vue"
import ProfileMenu from "@/layouts/ProfileMenu.vue"
import { useAlertStore } from "@/store/alertStore"
import { useAuthStore } from "@/store/api/authStore"
import { useAppStore } from "@/store/app"

const { mobile } = useDisplay()
const { loading } = storeToRefs(useAppStore())
const { show, config } = storeToRefs(useAlertStore())
const { userProfile, userInitials, fullName } = storeToRefs(useAuthStore())
const { logout } = useAuthStore()

const drawer = ref(!mobile.value)

const onClick = () => {
  drawer.value = !drawer.value
}
</script>
<style lang="scss" scoped>
.container__main {
  height: calc(100svh - var(--v-layout-top));
  overflow-y: auto;
}
</style>
