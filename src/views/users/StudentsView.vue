<template>
  <BreadCrumbs :items="links" />
  <StudentsTable :students="students" :loading="loading" :campus-array="adminCampus" :generations="generations" :variables="variablesFind" @consult="onConsult" @create="openCreate" @edit="openEdit" />
  <StudentCreateDialog v-model="createDialog" :campus-array="adminCampus" :generations="generations" @submit="onCreateStudent" />
  <StudentUpdateDialog v-model="updateDialog" :campus-array="adminCampus" :edit-item="edit" @submit="onUpdate(edit!.id, $event)" />
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { ref } from "vue"

import BreadCrumbs from "@/components/shared/BreadCrumbs.vue"
import StudentCreateDialog from "@/components/users/StudentCreateDialog.vue"
import StudentsTable from "@/components/users/StudentsTable.vue"
import StudentUpdateDialog from "@/components/users/StudentUpdateDialog .vue"
import { useStudentPageStore } from "@/store/views/studentPage"

const { createDialog, updateDialog, links, students, loading, edit, generations, adminCampus, variablesFind } = storeToRefs(useStudentPageStore())
const { openCreate, onCreateStudent, openEdit, onUpdate, onConsult } = useStudentPageStore()
</script>
