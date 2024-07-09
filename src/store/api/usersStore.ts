import { useLazyQuery, useMutation, useQuery } from "@vue/apollo-composable"
import { defineStore } from "pinia"
import { ref } from "vue"
import { useRouter } from "vue-router"

import {
  ADD_FILE_TO_USER,
  ADD_PHOTO_TO_USER,
  CampusEnum,
  CREATE_USER,
  DELETE_PHOTO_FROM_USER,
  GET_USER,
  Mutation,
  MutationCreateConstancyArgs,
  MutationCreatePhotoArgs,
  MutationCreateUserArgs,
  MutationRemovePhotoArgs,
  MutationSearchAllUsersArgs,
  MutationUpdateUserArgs,
  Query,
  QueryFindOneUserArgs,
  SEATCH_USERS,
  UPDATE_USER,
  User,
} from "@/grapqhl"
import { useAlertStore } from "@/store/alertStore"

export const useUsersStore = defineStore("usersStore", () => {
  const studentsMap = ref<Map<number, User>>(new Map())
  const { showAlert } = useAlertStore()
  const selectedUser = ref<User>()
  const selectedUserId = ref<QueryFindOneUserArgs>({ id: 0 })

  const $reset = () => {
    selectedUser.value = undefined
    useUsersStore().$reset()
  }

  const {
    loading: loadingTestUsers,
    mutate: mutateTestUsers,
    onDone: onResultStudents,
    onError: onErrorStudents,
  } = useMutation<Mutation, MutationSearchAllUsersArgs>(SEATCH_USERS, {
    fetchPolicy: "no-cache",
  })

  const {
    variables: variablesUser,
    loading: loadingStudent,
    refetch: refetchStudent,
    load: loadStudent,
    onError: onErrorStudent,
    onResult: onResultStudent,
  } = useLazyQuery<Query, QueryFindOneUserArgs>(GET_USER, selectedUserId)

  const {
    loading: loadingCreateStudent,
    mutate: mutateCreateStudent,
    onDone: onDoneCreateStudent,
    onError: onErrorCreateStudent,
  } = useMutation<Mutation, MutationCreateUserArgs>(CREATE_USER, {
    fetchPolicy: "no-cache",
  })

  const {
    loading: loadingUpdateStudent,
    mutate: mutateUpdateStudent,
    onDone: onDoneUpdateStudent,
    onError: onErrorUpdateStudent,
  } = useMutation<Mutation, MutationUpdateUserArgs>(UPDATE_USER, {
    fetchPolicy: "no-cache",
  })

  const {
    loading: loadingAddPhoto,
    mutate: mutateAddPhoto,
    onDone: onDoneAddPhoto,
    onError: onErrorAddPhoto,
  } = useMutation<Mutation, MutationCreatePhotoArgs>(ADD_PHOTO_TO_USER, {
    fetchPolicy: "no-cache",
  })

  const {
    loading: loadingRemovePhoto,
    mutate: mutateRemovePhoto,
    onDone: onDoneRemovePhoto,
    onError: onErrorRemovePhoto,
  } = useMutation<Mutation, MutationRemovePhotoArgs>(DELETE_PHOTO_FROM_USER, {
    fetchPolicy: "no-cache",
  })

  const {
    loading: loadingAddFile,
    mutate: mutateAddFile,
    onDone: onDoneAddFile,
    onError: onErrorAddFile,
  } = useMutation<Mutation, MutationCreateConstancyArgs>(ADD_FILE_TO_USER, {
    fetchPolicy: "no-cache",
  })

  const fetchStudent = () => loadStudent() || refetchStudent()

  onResultStudent((res) => {
    if (res?.data?.findOneUser) {
      selectedUser.value = res.data.findOneUser
    }
  })

  onResultStudents((res) => {
    if (res?.data?.searchAllUsers) {
      studentsMap.value = new Map(res.data.searchAllUsers.map((m) => [m.id, m]))
    }
  })

  onErrorStudents((err) => {
    console.error(err)
  })

  onDoneCreateStudent((param) => {
    if (param?.data?.createUser) {
      showAlert({
        title: "Usuario creado exitosamente",
        status: "success",
      })
    }
  })

  onErrorCreateStudent((error) => {
    showAlert({
      title: "Error al crear el usuario. Intente más tarde.",
      status: "error",
    })
  })

  onDoneUpdateStudent((param) => {
    if (param?.data?.updateUser) {
      showAlert({
        title: "Usuario actualizado exitosamente",
        status: "success",
      })
      studentsMap.value.set(param.data.updateUser.id, param.data.updateUser)
    }
  })

  onErrorUpdateStudent((error) => {
    showAlert({
      title: "Error al actualizar el usuario. Intente más tarde.",
      status: "error",
    })
  })

  onDoneAddPhoto((param) => {
    if (param.data?.createPhoto) {
      showAlert({
        title: "Foto agregada exitosamente.",
        status: "success",
      })
      if (!selectedUser.value) return

      selectedUser.value.images = []
      selectedUser.value = {
        ...selectedUser.value,
        images: [param.data.createPhoto],
      }
    }
  })

  onErrorAddPhoto((error) => {
    showAlert({
      title: "Error al agregar la foto.",
      body: "Intentar mas tarde",
      status: "error",
      icon: "mdi-alert",
    })
  })

  onDoneRemovePhoto((param) => {
    if (param.data) {
      showAlert({
        title: "Foto eliminada exitosamente.",
        status: "success",
      })
    }
  })

  onErrorRemovePhoto((error) => {
    showAlert({
      title: "Error al eliminar la foto.",
      body: "Intentar mas tarde",
      status: "error",
      icon: "mdi-alert",
    })
  })

  return {
    studentsMap,
    selectedUser,
    variablesUser,
    loadingAddFile,
    loadingStudent,
    loadingAddPhoto,
    loadingRemovePhoto,
    loadingCreateStudent,
    loadingUpdateStudent,
    fetchStudent,
    mutateAddFile,
    mutateAddPhoto,
    mutateTestUsers,
    mutateRemovePhoto,
    mutateCreateStudent,
    mutateUpdateStudent,
    $reset,
  }
})
