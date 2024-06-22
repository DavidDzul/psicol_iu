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
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { computed } from "vue"

import BreadCrumbs from "@/components/shared/BreadCrumbs.vue"
import StudentDetailList from "@/components/users/StudentDetailList.vue"
import { useStudentDetailsPageStore } from "@/store/views/studentDetailsPage"
const { links, selectedUser, studentState } = storeToRefs(useStudentDetailsPageStore())
</script>
