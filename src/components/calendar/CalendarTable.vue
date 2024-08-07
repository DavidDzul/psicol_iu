<template>
  <v-data-table density="comfortable" :headers="headers" :items="calendars" class="elevation-1 overflow-auto" :loading="loading" :search="search" item-value="id">
    <template v-slot:top>
      <v-toolbar :flat="true">
        <!-- <v-toolbar-title>Lista de Generaciones</v-toolbar-title> -->
        <!-- <v-divider class="mx-4" :inset="true" :vertical="true"></v-divider> -->
        <v-text-field class="mx-4" v-model="search" hide-details prepend-icon="mdi-magnify" density="compact" single-line label="Buscar" :clearable="true"></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="primary" class="mb-2" @click="$emit('create')"> NUEVA FECHA </v-btn>
      </v-toolbar>
    </template>

    <template #[`item.generationId`]="{ item }">
      {{ generationsEntities?.get(item.generationId)?.entryName }}
    </template>
    <template #[`item.date`]="{ item }">
      {{ format(item.date) }}
    </template>
    <template #[`item.actions`]="{ item }">
      <div style="width: 100%">
        <v-tooltip location="bottom" text="Editar">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" color="warning" size="small" density="comfortable" icon="mdi-pencil" class="mr-2" @click="$emit('edit', item.id)"> </v-btn>
          </template>
        </v-tooltip>
        <v-tooltip location="bottom" text="Eliminar">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" color="error" size="small" density="comfortable" icon="mdi-delete" class="mr-2" @click="$emit('remove', item.id)"> </v-btn>
          </template>
        </v-tooltip>
      </div>
    </template>
    <template #no-data> No existen generaciones registradas </template>
  </v-data-table>
</template>
<script setup lang="ts">
import dayjs from "dayjs"
import { computed, PropType, ref } from "vue"

import { Calendar, Generation } from "@/grapqhl"

import { CampusTypeMap } from "../../../constants"

defineProps({
  calendars: { type: Array as PropType<Calendar[]>, default: () => [] },
  loading: { type: Boolean, default: () => false },
  generationsEntities: { type: Object as PropType<Map<number, Generation>>, default: () => ({}) },
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
        title: "Evento",
        align: "start",
        key: "name",
      },
      {
        title: "Generación",
        key: "generationId",
      },
      {
        title: "Fecha",
        key: "date",
      },
      {
        title: "Opciones",
        key: "actions",
        sortable: false,
        align: "center",
      },
    ] as never,
)

const format = (date: Date) => {
  const formatDate = dayjs(date)
  return formatDate.format("DD/MM/YYYY")
}
</script>
