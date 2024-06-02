<template>
  <StudentsTable @create="openCreate" />
  <StudentCreateDialog v-model="createDialog" />
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { ref } from "vue"

import StudentCreateDialog from "@/components/users/StudentCreateDialog.vue"
import StudentsTable from "@/components/users/StudentsTable.vue"
import { useStudentPageStore } from "@/store/views/studentPage.ts"

const { createDialog, links } = storeToRefs(useStudentPageStore())
const { openCreate } = useStudentPageStore()
</script>
