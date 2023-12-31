<template>

  <section id="summary">

    <div class="locations-controls">

      <aside class="locations-indicators">
        <q-icon name="trip_origin" size="sm"/>
        <div class="route"></div>
        <q-icon name="location_on" size="sm"/>

      </aside>

      <div class="locations-boxes">

        <q-btn class="location-button" @click="selectOrigin()">
          <div class="location-button-container">
            <div class="location-button-labels">
              <template v-if="origin.Label !== ''">
                <span class="label">{{ origin.Label }}</span>
                <span class="address">{{ origin.Address }}</span>
              </template>
              <span v-else class="label">{{ origin.Address }}</span>
            </div>
            <q-icon v-if="isSapienzaPlace(origin)" class="sapienza-icon" name="school" size="sm"/>
          </div>
        </q-btn>

        <q-btn class="location-button" @click="selectDestination()">
          <div class="location-button-container">
            <div class="location-button-labels">
              <template v-if="destination.Label !== ''">
                <span class="label">{{ destination.Label }}</span>
                <span class="address">{{ destination.Address }}</span>
              </template>
              <span v-else class="label">{{ destination.Address }}</span>
            </div>
            <q-icon v-if="isSapienzaPlace(destination)" class="sapienza-icon" name="school" size="sm"/>
          </div>
        </q-btn>

        <q-btn class="switch-button" icon="las la-arrows-alt-v" @click="switchLocations()"/>

      </div>

      <!--      <aside class="locations-switch">-->
      <!--       -->
      <!--      </aside>-->

    </div>

    <section class="date-time-controls">
      <q-btn class="outline-button" @click="selectDate()">
        <span>{{ dateLabel }}</span>
        <q-icon name="schedule" size="18px"/>
      </q-btn>

      <q-btn class="outline-button" @click="editFilters()">
        <span>Filters</span>
      </q-btn>

    </section>

  </section>

</template>

<script lang="ts" setup>

import { useRideStore } from 'stores/ride-store'
import { computed } from 'vue'
import { DateMode, ExtractTime, FormatShortDate } from 'src/tools/date-tools'
import { useRouter } from 'vue-router'
import { isSapienzaPlace } from 'src/models/place'
import { LocationMode, useLocationStore } from 'stores/location-store'
import { useUserStore } from 'stores/user-store'

const router = useRouter()
const rs = useRideStore()
const ls = useLocationStore()
const us = useUserStore()

const origin = computed(() => rs.searchParameters.Origin)
const destination = computed(() => rs.searchParameters.Destination)

const dateLabel = computed<string>(() => {
  const date = rs.searchParameters.Date
  const modeModifiers = rs.searchParameters.DateMode === DateMode.Arrive ? ['Arrive', 'by'] : ['Leave', 'at']
  return `${modeModifiers[0]} ${FormatShortDate(date)} ${modeModifiers[1]} ${ExtractTime(date)}`
})

function switchLocations (): void {
  // mock round trip to database
  rs.mockSearchDelay()
  rs.updateParameters({
    Destination: rs.searchParameters.Origin,
    Origin: rs.searchParameters.Destination
  })
}

function selectDate (): void {
  router.push('/rides/search/date-select')
}

function editFilters (): void {
  router.push('/rides/search/filters')
}

function selectDestination (): void {
  ls.setLocationMode(LocationMode.SearchDestination)
  if (us.options.debug.combinedLocation) {
    router.push('/rides/search/location')
  } else {
    router.push(`/rides/search/${isSapienzaPlace(destination.value) ? 'sap-location-select' : 'location-select'}/destination/ride`)
  }
}

function selectOrigin (): void {
  ls.setLocationMode(LocationMode.SearchOrigin)
  if (us.options.debug.combinedLocation) {
    router.push('/rides/search/location')
  } else {
    router.push(`/rides/search/${isSapienzaPlace(origin.value) ? 'sap-location-select' : 'location-select'}/origin/ride`)
  }
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
  min-width: 0;
}

.location-button {
  display: flex;
  flex-direction: row;
  font-size: medium;
  border-radius: $border-radius;
  background-color: $primary;
  color: $on-primary;
  cursor: pointer;
  text-transform: none;
  font-weight: normal;
  min-height: 60px;
}

.location-button::before {
  box-shadow: none !important;
}

.location-button-container {
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  flex: 1;
}

.location-button-labels {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  font-size: large;
}

.label, .address {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.address {
  font-size: medium;
  font-style: italic;
  padding-right: 2px; // solves issues with overflow clipping content
}

.sapienza-icon {
  color: $on-primary;
}

.switch-button {
  -webkit-font-smoothing: antialiased;
  position: absolute;
  right: 16px;
  top: 120px;
  height: 40px;
  width: 40px;
  padding-right: 4px;
  font-size: 16px;
  color: $primary;
  background-color: $secondary-container;
  text-transform: none;
  border-radius: 50px !important;
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.switch-button::before {
  box-shadow: none !important;
}

.route {
  position: relative;
  background-image: url(//maps.gstatic.com/consumer/images/icons/1x/route_3dots_grey650_24dp.png);
  height: 32px;
  background-repeat: repeat-y;
}

.locations-switch {
  display: flex;
  justify-content: center;
}

.date-time-controls {
  display: flex;
  flex-direction: row;
  font-size: medium;
  justify-content: space-between;
}

.time em {
  font-weight: bold;
}

</style>
