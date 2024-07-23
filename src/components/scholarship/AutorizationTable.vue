<template>
  <v-row class="mx-auto my-auto">
    <v-col cols="6">
      <h3>Listado de Refrendos</h3>
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
          <VueDatePicker v-model="month" auto-apply :enable-time-picker="false" :disabled="!generationData" month-picker></VueDatePicker>
        </v-col>
        <v-col class="align-center" cols="3">
          <v-btn color="grey" :disabled="!isFormValid" :loading="loading" class="mr-2" prepend-icon="mdi-magnify" @click="consultData">BUSCAR</v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
  <br />

  <v-data-table density="comfortable" v-model:expanded="expanded" :headers="headers" class="elevation-1 overflow-auto" :loading="loading" :search="search" :items="users" item-value="id" show-expand>
    <template v-slot:top>
      <v-toolbar flat>
        <v-divider :inset="true" :vertical="true"></v-divider>
        <v-text-field class="mx-5" v-model="search" hide-details prepend-icon="mdi-magnify" density="compact" single-line label="Buscar (Nombre, Apellido, Matrícula)" :clearable="true"></v-text-field>
      </v-toolbar>
    </template>
    <template #[`item.actions`]="{ item }">
      <div style="width: 100%">
        <v-tooltip location="bottom" text="Autorizar">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              color="success"
              density="comfortable"
              icon="mdi-account-check"
              class="mr-2"
              :disabled="validateLastConstancy(item.documents || []) ? false : true"
              @click="$emit('edit', item.id)"
            >
            </v-btn>
          </template>
        </v-tooltip>
      </div>
    </template>
    <template v-slot:expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length" style="padding: 0px">
          <div class="expanded-content">
            <div class="expanded-column">
              <span class="font-weight-medium">Asistencia:</span>
              {{ countAttendance(item.attendanceMap || []) }}
            </div>
            <div class="expanded-column">
              <span class="font-weight-medium">Retardos:</span>
              {{ countLate(item.attendanceMap || []) }}
            </div>
            <div class="expanded-column">
              <span class="font-weight-medium">Faltas justificadas:</span>
              {{ countJustifiedAbsence(item.attendanceMap || []) }}
            </div>
            <div class="expanded-column">
              <span class="font-weight-medium">Retardos justificados:</span>
              {{ countJustifiedDelay(item.attendanceMap || []) }}
            </div>
          </div>
          <div class="one-content">
            <div class="expanded-column">
              <span class="font-weight-medium">Constancia de estudios:</span>
              <template v-if="validateLastConstancy(item.documents || [])"> <span style="color: green"> Válido</span> <v-icon color="success">mdi-check</v-icon> </template>
              <template v-else> <span style="color: red"> Inválido</span> <v-icon color="error">mdi-close</v-icon> </template>
            </div>
          </div>
        </td>
      </tr>
    </template>
    <template #no-data> No existen datos registrados </template>
  </v-data-table>
</template>
<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker"
import dayjs from "dayjs"
import { computed, onBeforeMount, PropType, ref, watch } from "vue"

import { Attendance, CampusEnum, Constancy, Generation, User } from "@/grapqhl"

import { CampusOption } from "../../../constants"
import "@vuepic/vue-datepicker/dist/main.css"

const props = defineProps({
  users: { type: Array as PropType<User[]>, default: () => [] },
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
const month = ref({
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
})
const expanded = ref([])
const campusValid = computed(() => {
  return campusData.value
})
const isFormValid = computed(() => {
  return campusData.value && generationData.value && month.value
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
      {
        title: "Apellido",
        key: "lastName",
      },
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
  const dateString = dayjs(`${month.value.year}-${String(month.value.month + 1).padStart(2, "0")}-01`).format("YYYY-MM-DD")
  if (campusData.value && generationData.value) {
    emit("consult", campusData.value, generationData.value, dateString)
  }
}

const countAttendance = (value: Attendance[] | undefined) => {
  if (value) {
    return value.length
  }
  return 0
}

const countLate = (value: Attendance[] | undefined) => {
  if (value) {
    const delay = value.filter((map) => map.delay)
    return delay.length
  }
  return 0
}

const countJustifiedDelay = (value: Attendance[] | undefined) => {
  if (value) {
    const justifiedDelay = value.filter((map) => map.justifiedDelay)
    return justifiedDelay.length
  }
}

const countJustifiedAbsence = (value: Attendance[] | undefined) => {
  if (value) {
    const justifiedAbsence = value.filter((map) => map.justifiedAbsence)
    return justifiedAbsence.length
  }
}

const validateLastConstancy = (value: Constancy[] | undefined) => {
  if (value?.length) {
    const doc = value[0]
    const docEnd = dayjs(doc.endDate)
    const now = dayjs()
    if (now.isBefore(docEnd)) {
      return true
    } else {
      return false
    }
  }
  return false
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
}

.expanded-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* gap: 16px; */
}
.one-content {
  display: grid;
  grid-template-columns: 1fr;
  /* gap: 16px; */
}
.expanded-column {
  padding: 8px 8px 8px 15px;
  border: 1px solid #e0e0e0;
  /* border-radius: 4px; */
}
</style>
