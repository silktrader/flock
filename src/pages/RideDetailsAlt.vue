<script lang="ts" setup>

import { useRideStore } from 'stores/ride-store'
import { computed, ref } from 'vue'
import { ExtractDate, ExtractDay, FormatShortDate } from 'src/tools/date-tools'
import { Ride } from 'src/models/ride'
import { useNavigationStore } from 'stores/navigation-store'
import RouteTimeline from 'components/RouteTimeline.vue'

enum DetailsView {
  Route,
  People,
  Rules,
  Car
}

const rs = useRideStore()
const ns = useNavigationStore()

const ride = computed<Ride>(() => rs.ride)

const accepted = computed<Date | null>(() => rs.isAccepted((ride.value.Id)))

const requested = computed<Date | null>(() => rs.isRequested((ride.value.Id)))

const detailsView = ref<DetailsView>(DetailsView.Route)
const detailsViewOptions: Array<{ label: string, value: DetailsView }> = [{
  label: 'Route',
  value: DetailsView.Route
}, {
  label: 'People',
  value: DetailsView.People
}, {
  label: 'Rules',
  value: DetailsView.Rules
}, {
  label: 'Car',
  value: DetailsView.Car
}]

// const isRequested = computed<boolean>(() => rs.isRequested(ride.value.Id))

function RequestRide (): void {
  rs.requestSelectedRide()
  ns.goRequestSent()
}

function CancelRequest (): void {
  rs.cancelSelectedRequest()
  ns.goHome()
}

</script>

<template>

  <q-page class="rd">

    <header class="modal-header">
      <q-btn aria-label="Back" flat icon="arrow_back" size="lg" @click="ns.goBack()"/>
      <section class="secondary-header-title">
        <span>{{
            `${ride.Origin.Label ?? ride.Origin.Address}
            to ${ride.Destination.Label ?? ride.Destination.Address}`
          }}</span>
        <span class="modal-header-subtitle">{{ ExtractDate(ride.Departure) }}</span>
      </section>
    </header>

    <q-img class="rd__route-image" spinner-color="secondary" src="~/assets/route-map.svg"/>

    <div class="segmented-button-container">
      <q-btn-toggle v-model="detailsView" :options="detailsViewOptions" class="button-toggle-large"/>
    </div>

    <main class="rd__section-container">

      <template v-if="detailsView === DetailsView.Route">
        <transition appear enter-active-class="animated fadeIn">
          <section key="route-view" class="ride-details__section">

            <route-timeline :ride="ride"/>

            <div v-if="ride.Recurring && !requested" class="notice-box route-box">
              <q-icon name="las la-calendar-week" size="lg"/>
              <span>{{ ride.Driver.firstName }} repeats this same route every {{ ExtractDay(ride.Departure) }}.</span>
            </div>

            <div v-if="requested" class="notice-box route-box">
              <q-icon name="las la-stamp" size="sm"/>
              <span>You requested this ride {{ FormatShortDate(requested) }}. <br/>
                  {{ ride.Driver.firstName }} has yet to accept it.</span>
            </div>

            <div v-else-if="accepted" class="notice-box route-box">
              <q-icon name="las la-stamp" size="sm"/>
              <span>You're part of this ride. {{
                  ride.Driver.firstName
                }} accepted your request {{ FormatShortDate(accepted) }}.</span>
            </div>

          </section>
        </transition>
      </template>

      <template v-else-if="detailsView === DetailsView.People">
        <transition appear enter-active-class="animated fadeIn">
          <section key="people-view" class="ride-details-section">

            <q-list style="padding-left: 8px">

              <q-item-label header style="padding-top: 0 !important;">Driver</q-item-label>
              <q-item>

                <q-item-section class="person-avatar-section">
                  <q-avatar class="driver-avatar">
                    <q-img :src="ride.Driver.avatarUrl"/>
                    <span class="driver-rating">{{ ride.Driver.Rating.toFixed(1) }}</span>
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <div class="driver-details">
                    <span>{{ ride.Driver.displayName }}</span>
                    <div class="degree">
                      <q-icon name="school"/>
                      <span>{{ ride.Driver.degree }}</span>
                    </div>
                    <div class="person-stats">
                      <q-rating
                          v-model="ride.Driver.onTimeRating"
                          :max="3"
                          color="accent"
                          icon="alarm_on"
                          readonly
                          size="xs"
                      />
                      <q-tooltip anchor="top middle" max-width="300px" self="bottom middle">
                        An estimate of {{ ride.Driver.firstName }} punctuality, as rated by his past passengers.
                      </q-tooltip>
                    </div>

                  </div>
                </q-item-section>

                <q-item-section side>
                  <q-btn color="secondary" flat icon="arrow_forward_ios"/>
                </q-item-section>

              </q-item>

              <q-item-label header>Passengers</q-item-label>

              <q-item v-for="passenger in ride.passengers" :key="passenger.id">

                <q-item-section class="person-avatar-section">
                  <q-avatar class="passenger-avatar">
                    <q-img :src="passenger.avatarUrl"/>
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <div class="passenger-details">
                    <span>{{ passenger.displayName }}</span>
                    <div class="degree">
                      <q-icon name="school"/>
                      <span>{{ passenger.degree }}</span>
                    </div>
                  </div>
                </q-item-section>

                <q-item-section side>
                  <q-btn color="secondary" flat icon="arrow_forward_ios"/>
                </q-item-section>

              </q-item>

              <template v-if="ride.FreeSeats">
                <q-item v-for="index in ride.FreeSeats" :key="index">

                  <q-item-section class="person-avatar-section">
                    <q-avatar class="free-seat-avatar"/>
                  </q-item-section>

                  <q-item-section>
                    <q-chip class="chip">Free Seat</q-chip>
                  </q-item-section>

                  <q-item-section side>
                    <div v-if="index === 1" class="free-seats-spacer"/>
                    <q-btn v-else color="secondary" flat icon="las la-user-plus"/>
                  </q-item-section>

                </q-item>

              </template>

            </q-list>

          </section>
        </transition>
      </template>

      <template v-else-if="detailsView === DetailsView.Car">
        <transition appear enter-active-class="animated fadeIn">
          <section key="car-view" class="ride-details-section">

            <div class="car-details-container">

              <div class="car-details-header">
                <q-avatar size="80px">
                  <img alt="Car Avatar" src="/images/clio.jpg" style="object-fit: cover">
                </q-avatar>

                <span class="car-model">{{ ride.Car.model }}</span>
              </div>

              <section class="car-accessories">
                <span class="details-label">Features</span>
                <div class="accessories-list">
                  <span v-if="ride.Car.electric" class="chip">Electric</span>
                  <span v-if="ride.Car.airConditioning" class="chip">Air Conditioning</span>
                  <span v-if="ride.Car.bootSpace" class="chip">Boot Space</span>
                  <span v-if="ride.Car.airBag" class="chip">Passenger Airbags</span>
                  <span v-if="ride.Car.usbChargers" class="chip">USB Chargers</span>
                  <span v-if="ride.Car.soundSystem" class="chip">Sound System</span>
                </div>
              </section>

              <section class="car-details-plate">
            <span class="details-label">
              <span>License Plate</span>
              <q-icon v-if="!accepted" color="secondary" name="info" size="sm">
                <q-tooltip anchor="top middle" max-width="300px" self="bottom middle">
                    {{ ride.Driver.firstName }}'s license plate will show once he accepts your ride request.
                  </q-tooltip>
              </q-icon>
            </span>
                <span :class="{blurred: !accepted, 'car-plate': true}">{{ ride.Car.vrm }}</span>
              </section>

            </div>

          </section>
        </transition>
      </template>

      <template v-else-if="detailsView === DetailsView.Rules">
        <transition appear enter-active-class="animated fadeIn">
          <section key="rules-view" class="ride-details-section-container">

            <div class="rules-container">

              <q-chat-message v-if="ride.comment"
                              :avatar="ride.Driver.avatarUrl"
                              :text="[ride.comment]"
                              bg-color="amber-4"
                              size="8"
                              text-color="grey-10"
              />

              <div class="car-accessories">
                <span class="details-label">Conduct</span>
                <div class="rules-list">
                  <span v-for="rule in ride.rules" :key="rule" class="chip">{{ rule }}</span>
                </div>
              </div>

              <q-item v-if="ride.Expense === 0">
                <q-item-section>
                  <div class="expense-container">
                    Free Ride
                  </div>
                  <aside class="expense-none-notice">
                    <q-icon name="las la-mug-hot" size="md"/>
                    <span>
              You can tip {{ ride.Driver.displayName }} when the ride's over. It's up to you. <br/>
              Donuts and coffee are welcome too!
              </span>
                  </aside>
                </q-item-section>

              </q-item>

              <q-item v-else>
                <q-item-section>
                  <div class="expense-container">
                    <div class="details-label">
                      <span>Contribution</span>
                      <q-icon color="secondary" name="info" size="sm"/>
                      <q-tooltip anchor="top middle" max-width="300px" self="bottom middle">
                        This amount comprises <b>all costs</b>, including parking and fuel. You're welcome to <b>tip the
                        driver</b>
                        in excess of displayed figure!
                      </q-tooltip>
                    </div>

                    <span class="expense">{{ ride.Expense }} €</span>

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

            </div>
          </section>
        </transition>
      </template>

    </main>

    <footer>
      <q-btn v-if="accepted" class="filled-button" label="Cancel Ride" size="lg"/>
      <q-btn v-else-if="requested" class="filled-button" label="Cancel Request" size="lg"
             @click="CancelRequest()"/>
      <q-btn v-else class="filled-button" label="Request Ride" size="lg" @click="RequestRide()"/>
    </footer>

  </q-page>

</template>

<style lang="scss" scoped>
@import "src/css/quasar.variables.scss";

// Main

.rd {
  height: 100vh;
  display: flex;
  flex-direction: column;

  &__route-image {
    height: 180px;
    object-fit: cover;
  }

  &__section-container {
    display: flex;
    flex-direction: column;
    flex-grow: 5;
  }

  &__section {
    display: flex;
    flex-direction: column;
    margin-top: 4px;
  }
}

.segmented-button-container {
  display: flex;
  width: 100%;
  position: relative;
  top: -20px;
  justify-content: center;
}

// Route

.pickup-prompt {
  display: flex;
  flex-direction: row;
  margin-left: 56px;
  margin-right: 48px;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.route-box {
  background-color: $surface-variant;
  color: $on-surface-variant;
}

// People

.driver-details, .passenger-details {
  display: flex;
  flex-direction: column;
  font-size: medium;
  gap: 4px;
}

.driver-avatar {
  width: 80px;
  height: 80px;
}

.passenger-avatar {
  width: 60px;
  height: 60px;
}

.free-seat-avatar {
  position: relative;
  border: 2px dashed $on-surface-variant;
  border-radius: 50%;
  overflow: hidden;
  width: 60px;
  height: 60px;
  background-color: $surface-variant;
}

.passenger-details {
  width: 100%;
}

.person-avatar-section {
  max-width: 120px;
}

.degree {
  display: flex;
  gap: 4px;
  align-items: center;
  opacity: 80%;
  font-size: small;

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: fit-content;
  }
}

.person-stats {
  padding-top: 4px;
  display: flex;
}

.list-action {
  display: flex;
  justify-content: end;
}

.free-seats-container {
  display: flex;
  gap: 8px;
}

.free-seats {
  display: inline-flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
}

.free-seats-spacer {
  min-width: 32px;
}

.free-seats-actions {
  display: flex;
  flex-direction: row;
  justify-content: center;
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

.driver-rating {
  position: absolute;
  bottom: -14px;
  right: -12px;
  height: 48px;
  width: 48px;
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

// reduced size footer, holding small button
//footer {
//  display: flex;
//  flex-direction: column;
//  width: 100%;
//  margin-bottom: 24px;
//  margin-top: 24px;
//  align-items: center;
//}

small {
  font-size: xx-small;
}

// Car

.car-details-container, .rules-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: 32px;
  color: $on-background;
}

.car-details-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%
}

.car-model {
  font-size: medium;
  font-weight: bold;
}

.details-label {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.64);
  gap: 4px;
}

.car-details-plate {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.car-plate {
  color: $on-background;
  font-family: "Roboto Mono", monospace;
}

.blurred {
  filter: blur(3px);
}

.car-accessories {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.accessories-list, .rules-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding-left: 32px;
  padding-right: 32px;
  gap: 8px;
}

// Rules

.expense-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: $on-background;
}

.expense {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 8px;
  border-radius: 12px;
  padding: 8px;
  border: 2px solid $secondary;
  font-size: medium;
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
  font-size: medium;
  gap: 8px;
}

.expense-payments-means {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

footer {
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  flex-shrink: 0;
  margin-left: 24px;
  margin-right: 24px;
  margin-bottom: 16px;
}

</style>

<style lang="scss">
.q-message-container {
  justify-content: center;
  font-style: italic;
}

.q-message-avatar {
  width: 60px;
  height: 60px;
}

</style>
