<template>
  <BreadCrumbs :items="links" />
  <v-card>
    <v-tabs v-model="settingTab" bg-color="grey">
      <v-tab value="one">GENERACIONES</v-tab>
      <!-- <v-tab value="two">Item Two</v-tab>
      <v-tab value="three">Item Three</v-tab> -->
    </v-tabs>

    <v-card-text>
      <v-tabs-window v-model="settingTab">
        <v-tabs-window-item value="one">
          <GenerationsTable :generations="generations" :loading="loadGenerations" :search="searchGenerations" @create="openCreateGeneration" @edit="openEditGeneration" />
        </v-tabs-window-item>

        <!-- <v-tabs-window-item value="two"> Two </v-tabs-window-item>
        <v-tabs-window-item value="three"> Three </v-tabs-window-item> -->
      </v-tabs-window>
    </v-card-text>
  </v-card>

  <GenerationCreateDialog v-model="createGenerationDialog" @submit="onCreateGeneration" />
  <GenerationUpdateDialog v-model="updateGenerationDialog" :edit-item="editGeneration" @submit="onUpdateGeneration(editGeneration!.id, $event)" />
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { ref } from "vue"

import GenerationCreateDialog from "@/components/settings/GenerationCreateDialog.vue"
import GenerationsTable from "@/components/settings/GenerationsTable.vue"
import GenerationUpdateDialog from "@/components/settings/GenerationUpdateDialog.vue"
import BreadCrumbs from "@/components/shared/BreadCrumbs.vue"
import PanelHeaderOptions from "@/components/shared/PanelHeaderOptions.vue"
import { useSettingsPageStore } from "@/store/views/settingsPage"

const { links, createGenerationDialog, generations, loadGenerations, searchGenerations, settingTab, updateGenerationDialog, editGeneration } = storeToRefs(useSettingsPageStore())
const { openCreateGeneration, onCreateGeneration, openEditGeneration, onUpdateGeneration } = useSettingsPageStore()
</script>
