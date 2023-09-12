<script lang="ts" setup>

import { useRideStore } from 'stores/ride-store'
import { computed } from 'vue'
import { AcceptedRide } from 'src/models/ride'

const rs = useRideStore()

const moneySaved = computed<number>(() => {
  // calculate the distance travelled assuming 0.5 kms travelled per minute
  const distance = rs.completedRides.reduce((acc: number, current: AcceptedRide) => acc + current.CarpoolDuration, 0) * 0.5

  // calculate carpooling expenses
  // const cost = rs.completedRides.reduce((acc: number, current: AcceptedRide) => acc + current.expense, 0)

  // estimate the cost per km, as per ChatGPT suggestion
  return distance * 0.085
}
)

</script>

<template>

  <div class="card stat-container">

    <q-icon color="secondary" name="las la-gas-pump" size="48px"/>
    <div class="stat-main">
      <span>Euro Saved</span>
      <span class="stat-value">{{ moneySaved.toFixed(0) }}</span>
    </div>

  </div>

</template>

<style lang="scss" scoped>

</style>
