<template>

  <main class="results-container">

    <header class="modal-header">
      <q-btn aria-label="Back" flat icon="arrow_back" size="lg" @click="router.go(-1)"/>
      <section class="modal-header-title">
        <span>Ride Search</span>
        <span class="modal-header-subtitle">Results</span>
      </section>
      <section>
        <q-btn aria-label="Close" flat icon="las la-bug" size="sm" @click="showOptions = true"/>
        <q-btn aria-label="Close" flat icon="close" size="lg" @click="abort()"/>
      </section>
    </header>

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

    <div v-if="resultCardVersion === 'a'" class="ride-cards">
      <search-result-v1 v-for='ride in rs.rides' :key='ride.Id' :r="ride"/>
    </div>

    <div v-else-if="resultCardVersion === 'b'" class="ride-cards">
      <search-result-v2 v-for='ride in rs.rides' :key='ride.Id' :r="ride"/>
    </div>

    <q-dialog v-model="showOptions">
      <q-card class="dialog">
        <q-card-section>
          <div class="text-h6">Component Versions</div>
        </q-card-section>

        <q-item-label header>Results Cards</q-item-label>
        <q-item dense>
          <q-item-section>
            <q-btn-toggle
              v-model="resultCardVersion"
              :options="[{label: 'Initial', value: 'a'}, {label: 'Streamlined', value: 'b'}]"
              outline
              toggle-color="primary"
            />
          </q-item-section>
        </q-item>

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Close" no-caps/>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </main>

</template>

<script lang="ts" setup>

import { useRideStore } from 'stores/ride-store'
import { computed, ref } from 'vue'
import { ExtractTime, FormatFriendlyDate } from 'src/tools/date-tools'
import SearchResultV1 from 'components/SearchResultV1.vue'
import SearchResultV2 from 'components/SearchResultV2.vue'
import { useRouter } from 'vue-router'

const rs = useRideStore()
const router = useRouter()

const showOptions = ref<boolean>(false)
const resultCardVersion = ref<string>('b')

const arriveByTime = computed<string>(() => rs.rideParameters?.ArriveBy ? ExtractTime(rs.rideParameters.ArriveBy) : '')
const arriveByDate = computed<string>(() => rs.rideParameters?.ArriveBy ? FormatFriendlyDate(rs.rideParameters.ArriveBy) : '')

const destination = computed(() => rs.rideParameters.Destination)

async function abort (): Promise<void> {
  await router.replace('/')
  rs.reset()
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

#summary {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
  background-color: $secondary;
  color: $on-secondary;
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
  padding: 1rem;
  gap: 1rem;
  overflow: auto;
}

.ride-details-header em {
  font-style: normal;
  font-weight: bold;
}

.dialog {
  background-color: $surface-variant;
  color: $on-surface-variant;
}

</style>
