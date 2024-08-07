<template>
  <v-row class="mx-auto my-auto">
    <v-col cols="6">
      <h3>Listado de Refrendos del Ciclo Escolar {{ arrayCycle[0].text }}</h3>
    </v-col>
  </v-row>
  <div class="custom-card">
    <div class="custom-card__content">
      <v-row class="mx-auto">
        <v-col class="mb-0 pb-0" cols="12">
          <label style="color: gray">Seleccione los filtros de búsqueda:</label>
        </v-col>
        <v-col cols="6">
          <v-select v-model="campusData" density="compact" label="Sede" :items="campusArray" item-title="text" item-value="value" :rules="[(v: any) => !!v || 'Sede es requerida']"></v-select>
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="generationData"
            density="compact"
            label="Generación"
            :items="campusGenerations"
            item-title="entryName"
            item-value="id"
            :rules="[(v: any) => !!v || 'Generación es requerida']"
            :disabled="!campusValid"
          ></v-select>
        </v-col>

        <v-col cols="4">
          <v-select
            v-model="consult.year"
            density="compact"
            label="Año de refrendo"
            :items="getYear"
            item-title="text"
            item-value="value"
            :rules="[(v: any) => !!v || 'Año del refrendo es requerida']"
          ></v-select>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="consult.month"
            density="compact"
            label="Mes de refrendo"
            :items="months"
            item-title="text"
            item-value="value"
            :rules="[(v: any) => !!v || 'Mes de refrendo es requerido']"
          ></v-select>
        </v-col>
        <!-- <v-col cols="3">
          <VueDatePicker v-model="month" auto-apply :enable-time-picker="false" :disabled="!generationData" month-picker></VueDatePicker>
        </v-col> -->
        <v-col cols="4" style="text-align: center">
          <v-btn color="grey" :disabled="!isFormValid" :loading="loading" class="mr-2" prepend-icon="mdi-magnify" @click="consultData">CONSULTAR</v-btn>
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
    <template #[`item.enrollment`]="{ item }">
      {{ item.enrollment }}
    </template>
    <template #[`item.actions`]="{ item }">
      <div style="width: 100%" v-if="item.active && !item.autorizationMonth">
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
              @click="$emit('create', item.id)"
            >
            </v-btn>
          </template>
        </v-tooltip>
      </div>
      <div style="width: 100%" v-else-if="!item.active">
        <!-- <v-icon color="red"> mdi-checkbox-blank-circle</v-icon> -->
        <v-tooltip location="bottom" text="Usuario de baja">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" color="red" density="comfortable" icon="mdi-account-remove" class="mr-2"> </v-btn>
          </template>
        </v-tooltip>
      </div>
      <div style="width: 100%" v-else-if="item.autorizationMonth">
        <!-- <v-icon color="green"> mdi-checkbox-blank-circle</v-icon> -->
        <v-tooltip location="bottom" text="Visualizar autorización">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" color="warning" density="comfortable" icon="mdi-eye" class="mr-2"> </v-btn>
          </template>
        </v-tooltip>
      </div>
    </template>
    <template v-slot:expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length" style="padding: 0px">
          <div class="expanded-content">
            <div class="expanded-column">
              <span class="font-weight-medium">ASISTENCIAS DEL MES:</span>
              {{ assists(item.attendanceMap || []) }}
            </div>
            <div class="expanded-column">
              <span class="font-weight-medium">FALTAS DEL MES:</span>
              {{ countAbsences(item.attendanceMap || []) }}
            </div>
            <div class="expanded-column">
              <span class="font-weight-medium">RETARDOS DEL MES:</span>
              {{ countLate(item.attendanceMap || []) }}
            </div>
            <div class="expanded-column">
              <span class="font-weight-medium">FALTAS JUSTIFICADAS DEL MES:</span>
              {{ countJustifiedAbsence(item.attendanceMap || []) }}
            </div>
            <div class="expanded-column">
              <span class="font-weight-medium">RETARDOS JUSTIFICADOS DEL MES:</span>
              {{ countJustifiedDelay(item.attendanceMap || []) }}
            </div>
            <div class="expanded-column">
              <!-- <span class="font-weight-medium">FALTAS EN {{ currentSemester }} :</span> -->
              <!-- {{ semesterAbsences(item.attendanceMap || []) }} -->
              <span v-html="semesterAbsences(item.attendanceMap || [])"></span>
            </div>
          </div>
          <div class="one-content">
            <div class="expanded-column">
              <span class="font-weight-medium">CONSTANCIA DE ESTUDIOS:</span>
              <template v-if="validateLastConstancy(item.documents || [])">
                <span style="color: green"> VIGENCIA HASTA EL {{ dayjs(item.documents[0].endDate).format("DD/MM/YYYY") }} </span>
              </template>
              <template v-else> <span style="color: red"> NO VIGENTE</span> </template>
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

import { Attendance, Calendar, CampusEnum, Constancy, Generation, User } from "@/grapqhl"

import { CampusOption } from "../../../constants"
import "@vuepic/vue-datepicker/dist/main.css"

const props = defineProps({
  users: { type: Array as PropType<User[]>, default: () => [] },
  loading: { type: Boolean, default: () => false },
  generations: { type: Array as PropType<Generation[]>, default: () => [] },
  campusArray: { type: Array as PropType<CampusOption[]>, default: () => [] },
  variables: { type: Object as PropType<{ campus: CampusEnum | undefined; generation: number | undefined; date: string }> },
  calendars: { type: Array as PropType<Calendar[]>, default: () => [] },
})

const emit = defineEmits<{
  create: [id: number]
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
const consult = ref({
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
})

const expanded = ref([])
const campusValid = computed(() => {
  return campusData.value
})

const isFormValid = computed(() => {
  return campusData.value && generationData.value && consult.value
})

const campusGenerations = computed(() => {
  return props.generations.filter((map) => map.campus === campusData.value)
})

const arrayCycle = computed(() => {
  const currentDate = dayjs()
  const startYear = currentDate.month() >= 7 ? currentDate.year() : currentDate.year() - 1
  const endYear = startYear + 1
  return [{ value: 1, text: `${startYear} - ${endYear}` }]
})

const months = computed(() => {
  return [
    { value: 1, text: "Enero" },
    { value: 2, text: "Febrero" },
    { value: 3, text: "Marzo" },
    { value: 4, text: "Abril" },
    { value: 5, text: "Mayo" },
    { value: 6, text: "Junio" },
    { value: 7, text: "Julio" },
    { value: 8, text: "Agosto" },
    { value: 9, text: "Septiembre" },
    { value: 10, text: "Octubre" },
    { value: 11, text: "Noviembre" },
    { value: 12, text: "Diciembre" },
  ]
})

const getYear = computed(() => {
  const currentDate = dayjs()
  return [
    { value: currentDate.year() - 1, text: currentDate.year() - 1 },
    { value: currentDate.year(), text: currentDate.year() },
    { value: currentDate.year() + 1, text: currentDate.year() + 1 },
  ]
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
  const dateString = dayjs(`${consult.value.year}-${String(consult.value.month + 1).padStart(2, "0")}-01`).format("YYYY-MM-DD")
  if (campusData.value && generationData.value) {
    emit("consult", campusData.value, generationData.value, dateString)
  }
}

const assists = (attendances: Attendance[]): number => {
  const { month, year } = consult.value
  const calendarDates = new Set(
    props.calendars
      .filter((event) => {
        const eventDate = dayjs(event.date)
        return eventDate.month() + 1 === month && eventDate.year() === year
      })
      .map((event) => event.date),
  )
  const matches = attendances.filter((att) => {
    const attDate = dayjs(att.recordDate)
    return calendarDates.has(att.recordDate) && attDate.month() + 1 === month && attDate.year() === year
  })
  return matches.length
}

const countAbsences = (attendances: Attendance[]): number => {
  const { month, year } = consult.value
  const calendarDates = new Set(
    props.calendars
      .filter((event) => {
        const eventDate = dayjs(event.date)
        return eventDate.month() + 1 === month && eventDate.year() === year
      })
      .map((event) => event.date),
  )
  const attendedDates = new Set(
    attendances
      .filter((att) => {
        const attDate = dayjs(att.recordDate)
        return attDate.month() + 1 === month && attDate.year() === year
      })
      .map((att) => att.recordDate),
  )
  const absences = Array.from(calendarDates).filter((date) => !attendedDates.has(date))
  return absences.length
}

const countLate = (attendances: Attendance[]): number => {
  const { month, year } = consult.value
  const calendarDates = new Set(
    props.calendars
      .filter((event) => {
        const eventDate = dayjs(event.date)
        return eventDate.month() + 1 === month && eventDate.year() === year
      })
      .map((event) => event.date),
  )
  const lateDates = attendances
    .filter((att) => {
      const attDate = dayjs(att.recordDate)
      return attDate.month() + 1 === month && attDate.year() === year && att.delay
    })
    .map((att) => att.recordDate)
  const count = Array.from(calendarDates).filter((date) => lateDates.includes(date))
  return count.length
}

const countJustifiedDelay = (attendances: Attendance[]): number => {
  const { month, year } = consult.value
  const calendarDates = new Set(
    props.calendars
      .filter((event) => {
        const eventDate = dayjs(event.date)
        return eventDate.month() + 1 === month && eventDate.year() === year
      })
      .map((event) => event.date),
  )
  const justifiedDelayDates = attendances
    .filter((att) => {
      const attDate = dayjs(att.recordDate)
      return attDate.month() + 1 === month && attDate.year() === year && att.justifiedDelay
    })
    .map((att) => att.recordDate)
  const count = Array.from(calendarDates).filter((date) => justifiedDelayDates.includes(date))
  return count.length
}

const countJustifiedAbsence = (attendances: Attendance[]): number => {
  const { month, year } = consult.value
  const calendarDates = new Set(
    props.calendars
      .filter((event) => {
        const eventDate = dayjs(event.date)
        return eventDate.month() + 1 === month && eventDate.year() === year
      })
      .map((event) => event.date),
  )
  const justifiedAbsenceDates = attendances
    .filter((att) => {
      const attDate = dayjs(att.recordDate)
      return attDate.month() + 1 === month && attDate.year() === year && att.justifiedAbsence
    })
    .map((att) => att.recordDate)

  const count = Array.from(calendarDates).filter((date) => justifiedAbsenceDates.includes(date))
  return count.length
}

const semesterAbsences = (attendances: Attendance[]): string => {
  const { month, year } = consult.value
  let semesterStart: dayjs.Dayjs
  let semesterEnd: dayjs.Dayjs
  let startMonthText: string
  let endMonthText: string

  if (month >= 1 && month <= 6) {
    // Primer semestre: Enero - Mes seleccionado
    semesterStart = dayjs(`${year}-01-01`)
    semesterEnd = dayjs(`${year}-${String(month).padStart(2, "0")}-01`).endOf("month")
    startMonthText = "ENERO"
  } else {
    // Segundo semestre: Julio - Mes seleccionado
    semesterStart = dayjs(`${year}-07-01`)
    semesterEnd = dayjs(`${year}-${String(month).padStart(2, "0")}-01`).endOf("month")
    startMonthText = "JULIO"
  }

  // Mapping month number to month name
  const monthNames = ["", "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"]
  endMonthText = monthNames[month]

  const calendarDates = new Set(
    props.calendars
      .filter((event) => {
        const eventDate = dayjs(event.date)
        return (eventDate.isAfter(semesterStart) && eventDate.isBefore(semesterEnd)) || eventDate.isSame(semesterStart) || eventDate.isSame(semesterEnd)
      })
      .map((event) => event.date),
  )

  const attendedDates = new Set(
    attendances
      .filter((att) => {
        const attDate = dayjs(att.recordDate)
        return (attDate.isAfter(semesterStart) && attDate.isBefore(semesterEnd)) || attDate.isSame(semesterStart) || attDate.isSame(semesterEnd)
      })
      .map((att) => att.recordDate),
  )

  const absences = Array.from(calendarDates).filter((date) => !attendedDates.has(date))

  return `<span class="font-weight-medium"> FALTAS DE ${startMonthText} - ${endMonthText} ${year}:</span> ${absences.length}`
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
  grid-template-columns: repeat(3, 1fr); /* Tres columnas iguales */
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
