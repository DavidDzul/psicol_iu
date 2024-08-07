import { useLazyQuery, useMutation, useQuery } from "@vue/apollo-composable"
import { defineStore } from "pinia"
import { ref } from "vue"
import { useRouter } from "vue-router"

import {
  Calendar,
  CREATE_CALENDAR,
  CREATE_GENERATION,
  DELETE_CALENDAR,
  GET_CALENDAR,
  Mutation,
  MutationCreateCalendarArgs,
  MutationCreateGenerationArgs,
  MutationRemoveCalendarArgs,
  MutationUpdateCalendarArgs,
  MutationUpdateGenerationArgs,
  Query,
  UPDATE_CALENDAR,
  UPDATE_GENERATION,
} from "@/grapqhl"
import { useAlertStore } from "@/store/alertStore"

export const useCalendarStore = defineStore("calendarStore", () => {
  const calendarMap = ref<Map<number, Calendar>>(new Map())
  const { showAlert } = useAlertStore()

  const $reset = () => {
    calendarMap.value = new Map()
  }

  const {
    loading: loadingCalendar,
    refetch: refetchCalendar,
    onError: onErrorCalendar,
    onResult: onResultCalendar,
  } = useQuery<Query>(GET_CALENDAR, undefined, {
    fetchPolicy: "no-cache",
  })

  const {
    loading: loadingCreateCalendar,
    mutate: mutateCreateCalendar,
    onDone: onDoneCreateCalendar,
    onError: onErrorCreateCalendar,
  } = useMutation<Mutation, MutationCreateCalendarArgs>(CREATE_CALENDAR, {
    fetchPolicy: "no-cache",
  })

  const {
    loading: loadingUpdateCalendar,
    mutate: mutateUpdateCalendar,
    onDone: onDoneUpdateCalendar,
    onError: onErrorUpdateCalendar,
  } = useMutation<Mutation, MutationUpdateCalendarArgs>(UPDATE_CALENDAR, {
    fetchPolicy: "no-cache",
  })

  const {
    loading: loadingRemoveCalendar,
    mutate: mutateRemoveCalendar,
    onDone: onDoneRemoveCalendar,
    onError: onErrorRemoveCalendar,
  } = useMutation<Mutation, MutationRemoveCalendarArgs>(DELETE_CALENDAR, {
    fetchPolicy: "no-cache",
  })

  onResultCalendar((res) => {
    if (res?.data?.findAllCalendar) {
      calendarMap.value = new Map(res.data.findAllCalendar.map((m) => [m.id, m]))
    }
  })

  onErrorCalendar((err) => {
    console.error(err)
  })

  onDoneCreateCalendar((param) => {
    if (param?.data?.createCalendar) {
      showAlert({
        title: "Fecha creada exitosamente.",
        status: "success",
      })
      calendarMap.value.set(param.data.createCalendar.id, param.data.createCalendar)
    }
  })

  onErrorCreateCalendar((error) => {
    showAlert({
      title: "Error al crear la fecha. Intente más tarde.",
      status: "error",
    })
  })

  onDoneUpdateCalendar((param) => {
    if (param?.data?.updateCalendar) {
      showAlert({
        title: "Calendario actualizado exitosamente.",
        status: "success",
      })
      calendarMap.value.set(param.data.updateCalendar.id, param.data.updateCalendar)
    }
  })

  onErrorUpdateCalendar((error) => {
    showAlert({
      title: "Error al actualizar la fecha. Intente más tarde.",
      status: "error",
    })
  })

  onDoneRemoveCalendar((param) => {
    if (param?.data?.removeCalendar) {
      showAlert({
        title: "Fecha eliminada exitosamente.",
        status: "success",
      })
    }
  })

  onErrorRemoveCalendar((error) => {
    showAlert({
      title: "Error al eliminar la fecha. Intente más tarde.",
      status: "error",
    })
  })

  return {
    loadingCalendar,
    calendarMap,
    loadingRemoveCalendar,
    loadingUpdateCalendar,
    loadingCreateCalendar,
    refetchCalendar,
    mutateRemoveCalendar,
    mutateUpdateCalendar,
    mutateCreateCalendar,
    $reset,
  }
})
