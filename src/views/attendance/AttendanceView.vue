<template>
  <BreadCrumbs :items="links" />
  <AttendanceTable :attendance="attendance" :variables="variables" :campus-array="adminCampus" :generations="generations" @consult="onConsult" @create="openCreate" @edit="openEdit" />
  <AttendanceCreateDialog v-model="createDialog" :students="usersAttendance" :generations="generations" :campus="myCampus" @submit="onCreateAttendance" />
  <AttendanceUpdateDialog v-model="updateDialog" :edit-item="edit" @submit="onUpdate(edit!.id, $event)" />
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { ref } from "vue"

import AttendanceCreateDialog from "@/components/attendance/AttendanceCreateDialog.vue"
import AttendanceTable from "@/components/attendance/AttendanceTable.vue"
import AttendanceUpdateDialog from "@/components/attendance/AttendanceUpdateDialog.vue"
import BreadCrumbs from "@/components/shared/BreadCrumbs.vue"
import { useAttendancePageStore } from "@/store/views/attendancePage"

const { links, attendance, edit, updateDialog, variables, adminCampus, generations, createDialog, usersAttendance, myCampus } = storeToRefs(useAttendancePageStore())
const { onConsult, openCreate, onCreateAttendance, openEdit, onUpdate } = useAttendancePageStore()
</script>
