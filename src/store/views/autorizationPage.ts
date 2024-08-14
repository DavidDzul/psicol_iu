import dayjs from "dayjs"
import { defineStore, storeToRefs } from "pinia"
import { computed, ref } from "vue"

import { Autorization, CampusEnum, CreateAutorizationInput, StatusAutorizationEmun } from "@/grapqhl"
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
  const updateDialog = ref(false)
  const selectedUser = ref(0)
  const editAutorization = ref<Autorization | undefined>()
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

  const openUpdate = async (userId: number, month: number, year: number) => {
    updateDialog.value = true
    const user = autorizationMap.value.get(userId)
    console.log(1)
    if (user) {
      console.log(2)
      if (!user.autorizationMonth) return
      console.log(3)
      const autorization = user.autorizationMonth.find((item) => {
        const itemDate = dayjs(item.date)
        return itemDate.month() + 1 === month && itemDate.year() === year
      })
      console.log(4)
      if (autorization) {
        console.log(5)
        editAutorization.value = autorization
      } else {
        console.log(6)
        editAutorization.value = undefined
      }
    }
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
        const input = { ...createAutorizationInput, userId: findUser.id } as CreateAutorizationInput
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

  const fullAutorization = async (id: number, month: number, year: number) => {
    const findUser = autorizationMap.value.get(id)
    try {
      if (findUser) {
        const formatDate = `${year}/${month}/16`
        const input = { userId: findUser.id, status: StatusAutorizationEmun.Active, percentage: 100, date: formatDate } as CreateAutorizationInput
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
    updateDialog,
    editAutorization,
    onConsult,
    openUpdate,
    openCreate,
    fullAutorization,
    onCreateAutorization,
  }
})
