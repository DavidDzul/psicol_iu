<template>
  <BreadCrumbs :items="links" />
  <AutorizationTable :users="autorization" :campus-array="adminCampus" :variables="variables" :generations="generations" @consult="onConsult" />
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { ref } from "vue"

import AutorizationTable from "@/components/scholarship/AutorizationTable.vue"
import BreadCrumbs from "@/components/shared/BreadCrumbs.vue"
import { useAutorizationPageStore } from "@/store/views/autorizationPage"

const { links, autorization, loading, adminCampus, variables, generations } = storeToRefs(useAutorizationPageStore())
const { onConsult } = useAutorizationPageStore()
</script>
