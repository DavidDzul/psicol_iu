<template>
  <v-list style="padding-top: 1px">
    <template v-for="(item, i) in links" :key="i">
      <template v-if="item.group">
        <v-list-group :value="item.text">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :title="item.text" :prepend-icon="item.icon"> </v-list-item>
          </template>
          <v-list-item v-for="(subItem, map) in item.links" :key="map" :prepend-icon="subItem.icon" :title="subItem.text" :to="subItem.link" :exact="true"> </v-list-item>
        </v-list-group>
      </template>
      <template v-else>
        <v-list-item :to="item.link" :title="item.text" :prepend-icon="item.icon" :exact="true"> </v-list-item>
      </template>
    </template>
  </v-list>
</template>

<script setup lang="ts">
import { ref } from "vue"
const links = ref([
  {
    text: "Inicio",
    icon: "mdi-home",
    link: "/",
  },
  {
    text: "Usuarios",
    icon: "mdi-account-circle",
    group: true,
    links: [
      {
        text: "Becarios",
        link: "/becarios",
        icon: "mdi-account",
      },
      // {
      //   text: "Egresados",
      //   link: "/egresados",
      //   icon: "mdi-account-outline",
      // },
      // {
      //   text: "Empresas",
      //   link: "/empresas",
      //   icon: "mdi-city",
      // },
    ],
  },
  {
    text: "Configuración",
    icon: "mdi-wrench",
    link: "/configuraciones",
  },
])
</script>
