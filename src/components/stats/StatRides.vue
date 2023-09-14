<script lang="ts" setup>

import { useRideStore } from 'stores/ride-store'
import { computed } from 'vue'
import { AcceptedRide } from 'src/models/ride'

const rs = useRideStore()

const ridesCount = computed<number>(() => rs.completedRides.length)

const ridesMinutes = computed<number>(() =>
  rs.completedRides.reduce((acc: number, current: AcceptedRide) => acc + current.CarpoolDuration, 0)
)

</script>

<template>

  <div class="card stat-container">

    <q-icon name="svguse:icons/cars.svg#icon-1" size="48px"/>
    <div class="stat-main">
      <span>Rides Taken</span>
      <span class="stat-value">{{ ridesCount }}</span>
    </div>

  </div>

</template>

<style lang="scss">

@import "src/css/quasar.variables.scss";

.stat-container {
  height: 150px;
  max-width: 200px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 16px;
  justify-content: center;
  align-items: center;
}

.stat-main {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  display: flex;
  color: $on-background;
}

.stat-value {
  border-radius: 100%;
  height: 36px;
  width: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $secondary-container;
  font-family: "Roboto Mono", monospace;
}

</style>
