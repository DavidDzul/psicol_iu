import { defineStore, storeToRefs } from "pinia"
import { computed, onUnmounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

import { CampusEnum, CreateUserInput, UpdateUserInput, User } from "@/grapqhl"
import { useAuthStore } from "@/store/api/authStore"
import { useSettingsStore } from "@/store/api/settingsStore"
import { useUsersStore } from "@/store/api/usersStore"

export const useStudentPageStore = defineStore("studentPage", () => {
  const { studentsMap } = storeToRefs(useUsersStore())
  const { loadingGenerations, generationsMap } = storeToRefs(useSettingsStore())
  const { mutateCreateStudent, mutateUpdateStudent, mutateTestUsers } = useUsersStore()
  const { adminCampus } = storeToRefs(useAuthStore())

  const variablesFind = ref<{ campus: CampusEnum | undefined; generation: number | undefined }>({
    campus: adminCampus.value ? adminCampus.value[0]?.value : undefined,
    generation: undefined,
  })
  const createDialog = ref(false)
  const updateDialog = ref(false)
  const edit = ref<User | undefined>()

  const students = computed(() => [...studentsMap.value.values()])
  const loading = computed(() => loadingGenerations.value)
  const generations = computed(() => [...generationsMap.value.values()].filter((map) => map.inProgress === true))

  const links = computed(() => [
    {
      title: "Inicio",
      disabled: false,
      href: "/",
    },
    {
      title: "Becarios",
      disabled: true,
      href: "/becarios",
    },
  ])

  const openCreate = () => {
    createDialog.value = true
  }

  const openEdit = (id: number) => {
    const user = studentsMap.value.get(id)
    if (!user) return
    edit.value = { ...user }
    updateDialog.value = true
  }

  const onConsult = async (campus: CampusEnum, generation: number) => {
    variablesFind.value = { campus, generation }
    try {
      await mutateTestUsers({ campus, generation })
    } catch (e) {
      console.error(e)
    }
  }

  const onCreateStudent = async (createUserInput: CreateUserInput) => {
    try {
      const res = await mutateCreateStudent({ createUserInput })
      if (res?.data?.createUser) {
        const user = res.data.createUser
        if (variablesFind.value.campus === user.campus && variablesFind.value.generation === user.generationId) {
          studentsMap.value.set(user.id, user)
        }
        createDialog.value = false
      }
    } catch (e) {
      console.error(e)
    }
  }

  const onUpdate = async (id: number, updateForm: UpdateUserInput) => {
    try {
      const res = await mutateUpdateStudent({ updateUserInput: { ...updateForm, id } })
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
    createDialog,
    updateDialog,
    links,
    loading,
    students,
    generations,
    adminCampus,
    variablesFind,
    onConsult,
    openCreate,
    onCreateStudent,
    openEdit,
    onUpdate,
  }
})
