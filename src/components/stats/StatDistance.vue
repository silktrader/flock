<script lang="ts" setup>

import { useRideStore } from 'stores/ride-store'
import { computed } from 'vue'
import { AcceptedRide } from 'src/models/ride'

const rs = useRideStore()

// ChatGPT suggests 0.5 kms per minute in an urban environment with an average sized car
const kmsTravelled = computed<number>(() =>
  rs.completedRides.reduce((acc: number, current: AcceptedRide) => acc + current.CarpoolDuration, 0) * 0.5
)

</script>

<template>

  <div class="card stat-container">

    <q-icon name="rocket_launch" size="44px"/>
    <div class="stat-main">
      <span>Km Travelled</span>
      <span class="stat-value">{{ kmsTravelled.toFixed(0) }}</span>
    </div>

  </div>

</template>

<style lang="scss" scoped>

</style>
