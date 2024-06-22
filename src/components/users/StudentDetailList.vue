<template>
  <v-list class="user-details-list" density="comfortable">
    <v-list-item title="ID" :subtitle="user.id"> </v-list-item>
    <v-list-item title="Nombre" :subtitle="user.firstName"> </v-list-item>
    <v-list-item title="Apellidos" :subtitle="user.lastName"> </v-list-item>
    <v-list-item title="Email" :subtitle="user.email"> </v-list-item>
    <v-list-item title="Activo">
      <v-list-item-subtitle>
        <v-icon>{{ user.active ? "mdi-check" : "mdi-close" }}</v-icon>
      </v-list-item-subtitle></v-list-item
    >
    <v-list-item title="Fecha de Registro" :subtitle="formattedDate"> </v-list-item>
  </v-list>
</template>
<script setup lang="ts">
import { unix } from "dayjs"
import { computed, PropType } from "vue"

import { User } from "@/grapqhl"

const props = defineProps({
  user: { type: Object as PropType<User>, required: true },
})

const formattedDate = computed(() => unix(Number.parseInt(props.user.createdAt) / 1000).format("DD/MM/YYYY HH:mm:ss"))
</script>
<style lang="scss">
.user-details-list {
  max-width: 450px;
  .v-list-item__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
