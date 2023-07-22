<template>

  <q-page>

    <header class="modal-header">
      <q-btn aria-label="Back" flat icon="arrow_back" size="lg" @click="router.go(-1)"/>
      <section class="modal-header-title">
        <span>{{
            `${ride.Origin.Label ?? ride.Origin.Address}
            to ${ride.Destination.Label ?? ride.Destination.Address}`
          }}</span>
        <span class="modal-header-subtitle">{{ ExtractDate(ride.Departure) }}</span>
      </section>
      <section>
        <q-btn aria-label="Close" flat icon="close" size="lg" @click="abort()"/>
      </section>
    </header>

    <section class="route">

      <q-img class="route-image shadow-7" fit="cover" spinner-color="white" src="src/assets/route-map.svg"/>

      <q-timeline class="timeline" color="secondary" layout="dense">

        <q-timeline-entry icon="location_on">

          <!-- Departure -->
          <template v-slot:title>
            <div class="timeline-header">
              <span>{{ ride.Origin.Address }}</span>
              <span class="timeline-header-time">
                <q-icon name="schedule" size="sm"/>{{ ExtractTime(ride.Departure) }}
              </span>
            </div>
          </template>

          <div class="timeline-instruction shuttle">
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
        <q-timeline-entry :avatar="ride.Driver.AvatarUrl" color="yellow-7">
          <template v-slot:title>
            <div class="timeline-header">
              <span>Meet {{ ride.Driver.DisplayName }}</span>
              <span class="timeline-header-time"><q-icon name="schedule" size="sm"/>{{ ExtractTime(ride.Pickup.Date) }}</span>
            </div>
          </template>

          <div class="timeline-pickup">
            <span>{{ ride.Pickup.Address }}</span>
            <div style="display: flex">
              <q-btn class="tonal-button" label="Change" rounded style="flex-grow: 1"/>
              <div style="flex-grow: 5"></div>
            </div>
            <div class="timeline-instruction carpool">
              <q-icon name="directions_car" size="sm"/>
              <span>Carpool for {{ ride.CarpoolDuration }} min.</span>
            </div>
          </div>

        </q-timeline-entry>

        <!-- Drop off-->
        <q-timeline-entry icon="directions_car">
          <template v-slot:title>
            <div class="timeline-header">
              <span>{{ ride.Driver.DisplayName }} drops you</span>
              <span class="timeline-header-time"><q-icon name="schedule" size="sm"/>{{
                  ExtractTime(ride.Drop.Date)
                }}</span>
            </div>
          </template>

          <div class="timeline-pickup">
            <span>{{ ride.Drop.Address }}</span>
            <div class="timeline-instruction shuttle">
              <q-icon name="directions_walk" size="sm"/>
              <span>Walk for {{ ride.DropDuration }} min.</span>
            </div>
          </div>

        </q-timeline-entry>

        <!-- Arrival -->
        <q-timeline-entry icon="flag">
          <template v-slot:title>
            <div class="timeline-header">
              <span>{{ ride.Destination.Address }}</span>
              <span class="timeline-header-time"><q-icon name="schedule" size="sm"/>{{
                  ExtractTime(ride.Arrival)
                }}</span>
            </div>
          </template>

          <!--          <div class="timeline-address">-->
          <!--            <span>{{ ride.Destination.Address }}</span>-->
          <!--          </div>-->

        </q-timeline-entry>

      </q-timeline>

      <q-separator/>

      <q-list style="padding-left: 8px">

        <!--        <q-item-label header><span class="section-header">Details</span></q-item-label>-->
        <q-item-label header>Driver</q-item-label>
        <q-item>

          <q-item-section>
            <q-avatar size="88  px">
              <q-img :src="ride.Driver.AvatarUrl"/>
              <span class="driver-rating">{{ ride.Driver.Rating.toFixed(1) }}</span>
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <div class="driver-name">
              <span>{{ ride.Driver.DisplayName }}</span>
              <span class="degree driver-degree">{{ ride.Driver.Degree }}</span>
              <!--              <div class="rating">-->
              <!--                <q-rating-->
              <!--                  v-model="ride.Driver.Rating"-->
              <!--                  color="orange"-->
              <!--                  icon-half="star_half"-->
              <!--                  readonly-->
              <!--                  size="small"-->
              <!--                />-->
              <!--                <span class="rating-number">{{ ride.Driver.Rating.toFixed(1) }}</span>-->
              <!--              </div>-->
            </div>
          </q-item-section>

          <div class="passenger-action">
            <q-btn color="secondary" flat icon="las la-sms" label="Contact" no-caps rounded/>
          </div>

        </q-item>

        <q-item-label header>Passengers</q-item-label>

        <q-item v-for="passenger in ride.Passengers" :key="passenger.Id">

          <q-item-section>
            <q-avatar size="64px">
              <q-img :src="passenger.AvatarUrl"/>
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <div class="passenger-details">
              <span>{{ passenger.DisplayName }}</span>
              <span class="degree">{{ passenger.Degree }}</span>
            </div>
          </q-item-section>

          <q-item-section>
            <div class="passenger-action">
              <q-btn color="secondary" flat icon="las la-user-check" label="View" no-caps rounded/>
            </div>
          </q-item-section>

        </q-item>

        <q-item>
          <q-item-section>
            <div class="free-seats">
              <q-avatar
                v-for="index in ride.FreeSeats"
                :key="index"
                class="free-seat"
              >
              </q-avatar>
            </div>
          </q-item-section>
          <q-item-section><span class="free-seats-text">{{ ride.FreeSeats }} free seat{{
              ride.FreeSeats > 1 ? 's' : ''
            }}</span>
          </q-item-section>

          <q-item-section>
            <div class="free-seats-actions">
              <q-btn v-if="ride.FreeSeats > 1" color="secondary" flat icon="las la-user-plus"
                     label="Invite" no-caps rounded
              />
            </div>
          </q-item-section>
        </q-item>

        <q-item-label header>Car</q-item-label>

        <q-item>

          <q-item-section>
            <q-avatar size="64px">
              <img src="/src/assets/cars/clio.jpg" style="object-fit: cover">
            </q-avatar>

          </q-item-section>

          <q-item-section><span class="car-model">{{ ride.Car.Model }}</span></q-item-section>

          <q-item-section>
            <div class="passenger-action">
              <q-icon v-if='ride.Car.Electric' name="electric_bolt" size="sm"/>
              <q-icon v-if='ride.Car.AirConditioning' name="ac_unit" size="sm"/>
            </div>
          </q-item-section>

        </q-item>

        <q-separator spaced/>

        <q-item v-if="ride.Expense === 0">
          <q-item-section>
            <div class="expense-container">
              Free Ride
            </div>
            <aside class="expense-none-notice">
              <q-icon name="las la-mug-hot" size="md"/>
              <span>
              You can still tip {{ ride.Driver.DisplayName }} when the ride's over. <br/>
              Donuts and coffee are welcome too!
              </span>
            </aside>
          </q-item-section>

        </q-item>

        <q-item v-else>
          <q-item-section>
            <div class="expense-container">
              <span class="expense-title">Your Contribution <q-icon name="info"/>
               <q-tooltip>
                This amount comprises <b>all costs</b>, including parking and fuel. You're welcome to <b>tip the driver</b>
                 in excess of displayed figure!
              </q-tooltip>
              </span>

              <div class="expense">
                {{ ride.Expense }} €
              </div>
              <aside class="expense-payments-container">
                <span>Pay when the ride's over with:</span>
                <div class="expense-payments-means">
                  <q-icon name="las la-money-bill-wave" size="sm">
                    <q-tooltip>Cash</q-tooltip>
                  </q-icon>
                  <q-icon name="lab la-paypal" size="sm">
                    <q-tooltip>Paypal</q-tooltip>
                  </q-icon>
                  <q-icon name="lab la-bitcoin" size="sm">
                    <q-tooltip>Bitcoins</q-tooltip>
                  </q-icon>
                </div>
              </aside>
            </div>
          </q-item-section>

        </q-item>

        <q-separator spaced/>

        <template v-if="ride.Recurring">

          <q-item>
            <q-item-section>
              <div id="recurring-information">
                <q-icon name="las la-calendar-week" size="lg"/>
                <span>
              {{ ride.Driver.DisplayName }} drives to <b>{{ ride.Destination.Label ?? ride.Destination.Address }}</b> every
              <b>{{ ExtractDay(ride.Departure) }}</b> arriving at <b>{{ ExtractTime(ride.Arrival) }}</b>.
                </span>
              </div>
            </q-item-section>

          </q-item>
        </template>

      </q-list>

    </section>

    <footer>
      <span v-if="ride.Requested">Ride requested, pending approval</span>
      <q-btn v-else class="filled-button" label="Request Ride" no-caps rounded size="lg"
             @click="RequestRide()"/>
    </footer>

    <q-page-scroller :offset="[8, 8]" :scroll-offset="20" position="bottom-right" reverse>
      <q-btn class="filled-button" fab-mini icon="keyboard_arrow_down"/>
    </q-page-scroller>

  </q-page>

</template>

<script lang="ts" setup>

import { Transport, useRideStore } from 'stores/ride-store'
import { computed } from 'vue'
import { ExtractDate, ExtractDay, ExtractTime } from 'src/tools/date-tools'
import { Ride } from 'src/models/ride'
import { useRouter } from 'vue-router'

const rs = useRideStore()
const router = useRouter()

const ride = computed<Ride>(() => {
  if (rs.ride === undefined) {
    throw new Error('Missing ride')
  }
  return rs.ride
})

function RequestRide (): void {
  router.push('/request-sent')
}

async function abort (): Promise<void> {
  await router.replace('/')
  rs.reset()
}

</script>

<style lang="scss">
@import "src/css/quasar.variables.scss";

.route {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.timeline {
  color: $on-background;
  margin: 0;
  padding-left: 2rem;
  padding-right: 2rem;
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

.driver-degree {
  font-size: small;
}

.passenger-action {
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
  border: 2px solid $on-surface-variant;
  border-radius: 50%;
  overflow: hidden;
  width: 50px;
  height: 50px;
  background-color: $surface-variant;
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
  width: 100%;
  margin-bottom: 24px;
  margin-top: 24px;
  align-items: center;
}

.footer-button {
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
  width: fit-content;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  margin-top: 8px;
  align-items: center;
  font-size: small;
  font-style: italic;
}

.carpool {
  background-color: #fdd835;
  color: #1f4e4c;
}

.shuttle {
  background-color: #1f4e4c;
  color: #bbece8;
}

.timeline-pickup {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: small;
  width: fit-content;
}

.timeline-carpool {
  color: $carpool;
}

/*.timeline-address {*/
/*  font-size: small;*/
/*}*/

.q-timeline__subtitle {
  margin-bottom: 0 !important;
}

small {
  font-size: xx-small;
}

.expense-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: medium;
  gap: 8px;
}

.expense {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 8px;
  border-radius: 12px;
  padding: 8px;
  border: 2px solid $secondary;
}

.expense-title {
  font-size: medium;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 8px;
}

.expense-none-notice {
  display: flex;
  gap: 24px;
  align-items: center;
  padding: 24px;
  font-style: italic;
}

.expense-payments-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: small;
  gap: 8px;
}

.expense-payments-means {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

#recurring-information {
  border-radius: 12px;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  font-size: medium;
  width: 100%;
  background-color: $tertiary-container;
  color: $on-tertiary-container
}

.driver-rating {
  position: absolute;
  bottom: -12px;
  right: -12px;
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

</style>
