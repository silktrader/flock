<template>

  <q-page>
    <div class="container">

      <header class="request-sent-header">
        <div class="close-button">
          <q-btn aria-label="Close" flat icon="close" size="lg" @click="abort()"/>
        </div>
        <div style="flex-grow: 3"></div>
        <q-img fit="contain" height="200px" src="~/assets/success-car.svg"/>
        <div style="flex-grow: 3"></div>
      </header>

      <section class="messages">

        <span class="request-sent">Request Sent!</span>
        <q-icon name="las la-check-circle" size="lg"/>
        <div class="request-wait">
          <span>We will <em>notify</em> you when {{ ride.Driver.displayName }} reviews the proposed route.</span>
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

      </section>

    </div>

  </q-page>

</template>

<script lang="ts" setup>

import { useRideStore } from 'stores/ride-store'
import { computed } from 'vue'
import { Ride } from 'src/models/ride'
import { date } from 'quasar'
import { useRouter } from 'vue-router'
import { SearchParameters } from 'src/models/search-parameters'

const rs = useRideStore()
const router = useRouter()

const ride = computed<Ride>(() => {
  if (rs.ride === undefined) {
    throw new Error('Missing ride')
  }
  return rs.ride
})

async function abort (): Promise<void> {
  await router.replace('/')
  rs.reset()
}

function SearchReturnRides (): void {
  // invert destination and origin
  const newParameters: SearchParameters = {
    ...rs.searchParameters,
    Origin: rs.searchParameters.Destination,
    Destination: rs.searchParameters.Origin,
    Date: date.addToDate(rs.searchParameters.Date, { hours: 3 })
  }

  // tk review these steps
  rs.reset()
  rs.updateParameters(newParameters)
  router.push('/search-results')
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

.request-sent-header {
  flex-grow: 5;
  display: flex;
  flex-direction: column;
}

.close-button {
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
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
