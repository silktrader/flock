<script lang="ts" setup>

import { useRouter } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { useRideStore } from 'stores/ride-store'
import { useLocationStore } from 'stores/location-store'
import { Place } from 'src/models/place'
import { QInput } from 'quasar'

const props = defineProps<{ target: 'origin' | 'destination' }>()
const router = useRouter()
const rs = useRideStore()
const ls = useLocationStore()

const formInput = ref<QInput>()
const locationInput = ref<string | null>(null)
const addressHint = ref<string>('')
const suggestedAddresses = ref<ReadonlyArray<string>>([])

function sanitiseAddress (address: string): string {
  return address.replace(/^(Via|Largo|Vicolo|Piazza)\s+|\s+\d+$/gi, '').trim()
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

function fillAddress (address: string): void {
  locationInput.value = `${address} `
  formInput.value?.focus()
  if ((/\d+\s$/).test(locationInput.value)) return
  addressHint.value = 'No.'
}

const isCompleteAddress = (address: string): boolean => (/^(\w+)\s[A-Za-z]+\s\d+$/).test(address)

const completeAddress = computed<boolean>(() => (!!locationInput.value && isCompleteAddress(locationInput.value)))

function removeHint (): void {
  addressHint.value = ''
}

function selectAddress (address: string): void {
  selectPlace({
    Address: address,
    Label: ''
  })
}

function selectPlace (place: Place): void {
  // determine if the address is missing a number and assign a default if necessary
  if (!captureNumber(place.Address)) place.Address = `${place.Address}, 1`

  if (props.target === 'destination') {
    rs.updateParameters({ Destination: place })
  } else if (props.target === 'origin') {
    rs.updateParameters({ Origin: place })
  } else {
    throw new Error('invalid parameter while selecting location')
  }

  ls.addRecentAddress(place.Address)
  router.replace('/search-results')
}

watch(locationInput, (newValue, oldValue) => {
  // don't generate random addresses when:
  // there aren't enough characters to generate sensible suggestions
  // the currently input one is of good form
  if (newValue === null || newValue.length < 3 || isCompleteAddress(newValue)) {
    suggestedAddresses.value = []
    removeHint()
  } else if (newValue !== oldValue) {
    if (!newValue?.endsWith(' ')) removeHint()
    // extract number and append it to randomly generated addresses
    const number = captureNumber(newValue)
    suggestedAddresses.value = ls.genAddresses(sanitiseAddress(newValue)).map(a => a + (number === null ? '' : `, ${number}`))
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
      <q-input ref="formInput"
               v-model="locationInput"
               :shadow-text="addressHint"
               clearable
               debounce="300"
               maxlength="25"
               outlined
               placeholder="Street or square name"
               rounded
      />
    </section>

    <q-list class="locations-list" padding>

      <template v-if="completeAddress && locationInput">
        <q-item v-ripple clickable @click="selectAddress(locationInput)">
          <q-item-section avatar>
            <q-avatar class="address-icon" icon="pin_drop"/>
          </q-item-section>
          <q-item-section class="address-section">
            <q-item-label lines="1">{{ locationInput }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon color="secondary" name="arrow_forward_ios"/>
          </q-item-section>
        </q-item>
      </template>

      <template v-else-if="suggestedAddresses.length">
        <q-item-label header>Suggestions</q-item-label>
        <q-item v-for="address in suggestedAddresses" :key="address">
          <q-item-section avatar>
            <q-avatar class="address-icon" icon="location_on"/>
          </q-item-section>
          <q-item-section v-ripple class="address-section" clickable @click="selectAddress(address)">
            <q-item-label lines="1">{{ address }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn v-if="isCompleteAddress(address)" color="secondary" dense flat icon="arrow_forward_ios"
                   @click="selectAddress(address)"/>
            <q-btn v-else color="secondary" dense flat icon="north_west" @click="fillAddress(address)"/>
          </q-item-section>
        </q-item>
      </template>

      <q-item-label header>Current Location</q-item-label>
      <q-item v-ripple clickable @click="selectPlace({Label: 'Gamification Lab', Address: 'Via dei Volsci, 122'})">
        <q-item-section avatar>
          <q-avatar class="address-icon" icon="my_location"/>
        </q-item-section>
        <q-item-section class="address-section">
          <q-item-label>Use Current Location</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon color="secondary" name="arrow_forward_ios"/>
        </q-item-section>
      </q-item>

      <template v-if="!suggestedAddresses.length && ls.recentAddresses.length > 0 && !completeAddress">
        <q-item-label header>Recent Searches</q-item-label>
        <q-item v-for="address in ls.recentAddresses" :key="address" v-ripple clickable @click="selectAddress(address)">
          <q-item-section avatar>
            <q-avatar class="address-icon" icon="las la-history"/>
          </q-item-section>
          <q-item-section class="address-section">
            <q-item-label lines="1">{{ address }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon color="secondary" name="arrow_forward_ios"/>
          </q-item-section>
        </q-item>

        <q-item-label header>Favourite Places</q-item-label>
        <q-item v-for="place in ls.favouritePlaces" :key="place.Address" v-ripple clickable @click="selectPlace(place)">
          <q-item-section avatar>
            <q-avatar :icon="place.Icon" class="address-icon"/>
          </q-item-section>
          <q-item-section class="address-section">
            <q-item-label>{{ place.Label }}</q-item-label>
            <q-item-label caption>{{ place.Address }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon color="secondary" name="arrow_forward_ios"/>
          </q-item-section>
        </q-item>
      </template>

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
  font-size: medium;
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

.address-icon {
  color: $secondary;
}

.address-section {
  cursor: pointer;
  color: $secondary;
  min-height: 40px;
  font-size: medium;
}

</style>
