import dayjs from "dayjs"
import { defineStore, storeToRefs } from "pinia"
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

import { CreateUserInput, Photo, UpdateUserInput, User } from "@/grapqhl"
import { useUsersStore } from "@/store/api/usersStore"
import { useAppStore } from "@/store/app"

export const useStudentDetailsPageStore = defineStore("studentDetailsPage", () => {
  const { studentsMap, loadingStudent, selectedUser, variablesUser, loadingAddPhoto, loadingRemovePhoto, loadingAddFile, loadingRemoveFile } = storeToRefs(useUsersStore())
  const { fetchStudent, mutateAddPhoto, mutateRemovePhoto, mutateAddFile, mutateRemoveFile } = useUsersStore()

  const { setLoading } = useAppStore()
  const route = useRoute()
  const router = useRouter()
  const photoDialog = ref(false)
  const studentState = ref([])
  const file = ref<File | null>(null)
  const previewUrl = ref("")
  const createFileDialog = ref(false)

  watch(
    () => route.params.id,
    (idString) => checkRouteId(idString),
  )

  const checkRouteId = async (idString: string | string[]) => {
    const id = !Array.isArray(idString) ? parseInt(idString) : NaN
    if (route.name === "StudentDetails" && !Array.isArray(id) && !isNaN(id) && variablesUser.value?.id !== id) {
      variablesUser.value = { id }
      setLoading(true)
      try {
        const res = await fetchStudent()
        if (res) {
          //console.log(res)
        } else {
          await router.push("/becarios")
        }
      } catch (e) {
        await router.push("/becarios")
      } finally {
        setLoading(false)
      }
    }
  }

  checkRouteId(route.params.id).then()

  const students = computed(() => [...studentsMap.value.values()])
  const loading = computed(() => loadingStudent.value)
  const addPhotoLoading = computed(() => loadingAddPhoto.value)

  const links = computed(() => [
    {
      title: "Inicio",
      disabled: false,
      href: "/",
    },
    {
      title: "Becarios",
      disabled: true,
      href: "/becarios",
    },
  ])

  const openCreteFile = () => {
    createFileDialog.value = true
  }

  const changePhoto = (event: File | File[] | null) => {
    if (event) {
      const fileToLoad = Array.isArray(event) ? event[0] : event
      previewUrl.value = window.URL.createObjectURL(fileToLoad)
      file.value = fileToLoad
      photoDialog.value = true
    } else {
      previewUrl.value = ""
      file.value = null
    }
  }

  const savePhoto = async () => {
    if (file.value) {
      if (!selectedUser.value) return
      try {
        const res = await mutateAddPhoto({ photo: file.value, userId: selectedUser.value?.id })
        if (res) {
          photoDialog.value = false
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  const onRemovePhoto = async (photo: Photo) => {
    if (!selectedUser.value) return
    try {
      const res = await mutateRemovePhoto({
        id: photo.id,
        userId: selectedUser.value.id,
      })
      if (res) {
        selectedUser.value = {
          ...selectedUser.value,
          images: selectedUser.value.images.filter((photoMap) => {
            return photoMap.id !== photo.id
          }),
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const onAddFile = async (file: File, startDate: string, endDate: string) => {
    if (!selectedUser.value) return
    try {
      const formattedStartDate = dayjs(startDate).format("YYYY/MM/DD")
      const formattedEndDate = dayjs(endDate).format("YYYY/MM/DD")
      const res = await mutateAddFile({
        userId: selectedUser.value.id,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        recordFile: file,
      })
      if (res) {
        createFileDialog.value = false
      }
    } catch (e) {
      console.error(e)
    }
  }

  const onRemoveConstacy = async (id: number) => {
    if (!selectedUser.value) return
    try {
      const res = await mutateRemoveFile({
        id,
      })
      if (res) {
        selectedUser.value = {
          ...selectedUser.value,
          documents: selectedUser.value.documents.filter((doc) => {
            return doc.id !== id
          }),
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  return {
    links,
    loading,
    students,
    previewUrl,
    photoDialog,
    selectedUser,
    studentState,
    addPhotoLoading,
    createFileDialog,
    onAddFile,
    savePhoto,
    changePhoto,
    openCreteFile,
    onRemovePhoto,
    onRemoveConstacy,
  }
})
