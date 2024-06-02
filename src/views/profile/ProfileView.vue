<template>
  <BreadCrumbs :items="links"></BreadCrumbs>
  <ProfileUpdateForm :admin="admin || undefined" @submit="onUpdate" />
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"

import ProfileUpdateForm from "@/components/profile/ProfileUpdateForm.vue"
import BreadCrumbs from "@/components/shared/BreadCrumbs.vue"
import { useProfilePageStore } from "@/store/views/profilePage"

const { links, admin } = storeToRefs(useProfilePageStore())
const { onUpdate } = useProfilePageStore()
</script>
