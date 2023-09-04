<script lang="ts" setup>

import { useRideStore } from 'stores/ride-store'
import { computed } from 'vue'

const rs = useRideStore()

const ridesCount = computed<number>(() => rs.completedRides.length)

</script>

<template>

  <div class="card ride-count">

    <img src="/src/assets/car.png"/>

    <div class="ride-count__stat">
      <span>Rides</span>
      <span class="rc__stat__figure">{{ ridesCount }}</span>
    </div>

  </div>

</template>

<style lang="scss" scoped>

@import "src/css/quasar.variables.scss";

.ride-count {
  height: 150px;
  flex-grow: 1;
  background-color: #B1C7FC;
  display: flex;
  flex-direction: column;
  padding: 16px;
  justify-content: space-between;

  img {
    width: 80px;
    object-fit: contain;
  }
}

.ride-count__stat {
  flex-direction: row;
  align-items: center;
  gap: 8px;
  font-size: large;
  color: black;
  display: flex;
  align-self: flex-end;
}

.stat-value {
  //border: 1px solid black;
  border-radius: 100%;
  height: 32px;
  width: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  //background-color: $tertiary-container;
  //color: $on-tertiary-container;
  background-color: #062D89;
  color: #B1C7FC;
  font-weight: bold;
}

</style>
