<script lang="ts" setup>

import { ExtractTime, FormatLongDate } from '../tools/date-tools'
import { Drive } from 'src/models/drive'
import { useDriveStore } from 'src/stores/driveStore'
import { useUserStore } from 'stores/user-store'
import { useNavigationStore } from 'stores/navigation-store'

const props = defineProps<{
  drive: Drive
}>()

</script>

<template>

  <transition
    appear
    enter-active-class="animated slideInRight"
  >

    <q-card key="upcoming-ride-card" v-ripple class="ride-card card q-hoverable cursor-pointer" flat>
      <span class="q-focus-helper"/>

      <q-card-section class="card-header">
        <span>{{ FormatLongDate(drive.Departure) }}</span>
      </q-card-section>

      <q-card-section class="ride-details">

        <section class="directions">
          <div class="directions-times">
            <span>{{ ExtractTime(drive.Departure) }}</span>
            <span>{{ ExtractTime(drive.Arrival) }}</span>
          </div>

          <div class="graph">
            <div class="graph-pickup"/>
            <div class="graph-route"/>
            <div class="graph-drop"/>
          </div>

          <div class="directions-locations">
            <span>{{ drive.Origin.Label ? drive.Origin.Label : drive.Origin.Address }}</span>
            <span>{{ drive.Destination.Label ? drive.Destination.Label : drive.Destination.Address}}</span>
          </div>
        </section>
        <section>
            <div class="column">
                <div style="padding-bottom: 0.7em;">Passengers:</div>
                <div>
                    <q-avatar
                        v-for="index in drive.FreeSeats"
                        :key="index"
                        class="free-seat-avatar"
                        style="margin-right: 3px;"
                    >
                    <div style="font-size: small; font-style: italic; font-weight: lighter; margin-left: -6px; margin-top: -5px;">free</div>
                    </q-avatar>
                </div>
            </div>
        </section>
      </q-card-section>
    </q-card>
  </transition>

</template>

<style lang="scss" scoped>
@import "src/css/quasar.variables.scss";
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap');

.free-seat-avatar {
  position: relative;
  border: 2px dashed $on-surface-variant;
  border-radius: 50%;
  overflow: hidden;
  width: 50px;
  height: 50px;
  background-color: $surface-variant;
}

.ride-card {
  min-width: 288px;
  border-style: solid;
  border-color: $primary;
  border-width: 1px;
}

.ride-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.directions {
  display: flex;
  flex-direction: row;
  gap: 12px;
}

.directions-locations, .directions-times {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
}

.directions-times {
  font-family: 'Roboto Mono', monospace;
}

.directions-locations {
  span {
    max-width: 24ch;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.graph {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 3px;
  margin-bottom: 4px;
}

.graph-route {
  display: flex;
  flex-grow: 1;
  border-left: 2px dashed $secondary;
  margin-left: 5px;
}

.graph-pickup, .graph-drop {
  width: 12px;
  height: 12px;
  border-radius: 100%;
}

.graph-drop {
  background-color: $secondary;
}

.graph-pickup {
  border: 2px solid $secondary;
}

.ride-extra {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 16px;

  span {
    font-style: italic;
  }
}

.lecture-course {
  height: 50px;
  width: 50px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

</style>
