import { defineStore, storeToRefs } from "pinia"
import { computed, ref } from "vue"

import { Attendance, CampusEnum, CreateAttendanceInput, UpdateAttendanceInput } from "@/grapqhl"
import { useAttendanceStore } from "@/store/api/attendanceStore"
import { useAuthStore } from "@/store/api/authStore"
import { useSettingsStore } from "@/store/api/settingsStore"

export const useAttendancePageStore = defineStore("attendancePage", () => {
  const { mutateAttendanceUsers, fetchUsersAttendance, mutateCreateAttendance, mutateUpdateAttendance } = useAttendanceStore()
  const { attendanceMap, usersAttendanceMap } = storeToRefs(useAttendanceStore())
  const { adminCampus, userProfile } = storeToRefs(useAuthStore())
  const { loadingGenerations, generationsMap } = storeToRefs(useSettingsStore())

  const attendance = computed(() => [...attendanceMap.value.values()])
  const loading = computed(() => loadingGenerations.value)
  const generations = computed(() => [...generationsMap.value.values()].filter((map) => map.inProgress === true))
  const usersAttendance = computed(() => [...usersAttendanceMap.value.values()])

  const variables = ref<{ campus: CampusEnum | undefined; generation: number | undefined; date: string }>({
    campus: adminCampus.value ? adminCampus.value[0]?.value : undefined,
    generation: undefined,
    date: "",
  })

  const myCampus = computed(() => userProfile.value?.campus)
  const createDialog = ref(false)
  const updateDialog = ref(false)
  const edit = ref<Attendance | undefined>()

  const links = computed(() => [
    {
      title: "Inicio",
      disabled: false,
      href: "/",
    },
    {
      title: "Asistencia",
      disabled: true,
      href: "/asistencia",
    },
  ])

  const openCreate = async () => {
    createDialog.value = true
    await fetchUsersAttendance()
  }

  const openEdit = (id: number) => {
    const attendance = attendanceMap.value.get(id)
    if (!attendance) return
    edit.value = { ...attendance }
    updateDialog.value = true
  }

  const onConsult = async (campus: CampusEnum, generation: number, date: string) => {
    variables.value = { campus, generation, date }
    try {
      await mutateAttendanceUsers({ campus, generation, date })
    } catch (e) {
      console.error(e)
    }
  }

  const onCreateAttendance = async (input: CreateAttendanceInput) => {
    try {
      const res = await mutateCreateAttendance({ createAttendanceInput: input })
      if (res?.data?.createAttendance) {
        // const user = res.data.createUser
        // if (variablesFind.value.campus === user.campus && variablesFind.value.generation === user.generationId) {
        //   studentsMap.value.set(user.id, user)
        // }
        createDialog.value = false
      }
    } catch (e) {
      console.error(e)
    }
  }

  const onUpdate = async (id: number, updateForm: UpdateAttendanceInput) => {
    try {
      const res = await mutateUpdateAttendance({ updateAttendanceInput: { ...updateForm, id } })
      if (res) {
        updateDialog.value = false
        edit.value = undefined
      }
    } catch (e) {
      console.error(e)
    }
  }

  return {
    edit,
    links,
    myCampus,
    variables,
    attendance,
    adminCampus,
    generations,
    updateDialog,
    createDialog,
    usersAttendance,
    onUpdate,
    openEdit,
    onConsult,
    openCreate,
    onCreateAttendance,
  }
})
