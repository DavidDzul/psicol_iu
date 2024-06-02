<template>
  <v-data-table density="comfortable" :headers="headers" :items="users" class="elevation-1 overflow-auto" :loading="loading" :search="search" item-value="id">
    <template v-slot:top>
      <v-toolbar :flat="true">
        <v-toolbar-title>Lista de Becarios</v-toolbar-title>
        <v-divider class="mx-4" :inset="true" :vertical="true"></v-divider>
        <v-text-field v-model="search" hide-details prepend-icon="mdi-magnify" density="compact" single-line label="Buscar (Nombre, Apellido, Email)" :clearable="true"></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="primary" class="mb-2" @click="$emit('create')"> Nuevo Usuario </v-btn>
      </v-toolbar>
    </template>

    <template #[`item.actions`]="{ item }">
      <div style="width: 100%">
        <v-tooltip location="bottom" text="Configurar Usuario">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" color="blue" size="small" density="comfortable" icon="mdi-cog" class="mr-2" @click="$emit('configureItem', item.id)"> </v-btn>
          </template>
        </v-tooltip>
        <v-tooltip location="bottom" text="Ver detalles">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" color="primary" size="small" density="comfortable" icon="mdi-eye" class="mr-2" :to="`/usuarios/${item.id}`"> </v-btn>
          </template>
        </v-tooltip>
        <v-tooltip location="bottom" text="Editar">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" color="warning" size="small" density="comfortable" icon="mdi-pencil" class="mr-2" @click="$emit('edit', item.id)"> </v-btn>
          </template>
        </v-tooltip>
        <v-tooltip location="bottom" :text="item.active ? 'Desactivar Usuario' : 'Activar Usuario'">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              :color="item.active ? 'error' : 'success'"
              size="small"
              density="comfortable"
              :icon="item.active ? 'mdi-account-cancel' : 'mdi-account-check'"
              class="mr-2"
              @click="item.active ? $emit('deactivate', item.id) : $emit('activate', item.id)"
            >
            </v-btn>
          </template>
        </v-tooltip>
        <v-tooltip location="bottom" text="Eliminar Usuario">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" color="error" size="small" density="comfortable" icon="mdi-delete" class="mr-2" @click="$emit('remove', item.id)"> </v-btn>
          </template>
        </v-tooltip>
      </div>
    </template>
    <template #no-data> No existen usuarios registrados </template>
  </v-data-table>
</template>
<script setup lang="ts">
import { computed, PropType, ref } from "vue"

import { CreateUserInput, User } from "@/grapqhl"

const props = defineProps({
  users: { type: Array as PropType<User[]>, default: () => [] },
  loading: { type: Boolean, default: () => false },
})

defineEmits<{
  create: []
  edit: [id: number]
  remove: [id: number]
  activate: [id: number]
  deactivate: [id: number]
  configureItem: [id: number]
}>()

const search = ref("")

const headers = computed(
  () =>
    [
      {
        title: "ID",
        align: "start",
        key: "id",
      },
      {
        title: "Nombre",
        key: "firstName",
      },
      { title: "Apellidos", key: "lastName" },
      { title: "Email", key: "email" },
      {
        title: "Activo",
        key: "active",
      },
      {
        title: "Opciones",
        key: "actions",
        sortable: false,
        align: "center",
      },
    ] as never,
)
</script>
