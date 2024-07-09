<template>
  <BreadCrumbs :items="links"></BreadCrumbs>
  <v-row v-if="selectedUser">
    <v-col cols="12">
      <v-toolbar :flat="true" :title="selectedUser.enrollment">
        <v-spacer></v-spacer>
        <v-menu :location="'left'">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="mdi-dots-vertical"> </v-btn>
          </template>
          <v-list>
            <v-list-subheader>Opciones de Plan</v-list-subheader>
            <v-list-item prepend-icon="mdi-pencil" title="Editar"></v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
      <v-expansion-panels variant="accordion" :multiple="true" v-model="studentState">
        <v-expansion-panel title="Datos del Becario">
          <v-expansion-panel-text>
            <StudentDetailList :user="selectedUser" />
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-title>
            <template #default="{ expanded }">
              <PanelHeaderOptions title="Foto de perfil" button-text="Nueva foto" :expanded="expanded" @button-click="onPhotoUpload" />
            </template>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <StudentPhotos :user-id="selectedUser.id" :photos="selectedUser.images" @remove="removePhoto" />
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-file-input ref="fileInput" class="d-none" accept="image/*" @update:model-value="changePhoto"></v-file-input>
        <v-expansion-panel>
          <v-expansion-panel-title>
            <template #default="{ expanded }">
              <PanelHeaderOptions title="Documentos" button-text="Nuevo documento" :expanded="expanded" @button-click="openCreteFile" />
            </template>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <h1>Documentos</h1>
            <!-- <StudentPhotos :user-id="selectedUser.id" :photos="selectedUser.images" @remove="removePhoto" /> -->
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
  <CreatePhotoDialog v-model="photoDialog" :loading="addPhotoLoading" :preview-url="previewUrl" @submit="savePhoto" />
  <CreateConstancyDialog v-model="createFileDialog" @submit="onAddFile" />
  <ConfirmationDialog ref="confirmationDialog" />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { computed, ref } from "vue"

import CreatePhotoDialog from "@/components/photos/CreatePhotoDialog.vue"
import BreadCrumbs from "@/components/shared/BreadCrumbs.vue"
import ConfirmationDialog from "@/components/shared/ConfirmationDialog.vue"
import PanelHeaderOptions from "@/components/shared/PanelHeaderOptions.vue"
import CreateConstancyDialog from "@/components/users/CreateConstancyDialog.vue"
import StudentDetailList from "@/components/users/StudentDetailList.vue"
import StudentPhotos from "@/components/users/StudentPhotos.vue"
import { Photo } from "@/grapqhl"
import { useStudentDetailsPageStore } from "@/store/views/studentDetailsPage"

import { deletePhotoBody, deletePhotoTitle } from "../../../constants"

const { links, selectedUser, studentState, photoDialog, previewUrl, addPhotoLoading, createFileDialog } = storeToRefs(useStudentDetailsPageStore())
const { changePhoto, savePhoto, onRemovePhoto, onAddFile, openCreteFile } = useStudentDetailsPageStore()

const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog>>()
const fileInput = ref(null)
const onPhotoUpload = () => {
  ;(fileInput.value as any).$el.getElementsByTagName("input")[0].click()
}

const removePhoto = async (photo: Photo) => {
  if (!photo) return
  const response = await confirmationDialog.value?.open({
    title: deletePhotoTitle,
    body: deletePhotoBody(),
  })
  if (!response) return
  await onRemovePhoto(photo)
}
</script>
