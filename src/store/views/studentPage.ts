import { defineStore, storeToRefs } from "pinia"
import { computed, ref } from "vue"

import { CreateUserInput, User } from "@/grapqhl"

export const useStudentPageStore = defineStore("studentPage", () => {
  const createDialog = ref(false)
  const updateDialog = ref(false)
  const edit = ref<User | undefined>()

  const $reset = () => {
    createDialog.value = false
    updateDialog.value = false
    edit.value = undefined
  }

  const links = computed(() => [
    {
      title: "Inicio",
      disabled: false,
      href: "/",
    },
    {
      title: "Usuarios",
      disabled: true,
      href: "/usuarios",
    },
  ])

  const openCreate = () => {
    createDialog.value = true
  }

  return {
    edit,
    createDialog,
    updateDialog,
    links,
    openCreate,
    $reset,
  }
})
