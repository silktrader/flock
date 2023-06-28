<template>

  <main class="results-container">

    <section id="summary" class="shadow-6">

      <div class="locations">

        <div class="origin">
          <q-icon name="trip_origin" size="sm"/>
          <div class="origin-details">
            <span v-if="rs.rideParameters.Origin.Label !== ''">{{ rs.rideParameters.Origin.Label }}</span>
            <span class="address">{{ rs.rideParameters.Origin.Address }}</span>
          </div>
        </div>

        <div class="route"></div>

        <div class="destination">
          <q-icon name="location_on" size="sm"/>
          <div class="destination-details">
            <span>{{ destination.Label }}</span>
            <span class="address">{{ destination.Address }}</span>
          </div>
        </div>

      </div>

      <div class="time">Arriving <em>{{ arriveByDate }}</em> by <em>{{ arriveByTime }}</em></div>
    </section>

    <q-separator/>

    <div class="ride-cards">
      <q-card v-for='ride in rs.rides' :key='ride.Id'>

        <q-card-section class="ride-card">

          <section class="driver">
            <div class="driver-avatar">
              <q-avatar size="100px">
                <img :src="ride.Driver.AvatarUrl"/>
              </q-avatar>
              <span class="driver-rating">{{ ride.Driver.Rating.toFixed(1) }}</span>
            </div>
            <span class="driver-name">{{ ride.Driver.Name }}</span>
          </section>

          <section class="ride-details">

            <section class="ride-details-header">
              <div class="ride-details-header-time">
                <span>Leave at <em>{{ ExtractTime(ride.Departure) }}</em></span>
                <span>Arrive at <em>{{ ExtractTime(ride.Arrival) }}</em></span>
              </div>
              <aside class="ride-details-header-duration">
                <!--              <img src="src/assets/arrow.png" height="32" width="32">-->
                <q-icon name="update" size="xs"></q-icon>
                <span>{{ FormatDuration(ride.Departure, ride.Arrival) }}</span>
              </aside>
            </section>

            <section class="ride-details-icons">

              <div class="ride-details-comfort">

                <div class="ride-detail">
                  <q-icon name="airline_seat_recline_normal" size="sm"></q-icon>
                  <div>
                    <span>{{ ride.Passengers.length }}</span>
                    <sub class="seats-total">/{{ ride.Car.Seats }}</sub>
                  </div>
                </div>

                <div class="ride-detail">
                  <q-icon name="euro" size="sm"></q-icon>
                  <span>{{ ride.Expense }}</span>
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
          <q-btn flat @click="reviewRide(ride)">View</q-btn>
        </q-card-actions>

      </q-card>

    </div>

  </main>

</template>

<script lang="ts" setup>

import { LeftButton, useNavigationStore } from 'stores/navigation-store'
import { Ride, useRideStore } from 'stores/ride-store'
import { computed } from 'vue'
import { ExtractTime, FormatDuration, FormatFriendlyDate } from 'src/tools/date-tools'
import { useRouter } from 'vue-router'

const ns = useNavigationStore()
const rs = useRideStore()
const router = useRouter()

ns.setTitle('Search Results')
ns.setButton(LeftButton.Back)

rs.generateNewRides(rs.rideParameters.Origin, rs.rideParameters.Destination)

const arriveByTime = computed<string>(() => rs.rideParameters?.ArriveBy ? ExtractTime(rs.rideParameters.ArriveBy) : '')
const arriveByDate = computed<string>(() => rs.rideParameters?.ArriveBy ? FormatFriendlyDate(rs.rideParameters.ArriveBy) : '')

const destination = computed(() => rs.rideParameters.Destination)

function reviewRide (ride: Ride): void {
  rs.selectRide(ride)
  router.push('/ride-details')
}

</script>

<style scoped>

.results-container {
  margin: 0;
}

#summary {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
  background-color: azure;
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

.route {
  position: relative;
  background-image: url(//maps.gstatic.com/consumer/images/icons/1x/route_3dots_grey650_24dp.png);
  height: 32px;
  background-repeat: repeat-y;
}

.destination-details, .origin-details {
  display: flex;
  flex-direction: column;
}

.address {
  font-size: xx-small;
  font-style: italic;
}

.time {
  font-size: medium;
}

.time em {
  font-weight: bold;
}

.ride-cards {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  margin-left: 1rem;
  margin-right: 1rem;
  gap: 1rem;
}

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

.ride-details-header em {
  font-style: normal;
  font-weight: bold;
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
