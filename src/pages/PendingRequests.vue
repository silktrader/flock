<script lang="ts" setup>

import { useRideStore } from 'stores/ride-store'
import { RequestedRide, Ride } from 'src/models/ride'
import { computed } from 'vue'
import { ExtractDate, ExtractTime } from '../tools/date-tools'
import { useNavigationStore } from 'stores/navigation-store'

const rs = useRideStore()
const ns = useNavigationStore()

const requests = computed<Array<RequestedRide>>(
  () => [...rs.requestedRides].sort((a, b) => a.requested > b.requested ? 1 : -1)
)

function viewRide (ride: Ride): void {
  rs.selectRide(ride)
  ns.goDetailsPage()
}

function closeModal (): void {
  ns.goBack()
}

</script>

<template>

  <main class="container">

    <header class="secondary-header">
      <q-btn aria-label="Back" flat icon="arrow_back" size="lg" @click="closeModal()"/>
      <section class="secondary-header-title">
        <span>Pending Ride Requests</span>
      </section>
    </header>

    <q-list padding>

      <q-item v-for="ride in requests" :key="ride.id" v-ripple class="request" clickable @click="viewRide(ride)">
        <q-item-section avatar>
          <q-avatar size="60px">
            <img :src="ride.driver.avatarUrl" alt="Driver's Avatar"/>
          </q-avatar>
        </q-item-section>
        <q-item-section class="pr__details">

          <div class="request-date">
            <span>{{ ExtractDate(ride.pickup.Date) }}</span>
            <span class="request-date-hour"><q-icon name="schedule"/>{{ ExtractTime(ride.pickup.Date) }}</span>
          </div>
          <div class="request-address">
            <span>{{ ride.pickup.Address }}</span>
            <q-icon name="arrow_right_alt" size="xs"/>
            <span>{{ ride.destination.Address }}</span>
          </div>

          <!--          <div class="request-timestamp">-->
          <!--            <span>req. {{ FormatShortDate(ride.requested!) }}</span>-->
          <!--          </div>-->

        </q-item-section>
      </q-item>

    </q-list>

  </main>

</template>

<style lang="scss" scoped>
@import "src/css/quasar.variables.scss";

.request {
  font-size: medium;
  color: $on-surface-variant;
  margin-top: 16px;
  margin-bottom: 16px;
}

.pr__details {
  display: flex;
  gap: 8px;
}

.request-date {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: medium;
  font-weight: bold;
}

.request-date-hour {
  display: flex;
  gap: 4px;
  align-items: center;
  font-weight: normal;
  font-size: small;
}

.request-address {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: small;

  span {
    display: inline-block;
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.request-timestamp {
  color: $dark;
  font-size: small;
  font-style: italic;
}

</style>
