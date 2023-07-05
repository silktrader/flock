<template>

  <q-page>

    <div class="container">

      <div class="back-control">
        <q-btn aria-label="Back" flat icon="arrow_back" round size="lg" @click="ReviewRide()"/>
      </div>

      <header>
        <q-img fit="contain" height="200px" src="src/assets/success-car.svg"/>
      </header>

      <section class="messages">

        <span class="request-sent">Request Sent!</span>
        <q-icon name="las la-check-circle" size="lg"/>
        <!--        <q-img fit="contain" height="32px" src="src/assets/checkmark.webp"/>-->
        <div class="request-wait">
          <span>We will <em>notify</em> you when {{ ride.Driver.Name }} reviews the proposed route.</span>
          <span>Fingers crossed!</span>
          <div class="notification-icons">
            <q-icon name="las la-at" size="sm"/>
            <q-icon name="las la-bell" size="sm"/>
          </div>

        </div>

        <!--      <q-btn color="primary" flat label="Search Return" rounded/>-->
        <!--        <aside class="actions">-->
        <!--          <span class="text-action">Search for a return ride</span>-->
        <!--          <span>@16:00, after the "Human Computer Interaction" lecture</span>-->
        <!--        </aside>-->

        <!--        <a href="">Leave a comment to Konstantin</a>-->

        <div class="text-action">
          <q-btn color="accent" label="Search for a return ride" outline rounded @click="SearchReturnRides()"/>
          <span class="action-comment">* on the same day, at the end of your last lecture</span>
        </div>

        <div class="text-action">
          <q-btn color="accent" label="Add a comment to your request" outline rounded/>
        </div>

        <div class="text-action">
          <q-btn color="accent" label="View your Pending Requests" outline rounded/>
        </div>

      </section>

    </div>

  </q-page>

</template>

<script lang="ts" setup>

import { useNavigationStore } from 'stores/navigation-store'
import { RideParameters, useRideStore } from 'stores/ride-store'
import { computed } from 'vue'
import { Ride } from 'src/models/ride'
import { date } from 'quasar'
import { useRouter } from 'vue-router'

const ns = useNavigationStore()
const rs = useRideStore()
const router = useRouter()

const ride = computed<Ride>(() => {
  if (rs.ride === undefined) {
    throw new Error('Missing ride')
  }
  return rs.ride
})

ns.hideToolbar()
rs.requestSelectedRide()

function SearchReturnRides (): void {
  // invert destination and origin
  const newParameters: RideParameters = {
    ...rs.rideParameters,
    Origin: rs.rideParameters.Destination,
    Destination: rs.rideParameters.Origin,
    ArriveBy: date.addToDate(rs.rideParameters.ArriveBy, { hours: 3 })
  }

  rs.reset()
  rs.setNewParameters(newParameters)
  router.push('/search-results')
  rs.generateNewRides()
  ns.showToolbar()
}

async function ReviewRide (): Promise<void> {
  await router.go(-1)
  ns.showToolbar()
}

</script>

<style lang="scss" scoped>
@import "src/css/quasar.variables.scss";

.container {
  display: flex;
  height: 100vh;
  flex-direction: column;
  background-color: $primary;
  color: $on-primary;
}

header {
  flex-grow: 5;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.messages {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  background-color: $surface-variant;
  color: $on-surface-variant;
  border-top-right-radius: 24px;
  border-top-left-radius: 24px;
  justify-content: center;
}

.request-sent {
  margin-top: 1rem;
  font-weight: bold;
  font-size: x-large;
}

.request-wait {
  display: flex;
  flex-direction: column;
  margin: 2rem;
  font-weight: normal;
  font-size: small;
  text-align: center;
  font-style: italic;
}

.request-wait em {
  font-weight: bold;
}

.actions {
  margin: 2rem;
}

.text-action {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.action-comment {
  font-style: italic;
  font-size: xx-small;
}

.notification-icons {
  margin-top: 16px;
}

</style>
