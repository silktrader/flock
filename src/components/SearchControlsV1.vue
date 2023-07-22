<template>

  <section id="summary" class="shadow-6">

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
