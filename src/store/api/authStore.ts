import { useApolloClient, useLazyQuery, useMutation } from "@vue/apollo-composable"
import { createUploadLink } from "apollo-upload-client"
import { defineStore, getActivePinia } from "pinia"
import { computed, ref } from "vue"
import { RouteLocationNormalized, useRouter } from "vue-router"

import { Admin, ADMIN_LOGIN, GET_PROFILE, Mutation, Query } from "@/grapqhl"
import { useAlertStore } from "@/store/alertStore"

export const useAuthStore = defineStore("authStore", () => {
  const { push } = useRouter()
  const { client } = useApolloClient()
  const { showAlert } = useAlertStore()
  const userProfile = ref<Admin>()

  const {
    loading: loadingLogin,
    mutate: loginMutation,
    onDone: onDoneLogin,
    onError: onErrorLogin,
  } = useMutation<Mutation>(ADMIN_LOGIN, {
    fetchPolicy: "no-cache",
  })

  onDoneLogin((param) => {
    if (param?.data?.login) {
      console.log(param.data)
    }
  })

  onErrorLogin((error) => {
    console.error(error)
    showAlert({
      title: "Error al iniciar sesión, verifica tu usuario y/o contraseña.",
      status: "error",
    })
  })

  const {
    loading: loadingProfile,
    load,
    refetch,
    result: profileResult,
    onError,
    onResult,
  } = useLazyQuery<Query>(GET_PROFILE, {
    fetchPolicy: "no-cache",
  })

  const fetchProfile = () => load() || refetch()

  const login = async (email: string, password: string) => {
    const res = await loginMutation({ email, password })
    if (res?.data?.login) {
      const token = res?.data?.login.token || ""
      localStorage.setItem("token", token)
      await getProfile(token)
    }
  }

  const getProfile = async (token: string, to?: RouteLocationNormalized) => {
    client.setLink(
      createUploadLink({
        uri: import.meta.env.VITE_API_URL,
        headers: { Authorization: `Bearer ${token}`, "Apollo-Require-Preflight": "true" },
      }),
    )
    const res = await fetchProfile()
    if (res) {
      await push(to || "/")
    }
  }

  onError(() => {
    localStorage.removeItem("token")
    client.setLink(
      createUploadLink({
        uri: import.meta.env.VITE_API_URL,
        headers: undefined,
      }),
    )
    push({ path: "/auth/login" })
    showAlert({
      title: "Error al consultar usuario, intente mas tarde.",
      status: "error",
    })
  })

  onResult((param) => {
    if (param.data?.profile) {
      userProfile.value = param.data.profile
    }
  })

  const loggedUser = computed<Admin | null>(() => profileResult?.value?.profile || null)

  const userInitials = computed<string>(() => `${profileResult?.value?.profile.firstName.charAt(0) || ""}${profileResult?.value?.profile.lastName.charAt(0) || ""}`)

  const fullName = computed<string>(() => `${profileResult?.value?.profile.firstName || ""} ${profileResult?.value?.profile.lastName || ""}`)

  const $reset = () => {
    userProfile.value = undefined
    localStorage.removeItem("token")
    client.setLink(
      createUploadLink({
        uri: import.meta.env.VITE_API_URL,
        headers: undefined,
      }),
    )
    push({ path: "/auth/login" })
  }

  const logout = () => {
    const activePinia = getActivePinia()
    if (activePinia) {
      Object.entries(activePinia.state.value).forEach(([storeName, state]) => {
        const storeDefinition = defineStore(storeName, state)
        const store = storeDefinition(activePinia)
        store.$reset()
      })
    }
  }

  return {
    loadingLogin,
    loadingProfile,
    loggedUser,
    userInitials,
    fullName,
    userProfile,
    login,
    logout,
    getProfile,
    $reset,
  }
})
