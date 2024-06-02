import { defineStore, storeToRefs } from "pinia"
import { computed, ref } from "vue"

import { useAuthStore } from "@/store/api/authStore"

export const useProfilePageStore = defineStore("ProfilePage", () => {
  const { loggedUser } = storeToRefs(useAuthStore())
  const profile = ref("")

  const $reset = () => {
    profile.value = ""
  }

  const admin = computed(() => loggedUser.value)
  const links = computed(() => [
    {
      title: "Inicio",
      disabled: false,
      href: "/",
    },
    {
      title: "Perfil",
      disabled: true,
      href: "/perfil",
    },
  ])

  const onUpdate = () => {
    console.log("update")
  }

  return {
    profile,
    links,
    admin,
    onUpdate,
    $reset,
  }
})
