<template>

  <section id="summary">

    <div class="locations-controls">

      <aside class="locations-indicators">
        <q-icon name="trip_origin" size="sm"/>
        <div class="route"></div>
        <q-icon name="location_on" size="sm"/>

      </aside>

      <div class="locations-boxes">

        <div class="origin">
          <div class="origin-details">
            <span v-if="rs.searchParameters.Origin.Label !== ''">{{ rs.searchParameters.Origin.Label }}</span>
            <span class="address">{{ rs.searchParameters.Origin.Address }}</span>
          </div>
        </div>

        <div class="destination">
          <div class="destination-details">
            <span>{{ destination.Label }}</span>
            <span class="address">{{ destination.Address }}</span>
          </div>
        </div>
      </div>

      <aside class="locations-switch">
        <q-btn color="primary" flat icon="swap_vert" round size="xl" @click="switchLocations()"/>
      </aside>

    </div>

    <section class="date-time-controls">
      <q-btn class="outline-button" outline @click="selectDate()">
        <span v-if="rs.searchParameters.DateMode === DateMode.Arrive">Arrive {{ searchDateLabel }} by {{
            searchTimeLabel
          }}</span>
        <span v-else>Leave {{ searchDateLabel }} at {{ searchTimeLabel }}</span>
        <q-icon name="schedule" size="18px"/>
      </q-btn>
    </section>
  </section>

</template>

<script lang="ts" setup>

import { useRideStore } from 'stores/ride-store'
import { computed } from 'vue'
import { DateMode, ExtractTime, FormatShortDate } from 'src/tools/date-tools'
import { useRouter } from 'vue-router'

const rs = useRideStore()
const router = useRouter()

const destination = computed(() => rs.searchParameters.Destination)

const searchTimeLabel = computed<string>(() => ExtractTime(rs.searchParameters.Date))
const searchDateLabel = computed<string>(() => FormatShortDate(rs.searchParameters.Date))

function switchLocations (): void {
  const {
    Origin: oldOrigin,
    Destination: oldDestination
  } = rs.searchParameters

  rs.setDestination(oldOrigin)
  rs.setOrigin(oldDestination)
}

function selectDate (): void {
  router.push('/date-select')
}

</script>

<style lang="scss" scoped>

@import "src/css/quasar.variables.scss";

#summary {
  display: flex;
  flex-direction: column;
  padding: 8px 16px 16px 16px;
  gap: 24px;
  background-color: $secondary-container;
  color: $on-secondary-container;
}

.locations-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.locations-indicators {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 32px;
}

.locations-boxes {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 3;
}

.destination, .origin {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: medium;
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
  padding: 8px 16px 8px 16px;
  width: 100%;
  border-radius: $border-radius;
  background-color: $primary;
  color: $on-primary;
  cursor: pointer;
}

.address {
  font-size: xx-small;
  font-style: italic;
}

.locations-switch {
  display: flex;
  justify-content: center;
  width: 32px;
}

.date-time-controls {
  font-size: medium;
}

.time em {
  font-weight: bold;
}

</style>
