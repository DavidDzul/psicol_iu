<template>
  <v-card class="auto">
    <v-card-item>
      <v-card-title> Becarios </v-card-title>
      <v-card-subtitle> Seleccione los filtros de búsqueda: </v-card-subtitle>
    </v-card-item>
    <v-card-text style="padding: 5px">
      <v-row class="mx-auto">
        <v-col cols="3">
          <v-select v-model="campusData" density="compact" label="Sede" :items="campusArray" item-title="text" item-value="value" :rules="[(v) => !!v || 'Sede es requerida']"></v-select>
        </v-col>
        <v-col cols="3">
          <v-select
            v-model="generationData"
            density="compact"
            label="Generación"
            :items="campusGenerations"
            item-title="generation"
            item-value="id"
            :rules="[(v) => !!v || 'Generación es requerida']"
            :disabled="!campusValid"
          ></v-select>
        </v-col>
        <v-col class="align-center" cols="6">
          <v-btn color="grey" :disabled="!isFormValid" :loading="loading" class="mr-2" @click="consultData">Consultar</v-btn>
          <v-btn color="primary" :loading="loading" @click="$emit('create')">Nuevo becario</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <br />
  <v-data-table density="comfortable" :headers="headers" :items="students" class="elevation-1 overflow-auto" :loading="loading" :search="search" item-value="id">
    <template v-slot:top>
      <v-toolbar :flat="true">
        <p class="text-h6 font-weight-400 mx-4">
          {{ variables?.campus && students.length ? campusMap.get(variables?.campus)?.text : "" }} {{ variables?.generation ? getGeneration(variables.generation) : "" }}
        </p>
        <v-divider :inset="true" :vertical="true"></v-divider>
        <v-text-field class="mx-5" v-model="search" hide-details prepend-icon="mdi-magnify" density="compact" single-line label="Buscar (Nombre, Apellido, Matrícula)" :clearable="true"></v-text-field>
      </v-toolbar>
    </template>
    <template #[`item.actions`]="{ item }">
      <div style="width: 100%">
        <v-tooltip location="bottom" text="Ver detalles">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" color="primary" size="small" density="comfortable" icon="mdi-eye" class="mr-2" :to="`/usuarios/${item.id}`"> </v-btn>
          </template>
        </v-tooltip>
        <v-tooltip location="bottom" text="Editar">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" color="warning" size="small" density="comfortable" icon="mdi-pencil" class="mr-2" @click="$emit('edit', item.id)"> </v-btn>
          </template>
        </v-tooltip>
        <!-- <v-tooltip location="bottom" :text="item.active ? 'Desactivar Usuario' : 'Activar Usuario'">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              :color="item.active ? 'error' : 'success'"
              size="small"
              density="comfortable"
              :icon="item.active ? 'mdi-account-cancel' : 'mdi-account-check'"
              class="mr-2"
              @click="item.active ? $emit('deactivate', item.id) : $emit('activate', item.id)"
            >
            </v-btn>
          </template>
        </v-tooltip> -->
        <v-tooltip location="bottom" text="Eliminar Usuario">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" color="error" size="small" density="comfortable" icon="mdi-delete" class="mr-2" @click="$emit('remove', item.id)"> </v-btn>
          </template>
        </v-tooltip>
      </div>
    </template>
    <template #no-data> No existen usuarios registrados </template>
  </v-data-table>
</template>
<script setup lang="ts">
import { computed, onBeforeMount, PropType, ref, watch } from "vue"

import { CampusEnum, Generation, User } from "@/grapqhl"

import { CampusOption, CampusTypeMap } from "../../../constants"

const props = defineProps({
  students: { type: Array as PropType<User[]>, default: () => [] },
  loading: { type: Boolean, default: () => false },
  generations: { type: Array as PropType<Generation[]>, default: () => [] },
  campusArray: { type: Array as PropType<CampusOption[]>, default: () => [] },
  variables: { type: Object as PropType<{ campus: CampusEnum | undefined; generation: number | undefined }> },
})

const emit = defineEmits<{
  create: []
  consult: [campus: CampusEnum, generation: number]
  edit: [id: number]
  remove: [id: number]
  activate: [id: number]
  deactivate: [id: number]
  configureItem: [id: number]
}>()

const search = ref("")
const campusData = ref<CampusEnum | null>(null)
const generationData = ref<number | null>(null)

const campusMap = computed(() => CampusTypeMap)
const campusValid = computed(() => {
  return campusData.value
})
const isFormValid = computed(() => {
  return campusData.value && generationData.value
})
const campusGenerations = computed(() => {
  return props.generations.filter((map) => map.campus === campusData.value)
})

const headers = computed(
  () =>
    [
      {
        title: "ID",
        align: "start",
        key: "id",
      },
      {
        title: "Matrícula",
        align: "start",
        key: "enrollment",
      },
      {
        title: "Nombre",
        key: "firstName",
      },
      { title: "Apellidos", key: "lastName" },
      {
        title: "Opciones",
        key: "actions",
        sortable: false,
        align: "center",
      },
    ] as never,
)

watch(
  () => campusData.value,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      generationData.value = null
    }
  },
)

onBeforeMount(() => {
  campusData.value = props.variables?.campus || null
  setTimeout(() => {
    generationData.value = props.variables?.generation || null
  }, 100)
})

const consultData = () => {
  if (campusData.value && generationData.value) {
    emit("consult", campusData.value, generationData.value)
  }
}

const getGeneration = (value: number) => {
  const find = props.generations.find((map) => map.id === value)
  if (find) {
    return "- G" + find.generation
  }
  return null
}
</script>
