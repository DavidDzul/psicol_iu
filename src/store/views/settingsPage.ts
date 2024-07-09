import { defineStore, storeToRefs } from "pinia"
import { computed, ref } from "vue"

import { CreateGenerationInput, Generation, UpdateGenerationInput, User } from "@/grapqhl"
import { useAuthStore } from "@/store/api/authStore"
import { useSettingsStore } from "@/store/api/settingsStore"

export const useSettingsPageStore = defineStore("settingsPage", () => {
  const { loadingGenerations, generationsMap } = storeToRefs(useSettingsStore())
  const { refetchGenerations, mutateCreateGeneration, mutateUpdateGeneration } = useSettingsStore()
  const { adminCampus } = storeToRefs(useAuthStore())

  const createGenerationDialog = ref(false)
  const updateGenerationDialog = ref(false)
  const editGeneration = ref<Generation | undefined>()

  const $reset = () => {
    createGenerationDialog.value = false
    updateGenerationDialog.value = false
    editGeneration.value = undefined
  }

  const settingsState = ref([])
  const searchGenerations = ref("")
  const settingTab = ref(null)

  const generations = computed(() => [...generationsMap.value.values()])
  const loadGenerations = computed(() => loadingGenerations.value)

  const links = computed(() => [
    {
      title: "Inicio",
      disabled: false,
      href: "/",
    },
    {
      title: "Configuración",
      disabled: true,
      href: "/configuraciones",
    },
  ])

  const openCreateGeneration = () => {
    createGenerationDialog.value = true
  }

  const openEditGeneration = (id: number) => {
    const user = generationsMap.value.get(id)
    if (!user) return
    editGeneration.value = { ...user }
    updateGenerationDialog.value = true
  }

  const onCreateGeneration = async (createGenerationInput: CreateGenerationInput) => {
    try {
      const res = await mutateCreateGeneration({ createGenerationInput })
      if (res) {
        createGenerationDialog.value = false
      }
    } catch (e) {
      console.error(e)
    }
  }

  const onUpdateGeneration = async (id: number, updateGenerationForm: UpdateGenerationInput) => {
    try {
      const res = await mutateUpdateGeneration({ updateGenerationInput: { ...updateGenerationForm, id } })
      if (res) {
        updateGenerationDialog.value = false
        editGeneration.value = undefined
      }
    } catch (e) {
      console.error(e)
    }
  }

  return {
    editGeneration,
    createGenerationDialog,
    updateGenerationDialog,
    links,
    settingsState,
    loadGenerations,
    generations,
    searchGenerations,
    settingTab,
    adminCampus,
    onCreateGeneration,
    openEditGeneration,
    onUpdateGeneration,
    openCreateGeneration,
    $reset,
  }
})
