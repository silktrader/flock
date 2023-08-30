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
        <q-btn aria-label="Close" flat icon="las la-bug" size="sm" @click="showOptions = true"/>
        <q-btn aria-label="Close" flat icon="close" size="lg" @click="abort()"/>
      </section>
    </header>

    <search-controls-v1 v-if="searchControlsVersion === 'a'"/>
    <search-controls-v2 v-else/>

    <q-separator/>

    <div v-if="rs.searching" class="loading-spinner">
      <span>searching for rides ...</span>
      <q-spinner color="accent" size="50px"/>
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

    <div v-else-if="resultCardVersion === 'a'" class="ride-cards">
      <search-result-v1 v-for='ride in rides' :key='ride.Id' :r="ride"/>
    </div>

    <div v-else-if="resultCardVersion === 'b'" class="ride-cards">
      <transition-group
        appear
        enter-active-class="animated slideInUp"
        leave-active-class="animated slideOutDown"
        mode="out-in">
        <search-result-v2 v-for='ride in rides' :key='ride.Id' :r="ride"/>
      </transition-group>
    </div>

    <!--    Debug prompt offering components versions choice-->
    <q-dialog v-model="showOptions">
      <q-card class="dialog">
        <q-card-section>
          <div class="text-h6">Component Versions</div>
        </q-card-section>

        <q-list>

          <q-item-label header>Search Controls</q-item-label>
          <q-item dense>
            <q-item-section>
              <q-btn-toggle
                v-model="searchControlsVersion"
                :options="[{label: 'Initial', value: 'a'}, {label: 'Expanded', value: 'b'}]"
                outline
                rounded
                toggle-color="primary"
              />
            </q-item-section>
          </q-item>

          <q-item-label header>Results Cards</q-item-label>
          <q-item dense>
            <q-item-section>
              <q-btn-toggle
                v-model="resultCardVersion"
                :options="[{label: 'Initial', value: 'a'}, {label: 'Streamlined', value: 'b'}]"
                outline
                rounded
                toggle-color="primary"
              />
            </q-item-section>
          </q-item>

        </q-list>

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Close" no-caps/>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>

</template>

<script lang="ts" setup>

import { useRideStore } from 'stores/ride-store'
import { computed, ref } from 'vue'
import SearchResultV1 from 'components/SearchResultV1.vue'
import SearchResultV2 from 'components/SearchResultV2.vue'
import { useRouter } from 'vue-router'
import { Ride } from 'src/models/ride'
import SearchControlsV1 from 'components/SearchControlsV1.vue'
import SearchControlsV2 from 'components/SearchControlsV2.vue'
import { useUserStore } from 'stores/user-store'
import { date } from 'quasar'

const rs = useRideStore()
const us = useUserStore()
const router = useRouter()

const showOptions = ref<boolean>(false)
const resultCardVersion = ref<string>('b')
const searchControlsVersion = ref<string>('b')

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
  if (!a.Recurring && b.Recurring) return -1
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
  font-style: italic;
  color: $on-background;
}

.dialog {
  padding: 8px;
  background-color: $surface-variant;
  color: $on-surface-variant;
}

</style>
