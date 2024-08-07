<template>
  <BreadCrumbs :items="links" />
  <AutorizationTable :users="autorization" :campus-array="adminCampus" :calendars="calendars" :variables="variables" :generations="generations" @consult="onConsult" @create="openCreate" />
  <CreateAutorizationDialog v-model="createDialog" @submit="onCreateAutorization" />
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { ref } from "vue"

import AutorizationTable from "@/components/scholarship/AutorizationTable.vue"
import CreateAutorizationDialog from "@/components/scholarship/CreateAutorizationDialog.vue"
import BreadCrumbs from "@/components/shared/BreadCrumbs.vue"
import { useAutorizationPageStore } from "@/store/views/autorizationPage"

const { links, autorization, adminCampus, variables, generations, createDialog, calendars } = storeToRefs(useAutorizationPageStore())
const { onConsult, openCreate, onCreateAutorization } = useAutorizationPageStore()
</script>
