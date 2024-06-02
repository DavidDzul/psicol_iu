import { defineStore } from "pinia"
import { ref } from "vue"

export const useAppStore = defineStore("appStore", () => {
  const loading = ref(false)

  const setLoading = (status: boolean) => {
    loading.value = status
  }

  const $reset = () => {
    loading.value = false
  }

  return {
    loading,
    setLoading,
    $reset,
  }
})
