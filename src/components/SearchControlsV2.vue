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
            <!--          <q-img fit="scale-down" src="/src/assets/SapLogo.png" width="32px"/>-->
            <q-icon v-if="isSapienzaPlace(destination)" class="sapienza-icon" name="school" size="sm"/>
          </div>
        </q-btn>

      </div>

      <aside class="locations-switch">
        <q-btn color="primary" flat icon="swap_vert" round size="xl" @click="switchLocations()"/>
      </aside>

    </div>

    <section class="date-time-controls">
      <q-btn class="outline-button" @click="selectDate()">
        <span v-if="wantsArrive">Arrive {{ searchDateLabel }} by {{ searchTimeLabel }}</span>
        <span v-else>Leave {{ searchDateLabel }} at {{ searchTimeLabel }}</span>
        <q-icon name="schedule" size="18px"/>
      </q-btn>

      <q-btn class="outline-button" @click="editFilters()">
        <span>Filters</span>
        <!--        <q-icon name="las la-filter"/>-->
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

const rs = useRideStore()
const router = useRouter()

const origin = computed(() => rs.searchParameters.Origin)
const destination = computed(() => rs.searchParameters.Destination)
const wantsArrive = computed<boolean>(() => rs.searchParameters.DateMode === DateMode.Arrive)

const searchTimeLabel = computed<string>(() => ExtractTime(rs.searchParameters.Date))
const searchDateLabel = computed<string>(() => FormatShortDate(rs.searchParameters.Date))

function switchLocations (): void {
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
  router.push(`/rides/search/${isSapienzaPlace(destination.value) ? 'sap-location-select' : 'location-select'}/destination`)
}

function selectOrigin (): void {
  router.push(`/rides/search/${isSapienzaPlace(origin.value) ? 'sap-location-select' : 'location-select'}/origin`)
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
}

.label, .address {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.address {
  font-size: small;
  font-style: italic;
  padding-right: 2px; // solves issues with overflow clipping content
}

.sapienza-icon {
  color: $on-primary;
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
  width: 32px;
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
