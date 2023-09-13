<script lang="ts" setup>

import { useRideStore } from 'stores/ride-store'
import { computed } from 'vue'
import { AcceptedRide } from 'src/models/ride'

const rs = useRideStore()

// calculated after a short consultation with ChatGPT
const co2Saved = computed<number>(() =>
  rs.completedRides.reduce((acc: number, current: AcceptedRide) => acc + current.CarpoolDuration, 0) * 0.148
)

</script>

<template>

  <div class="card co2-saved">

    <div class="ride-count__stat">
      <q-icon color="secondary" name="las la-leaf" size="48px"/>
      <span>CO<sub>2</sub> Kg Saved</span>
      <section class="co2__kgs">
        <span class="rc__stat__figure">{{ co2Saved.toFixed(0) }}</span>
      </section>
    </div>

    <div class="co2-saved__equivalence">

      <div class="co2-saved__equivalence__header">CO<sub>2</sub> Footprint</div>

      <div class="co2-saved__equivalence__item">
        <span class="co2-saved__equivalence__sym">≈</span>
        <span>{{ (co2Saved / 0.06).toFixed(0) }}</span>
        <q-icon color="secondary" name="las la-apple-alt" size="32px"/>
      </div>

      <!--    https://www.co2everything.com/co2e-of/coffee-->
      <div class="co2-saved__equivalence__item">
        <span class="co2-saved__equivalence__sym">≈</span>
        <span>{{ (co2Saved / 0.4).toFixed(0) }}</span>
        <q-icon color="secondary" name="las la-coffee" size="32px"/>
      </div>
    </div>

  </div>

</template>

<style lang="scss" scoped>

@import "src/css/quasar.variables.scss";

.co2-saved {
  height: 300px;
  max-width: 200px;
  display: flex;
  flex-grow: 2;
  flex-direction: column;
  padding: 16px;
  gap: 24px;
  justify-content: space-between;
  align-items: center;
  color: $secondary;
}

.ride-count__stat {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  display: flex;
}

.rc__stat__figure {
  border-radius: 100%;
  height: 32px;
  width: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $secondary-container;
  font-family: "Roboto Mono", monospace;
}

.co2__kgs {
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
}

.co2-saved__equivalence {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.co2-saved__equivalence__header {
  margin-bottom: 8px;
}

.co2-saved__equivalence__item {
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4px;
  display: flex;
  color: $secondary;
  font-family: "Roboto Mono", monospace;
  font-size: medium;
}

.co2-saved__equivalence__sym {
  font-size: large;
  padding-right: 4px;
}

</style>
