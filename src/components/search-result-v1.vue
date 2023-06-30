<template>

  <q-card>

    <q-card-section class="ride-card">

      <section class="driver">
        <div class="driver-avatar">
          <q-avatar size="100px">
            <img :src="r.Driver.AvatarUrl"/>
          </q-avatar>
          <span class="driver-rating">{{ r.Driver.Rating.toFixed(1) }}</span>
        </div>
        <span class="driver-name">{{ r.Driver.Name }}</span>
      </section>

      <section class="ride-details">

        <section class="ride-details-header">
          <div class="ride-details-header-time">
            <span>Leave at <em>{{ ExtractTime(r.Departure) }}</em></span>
            <span>Arrive at <em>{{ ExtractTime(r.Arrival) }}</em></span>
          </div>
          <aside class="ride-details-header-duration">
            <q-icon name="update" size="xs"></q-icon>
            <span>{{ FormatDuration(r.Departure, r.Arrival) }}</span>
          </aside>
        </section>

        <section class="ride-details-icons">

          <div class="ride-details-comfort">

            <div class="ride-detail">
              <q-icon name="airline_seat_recline_normal" size="sm"></q-icon>
              <div>
                <span>{{ freeSeats }}</span>
                <sub class="seats-total">/{{ r.Car.Seats }}</sub>
              </div>
            </div>

            <div class="ride-detail">
              <q-icon name="euro" size="sm"></q-icon>
              <span>{{ r.Expense }}</span>
            </div>

            <div class="ride-detail">
              <q-icon name="event_repeat" size="sm"/>
            </div>

          </div>

          <!--          <div class="ride-detail">-->
          <!--            <q-icon name="smoking_rooms" size="sm"></q-icon>-->
          <!--          </div>-->

          <!--          <div class="ride-detail">-->
          <!--            <q-icon name="music_note" size="sm"></q-icon>-->
          <!--          </div>-->

          <!--          <div class="ride-detail">-->
          <!--            <q-icon name="electric_bolt" size="sm"></q-icon>-->
          <!--          </div>-->

          <!--          <div class="ride-detail">-->
          <!--            <q-icon name="ac_unit" size="sm"></q-icon>-->
          <!--          </div>-->

          <div class="ride-details-commute">

            <div class="ride-detail">
              <q-icon name="directions_subway" size="sm"></q-icon>
              <span>9 min</span>
            </div>

            <div class="ride-detail">
              <q-icon name="directions_walk" size="sm"></q-icon>
              <span>3 min</span>
            </div>

          </div>

        </section>

      </section>

    </q-card-section>

    <q-separator/>

    <q-card-actions align="right">
      <q-btn flat>Request</q-btn>
      <q-btn flat @click="reviewRide()">View</q-btn>
    </q-card-actions>

  </q-card>

</template>

<script lang="ts" setup>

import { Ride, useRideStore } from 'stores/ride-store'
import { useRouter } from 'vue-router'
import { ExtractTime, FormatDuration } from 'src/tools/date-tools'
import { computed } from 'vue'

const rs = useRideStore()
const router = useRouter()

const props = defineProps<{
  r: Ride // webstorm will complain if the instance is named after the interface (bug)
}>()

const freeSeats = computed<number>(() => props.r.Car.Seats - props.r.Passengers.length)

function reviewRide (): void {
  rs.selectRide(props.r)
  router.push('/ride-details')
}

</script>

<style scoped>

.ride-card {
  display: flex;
  padding: 1rem;
  gap: 18px;
}

.driver {
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  align-items: center;
  gap: 16px;
}

.driver-avatar {
  position: relative;
}

.driver-name {
  font-size: medium;
}

.driver-rating {
  position: absolute;
  bottom: -12px;
  left: -12px;
  height: 48px;
  width: 48px;
  background-image: url(/src/assets/star.png);
  background-size: 48px 48px;
  background-repeat: no-repeat;
  text-align: center;
  font-size: xx-small;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ride-details {
  display: flex;
  flex-direction: column;
  flex-grow: 3;
  gap: 24px;
}

.ride-details-header {
  display: flex;
  flex-direction: row;
  font-size: small;
  justify-content: space-between;
}

.ride-details-header-time {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.ride-details-header-duration {
  opacity: 65%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-left: 2px solid black;
  padding-left: 1rem;
  margin-top: 8px;
  margin-bottom: 8px;
}

.ride-details-icons {
  display: flex;
  flex-direction: column;
  font-size: small;
  gap: 8px;
}

.ride-details-comfort, .ride-details-commute {
  display: flex;
  flex-direction: row;
  justify-content: right;
  gap: 16px;
  height: 32px;
}

.ride-detail {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: aliceblue;
  gap: 4px;
  padding: 5px;
  border-radius: 10px;
}

.seats-total {
  font-size: xx-small;
  opacity: 70%;
}

</style>
