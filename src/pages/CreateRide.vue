<template>
  <q-page class="column">
    <header class="modal-header">
      <!--      <q-btn aria-label="Back" flat icon="arrow_back" size="lg" @click="router.go(-1)"/>-->
      <div class="modal-header-spacer"/>
      <section class="modal-header-title">
        <span style="padding-right: 1em; font-weight: bolder;">Drive Creation</span>
        <!--        <span class="modal-header-subtitle">Results</span>-->
      </section>
      <section>
        <q-btn aria-label="Close" flat icon="close" size="lg" @click="abort()"/>
      </section>
    </header>
    <q-separator/>
    <div class="column general-container ">
      <div class="instruction">Where do you leave from? </div>
      <q-btn class="place-button" align="left" @click="selectOrigin()" icon="search">Choose your initial location</q-btn>
    </div>
  </q-page>
</template>

<script lang="ts" setup>

import { useRideStore } from 'stores/ride-store'
import { computed } from 'vue'
import { DateMode, ExtractTime, FormatShortDate } from 'src/tools/date-tools'
import { useRouter } from 'vue-router'
import { isSapienzaPlace } from 'src/models/place'

const router = useRouter()

function selectOrigin (): void {
  router.push('/rides/search/location-select/origin/drive')
}

function abort (): void {
  router.push('/')
}

</script>

<style  lang="scss" scoped>
@import "src/css/quasar.variables.scss";

</style>
