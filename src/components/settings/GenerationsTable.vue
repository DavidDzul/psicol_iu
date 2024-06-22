<template>
  <v-data-table density="comfortable" :headers="headers" :items="generations" class="elevation-1 overflow-auto" :loading="loading" :search="search" item-value="id">
    <template v-slot:top>
      <v-toolbar :flat="true">
        <!-- <v-toolbar-title>Lista de Generaciones</v-toolbar-title> -->
        <!-- <v-divider class="mx-4" :inset="true" :vertical="true"></v-divider> -->
        <v-text-field class="mx-4" v-model="search" hide-details prepend-icon="mdi-magnify" density="compact" single-line label="Buscar" :clearable="true"></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="primary" class="mb-2" @click="$emit('create')"> NUEVA GENERACIÓN </v-btn>
      </v-toolbar>
    </template>

    <template #[`item.inProgress`]="{ item }">
      <v-icon v-if="item.inProgress" color="success">mdi-check</v-icon>
      <v-icon v-else color="error">mdi-close</v-icon>
    </template>
    <template #[`item.campus`]="{ item }">
      {{ campusMap.get(item.campus)?.text }}
    </template>
    <template #[`item.actions`]="{ item }">
      <div style="width: 100%">
        <v-tooltip location="bottom" text="Editar">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" color="warning" size="small" density="comfortable" icon="mdi-pencil" class="mr-2" @click="$emit('edit', item.id)"> </v-btn>
          </template>
        </v-tooltip>
      </div>
    </template>
    <template #no-data> No existen generaciones registradas </template>
  </v-data-table>
</template>
<script setup lang="ts">
import { computed, PropType, ref } from "vue"

import { Generation } from "@/grapqhl"

import { CampusTypeMap } from "../../../constants"

defineProps({
  generations: { type: Array as PropType<Generation[]>, default: () => [] },
  loading: { type: Boolean, default: () => false },
})

defineEmits<{
  create: []
  edit: [id: number]
  remove: [id: number]
  configureItem: [id: number]
}>()

const search = ref("")

const campusMap = computed(() => CampusTypeMap)
const headers = computed(
  () =>
    [
      {
        title: "ID",
        align: "start",
        key: "id",
      },
      {
        title: "Generación",
        align: "start",
        key: "generation",
      },
      {
        title: "Activa",
        key: "inProgress",
      },
      {
        title: "Sede",
        key: "campus",
      },
      {
        title: "Opciones",
        key: "actions",
        sortable: false,
        align: "center",
      },
    ] as never,
)
</script>
