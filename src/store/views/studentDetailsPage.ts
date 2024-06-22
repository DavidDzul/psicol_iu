import { defineStore, storeToRefs } from "pinia"
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

import { CreateUserInput, UpdateUserInput, User } from "@/grapqhl"
import { useUsersStore } from "@/store/api/usersStore"
import { useAppStore } from "@/store/app"

export const useStudentDetailsPageStore = defineStore("studentDetailsPage", () => {
  const { studentsMap, loadingStudent, selectedUser, variablesUser } = storeToRefs(useUsersStore())
  const { fetchStudent } = useUsersStore()

  const { setLoading } = useAppStore()
  const route = useRoute()
  const router = useRouter()

  const studentState = ref([])

  watch(
    () => route.params.id,
    (idString) => checkRouteId(idString),
  )

  const checkRouteId = async (idString: string | string[]) => {
    const id = !Array.isArray(idString) ? parseInt(idString) : NaN
    console.log(id)
    if (route.name === "StudentDetails" && !Array.isArray(id) && !isNaN(id) && variablesUser.value?.id !== id) {
      variablesUser.value = { id }
      setLoading(true)
      try {
        const res = await fetchStudent()
        if (res) {
          //console.log(res)
        } else {
          await router.push("/becarios")
        }
      } catch (e) {
        await router.push("/becarios")
      } finally {
        setLoading(false)
      }
    }
  }

  checkRouteId(route.params.id).then()

  const students = computed(() => [...studentsMap.value.values()])
  const loading = computed(() => loadingStudent.value)

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

  return {
    links,
    loading,
    students,
    selectedUser,
    studentState,
  }
})
