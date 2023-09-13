<template>
    <q-page class="column">
      <header class="modal-header">
        <q-btn aria-label="Back" flat icon="arrow_back" size="lg" @click="router.go(-2)"/>
        <div class="modal-header-spacer"/>
        <section class="modal-header-title">
          <span style="padding-right: 1em; font-weight: bolder;">Destination</span>
          <!--<span class="modal-header-subtitle">Results</span>-->
        </section>
        <section>
          <q-btn aria-label="Close" flat icon="close" size="lg" @click="abort"/>
        </section>
      </header>
      <q-separator/>
      <div class="column general-container ">
        <div class="instruction" style="text-align: left;">Where are you going? </div>
        <q-btn class="place-button" align="left" icon="search" @click="selectDest()">Choose your destination address</q-btn>
      </div>
      <div style="text-align: center; padding-top:15px;">
        <q-img src="~/assets/end.png" style="max-width: 280px"/>
      </div>
    </q-page>
  </template>
\
<script lang="ts" setup>

import { useRouter } from 'vue-router'

const router = useRouter()

function abort (): void {
  router.push('/')
}

function selectDest (): void {
  router.push('/rides/search/location-select/destination/drive')
}

</script>

<style  lang="scss" scoped>
@import "src/css/quasar.variables.scss";

</style>
