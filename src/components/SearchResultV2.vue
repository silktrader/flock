<template>

  <div v-ripple class="card" @click="reviewRide()">

    <div class="driver-schedule">

      <section class="driver">
        <div class="driver-avatar">
          <q-avatar size="100px">
            <img :src="r.Driver.AvatarUrl"/>
          </q-avatar>
          <span class="driver-rating">{{ r.Driver.Rating.toFixed(1) }}</span>
        </div>
        <span class="driver-name">{{ r.Driver.DisplayName }}</span>
      </section>

      <section class="schedule">

        <section class="schedule-times">

          <aside class="duration">
            <q-icon name="update" size="sm"></q-icon>
            <span>{{ FormatDuration(r.Departure, r.Arrival) }}</span>
          </aside>

          <div class="locations">

            <div class="origin">
              <q-icon name="trip_origin" size="sm"/>
              <div class="origin-details">
                <span>{{ ExtractTime(r.Departure) }}</span>
              </div>
            </div>

            <div class="route"></div>

            <div class="destination">
              <q-icon name="location_on" size="sm"/>
              <div class="destination-details">
                <span>{{ ExtractTime(r.Arrival) }}</span>
              </div>
            </div>

          </div>

        </section>

        <section class="schedule-details">

          <div v-if="r.Pickup.Transport === Transport.Subway" class="ride-detail">
            <q-icon name="directions_subway" size="sm"></q-icon>
          </div>

          <div v-else-if="r.Pickup.Transport === Transport.Bus" class="ride-detail">
            <q-icon name="directions_bus" size="sm"></q-icon>
          </div>

          <div class="ride-detail">
            <q-icon name="directions_walk" size="sm"></q-icon>
          </div>

          <div class="expense">
            {{ r.Expense }} €
          </div>

        </section>
      </section>
    </div>

  </div>

</template>

<script lang="ts" setup>

import { Transport, useRideStore } from 'stores/ride-store'
import { useRouter } from 'vue-router'
import { Ride } from 'src/models/ride'
import { ExtractTime, FormatDuration } from '../tools/date-tools'

const rs = useRideStore()
const router = useRouter()

const props = defineProps<{
  r: Ride // webstorm will complain if the instance is named after the interface (bug)
}>()

function reviewRide (): void {
  rs.selectRide(props.r)
  router.push('/ride-details')
}

</script>

<style lang="scss" scoped>
@import "src/css/quasar.variables.scss";

.card {
  padding: 24px;
  background-color: #23261e;
  color: rgb(228, 227, 221);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.driver-schedule {
  display: flex;
  flex-direction: row;
  gap: 16px;
  justify-content: space-between;
}

.driver {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
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
  color: $on-secondary;
}

.schedule {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.schedule-details {
  display: flex;
  flex-direction: row;
  justify-content: right;
  gap: 16px;
}

.schedule-times {
  display: flex;
  flex-direction: row;
  gap: 16px;
  justify-content: end;
}

.duration {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ride-detail, .expense {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
}

.route {
  border-left: 2px solid white;
  margin-left: 10px;
  height: 16px;
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

.ride-detail {
  background-color: $secondary;
  color: $on-secondary;
}

.ride-detail small {
  font-size: xx-small;
}

.expense {
  border: 2px solid $secondary;
}

</style>
