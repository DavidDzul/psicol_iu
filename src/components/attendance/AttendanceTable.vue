<template>
  <v-row class="mx-auto my-auto">
    <v-col cols="6">
      <h3>Listado de Asistencias</h3>
    </v-col>
    <v-col cols="6" style="text-align: right">
      <v-btn color="primary" :loading="loading" prepend-icon="mdi-plus" @click="$emit('create')">AGREGAR</v-btn>
    </v-col>
  </v-row>
  <div class="custom-card">
    <div class="custom-card__content">
      <v-row class="mx-auto">
        <v-col class="mb-0 pb-0" cols="12">
          <label style="color: gray">Seleccione los filtros de búsqueda:</label>
        </v-col>
        <v-col cols="3">
          <v-select v-model="campusData" density="compact" label="Sede" :items="campusArray" item-title="text" item-value="value" :rules="[(v: any) => !!v || 'Sede es requerida']"></v-select>
        </v-col>
        <v-col cols="3">
          <v-select
            v-model="generationData"
            density="compact"
            label="Generación"
            :items="campusGenerations"
            item-title="generation"
            item-value="id"
            :rules="[(v: any) => !!v || 'Generación es requerida']"
            :disabled="!campusValid"
          ></v-select>
        </v-col>
        <v-col cols="3">
          <VueDatePicker v-model="dateData" auto-apply :enable-time-picker="false" :disabled="!generationData"></VueDatePicker>
        </v-col>
        <v-col class="align-center" cols="3">
          <v-btn color="grey" :disabled="!isFormValid" :loading="loading" class="mr-2" prepend-icon="mdi-magnify" @click="consultData">BUSCAR</v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
  <br />

  <v-data-table density="comfortable" :headers="headers" :items="attendance" class="elevation-1 overflow-auto" :loading="loading" :search="search" item-value="id">
    <template v-slot:top>
      <v-toolbar :flat="true">
        <v-divider :inset="true" :vertical="true"></v-divider>
        <v-text-field class="mx-5" v-model="search" hide-details prepend-icon="mdi-magnify" density="compact" single-line label="Buscar (Nombre, Apellido, Matrícula)" :clearable="true"></v-text-field>
      </v-toolbar>
    </template>

    <template #[`item.userName`]="{ item }">
      {{ fullName(item?.userAttendance || undefined) }}
    </template>
    <!-- <template #[`item.checkIn`]="{ item }">
      <div v-if="item.checkIn">
        {{ converTimestamp(item.checkIn) }}
      </div>
    </template>
    <template #[`item.checkOut`]="{ item }">
      <div v-if="item.checkOut">
        {{ converTimestamp(item.checkOut) }}
      </div>
    </template> -->
    <template #[`item.reason`]="{ item }">
      <div v-if="item.reason === ReasonEmun.Other">
        {{ item.descripcion }}
      </div>
      <div v-else>
        {{ ReasonMap.get(item.reason)?.text }}
      </div>
    </template>
    <template #[`item.status`]="{ item }">
      <v-tooltip v-if="item.delay" location="bottom" text="Retardo">
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" color="orange"> mdi-timer </v-icon>
        </template>
      </v-tooltip>
      <v-tooltip v-else-if="item.justifiedDelay" location="bottom" text="Retardo justificado">
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" color="yellow"> mdi-timer </v-icon>
        </template>
      </v-tooltip>
      <v-tooltip v-else-if="item.justifiedAbsence" location="bottom" text="Falta justificada">
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" color="red"> mdi-timer </v-icon>
        </template>
      </v-tooltip>
    </template>
    <template #[`item.actions`]="{ item }">
      <div style="width: 100%">
        <v-tooltip location="bottom" text="Editar">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" color="warning" size="small" density="comfortable" icon="mdi-pencil" class="mr-2" @click="$emit('edit', item.id)"> </v-btn>
          </template>
        </v-tooltip>
        <!-- <v-tooltip location="bottom" text="Eliminar">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" color="error" size="small" density="comfortable" icon="mdi-delete" class="mr-2" @click="$emit('remove', item.id)"> </v-btn>
          </template>
        </v-tooltip> -->
      </div>
    </template>
    <template #no-data> No existen datos registrados </template>
  </v-data-table>
</template>
<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker"
import dayjs from "dayjs"
import { computed, onBeforeMount, PropType, ref, watch } from "vue"

import { Attendance, CampusEnum, Generation, ReasonEmun, User } from "@/grapqhl"

import { CampusOption, ReasonMap } from "../../../constants"
import "@vuepic/vue-datepicker/dist/main.css"

const props = defineProps({
  attendance: { type: Array as PropType<Attendance[]>, default: () => [] },
  loading: { type: Boolean, default: () => false },
  generations: { type: Array as PropType<Generation[]>, default: () => [] },
  campusArray: { type: Array as PropType<CampusOption[]>, default: () => [] },
  variables: { type: Object as PropType<{ campus: CampusEnum | undefined; generation: number | undefined; date: string }> },
})

const emit = defineEmits<{
  create: []
  consult: [campus: CampusEnum, generation: number, date: string]
  edit: [id: number]
  remove: [id: number]
  activate: [id: number]
  deactivate: [id: number]
  configureItem: [id: number]
}>()

const search = ref("")
const campusData = ref<CampusEnum | null>(null)
const generationData = ref<number | null>(null)
const dateData = ref<string>("")

const campusValid = computed(() => {
  return campusData.value
})
const isFormValid = computed(() => {
  return campusData.value && generationData.value && dateData.value
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
        key: "userAttendance.enrollment",
      },
      {
        title: "Nombre",
        key: "userName",
      },
      { title: "Entrada", key: "checkIn" },
      { title: "Salida", key: "checkOut" },
      { title: "Estatus", key: "status" },
      { title: "Motivo", key: "reason" },
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
    dateData.value = props.variables?.date || ""
  }, 100)
})

const consultData = () => {
  if (campusData.value && generationData.value) {
    emit("consult", campusData.value, generationData.value, dateData.value)
  }
}

const converTimestamp = (value: string) => {
  const timestamp = parseInt(value, 10)
  const date = dayjs(timestamp).add(1, "hour")
  const formattedDate = date.format("DD/MM/YYYY HH:mm:ss")
  return formattedDate
}

const fullName = (user: User | undefined) => {
  if (user) {
    return user.firstName + " " + user.lastName
  }
}
</script>

<style scoped>
.custom-card {
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px;
  transition: box-shadow 0.3s ease;

  /* Estilos adicionales según necesidad */
}
</style>
