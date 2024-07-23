import { useLazyQuery, useMutation, useQuery } from "@vue/apollo-composable"
import { defineStore } from "pinia"
import { ref } from "vue"

import {
  Attendance,
  ATTENDANCE_USERS,
  CREATE_ATTENDANCE,
  GET_USERS_ATTENDANCE,
  Mutation,
  MutationCreateAttendanceArgs,
  MutationFindAttendanceUsersArgs,
  MutationUpdateAttendanceArgs,
  Query,
  UPDATE_ATTENDANCE,
  User,
} from "@/grapqhl"
import { useAlertStore } from "@/store/alertStore"

export const useAttendanceStore = defineStore("attendanceStore", () => {
  const attendanceMap = ref<Map<number, Attendance>>(new Map())
  const usersAttendanceMap = ref<Map<number, User>>(new Map())
  const { showAlert } = useAlertStore()

  const $reset = () => {
    useAttendanceStore().$reset()
  }

  const {
    loading: loadingUsersAttendance,
    load: loadUsersAttendance,
    refetch: refetchUsersAttendance,
    onError: onErrorUsersAttendance,
    onResult: onResultUsersAttendance,
  } = useLazyQuery<Query>(GET_USERS_ATTENDANCE, undefined, {
    fetchPolicy: "no-cache",
  })

  const {
    loading: loadingAttendanceUsers,
    mutate: mutateAttendanceUsers,
    onDone: onResultAttendanceUsers,
    onError: onErrorAttendanceUsers,
  } = useMutation<Mutation, MutationFindAttendanceUsersArgs>(ATTENDANCE_USERS, {
    fetchPolicy: "no-cache",
  })

  const {
    loading: loadingUpdateAttendance,
    mutate: mutateUpdateAttendance,
    onDone: onDoneUpdateAttendance,
    onError: onErrorUpdateAttendance,
  } = useMutation<Mutation, MutationUpdateAttendanceArgs>(UPDATE_ATTENDANCE, {
    fetchPolicy: "no-cache",
  })

  const {
    loading: loadingCreateAttendance,
    mutate: mutateCreateAttendance,
    onDone: onDoneCreateAttendance,
    onError: onErrorCreateAttendance,
  } = useMutation<Mutation, MutationCreateAttendanceArgs>(CREATE_ATTENDANCE, {
    fetchPolicy: "no-cache",
  })

  const fetchUsersAttendance = () => loadUsersAttendance() || refetchUsersAttendance()

  onResultAttendanceUsers((res) => {
    if (res?.data?.findAttendanceUsers) {
      attendanceMap.value = new Map(res.data.findAttendanceUsers.map((m) => [m.id, m]))
    }
  })

  onErrorAttendanceUsers((err) => {
    console.error(err)
  })

  onResultUsersAttendance((res) => {
    if (res?.data?.findAllUsers) {
      usersAttendanceMap.value = new Map(res.data.findAllUsers.map((m) => [m.id, m]))
    }
  })

  onErrorUsersAttendance((err) => {
    console.error(err)
  })

  onDoneCreateAttendance((res) => {
    if (res?.data?.createAttendance) {
      showAlert({
        title: "Asistencia agregada exitosamente.",
        status: "success",
      })
    }
  })

  onErrorCreateAttendance((err) => {
    console.error(err)
    showAlert({
      title: "Error al agregar la asistencia. Intente más tarde.",
      status: "error",
    })
  })

  onDoneUpdateAttendance((param) => {
    if (param?.data?.updateAttendance) {
      showAlert({
        title: "Asistencia actualizada exitosamente.",
        status: "success",
      })
      attendanceMap.value.set(param.data.updateAttendance.id, param.data.updateAttendance)
    }
  })

  onErrorUpdateAttendance((err) => {
    console.error(err)
    showAlert({
      title: "Error al actualizar la asistencia. Intente más tarde.",
      status: "error",
    })
  })

  return {
    attendanceMap,
    usersAttendanceMap,
    loadingAttendanceUsers,
    loadingCreateAttendance,
    loadingUpdateAttendance,
    mutateUpdateAttendance,
    mutateAttendanceUsers,
    fetchUsersAttendance,
    mutateCreateAttendance,
    $reset,
  }
})
