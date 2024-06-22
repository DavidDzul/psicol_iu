import { useLazyQuery, useMutation, useQuery } from "@vue/apollo-composable"
import { defineStore } from "pinia"
import { ref } from "vue"
import { useRouter } from "vue-router"

import {
  CampusEnum,
  CREATE_USER,
  GET_USER,
  GET_USERS,
  Mutation,
  MutationCreateUserArgs,
  MutationTestFindUsersArgs,
  MutationUpdateUserArgs,
  Query,
  QueryFindAllUsersArgs,
  QueryFindOneUserArgs,
  TEST_USERS,
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
  } = useMutation<Mutation, MutationTestFindUsersArgs>(TEST_USERS, {
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

  const fetchStudent = () => loadStudent() || refetchStudent()

  onResultStudent((res) => {
    if (res?.data?.findOneUser) {
      selectedUser.value = res.data.findOneUser
    }
  })

  onResultStudents((res) => {
    if (res?.data?.testFindUsers) {
      studentsMap.value = new Map(res.data.testFindUsers.map((m) => [m.id, m]))
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

  return {
    studentsMap,
    selectedUser,
    variablesUser,
    loadingStudent,
    loadingCreateStudent,
    loadingUpdateStudent,
    fetchStudent,
    mutateCreateStudent,
    mutateUpdateStudent,
    mutateTestUsers,
    $reset,
  }
})
