import { useLazyQuery, useMutation, useQuery } from "@vue/apollo-composable"
import { defineStore } from "pinia"
import { ref } from "vue"
import { useRouter } from "vue-router"

import { CREATE_GENERATION, Generation, GET_GENERATIONS, Mutation, MutationCreateGenerationArgs, MutationUpdateGenerationArgs, Query, UPDATE_GENERATION } from "@/grapqhl"
import { useAlertStore } from "@/store/alertStore"

export const useSettingsStore = defineStore("settingsStore", () => {
  const generationsMap = ref<Map<number, Generation>>(new Map())
  const { showAlert } = useAlertStore()

  const $reset = () => {
    generationsMap.value = new Map()
  }

  const {
    loading: loadingGenerations,
    refetch: refetchGenerations,
    onError: onErrorGenerations,
    onResult: onResultGenerations,
  } = useQuery<Query>(GET_GENERATIONS, undefined, {
    fetchPolicy: "no-cache",
  })

  const {
    loading: loadingCreateGeneration,
    mutate: mutateCreateGeneration,
    onDone: onDoneCreateGeneration,
    onError: onErrorCreateGeneration,
  } = useMutation<Mutation, MutationCreateGenerationArgs>(CREATE_GENERATION, {
    fetchPolicy: "no-cache",
  })

  const {
    loading: loadingUpdateGeneration,
    mutate: mutateUpdateGeneration,
    onDone: onDoneUpdateGeneration,
    onError: onErrorUpdateGeneration,
  } = useMutation<Mutation, MutationUpdateGenerationArgs>(UPDATE_GENERATION, {
    fetchPolicy: "no-cache",
  })

  onResultGenerations((res) => {
    if (res?.data?.findAllGenerations) {
      generationsMap.value = new Map(res.data.findAllGenerations.map((m) => [m.id, m]))
    }
  })

  onErrorGenerations((err) => {
    console.error(err)
  })

  onDoneCreateGeneration((param) => {
    if (param?.data?.createGeneration) {
      showAlert({
        title: "Generación creada exitosamente.",
        status: "success",
      })
      generationsMap.value.set(param.data.createGeneration.id, param.data.createGeneration)
    }
  })

  onErrorCreateGeneration((error) => {
    showAlert({
      title: "Error al crear la generación. Intente más tarde.",
      status: "error",
    })
  })

  onDoneUpdateGeneration((param) => {
    if (param?.data?.updateGeneration) {
      showAlert({
        title: "Generación actualizada exitosamente.",
        status: "success",
      })
      generationsMap.value.set(param.data.updateGeneration.id, param.data.updateGeneration)
    }
  })

  onErrorUpdateGeneration((error) => {
    showAlert({
      title: "Error al actualizar la generación. Intente más tarde.",
      status: "error",
    })
  })

  return {
    loadingGenerations,
    generationsMap,
    loadingCreateGeneration,
    loadingUpdateGeneration,
    mutateCreateGeneration,
    mutateUpdateGeneration,
    refetchGenerations,
    $reset,
  }
})
