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
        <v-col cols="4">
          <v-select v-model="campusData" density="compact" label="Sede" :items="campusArray" item-title="text" item-value="value" :rules="[(v: any) => !!v || 'Sede es requerida']"></v-select>
        </v-col>
        <v-col cols="4">
          <!-- <v-select
            v-model="consult.year"
            density="compact"
            label="Ciclo escolar"
            :items="getYear"
            item-title="text"
            item-value="value"
            :rules="[(v: any) => !!v || 'Ciclo escolar es requerida']"
          ></v-select> -->
          <v-text-field v-model="getYear[0].text" label="Ciclo escolar actual" density="compact" readonly></v-text-field>
        </v-col>
        <v-col cols="4">
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
        <!-- <v-col cols="4">
          <v-select
            v-model="consult.year"
            density="compact"
            label="Año de refrendo"
            :items="getYear"
            item-title="text"
            item-value="value"
            :rules="[(v: any) => !!v || 'Año del refrendo es requerida']"
          ></v-select>
        </v-col> -->

        <v-col cols="4">
          <v-select
            v-model="selectedSemester"
            density="compact"
            label="Semestre"
            :items="semesters"
            item-title="text"
            item-value="value"
            :rules="[(v: any) => !!v || 'Semestre es requerido']"
          ></v-select>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="consult.month"
            density="compact"
            label="Mes de refrendo"
            :items="filteredMonths"
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

  <v-data-table
    density="comfortable"
    v-model:expanded="expanded"
    :headers="headers"
    class="elevation-1 overflow-auto"
    :loading="loading"
    :search="search"
    :items="arrayUsers"
    item-value="id"
    show-expand
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-divider :inset="true" :vertical="true"></v-divider>
        <v-text-field class="mx-5" v-model="search" hide-details prepend-icon="mdi-magnify" density="compact" single-line label="Buscar (Nombre, Apellido, Matrícula)" :clearable="true"></v-text-field>
      </v-toolbar>
    </template>
    <template #[`item.enrollment`]="{ item }">
      {{ item.enrollment }}
    </template>
    <!-- <template #[`item.totalAmount`]="{ item }"> <div style="width: 100%">$1000</div> </template> -->
    <template #[`item.actions`]="{ item }">
      <template v-if="item.validateDocument">
        <div style="width: 100%" v-if="!validateAutorization(item.autorizationMonth)">
          <v-tooltip location="bottom" text="Autorizar pago" v-if="item.active">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                variant="text"
                :color="item.absenceCount >= 2 ? 'grey' : 'green'"
                density="comfortable"
                icon="mdi-account-check"
                class="mr-2"
                @click="$emit('submit', item.id, consult.month || 0, getYear[0].value)"
              >
              </v-btn>
            </template>
          </v-tooltip>
          <v-tooltip location="bottom" text="Agregar penalización" v-if="item.active">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" variant="text" :color="item.absenceCount >= 2 ? 'yellow' : 'grey'" density="comfortable" icon="mdi-account-alert" class="mr-2" @click="$emit('create', item.id)">
              </v-btn>
            </template>
          </v-tooltip>
          <v-tooltip location="bottom" text="Usuario de baja" v-if="!item.active">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" variant="text" color="red" density="comfortable" icon="mdi-account-remove" class="mr-2"> </v-btn>
            </template>
          </v-tooltip>
        </div>
        <div style="width: 100%" v-else>
          <!-- <v-icon color="green"> mdi-checkbox-blank-circle</v-icon> -->
          <v-tooltip location="bottom" text="Editar autorización">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" variant="text" color="warning" density="comfortable" icon="mdi-account-edit" class="mr-2" @click="$emit('edit', item.id, consult.month || 0, getYear[0].value)">
              </v-btn>
            </template>
          </v-tooltip>
        </div>
      </template>
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
              <span class="font-weight-medium"> FALTAS DE {{ selectedSemester === 1 ? "JULIO" : "ENERO" }} A {{ consult.month ? MonthsMap.get(consult.month)?.text : "" }}:</span>
              {{ item.absenceCount }}
            </div>
          </div>
          <div class="one-content">
            <div class="expanded-column">
              <span class="font-weight-medium">CONSTANCIA DE ESTUDIOS:</span>
              <template v-if="item.validateDocument">
                <span style="color: green"> VIGENCIA HASTA EL {{ dayjs(item.documents[0].endDate).format("DD/MM/YYYY") }} </span>
              </template>
              <template v-else> <span style="color: red"> NO VIGENTE</span> </template>
            </div>
          </div>

          <p class="font-weight-medium px-4 py-2">HISTORIAL DE REFRENDO EN EL SEMESTRE {{ selectedSemester }}:</p>

          <div class="pb-5">
            <v-stepper alt-labels elevation="0" :model-value="item.autorizationMonth.length">
              <v-stepper-header>
                <template v-for="(autorization, index) of item.autorizationMonth" :key="index">
                  <v-stepper-item
                    :value="index + 1"
                    :icon="
                      autorization.status === StatusAutorizationEmun.Active
                        ? ' mdi-check'
                        : autorization.status === StatusAutorizationEmun.Suspended
                          ? 'mdi-account-alert'
                          : autorization.status === StatusAutorizationEmun.Detained
                            ? 'mdi-account-remove'
                            : ''
                    "
                    :color="
                      autorization.status === StatusAutorizationEmun.Active
                        ? 'green'
                        : autorization.status === StatusAutorizationEmun.Suspended
                          ? 'warning'
                          : autorization.status === StatusAutorizationEmun.Detained
                            ? 'danger'
                            : ''
                    "
                  >
                    <template v-slot:title>
                      <span class="font-weight-medium"> {{ getAutorizationMounth(autorization.date) }} </span>
                    </template>
                    <template v-slot:subtitle>
                      <span class="font-weight-medium py-1" style="font-size: 15px">{{ statusAutorizationMap.get(autorization.status)?.text }}</span>
                      <p class="font-weight-medium py-1" style="font-size: 15px">{{ autorization.percentage }}%</p>
                      <p class="font-weight-medium py-1" style="font-size: 15px" v-if="autorization.cause">
                        {{ autorization.cause === CauseEmun.Other ? autorization.otherCause : causeMap.get(autorization.cause)?.text }}
                      </p>
                    </template>
                  </v-stepper-item>
                  <v-divider v-if="index < item.autorizationMonth.length - 1"></v-divider>
                </template>
              </v-stepper-header>
            </v-stepper>
          </div>
        </td>
      </tr>
    </template>
    <template #no-data> No existen datos registrados </template>
  </v-data-table>
</template>
<script setup lang="ts">
import dayjs from "dayjs"
import { computed, onBeforeMount, PropType, ref, watch } from "vue"

import { Attendance, Autorization, Calendar, CampusEnum, CauseEmun, Constancy, Generation, StatusAutorizationEmun, User } from "@/grapqhl"

import { CampusOption, causeMap, MonthsMap, statusAutorizationMap } from "../../../constants"
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
  submit: [id: number, month: number, year: number]
  create: [id: number]
  consult: [campus: CampusEnum, generation: number, date: string]
  edit: [id: number, month: number, year: number]
  remove: [id: number]
  activate: [id: number]
  deactivate: [id: number]
  configureItem: [id: number]
}>()

const search = ref("")
const campusData = ref<CampusEnum | null>(null)
const generationData = ref<number | null>(null)
const selectedSemester = ref(null)

const consult = ref({
  month: null,
  year: new Date().getFullYear(),
})

const semesters = [
  { value: 1, text: "Semestre 1" },
  { value: 2, text: "Semestre 2" },
]

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

const months = computed(() => {
  const values = [
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
  return values
})

const getYear = computed(() => {
  const currentDate = dayjs()
  const cutoffDate = dayjs(`${currentDate.year()}-07-01`)
  const year = currentDate.isBefore(cutoffDate) ? currentDate.year() - 1 : currentDate.year()
  const valueYear = selectedSemester.value === 1 ? year : year + 1
  return [{ value: valueYear, text: `${year} - ${year + 1}` }]
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
        title: "Monto de beca",
        key: "totalAmount",
        align: "center",
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

watch(
  () => selectedSemester.value,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      consult.value.month = null
    }
  },
)

const filteredMonths = computed(() => {
  if (selectedSemester.value === 1) {
    return months.value.slice(6)
  } else if (selectedSemester.value === 2) {
    return months.value.slice(0, 6)
  }
  return []
})

const arrayUsers = computed(() => {
  return (
    props.users?.map((user) => {
      if (user.attendanceMap) {
        const autorization = filterAutorization(user.autorizationMonth || [])
        const absenceCount = semesterAbsences(user.attendanceMap)
        const validateDocument = validateLastConstancy(user.documents)
        return {
          ...user,
          absenceCount,
          validateDocument,
          autorizationMonth: autorization,
        }
      }
      return user
    }) || []
  )
})

onBeforeMount(() => {
  campusData.value = props.variables?.campus || null
  setTimeout(() => {
    generationData.value = props.variables?.generation || null
  }, 100)
})

const consultData = () => {
  if (consult.value.month) {
    const dateString = dayjs(`${consult.value.year}-${String(consult.value.month + 1).padStart(2, "0")}-01`).format("YYYY-MM-DD")
    if (campusData.value && generationData.value) {
      emit("consult", campusData.value, generationData.value, dateString)
    }
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

const semesterAbsences = (attendances: Attendance[]): number => {
  if (!consult.value.month) return 0
  const { month, year } = consult.value
  let semesterStart: dayjs.Dayjs
  let semesterEnd: dayjs.Dayjs

  if (month >= 1 && month <= 6) {
    semesterStart = dayjs(`${year + 1}-01-01`)
    semesterEnd = dayjs(`${year + 1}-${String(month).padStart(2, "0")}-01`).endOf("month")
  } else {
    semesterStart = dayjs(`${year}-07-01`)
    semesterEnd = dayjs(`${year}-${String(month).padStart(2, "0")}-01`).endOf("month")
  }

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
  return absences.length
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

const filterAutorization = (dates: Autorization[]) => {
  const { month, year } = consult.value

  let startDate: dayjs.Dayjs
  let endDate: dayjs.Dayjs

  if (selectedSemester.value === 2) {
    startDate = dayjs(`${year + 1}-01-01`)
    endDate = dayjs(`${year + 1}-06-30`)
  } else {
    startDate = dayjs(`${year}-07-01`)
    endDate = dayjs(`${year}-12-31`)
  }

  const filteredDates = dates.filter((item) => {
    const itemDate = dayjs(item.date)
    return (itemDate.isAfter(startDate) || itemDate.isSame(startDate, "day")) && (itemDate.isBefore(endDate) || itemDate.isSame(endDate, "day"))
  })

  return filteredDates
}

const validateAutorization = (value: Autorization[]): boolean => {
  const exists = value.some((item) => {
    const itemMonth = dayjs(item.date).month() + 1
    return itemMonth === consult.value.month
  })
  return exists
}

const getAutorizationMounth = (value: string) => {
  const format = dayjs(value)
  const result = format.month() + 1
  return MonthsMap.get(result)?.text
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
.custom-stepper {
  width: 100%;
  max-width: 100%;
}
</style>
