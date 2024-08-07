import dayjs from "dayjs"
import { defineStore, storeToRefs } from "pinia"
import { computed, ref } from "vue"

import { CampusEnum, CreateAutorizationInput } from "@/grapqhl"
import { useAuthStore } from "@/store/api/authStore"
import { useAutorizationStore } from "@/store/api/autorizationStore"
import { useCalendarStore } from "@/store/api/calendarStore"
import { useSettingsStore } from "@/store/api/settingsStore"

export const useAutorizationPageStore = defineStore("autorizationPage", () => {
  const { adminCampus } = storeToRefs(useAuthStore())
  const { loadingGenerations, generationsMap } = storeToRefs(useSettingsStore())
  const { loadingCalendar, calendarMap } = storeToRefs(useCalendarStore())

  const { autorizationMap, loadingCreateAutorization } = storeToRefs(useAutorizationStore())
  const { mutateAutorizationMap, mutateCreateAutorization } = useAutorizationStore()
  const variables = ref<{ campus: CampusEnum | undefined; generation: number | undefined; date: string }>({
    campus: adminCampus.value ? adminCampus.value[0]?.value : undefined,
    generation: undefined,
    date: "",
  })

  const loading = computed(() => loadingGenerations.value)
  const loadCalendar = computed(() => loadingCalendar.value)

  const calendars = computed(() => [...calendarMap.value.values()])
  const autorization = computed(() => [...autorizationMap.value.values()])
  const generations = computed(() => [...generationsMap.value.values()])
  const createDialog = ref(false)
  const selectedUser = ref(0)

  // const calendarRange = computed(() => {
  //   const referenceDate = dayjs(variables.value.date)
  //   const filteredEvents = calendars.value.filter((event) => {
  //     const eventDate = dayjs(event.date)
  //     return eventDate.year() === referenceDate.year() && eventDate.month() === referenceDate.month()
  //   })
  //   return filteredEvents
  // })

  const links = computed(() => [
    {
      title: "Inicio",
      disabled: false,
      href: "/",
    },
    {
      title: "Refrendo",
      disabled: true,
      href: "/refrendo",
    },
  ])

  const openCreate = async (id: number) => {
    createDialog.value = true
    selectedUser.value = id
  }

  const onConsult = async (campus: CampusEnum, generation: number, date: string) => {
    variables.value = { campus, generation, date }
    try {
      await mutateAutorizationMap({ campus, generation, date })
    } catch (e) {
      console.error(e)
    }
  }

  const onCreateAutorization = async (createAutorizationInput: CreateAutorizationInput) => {
    const findUser = autorizationMap.value.get(selectedUser.value)
    try {
      if (findUser) {
        const input = { ...createAutorizationInput, userId: findUser.id }
        const res = await mutateCreateAutorization({ createAutorizationInput: input })
        if (res?.data?.createAutorization) {
          createDialog.value = false
          selectedUser.value = 0
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  return {
    links,
    loading,
    calendars,
    variables,
    generations,
    adminCampus,
    loadCalendar,
    autorization,
    createDialog,
    onConsult,
    openCreate,
    onCreateAutorization,
  }
})
