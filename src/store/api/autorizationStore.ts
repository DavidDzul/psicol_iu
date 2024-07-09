import { useMutation } from "@vue/apollo-composable"
import { defineStore } from "pinia"
import { ref } from "vue"

import { GET_AUTORIZATION, Mutation, MutationSearchAllUsersArgs, User } from "@/grapqhl"
import { useAlertStore } from "@/store/alertStore"

export const useAutorizationStore = defineStore("autorizationStore", () => {
  const autorizationMap = ref<Map<number, User>>(new Map())
  const { showAlert } = useAlertStore()

  const $reset = () => {
    useAutorizationStore().$reset()
  }

  const {
    loading: loadingAutorizationMap,
    mutate: mutateAutorizationMap,
    onDone: onResultAutorizationMap,
    onError: onErrorAutorizationMap,
  } = useMutation<Mutation, MutationSearchAllUsersArgs>(GET_AUTORIZATION, {
    fetchPolicy: "no-cache",
  })

  onResultAutorizationMap((res) => {
    if (res?.data?.searchAllUsers) {
      autorizationMap.value = new Map(res.data.searchAllUsers.map((m) => [m.id, m]))
    }
  })

  onErrorAutorizationMap((err) => {
    console.error(err)
  })

  return {
    autorizationMap,
    loadingAutorizationMap,
    mutateAutorizationMap,
    $reset,
  }
})
