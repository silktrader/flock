<template>
  <q-page class="column">
    <header class="modal-header">
      <q-btn aria-label="Back" flat icon="arrow_back" size="lg" @click="router.go(-1)"/>
      <div class="modal-header-spacer"/>
      <section class="modal-header-title">
        <span style="padding-right: 1em; font-weight: bolder;">Starting point</span>
        <!--        <span class="modal-header-subtitle">Results</span>-->
      </section>
      <section>
        <q-btn aria-label="Close" flat icon="close" size="lg" @click="abort()"/>
      </section>
    </header>
    <q-separator/>
    <div class="column general-container ">
      <div class="instruction">Where do you leave from? </div>
      <q-btn class="place-button" align="left" @click="selectOrigin()" icon="search">Choose your initial address</q-btn>
    </div>
    <div style="text-align: center; padding-top:15px;">
      <q-img src="~/assets/start.png" style="max-width: 220px"/>
    </div>
  </q-page>
</template>

<script lang="ts" setup>

import { useDriveStore } from 'src/stores/driveStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const ds = useDriveStore()

function selectOrigin (): void {
  router.push('/rides/search/location-select/origin/drive')
}

function abort (): void {
  ds.clearTemporaryDrive()
  router.push('/')
}

</script>

<style  lang="scss" scoped>
@import "src/css/quasar.variables.scss";

</style>
