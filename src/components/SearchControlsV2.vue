<template>

  <section id="summary" class="shadow-6">

    <div class="locations-controls">

      <div class="locations">

        <div class="origin">
          <q-icon name="trip_origin" size="sm"/>
          <div class="origin-details">
            <span v-if="rs.rideParameters.Origin.Label !== ''">{{ rs.rideParameters.Origin.Label }}</span>
            <span class="address">{{ rs.rideParameters.Origin.Address }}</span>
          </div>
        </div>

        <div class="route"></div>

        <div class="destination">
          <q-icon name="location_on" size="sm"/>
          <div class="destination-details">
            <span>{{ destination.Label }}</span>
            <span class="address">{{ destination.Address }}</span>
          </div>
        </div>

      </div>

      <aside class="switch">
        <q-btn flat icon="swap_vert" round size="lg" @click="switchLocations()"/>
      </aside>

    </div>

    <div class="time">Arriving <em>{{ arriveByDate }}</em> by <em>{{ arriveByTime }}</em></div>
  </section>

</template>

<script lang="ts" setup>

import { useRideStore } from 'stores/ride-store'
import { computed } from 'vue'
import { ExtractTime, FormatFriendlyDate } from 'src/tools/date-tools'

const rs = useRideStore()

const arriveByTime = computed<string>(() => rs.rideParameters?.ArriveBy ? ExtractTime(rs.rideParameters.ArriveBy) : '')
const arriveByDate = computed<string>(() => rs.rideParameters?.ArriveBy ? FormatFriendlyDate(rs.rideParameters.ArriveBy) : '')

const destination = computed(() => rs.rideParameters.Destination)

function switchLocations (): void {
  const {
    Origin: oldOrigin,
    Destination: oldDestination
  } = rs.rideParameters

  rs.setDestination(oldOrigin)
  rs.setOrigin(oldDestination)
  rs.updateSearch()
}

</script>

<style lang="scss" scoped>

@import "src/css/quasar.variables.scss";

#summary {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
  background-color: $secondary;
  color: $on-secondary;
}

.locations-controls {
  display: flex;
  gap: 16px;
  align-items: center;
}

.locations {
  display: flex;
  flex-direction: column;
}

.destination, .origin {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: medium;
  height: 2rem;
}

.route {
  position: relative;
  background-image: url(//maps.gstatic.com/consumer/images/icons/1x/route_3dots_grey650_24dp.png);
  height: 32px;
  background-repeat: repeat-y;
}

.destination-details, .origin-details {
  display: flex;
  flex-direction: column;
}

.address {
  font-size: xx-small;
  font-style: italic;
}

.time {
  font-size: medium;
}

.time em {
  font-weight: bold;
}

</style>
