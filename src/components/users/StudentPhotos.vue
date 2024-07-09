<template>
  <template v-if="photos.length">
    <div v-for="(photo, index) of photos" :key="index">
      <v-img :src="photoUrl(photo)" lazy-src="https://miro.medium.com/max/1080/0*DqHGYPBA-ANwsma2.gif" :alt="`foto_${photo.id}`" height="300" style="position: relative" @click="showPhoto(index)">
        <v-menu v-model="fab.items[index]">
          <template v-slot:activator="{ props }">
            <v-btn icon style="position: absolute; bottom: 0; right: 0; margin: 10px" color="primary" v-bind="props"
              ><v-icon v-if="fab.items[index]"> mdi-close </v-icon> <v-icon v-else> mdi-camera </v-icon></v-btn
            >
          </template>

          <v-list>
            <v-list-item :href="photoUrl(photo)" target="_blank" @click.stop="">
              <template v-slot:prepend>
                <v-icon color="green">mdi-download</v-icon>
              </template>

              <v-list-item-title>Descargar</v-list-item-title>
            </v-list-item>
            <v-list-item @click="$emit('remove', photo)">
              <template v-slot:prepend>
                <v-icon color="red">mdi-delete</v-icon>
              </template>

              <v-list-item-title>Eliminar</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-img>
    </div>
  </template>
  <template v-else>
    <div>
      <v-sheet class="pa-10" color="primary" height="100%">
        <v-row class="fill-height" align="center" justify="center">
          <div class="text-h2">Sin foto</div>
        </v-row>
      </v-sheet>
    </div>
  </template>

  <!-- <v-carousel v-if="photos.length" v-model="corousel" hide-delimiters show-arrows="hover" height="300px">
    <v-carousel-item v-for="(photo, index) of photos" :key="index">
      <v-img :src="photoUrl(photo)" lazy-src="https://miro.medium.com/max/1080/0*DqHGYPBA-ANwsma2.gif" :alt="`foto_${photo.id}`" height="300" style="position: relative" @click="showPhoto(index)">
        <v-menu v-model="fab.items[index]">
          <template v-slot:activator="{ props }">
            <v-btn icon style="position: absolute; bottom: 0; right: 0; margin: 10px" color="primary" v-bind="props"
              ><v-icon v-if="fab.items[index]"> mdi-close </v-icon> <v-icon v-else> mdi-camera </v-icon></v-btn
            >
          </template>

          <v-list>
            <v-list-item :href="photoUrl(photo)" target="_blank" @click.stop="">
              <template v-slot:prepend>
                <v-icon color="green">mdi-download</v-icon>
              </template>

              <v-list-item-title>Descargar</v-list-item-title>
            </v-list-item>
            <v-list-item @click="$emit('remove', photo)">
              <template v-slot:prepend>
                <v-icon color="red">mdi-delete</v-icon>
              </template>

              <v-list-item-title>Eliminar</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-img>
    </v-carousel-item>
  </v-carousel>
  <v-carousel v-else v-model="corousel" hide-delimiters height="300px" :show-arrows="false">
    <v-carousel-item>
      <v-sheet color="primary" height="100%">
        <v-row class="fill-height" align="center" justify="center">
          <div class="text-h2">Sin foto</div>
        </v-row>
      </v-sheet>
    </v-carousel-item>
  </v-carousel> -->
</template>
<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/yup"
import { PublicPathState, useForm } from "vee-validate"
import { PropType, ref } from "vue"
import * as yup from "yup"

import { Photo } from "@/grapqhl"

import { FILE_URL } from "../../../constants"

const props = defineProps({
  modelValue: { type: Boolean, default: () => false },
  loading: { type: Boolean, default: () => false },
  photos: { type: Array as PropType<Photo[]>, default: () => [] },
  userId: { type: Number, required: true },
})

const corousel = ref(null)
const carouselDialog = ref(false)
const corouselFull = ref<null | number>(null)
const fab = ref<{ items: boolean[] }>({ items: [] })

defineEmits<{
  "update:modelValue": [value: boolean]
  submit: []
  remove: [photo: Photo]
}>()

const photoUrl = (photo: Photo) => {
  const url = `${FILE_URL}user/api/files/users/${props.userId}/images?s3=${photo.id}`
  return url
}

const showPhoto = (index: number) => {
  corouselFull.value = index
  carouselDialog.value = true
}
</script>

<style scoped lang="scss"></style>
