<template>

  <q-page class="results-container">

    <header class="modal-header">
      <!--      <q-btn aria-label="Back" flat icon="arrow_back" size="lg" @click="router.go(-1)"/>-->
      <div class="modal-header-spacer"/>
      <section class="modal-header-title">
        <span>Ride Search</span>
        <!--        <span class="modal-header-subtitle">Results</span>-->
      </section>
      <section>
        <q-btn aria-label="Close" flat icon="close" size="lg" @click="abort()"/>
      </section>
    </header>

    <search-controls-v1 v-if="us.options.debug.searchControls === SearchControls.FullPage"/>
    <search-controls-v2 v-else/>

    <q-separator/>

    <div v-if="rs.searching" class="loading-spinner">
      <span>searching for rides ...</span>
      <q-spinner color="accent" size="xl"/>
    </div>

    <div v-else-if="rides.length === 0" class="no-results-container">
      <transition
        appear
        enter-active-class="animated tada"
        leave-active-class="animated fadeOut">
        <div key="no-results-notice" class="no-results-notice">
          <div class="no-results-notice-image">
            <q-img alt="No Results Found" fit="contain" height="60px" src="~/assets/failure-car.svg"/>
          </div>
          <span>No rides found!</span>
        </div>
      </transition>
      <transition
        v-if="!ridesNotified"
        appear
        enter-active-class="animated zoomIn"
        leave-active-class="animated zoomOut"
        mode="out-in">
        <div key="no-results-prompt" class="no-results-prompt">
          <span>Should we notify you when somebody arranges such a ride?</span>
          <q-btn class="tonal-button" label="Notify Me" @click="notifyRide()"/>
        </div>
      </transition>
      <transition
        v-else
        appear
        enter-active-class="animated zoomIn"
        leave-active-class="animated zoomOut"
        mode="out-in">
        <div key="no-results-notified" class="no-results-prompt">
          <q-icon name="notification_add" size="md"/>
          <span>We'll tell you once someone schedules this ride.</span>
        </div>
      </transition>
    </div>

    <div v-else-if="us.options.debug.resultCards === ResultCards.Intricate" class="ride-cards">
      <search-result-v1 v-for='ride in rides' :key='ride.id' :r="ride"/>
    </div>

    <div v-else class="ride-cards">
      <search-result-v2 v-for='ride in rides' :key='ride.id' :ride="ride"/>
    </div>

  </q-page>

</template>

<script lang="ts" setup>

import { useRideStore } from 'stores/ride-store'
import { computed } from 'vue'
import SearchResultV1 from 'components/SearchResultV1.vue'
import SearchResultV2 from 'components/SearchResultV2.vue'
import { useRouter } from 'vue-router'
import { Ride } from 'src/models/ride'
import SearchControlsV1 from 'components/SearchControlsV1.vue'
import SearchControlsV2 from 'components/SearchControlsV2.vue'
import { useUserStore } from 'stores/user-store'
import { date } from 'quasar'
import { ResultCards, SearchControls } from 'src/models/options'

const rs = useRideStore()
const us = useUserStore()
const router = useRouter()

// parade rides starting from the ones users are most interested in; the shortest
const rides = computed<ReadonlyArray<Ride>>(() => [...rs.rides].sort(sortByDurationThenRecurring))

const ridesNotified = computed<boolean>(function () {
  const params = rs.searchParameters
  return us.rideNotifications.some(n =>
    date.getDateDiff(n.Date, params.Date, 'minutes') < 10 &&
    n.DateMode === params.DateMode &&
    n.Origin === params.Origin &&
    n.Destination === params.Destination
  )
})

function sortByDurationThenRecurring (a: Ride, b: Ride): number {
  if (a.TotalDuration > b.TotalDuration) return -1
  if (a.TotalDuration < b.TotalDuration) return 1
  if (!a.recurring && b.recurring) return -1
  return 0
}

async function abort (): Promise<void> {
  await router.replace('/')
  rs.reset()
}

function notifyRide (): void {
  us.notifyRide(rs.searchParameters)
}

</script>

<style lang="scss" scoped>
@import "src/css/quasar.variables.scss";

.results-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: 0;
}

.no-results-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding-top: 50px;
  gap: 16px;
  color: $on-background;
}

.no-results-notice {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: max-content;
  align-items: center;
  text-align: center;
  //color: $on-secondary-container;
  color: $warning;
  font-size: medium;
}

.no-results-notice-image {
  display: flex;
  align-items: center;
  height: 120px;
  width: 120px;
  background-color: $warning;
  border-radius: 100%;
  padding: 8px;
}

.no-results-prompt {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 64px;
  align-items: center;
  text-align: center;
  color: $on-background;

  i {
    color: $on-background;
  }
}

.ride-cards {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
  overflow: auto;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
  margin: auto;
  color: $accent;

  span {
    font-style: italic;
    font-size: medium;
  }
}

.dialog {
  padding: 8px;
  background-color: $surface-variant;
  color: $on-surface-variant;
}

</style>
