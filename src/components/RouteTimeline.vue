<script lang="ts" setup>

import { Transport } from 'stores/ride-store'
import { ExtractTime } from 'src/tools/date-tools'
import { Ride } from 'src/models/ride'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{ ride: Ride }>()

</script>

<template>

  <q-timeline class="rt" color="secondary" layout="dense">

    <q-timeline-entry color="tertiary" icon="location_on">

      <!-- Departure -->
      <template v-slot:title>
        <div class="rt__header">
          <span>{{ ride.Origin.Address }}</span>
          <span class="rt__header__time">
                <q-icon name="schedule" size="sm"/>{{ ExtractTime(ride.Departure) }}
              </span>
        </div>
      </template>

      <div class="rt__instruction rt__instruction--shuttle">
        <template v-if="ride.Pickup.Transport === Transport.None">
          <q-icon name="directions_walk" size="sm"/>
          <span>Walk for {{ ride.PickupDuration }} min.</span>
        </template>
        <template v-if="ride.Pickup.Transport === Transport.Subway">
          <q-icon name="subway" size="sm"/>
          <span>Ride {{ ride.Pickup.TransportId }} for {{ ride.PickupDuration }} min.</span>
        </template>
        <template v-if="ride.Pickup.Transport === Transport.Bus">
          <q-icon name="directions_bus" size="sm"/>
          <span>Ride bus <small>#</small>{{ ride.Pickup.TransportId }} for {{
              ride.PickupDuration
            }} min.</span>
        </template>
      </div>

    </q-timeline-entry>

    <!-- Pickup -->
    <q-timeline-entry :avatar="ride.Driver.avatarUrl" color="yellow-7">
      <template v-slot:title>
        <div class="rt__header">
          <span>{{ ride.Pickup.Address }}</span>
          <span class="rt__header__time"><q-icon name="schedule" size="sm"/>{{
              ExtractTime(ride.Pickup.Date)
            }}</span>
        </div>
      </template>

      <div class="rt__pickup">
        <div class="rt__instruction rt__instruction--carpool">
          <q-icon name="directions_car" size="sm"/>
          <span>Carpool for {{ ride.CarpoolDuration }} min.</span>
        </div>
        <q-btn v-if="!ride.accepted && !ride.requested" class="outline-button" size="md">Change</q-btn>
      </div>

    </q-timeline-entry>

    <!-- Drop off-->
    <q-timeline-entry class="rt__carpool" color="tertiary" icon="directions_car">
      <template v-slot:title>
        <div class="rt__header">
          <span>{{ ride.Drop.Address }}</span>
          <span class="rt__header__time"><q-icon name="schedule" size="sm"/>{{
              ExtractTime(ride.Drop.Date)
            }}</span>
        </div>
      </template>

      <div class="rt__pickup">
        <div class="rt__instruction rt__instruction--shuttle">
          <q-icon name="directions_walk" size="sm"/>
          <span>Walk for {{ ride.DropDuration }} min.</span>
        </div>
      </div>

    </q-timeline-entry>

    <!-- Arrival -->
    <q-timeline-entry color="tertiary" icon="flag">
      <template v-slot:title>
        <div class="rt__header">
          <span>{{ ride.Destination.Address }}</span>
          <span class="rt__header__time"><q-icon name="schedule" size="sm"/>{{
              ExtractTime(ride.Arrival)
            }}</span>
        </div>
      </template>

    </q-timeline-entry>

  </q-timeline>

</template>

<style lang="scss" scoped>

@import "src/css/quasar.variables.scss";

.rt {
  color: $on-background;
  margin: 0;
  padding-left: 2rem;
  padding-right: 2rem;

  &__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: medium;
    opacity: 1 !important;
    text-transform: none;

    &__time {
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: normal;
      font-size: small;
    }
  }

  &__instruction {
    display: flex;
    flex-direction: row;
    width: fit-content;
    gap: 8px;
    padding: 8px;
    border-radius: 8px;
    margin-top: 8px;
    align-items: center;
    font-style: italic;
  }

  &__instruction--shuttle {
    background-color: #1f4e4c;
    color: #bbece8;
  }

  &__instruction--carpool {
    background-color: #fdd835;
    color: #1f4e4c;
  }

  &__pickup {
    display: flex;
    flex-direction: row;
    align-items: end;
    justify-content: space-between;
  }

  &__carpool {
    .q-timeline__dot {

      color: #fdd835 !important;

      .q-icon {
        color: $tertiary-container !important;
      }
    }

    .q-timeline__dot::after {
      color: $tertiary-container;
    }
  }
}

</style>

<style lang="scss">

// the component's CSS mustn't be scoped for these to apply

.q-timeline__subtitle {
  margin-bottom: 0 !important;
}

.q-timeline__title {
  margin-bottom: 8px !important;
}

.q-timeline__dot::after {
  opacity: 0.7 !important;
}

</style>
