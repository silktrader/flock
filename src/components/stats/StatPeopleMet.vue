<script lang="ts" setup>

import { useRideStore } from 'stores/ride-store'
import { computed } from 'vue'
import { AcceptedRide } from 'src/models/ride'

const rs = useRideStore()

// count the driver, the passengers and oneself for each past ride
const peopleMet = computed<number>(() =>
  rs.completedRides.reduce((acc: number, current: AcceptedRide) => acc + current.passengers.length, 0)
)

</script>

<template>

  <div class="card stat-container">

    <q-icon color="secondary" name="las la-users" size="48px"/>

    <div class="stat-main">
      <span>People Met</span>
      <span class="stat-value">{{ peopleMet }}</span>
    </div>

  </div>

</template>

<style lang="scss" scoped>

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
  color: $secondary;
}

.stat-value {
  border-radius: 100%;
  height: 32px;
  width: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $secondary-container;
  font-family: "Roboto Mono", monospace;
}

</style>
