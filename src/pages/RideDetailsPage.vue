<template>

  <q-page>

    <section class="pickup">

      <q-img class="route-image shadow-7" spinner-color="white" src="src/assets/route.jpg"/>

      <q-timeline class="timeline" color="secondary" layout="dense">

        <q-timeline-entry icon="location_on">

          <template v-slot:title>
            <div class="timeline-header">
              <span>{{ ride.Origin.Address }}</span>
              <span class="timeline-header-time"><q-icon name="schedule" size="sm"/>{{ departureTime }}</span>
            </div>
          </template>

          <div class="timeline-instruction">
            <q-icon name="directions_walk" size="sm"/>
            <span>Walk for 3 min.</span>
          </div>

        </q-timeline-entry>

        <q-timeline-entry :avatar="ride.Driver.AvatarUrl">
          <template v-slot:title>
            <div class="timeline-header">
              <span>Meet {{ ride.Driver.Name }}</span>
              <span class="timeline-header-time"><q-icon name="schedule" size="sm"/>{{ pickupTime }}</span>
            </div>
          </template>

          <div class="timeline-pickup">
            <span>{{ ride.Pickup.Address }}</span>
            <q-btn color="secondary" label="Change" outline/>
            <div class="timeline-instruction">
              <q-icon name="directions_car" size="sm"/>
              <span>Carpool for 10 min.</span>
            </div>
          </div>

        </q-timeline-entry>

        <q-timeline-entry icon="flag">
          <template v-slot:title>
            <div class="timeline-header">
              <span>{{ ride.Destination.Address }}</span>
              <span class="timeline-header-time"><q-icon name="schedule" size="sm"/>{{ arrivalTime }}</span>
            </div>
          </template>

          <!--          <div class="timeline-address">-->
          <!--            <span>{{ ride.Destination.Address }}</span>-->
          <!--          </div>-->

        </q-timeline-entry>

      </q-timeline>

      <q-separator inset spaced></q-separator>

      <q-list padding>

        <q-item-label header><span class="section-header">Details</span></q-item-label>
        <q-item-label header>Driver</q-item-label>
        <q-item>

          <q-item-section>
            <q-avatar size="64px">
              <q-img :src="ride.Driver.AvatarUrl"/>
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <div class="driver-name">
              <span>{{ ride.Driver.Name }}</span>
              <!--              <span class="degree">{{ ride.Driver.Degree }}</span>-->
              <div>
                <q-btn color="primary" dense flat icon="call"/>
                <q-btn color="primary" dense flat icon="chat"/>
              </div>
            </div>
          </q-item-section>

          <q-item-section>
            <div class="rating">
              <q-rating
                v-model="ride.Driver.Rating"
                color="orange"
                icon-half="star_half"
                readonly
                size="small"
              />
              <span class="rating-number">{{ ride.Driver.Rating.toFixed(1) }}</span>
            </div>
          </q-item-section>

        </q-item>

        <q-item-label header>Passengers</q-item-label>

        <q-item v-for="passenger in ride.Passengers" :key="passenger.Id">

          <q-item-section>
            <q-avatar size="50px">
              <q-img :src="passenger.AvatarUrl"/>
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <div class="passenger-details">
              <span>{{ passenger.Name }}</span>
              <span class="degree">{{ passenger.Degree }}</span>
            </div>
          </q-item-section>

          <q-item-section>
            <div class="passenger-badges">
              <q-icon v-if="passenger.Badges.includes('punctual')" name="watch" size="sm"/>
              <q-icon v-if="passenger.Badges.includes('cordial')" name="mood" size="sm"/>
              <q-icon v-if="passenger.Badges.includes('veteran')" name="star" size="sm"/>
            </div>
          </q-item-section>

        </q-item>

        <q-item>
          <q-item-section>
            <div class="free-seats">
              <q-avatar
                v-for="index in freeSeats"
                :key="index"
                class="free-seat"
              >
              </q-avatar>
            </div>
          </q-item-section>
          <q-item-section><span class="free-seats-text">{{ freeSeats }} free seat{{ freeSeats > 1 ? 's' : '' }}!</span>
          </q-item-section>

          <q-item-section>
            <div class="free-seats-actions">
              <q-btn v-if="freeSeats > 1" color="primary" dense flat icon="person_add" label="Invite"></q-btn>
            </div>
          </q-item-section>
        </q-item>

        <q-item-label header>Car</q-item-label>

        <q-item>

          <q-item-section>
            <q-avatar class="car-icon">
              <q-icon name="directions_car" size="md"></q-icon>
            </q-avatar>

          </q-item-section>

          <q-item-section><span class="car-model">{{ ride.Car.Model }}</span></q-item-section>

          <q-item-section>
            <div class="passenger-badges">
              <q-icon v-if='ride.Car.Electric' name="electric_bolt" size="sm"/>
              <q-icon v-if='ride.Car.AirConditioning' name="ac_unit" size="sm"/>
            </div>
          </q-item-section>

          <!--          <q-item-section side>-->
          <!--            <q-item-label caption>meta</q-item-label>-->
          <!--          </q-item-section>-->
        </q-item>

      </q-list>

      <div class="separator"></div>

    </section>

    <q-page-sticky expand position="bottom">
      <footer>
        <q-separator spaced="16px"/>
        <q-btn class="footer-button" color="secondary" label="Book Ride" no-caps rounded size="lg"/>
      </footer>
    </q-page-sticky>

  </q-page>

</template>

<script lang="ts" setup>

import { LeftButton, useNavigationStore } from 'stores/navigation-store'
import { Ride, useRideStore } from 'stores/ride-store'
import { computed } from 'vue'
import { ExtractDate, ExtractTime } from 'src/tools/date-tools'

const ns = useNavigationStore()
const rs = useRideStore()

const ride = computed<Ride>(() => {
  if (rs.ride === undefined) {
    throw new Error('Missing ride')
  }
  return rs.ride
})

const freeSeats = computed<number>(() => ride.value.Car.Seats - ride.value.Passengers.length)
const departureTime = computed<string>(() => ExtractTime(ride.value.Departure))
const arrivalTime = computed<string>(() => ExtractTime(ride.value.Arrival))
const pickupTime = computed<string>(() => ExtractTime(ride.value.Pickup.Date))
const departureDate = computed<string>(() => ExtractDate(ride.value.Departure))

ns.setButton(LeftButton.Back)
ns.setTitle(`${ride.value.Origin.Label ?? ride.value.Origin.Address} to ${ride.value.Destination.Label ?? ride.value.Destination.Address}`)
ns.setSubtitle(departureDate.value)

console.log(ride.value.Destination)

</script>

<style>

.pickup {
  display: flex;
  flex-direction: column;
}

.timeline {
  padding-left: 1rem;
  padding-right: 1rem;
}

.section-header {
  font-size: large;
  font-weight: bold;
}

.route-image {
  height: 300px;
  object-fit: cover;
}

.driver-name {
  display: flex;
  flex-direction: column;
  /*align-items: center;*/
  font-size: medium;
}

.passenger-details {
  display: flex;
  flex-direction: column;
  font-size: small;
}

.degree {
  opacity: 80%;
  font-style: italic;
  font-size: smaller;
}

.passenger-badges {
  display: flex;
  flex-direction: row;
  gap: 8px;
  justify-content: center;
}

.free-seats {
  display: inline-flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
}

.free-seats-text {
  font-style: italic;
  font-size: small;
}

.free-seats-actions {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.free-seat {
  position: relative;
  border: 2px solid #fff;
  border-radius: 50%;
  overflow: hidden;
  width: 50px;
  height: 50px;
  background-color: lightgray;
}

.free-seat:not(:last-child) {
  margin-left: -25px;
}

.rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px
}

.rating-number {
  font-size: small;
}

.car-icon {
  display: flex;
  align-items: center;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  border: 2px solid maroon;
  /*background-color: lightgray;*/
  color: maroon;
}

.car-model {
  font-size: medium;
}

footer {
  display: flex;
  flex-direction: column;
  min-height: 50px;
  width: 100%;
  padding-bottom: 16px;
  background-color: white;
  align-items: center;
}

.footer-button {
  max-width: 200px;
}

.timeline-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: small;
  opacity: 1 !important;
  text-transform: none;
}

.timeline-header-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: normal;
}

.timeline-instruction {
  display: flex;
  flex-direction: row;
  gap: 8px;
  opacity: 80%;
  align-items: center;
  font-size: small;
  font-style: italic;
}

.timeline-pickup {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: small;
}

/*.timeline-address {*/
/*  font-size: small;*/
/*}*/

.q-timeline__subtitle {
  margin: 0;
}

.separator {
  min-height: 100px;
}

</style>
