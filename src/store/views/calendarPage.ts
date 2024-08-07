import { defineStore, storeToRefs } from "pinia"
import { computed, ref } from "vue"

import { Calendar, CampusEnum, CreateAutorizationInput, CreateCalendarInput, UpdateCalendarInput } from "@/grapqhl"
import { useAuthStore } from "@/store/api/authStore"
import { useAutorizationStore } from "@/store/api/autorizationStore"
import { useCalendarStore } from "@/store/api/calendarStore"

export const useCalendarPageStore = defineStore("calendarPage", () => {
  const { userProfile } = storeToRefs(useAuthStore())
  const { loadingCalendar, calendarMap } = storeToRefs(useCalendarStore())
  const { mutateCreateCalendar, mutateUpdateCalendar, mutateRemoveCalendar } = useCalendarStore()

  const loadCalendar = computed(() => loadingCalendar.value)
  const calendars = computed(() => [...calendarMap.value.values()])

  const createCalendarDialog = ref(false)
  const updateCalendarDialog = ref(false)
  const editCalendar = ref<Calendar | undefined>()

  const openCreateCalendar = async () => {
    createCalendarDialog.value = true
  }

  const openEditCalendar = (id: number) => {
    const calendar = calendarMap.value.get(id)
    if (!calendar) return
    editCalendar.value = { ...calendar }
    updateCalendarDialog.value = true
  }

  const onCreateCalendar = async (createCalendarInput: CreateCalendarInput) => {
    try {
      const res = await mutateCreateCalendar({ createCalendarInput })
      if (res) {
        createCalendarDialog.value = false
      }
    } catch (e) {
      console.error(e)
    }
  }

  const onUpdateCalendar = async (id: number, input: UpdateCalendarInput) => {
    try {
      const res = await mutateUpdateCalendar({ updateCalendarInput: { ...input, id } })
      if (res) {
        updateCalendarDialog.value = false
        editCalendar.value = undefined
      }
    } catch (e) {
      console.error(e)
    }
  }

  const onRemoveCalendar = async (id: number) => {
    try {
      const res = await mutateRemoveCalendar({
        id,
      })
      if (res?.data?.removeCalendar) {
        calendarMap.value.delete(id)
      }
    } catch (e) {
      console.error(e)
    }
  }

  return {
    calendars,
    userProfile,
    editCalendar,
    loadCalendar,
    updateCalendarDialog,
    createCalendarDialog,
    onRemoveCalendar,
    openEditCalendar,
    onUpdateCalendar,
    onCreateCalendar,
    openCreateCalendar,
  }
})
