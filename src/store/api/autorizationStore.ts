import { useMutation } from "@vue/apollo-composable"
import { defineStore } from "pinia"
import { ref } from "vue"

import { CREATE_AUTORIZATION, GET_AUTORIZATION, Mutation, MutationCreateAutorizationArgs, MutationSearchAllUsersArgs, User } from "@/grapqhl"
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

  const {
    loading: loadingCreateAutorization,
    mutate: mutateCreateAutorization,
    onDone: onDoneCreateAutorization,
    onError: onErrorCreateAutorization,
  } = useMutation<Mutation, MutationCreateAutorizationArgs>(CREATE_AUTORIZATION, {
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
    loadingCreateAutorization,
    mutateAutorizationMap,
    mutateCreateAutorization,
    $reset,
  }
})
