import { defineStore, storeToRefs } from "pinia"
import { ref } from "vue"

import { useAuthStore } from "@/store/api/authStore"

export const useLoginPageStore = defineStore("loginPage", () => {
  const { login } = useAuthStore()
  const { loadingLogin: loading } = storeToRefs(useAuthStore())

  const email = ref<string>()
  const password = ref<string>()

  const $reset = () => {
    email.value = ""
    password.value = ""
  }

  const onLogin = async () => {
    if (email.value && password.value) {
      await login(email.value, password.value)
    }
  }

  return {
    email,
    password,
    onLogin,
    loading,
    $reset,
  }
})
