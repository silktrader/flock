<template>

  <transition
    appear
    enter-active-class="animated slideInUp"
    leave-active-class="animated slideOutDown"
    mode="out-in">

    <div :key="ride.id" v-ripple class="result-container">

      <div v-if="requested" class="sr-card-header sr-card-header--requested">
        <span>You requested this ride {{ FormatShortDate(requested) }}</span>
      </div>

      <div v-else-if="ride.recurring" class="sr-card-header">
        <span>{{ ride.driver.firstName }} drives this route every {{ ExtractDay(ride.departure) }}</span>
      </div>

      <div v-ripple class="card" @click="reviewRide()">

        <div class="driver-schedule">

          <section class="driver">
            <div class="driver-avatar">
              <q-avatar size="100px">
                <img :src="ride.driver.avatarUrl" alt="Driver's Avatar"/>
              </q-avatar>
              <span class="driver-rating">{{ ride.driver.Rating.toFixed(1) }}</span>
            </div>
            <span class="driver-details">{{ ride.driver.displayName }}</span>
          </section>

          <section class="schedule">

            <section class="schedule-times">

              <aside class="duration">
                <q-icon name="update" size="sm"></q-icon>
                <span>{{ FormatDuration(ride.departure, ride.arrival) }}</span>
              </aside>

              <div class="locations">

                <div class="origin">
                  <q-icon name="trip_origin" size="sm"/>
                  <div class="origin-details">
                    <span>{{ ExtractTime(ride.departure) }}</span>
                  </div>
                </div>

                <div class="route"></div>

                <div class="destination">
                  <q-icon name="location_on" size="sm"/>
                  <div class="destination-details">
                    <span>{{ ExtractTime(ride.arrival) }}</span>
                  </div>
                </div>

              </div>

            </section>

            <section class="schedule-details">

              <div v-if="ride.pickup.Transport === Transport.Subway"
                   :class="['ride-detail', pickupClass]">
                <q-icon name="las la-train" size="md"/>
              </div>

              <div v-else-if="ride.pickup.Transport === Transport.Bus"
                   :class="['ride-detail', pickupClass]">
                <q-icon name="las la-bus" size="md"/>
              </div>

              <div :class="['ride-detail', walkClass]">
                <q-icon name="las la-walking" size="md"/>
              </div>

              <div class="result-expense">
                {{ ride.expense }} €
              </div>

            </section>
          </section>
        </div>
      </div>
    </div>

  </transition>

</template>

<script lang="ts" setup>

import { Transport, useRideStore } from 'stores/ride-store'
import { Ride } from 'src/models/ride'
import { ExtractDay, ExtractTime, FormatDuration, FormatShortDate } from '../tools/date-tools'
import { computed } from 'vue'
import { useNavigationStore } from 'stores/navigation-store'

const rs = useRideStore()
const ns = useNavigationStore()

const props = defineProps<{
  ride: Ride
}>()

const requested = computed<Date | null>(() => rs.isRequested(props.ride.id))

// const requested = computed<Date | null>(() =>
//   rs.bookedRides.filter(r => r.Id === props.ride.Id)[0]?.requested)

const pickupClass = computed<string>(() =>
  `bg-${rs.colourCodePickup(props.ride.PickupDuration)}`
)

const walkClass = computed<string>(() =>
  `bg-${rs.colourCodePickup(props.ride.WalkDuration)}`
)

function reviewRide (): void {
  rs.selectRide(props.ride)
  ns.goDetailsPage()
}

</script>

<style lang="scss" scoped>
@import "src/css/quasar.variables.scss";

.result-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  position: relative;
}

.sr-card-header {
  display: flex;
  justify-content: center;
  gap: 8px;
  align-items: center;
  font-style: italic;
  font-size: small;
  padding: 6px 6px 12px;
  border-bottom: 0;
  border-radius: 12px 12px 0 0;
  transform: translateY(6px);
  color: $on-surface-variant;
  background-color: $surface-variant;
  z-index: -1;
}

.sr-card-header--requested {
  color: $on-tertiary-container;
  background-color: $tertiary-container;
}

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

.driver-details {
  font-size: medium;
}

.driver-rating {
  position: absolute;
  bottom: -12px;
  left: -12px;
  height: 48px;
  width: 48px;
  padding-top: 3px;
  background-image: url(/src/assets/star.png);
  background-size: 48px 48px;
  background-repeat: no-repeat;
  text-align: center;
  font-size: small;
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
  width: 50px;
}

.ride-detail, .result-expense {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
}

.route {
  border-left: 2px solid white;
  margin-left: 11px;
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

.result-expense {
  border: 2px solid $secondary;
}

</style>
