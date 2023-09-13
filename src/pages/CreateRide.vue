<template>
  <q-page class="column">
    <header class="modal-header">
      <q-btn aria-label="Back" flat icon="arrow_back" size="lg" @click="router.go(-1)"/>
      <div class="modal-header-spacer"/>
      <section class="modal-header-title">
        <span style="padding-right: 1em; font-weight: bolder;"></span>
        <!--        <span class="modal-header-subtitle">Results</span>-->
      </section>
      <section>
        <q-btn aria-label="Close" flat icon="close" size="lg" @click="abort()"/>
      </section>
    </header>
    <q-separator/>
    <div class="column general-container ">
      <div class="instruction">Where do you leave from?</div>
      <q-btn align="left" class="place-button" icon="search" @click="selectOrigin()">Choose your initial address</q-btn>
    </div>
    <div style="text-align: center; padding-top:15px;">
      <q-img src="~/assets/start.png" style="max-width: 220px"/>
    </div>
  </q-page>
</template>

<script lang="ts" setup>

import { useDriveStore } from 'src/stores/driveStore'
import { useRouter } from 'vue-router'
import { LocationMode, useLocationStore } from 'stores/location-store'

const router = useRouter()
const ds = useDriveStore()
const ls = useLocationStore()

function selectOrigin (): void {
  ls.setLocationMode(LocationMode.CreateOrigin)
  router.push('/create-ride/location')
}

function abort (): void {
  ds.clearTemporaryDrive()
  router.push('/')
}

</script>

<style lang="scss" scoped>
@import "src/css/quasar.variables.scss";

</style>
