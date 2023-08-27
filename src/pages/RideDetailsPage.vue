<template>

  <q-page>

    <header class="modal-header">
      <q-btn aria-label="Back" flat icon="arrow_back" size="lg" @click="router.go(-1)"/>
      <section class="secondary-header-title">
        <span>{{
            `${ride.Origin.Label ?? ride.Origin.Address}
            to ${ride.Destination.Label ?? ride.Destination.Address}`
          }}</span>
        <span class="modal-header-subtitle">{{ ExtractDate(ride.Departure) }}</span>
      </section>
    </header>

    <section class="route">

      <q-img class="route-image shadow-7" fit="cover" spinner-color="white" src="~/assets/route-map.svg"/>

      <q-timeline class="timeline" color="secondary" layout="dense">

        <q-timeline-entry color="tertiary" icon="location_on">

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
        <q-timeline-entry :avatar="ride.Driver.avatarUrl" color="yellow-7">
          <template v-slot:title>
            <div class="timeline-header">
              <span>Meet {{ ride.Driver.DisplayName }}</span>
              <span class="timeline-header-time"><q-icon name="schedule" size="sm"/>{{ ExtractTime(ride.Pickup.Date) }}</span>
            </div>
          </template>

          <div class="timeline-pickup">
            <span>{{ ride.Pickup.Address }}</span>
            <!--            <div v-if="!ride.accepted" style="display: flex">-->
            <!--              <q-btn class="tonal-button" label="Change" rounded style="flex-grow: 1"/>-->
            <!--              <div style="flex-grow: 5"></div>-->
            <!--            </div>-->
            <div class="timeline-instruction carpool">
              <q-icon name="directions_car" size="sm"/>
              <span>Carpool for {{ ride.CarpoolDuration }} min.</span>
            </div>
          </div>

        </q-timeline-entry>

        <!-- Drop off-->
        <q-timeline-entry class="carpool-entry" color="tertiary" icon="directions_car">
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
        <q-timeline-entry color="tertiary" icon="flag">
          <template v-slot:title>
            <div class="timeline-header">
              <span>{{ ride.Destination.Address }}</span>
              <span class="timeline-header-time"><q-icon name="schedule" size="sm"/>{{
                  ExtractTime(ride.Arrival)
                }}</span>
            </div>
          </template>

        </q-timeline-entry>

      </q-timeline>

      <div v-if="!ride.accepted && !ride.Requested" class="pickup-prompt">
            <span class="pickup-prompt-notice">Propose a different place and time for meeting {{
                ride.Driver.firstName
              }}.</span>
        <q-btn class="outline-button" flat>Change Pickup</q-btn>
      </div>

      <q-separator/>

      <q-list style="padding-left: 8px">

        <!--        <q-item-label header><span class="section-header">Details</span></q-item-label>-->
        <q-item-label header>Driver</q-item-label>
        <q-item>

          <q-item-section>
            <q-avatar size="80px">
              <q-img :src="ride.Driver.avatarUrl"/>
              <span class="driver-rating">{{ ride.Driver.Rating.toFixed(1) }}</span>
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <div class="driver-details">
              <span>{{ ride.Driver.DisplayName }}</span>
              <span class="degree driver-degree">{{ ride.Driver.degree }}</span>
            </div>
          </q-item-section>

          <q-item-section side>
            <q-btn color="secondary" flat no-caps rounded>
              <div class="list-action-contents">
                <q-icon name="las la-sms"/>
                <span>Contact</span>
              </div>
            </q-btn>
          </q-item-section>

        </q-item>

        <q-item-label header>Passengers</q-item-label>

        <q-item v-for="passenger in ride.Passengers" :key="passenger.id">

          <q-item-section>
            <q-avatar size="64px">
              <q-img :src="passenger.avatarUrl"/>
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <div class="passenger-details">
              <span>{{ passenger.DisplayName }}</span>
              <span class="degree">{{ passenger.degree }}</span>
            </div>
          </q-item-section>

          <q-item-section side>
            <q-btn color="secondary" flat no-caps rounded>
              <div class="list-action-contents">
                <q-icon name="las la-user-check"/>
                <span>View</span>
              </div>
            </q-btn>
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
          <q-item-section>
            <span class="free-seats-text">{{ ride.FreeSeats }} free seat{{ ride.FreeSeats > 1 ? 's' : '' }}</span>
          </q-item-section>

          <q-item-section side>
            <q-btn v-if="ride.FreeSeats > 1" color="secondary" flat no-caps rounded>
              <div class="list-action-contents">
                <q-icon name="las la-user-plus"/>
                <span>Invite</span>
              </div>
            </q-btn>
          </q-item-section>
        </q-item>

        <q-item-label header>Car</q-item-label>

        <q-item>

          <q-item-section>
            <q-avatar size="64px">
              <img alt="Car Avatar" src="/images/clio.jpg" style="object-fit: cover">
            </q-avatar>

          </q-item-section>

          <q-item-section><span class="car-model">{{ ride.Car.Model }}</span></q-item-section>

          <q-item-section side>
            <q-btn color="secondary" flat no-caps rounded>
              <div class="list-action-contents">
                <q-icon name="las la-car-side"/>
                <span>View</span>
              </div>
            </q-btn>
          </q-item-section>

        </q-item>
      </q-list>

      <q-separator spaced/>

      <q-item v-if="ride.Expense === 0">
        <q-item-section>
          <div class="expense-container">
            Free Ride
          </div>
          <aside class="expense-none-notice">
            <q-icon name="las la-mug-hot" size="md"/>
            <span>
              You can tip {{ ride.Driver.DisplayName }} when the ride's over. It's up to you. <br/>
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
              <b>{{ ExtractDay(ride.Departure) }}</b>, arriving at <b>{{ ExtractTime(ride.Arrival) }}</b>.
                </span>
            </div>
          </q-item-section>

        </q-item>
      </template>

    </section>

    <footer>
      <span v-if="ride.Requested && !ride.accepted">Ride requested, pending approval</span>
      <q-btn v-else-if="ride.accepted" class="filled-button" label="Cancel Ride" size="lg"/>
      <q-btn v-else class="filled-button" label="Request Ride" size="lg" @click="RequestRide()"/>
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

.pickup-prompt {
  display: flex;
  flex-direction: column;
  margin-left: 48px;
  margin-right: 48px;
  gap: 8px;
  align-items: center;
}

.pickup-prompt-notice {
  font-size: small;
  text-align: center;
  font-style: italic;
}

.driver-details, .passenger-details, .car-model {
  display: flex;
  flex-direction: column;
  font-size: medium;
}

.passenger-details {
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

.list-action {
  display: flex;
  justify-content: end;
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
  margin-left: -30px;
}

.list-action-contents {
  display: flex;
  flex-direction: column;
  width: 40px;
  align-items: center;

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

footer {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 24px;
  margin-top: 24px;
  align-items: center;
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

.q-timeline__dot::after {
  opacity: 0.7 !important;
}

.carpool-entry {
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
