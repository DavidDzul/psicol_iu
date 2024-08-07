<template>
  <BreadCrumbs :items="links" />
  <v-card>
    <v-tabs v-model="settingTab" bg-color="grey">
      <v-tab value="one">GENERACIONES</v-tab>
      <v-tab value="two">CALENDARIO</v-tab>
      <!-- <v-tab value="three">Item Three</v-tab> -->
    </v-tabs>

    <v-card-text>
      <v-tabs-window v-model="settingTab">
        <v-tabs-window-item value="one">
          <GenerationsTable :generations="generations" :loading="loadGenerations" @create="openCreateGeneration" @edit="openEditGeneration" />
        </v-tabs-window-item>

        <v-tabs-window-item value="two">
          <CalendarTable
            :loading="loadCalendar"
            :calendars="calendars"
            :generations-entities="generationsMap"
            @create="openCreateCalendar"
            @edit="openEditCalendar"
            @remove="removeCalendarConfirmation"
          />
        </v-tabs-window-item>

        <!-- <v-tabs-window-item value="three"> Three </v-tabs-window-item> -->
      </v-tabs-window>
    </v-card-text>
  </v-card>

  <GenerationCreateDialog v-model="createGenerationDialog" :campus-array="adminCampus" @submit="onCreateGeneration" />
  <GenerationUpdateDialog v-model="updateGenerationDialog" :edit-item="editGeneration" :campus-array="adminCampus" @submit="onUpdateGeneration(editGeneration!.id, $event)" />
  <CalendarCreateDialog v-if="userProfile" v-model="createCalendarDialog" :generations="generations" :admin="userProfile" @submit="onCreateCalendar" />
  <CalendarUpdateDialog
    v-if="userProfile"
    v-model="updateCalendarDialog"
    :edit-item="editCalendar"
    :generations="generations"
    :admin="userProfile"
    @submit="onUpdateCalendar(editCalendar!.id, $event)"
  />
  <ConfirmationDialog ref="confirmationDialog" />
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { ref } from "vue"

import CalendarCreateDialog from "@/components/calendar/CalendarCreateDialog.vue"
import CalendarTable from "@/components/calendar/CalendarTable.vue"
import CalendarUpdateDialog from "@/components/calendar/CalendarUpdateDialog.vue"
import GenerationCreateDialog from "@/components/settings/GenerationCreateDialog.vue"
import GenerationsTable from "@/components/settings/GenerationsTable.vue"
import GenerationUpdateDialog from "@/components/settings/GenerationUpdateDialog.vue"
import BreadCrumbs from "@/components/shared/BreadCrumbs.vue"
import ConfirmationDialog from "@/components/shared/ConfirmationDialog.vue"
import { useCalendarPageStore } from "@/store/views/calendarPage"
import { useSettingsPageStore } from "@/store/views/settingsPage"

import { deleteCalendarBody, deleteCalendarTitle } from "../../../constants"

const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog>>()

const { links, createGenerationDialog, generations, generationsMap, loadGenerations, settingTab, updateGenerationDialog, editGeneration, adminCampus } = storeToRefs(useSettingsPageStore())
const { openCreateGeneration, onCreateGeneration, openEditGeneration, onUpdateGeneration } = useSettingsPageStore()

const { loadCalendar, calendars, createCalendarDialog, userProfile, updateCalendarDialog, editCalendar } = storeToRefs(useCalendarPageStore())
const { openCreateCalendar, onCreateCalendar, openEditCalendar, onUpdateCalendar, onRemoveCalendar } = useCalendarPageStore()

const removeCalendarConfirmation = async (id: number) => {
  if (!id) return
  const response = await confirmationDialog.value?.open({
    title: deleteCalendarTitle,
    body: deleteCalendarBody(),
  })
  if (!response) return
  await onRemoveCalendar(id)
}
</script>
