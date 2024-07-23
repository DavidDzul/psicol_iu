<template>
  <v-data-table density="comfortable" :headers="headers" :items="documents" class="elevation-1 overflow-auto" :loading="loading" :search="search" item-value="id">
    <template v-slot:top>
      <v-toolbar :flat="true">
        <v-text-field class="mx-4" v-model="search" hide-details prepend-icon="mdi-magnify" density="compact" single-line label="Buscar" :clearable="true"></v-text-field>
        <v-spacer></v-spacer>
      </v-toolbar>
    </template>

    <template #[`item.actions`]="{ item }">
      <div style="width: 100%">
        <v-tooltip location="bottom" text="Visualizar">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" color="warning" size="small" density="comfortable" icon="mdi-eye" class="mr-2" @click="viewDocument(item)"> </v-btn>
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
import { computed, PropType, ref } from "vue"

import { Constancy } from "@/grapqhl"

import { CampusTypeMap, FILE_URL } from "../../../constants"

defineProps({
  documents: { type: Array as PropType<Constancy[]>, default: () => [] },
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
        title: "Actualización",
        align: "start",
        key: "name",
      },
      {
        title: "Fecha de inicio",
        key: "startDate",
      },
      {
        title: "Fecha de término",
        key: "endDate",
      },
      {
        title: "Opciones",
        key: "actions",
        sortable: false,
        align: "center",
      },
    ] as never,
)

const viewDocument = (item: Constancy) => {
  const urlFile = `${FILE_URL}user/api/files/users/${item.userId}/records?s3=${encodeURIComponent(item.fileId)}`
  window.open(urlFile, "blank")
}
</script>
