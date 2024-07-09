import { defineStore, storeToRefs } from "pinia"
import { computed, ref } from "vue"

import { CampusEnum } from "@/grapqhl"
import { useAuthStore } from "@/store/api/authStore"
import { useAutorizationStore } from "@/store/api/autorizationStore"
import { useSettingsStore } from "@/store/api/settingsStore"

export const useAutorizationPageStore = defineStore("autorizationPage", () => {
  const { adminCampus } = storeToRefs(useAuthStore())
  const { loadingGenerations, generationsMap } = storeToRefs(useSettingsStore())
  const { autorizationMap } = storeToRefs(useAutorizationStore())
  const { mutateAutorizationMap } = useAutorizationStore()
  const variables = ref<{ campus: CampusEnum | undefined; generation: number | undefined; date: string }>({
    campus: adminCampus.value ? adminCampus.value[0]?.value : undefined,
    generation: undefined,
    date: "",
  })

  const loading = computed(() => loadingGenerations.value)
  const autorization = computed(() => [...autorizationMap.value.values()])
  const generations = computed(() => [...generationsMap.value.values()])

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

  const onConsult = async (campus: CampusEnum, generation: number, date: string) => {
    variables.value = { campus, generation, date }
    try {
      await mutateAutorizationMap({ campus, generation, date })
    } catch (e) {
      console.error(e)
    }
  }

  return {
    links,
    loading,
    variables,
    generations,
    adminCampus,
    autorization,
    onConsult,
  }
})
