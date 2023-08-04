<script lang="ts" setup>

import { useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { useRideStore } from 'stores/ride-store'
import { useLocationStore } from 'stores/location-store'

const props = defineProps<{ target: 'origin' | 'destination' }>()
const router = useRouter()
const rs = useRideStore()
const ls = useLocationStore()

const locationInput = ref<string>()
const places = ref<ReadonlyArray<string>>([])

// const preSelectedStreet = ref<string | null>(null)

function sanitiseAddress (address: string): string {
  return address.replace(/^(Via|Largo|Borgo|Contrada|Strada|Vicolo|Piazza)\s+|\s+\d+$/gi, '').trim()
}

function captureNumber (address: string): number | null {
  const matches = address.match(/\d+/g)
  if (matches !== null) {
    return Number(matches[0])
  }
  return null
}

function closeModal (): void {
  router.replace('/search-results')
}

function selectPlace (address: string): void {
  // determine if the address is missing a number and assign a default if necessary
  if (!captureNumber(address)) address = `${address}, 1`

  const place = {
    Address: address,
    Label: ''
  }
  if (props.target === 'destination') {
    rs.updateParameters({ Destination: place })
  } else if (props.target === 'origin') {
    rs.updateParameters({ Origin: place })
  } else {
    throw new Error('invalid parameter while selecting location')
  }
  router.replace('/search-results')
}

watch(locationInput, (newValue, oldValue) => {
  if (newValue === undefined || newValue.length < 3) {
    places.value = []
  } else if (newValue !== oldValue) {
    // extract number and append it to randomly generated addresses
    const number = captureNumber(newValue)
    const addresses = ls.genAddresses(sanitiseAddress(newValue))
    places.value = addresses.map(a => a + (number === null ? '' : `, ${number}`))
  }
})

</script>

<template>
  <main class="container">

    <header class="modal-header">
      <div class="modal-header-spacer"></div>
      <section class="modal-header-title">
        <span>Select a location</span>
      </section>
      <section>
        <q-btn aria-label="Close" flat icon="close" size="lg" @click="closeModal()"/>
      </section>
    </header>

    <section class="search-box">
      <q-input v-model="locationInput"
               clearable
               debounce="500"
               maxlength="25"
               outlined
               placeholder="Street or square name"
               rounded
      />
    </section>

    <q-list class="locations-list" padding separator>

      <q-item v-if="places.length === 0" v-ripple clickable
              @click="selectPlace({Label: 'Gamification Lab', Address: 'Via dei Volsci, 122'})">
        <q-item-section avatar>
          <q-avatar icon="my_location"/>
        </q-item-section>
        <q-item-section no-wrap>
          <q-item-label lines="1">Use current location</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon color="primary" name="navigate_next" size="lg"/>
        </q-item-section>
      </q-item>

      <q-item v-for="place in places" :key="place" v-ripple clickable @click="selectPlace(place)">
        <q-item-section avatar>
          <q-avatar icon="location_on"/>
        </q-item-section>
        <q-item-section no-wrap>
          <q-item-label lines="1">{{ place }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon color="primary" name="navigate_next" size="lg"/>
        </q-item-section>
      </q-item>

    </q-list>

  </main>
</template>

<style lang="scss" scoped>

@import "src/css/quasar.variables.scss";

.search-box {
  color: $on-secondary-container;
  background-color: $secondary-container;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 16px;
  width: 100%;
  justify-content: center;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  align-items: center;
}

.locations-list {
  font-size: medium;
  width: 100%;
}

.location-label {
  font-size: medium;
  color: $primary;
}

.location-address {
  font-size: small;
  color: $secondary;
}

</style>
