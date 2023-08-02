<template>

  <section id="summary">

    <div class="locations-controls">

      <aside class="locations-indicators">
        <q-icon name="trip_origin" size="sm"/>
        <div class="route"></div>
        <q-icon name="location_on" size="sm"/>

      </aside>

      <div :style="`flex-direction:${isSapDestination ?  `column` : 'column-reverse'}`"
           class="locations-boxes">

        <q-btn class="location-button">
          <div class="location-button-labels">
            <span v-if="otherPlace.Label !== ''">{{ otherPlace.Label }}</span>
            <span class="address">{{ otherPlace.Address }}</span>
          </div>
        </q-btn>

        <q-btn class="location-button" @click="selectSapLocation()">
          <div class="location-button-labels">
            <span>{{ sapienzaPlace.Label }}</span>
            <span class="address">{{ sapienzaPlace.Address }}</span>
          </div>
          <!--          <q-img fit="scale-down" src="/src/assets/SapLogo.png" width="32px"/>-->
          <q-icon class="sapienza-icon" name="school" size="sm"/>
        </q-btn>

      </div>

      <aside class="locations-switch">
        <q-btn color="primary" flat icon="swap_vert" round size="xl" @click="switchLocations()"/>
      </aside>

    </div>

    <section class="date-time-controls">
      <q-btn class="outline-button" outline @click="selectDate()">
        <span v-if="wantsArrive">Arrive {{ searchDateLabel }} by {{ searchTimeLabel }}</span>
        <span v-else>Leave {{ searchDateLabel }} at {{ searchTimeLabel }}</span>
        <q-icon name="schedule" size="18px"/>
      </q-btn>

      <q-btn class="outline-button" outline>
        <span>Filters</span>
        <!--        <q-icon name="las la-filter"/>-->
      </q-btn>

      <!--      <div class="pickup-time">-->
      <!--        <span>Pickup Time</span>-->
      <!--        <q-btn-toggle-->
      <!--          v-model="maxPickupTime"-->
      <!--          :options="pickupOptions"-->
      <!--          class="pickup-time-toggle"-->
      <!--          no-caps-->
      <!--          no-wrap-->
      <!--          toggle-color="primary"-->
      <!--          toggle-text-color="light-green-10"-->
      <!--        />-->
      <!--      </div>-->
    </section>

  </section>

</template>

<script lang="ts" setup>

import { useRideStore } from 'stores/ride-store'
import { computed, ref } from 'vue'
import { DateMode, ExtractTime, FormatShortDate } from 'src/tools/date-tools'
import { useRouter } from 'vue-router'

const rs = useRideStore()
const router = useRouter()

const isSapDestination = ref<boolean>(true)
const sapienzaPlace = computed(() => isSapDestination.value ? rs.searchParameters.Destination : rs.searchParameters.Origin)
const otherPlace = computed(() => isSapDestination.value ? rs.searchParameters.Origin : rs.searchParameters.Destination)
const wantsArrive = computed<boolean>(() => rs.searchParameters.DateMode === DateMode.Arrive)

const searchTimeLabel = computed<string>(() => ExtractTime(rs.searchParameters.Date))
const searchDateLabel = computed<string>(() => FormatShortDate(rs.searchParameters.Date))

// const maxPickupTime = ref<number>(10)
// const pickupOptions: ReadonlyArray<{ label: string, value: number }> = [{
//   label: '10',
//   value: 10
// }, {
//   label: '20',
//   value: 20
// }, {
//   label: '30',
//   value: 30
// }]

function switchLocations (): void {
  const {
    Origin: oldOrigin,
    Destination: oldDestination
  } = rs.searchParameters

  isSapDestination.value = !isSapDestination.value
  rs.setDestination(oldOrigin)
  rs.setOrigin(oldDestination)
}

function selectDate (): void {
  router.push('/date-select')
}

function selectSapLocation (): void {
  router.push(`/sap-location-select/destination=${isSapDestination.value}`)
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
}

.location-button-labels {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-grow: 3;
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
  display: flex;
  flex-direction: row;
  font-size: medium;
  justify-content: space-between;
}

.pickup-time {
  display: flex;
  flex-direction: row;
  text-wrap: none;
  align-items: center;
  gap: 8px;
}

.time em {
  font-weight: bold;
}

</style>
