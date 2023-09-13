<script lang="ts" setup>

import { useRouter } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { LocationMode, useLocationStore } from 'stores/location-store'
import { FavouritePlace, Place, SapienzaPlace } from 'src/models/place'
import { QInput } from 'quasar'
import { useDriveStore } from 'src/stores/driveStore'
import { useRideStore } from 'stores/ride-store'
import { useNavigationStore } from 'stores/navigation-store'
import { useUserStore } from 'stores/user-store'

const router = useRouter()
const ls = useLocationStore()
const rs = useRideStore()
const ds = useDriveStore()
const ns = useNavigationStore()
const us = useUserStore()

const formInput = ref<QInput>()
const locationInput = ref<string>('')
const addressHint = ref<string>('')
const suggestedAddresses = ref<ReadonlyArray<string>>([])

const placeholder = computed<string>(() => {
  switch (ls.locationMode) {
    case LocationMode.SearchOrigin:
      return 'Enter a starting point or course name'
    case LocationMode.SearchDestination:
      return 'Enter a destination or course name'
    default:
      return 'Enter a location or course name'
  }
})

const filteredFavourites = computed<ReadonlyArray<FavouritePlace>>(() => {
  const input = locationInput.value.toLowerCase()
  return input ? ls.favouritePlaces.filter(f => f.Address.toLowerCase().includes(input)) : ls.favouritePlaces
})

const sapienzaResults = computed<ReadonlyArray<{ place: SapienzaPlace, courseIds: Set<string> }>>(() => {
  if (!locationInput.value.toLowerCase()) return []
  const input = locationInput.value.toLowerCase()
  const placesFromAddress = ls.sapienzaPlaces.filter(f => f.Address.toLowerCase().includes(input) || f.Label.toLowerCase().includes(input))
  const placesFromCourse = us.courses.filter(c => c.acro.toLowerCase().includes(input) || c.name.toLowerCase().includes(input)).map(c => c.location)
  const uniqueResults = Array.from(new Set([...placesFromAddress, ...placesFromCourse]))
  return uniqueResults.map(place => ({
    place,
    courseIds: new Set(us.courses.filter(c => c.location.Address === place.Address).map(c => c.id))
  }))
})

const filteredRecentAddresses = computed<ReadonlyArray<string>>(() => {
  const input = locationInput.value // must cache it to avoid closures capturing the wrong value
  return !input.length ? ls.recentAddresses : ls.recentAddresses.filter(a => a.toLowerCase().includes(input.toLowerCase()))
})

const campuses = computed<Set<SapienzaPlace>>(() => {
  return new Set(us.courses.map(c => c.location))
})

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
  ns.goBack()
}

function fillAddress (address: string): void {
  locationInput.value = `${address} `
  formInput.value?.focus()
  if ((/\d+\s$/).test(locationInput.value)) return
  addressHint.value = 'No.'
}

const isCompleteAddress = (address: string): boolean => (/^(\w+)\s[A-Za-z]+\s\d+$/).test(address)

const completeAddress = computed<boolean>(() => isCompleteAddress(locationInput.value))

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
  if (!captureNumber(place.Address)) {
    place.Address = `${place.Address}, 1`
  } else {
    // add a comma to addresses with numbers
    place.Address = place.Address.replace(/(\b\w+\b)\s+(\d+)$/, '$1, $2')
  }

  switch (ls.locationMode) {
    case LocationMode.SearchOrigin:
      rs.updateParameters({ Origin: place })
      ls.addRecentAddress(place.Address)
      ns.goBack()
      break
    case LocationMode.SearchDestination:
      rs.updateParameters({ Destination: place })
      ls.addRecentAddress(place.Address)
      ns.goBack()
      break
    case LocationMode.CreateOrigin:
      ds.updateField('Origin', place)
      router.push('/create-ride/dest')
      break
    case LocationMode.CreateDestination:
      ds.updateField('Destination', place)
      router.push('/create-ride/passengers')
      break
    default:
      throw new Error('invalid parameter while selecting location')
  }
}

watch(locationInput, (newValue, oldValue) => {
  // don't generate random addresses when:
  // there aren't enough characters to generate sensible suggestions
  // the currently input one is of good form
  if (newValue.length < 3 || isCompleteAddress(newValue)) {
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

    <section class="search-box">
      <q-btn flat icon="arrow_back" @click="closeModal()"/>
      <q-form autofocus class="search-box-form" @submit="selectAddress(locationInput)">
        <q-input ref="formInput"
                 v-model="locationInput"
                 :placeholder="placeholder"
                 :shadow-text="addressHint"
                 borderless
                 class="search-box-input"
                 debounce="300"
                 maxlength="25"
        >
          <template v-if="locationInput.length" v-slot:append>
            <q-icon class="cursor-pointer" name="cancel" @click.stop.prevent="locationInput = ''"/>
          </template>
        </q-input>
      </q-form>
    </section>

    <q-list class="locations-list" padding>

      <template v-if="sapienzaResults.length">
        <q-item-label header>Sapienza Facilities</q-item-label>

        <q-item v-for="result in sapienzaResults" :key="result.place.Address" v-ripple clickable
                @click="selectPlace(result.place)">
          <q-item-section avatar>
            <q-avatar class="address-icon" icon="school"/>
          </q-item-section>
          <q-item-section class="address-section">
            <q-item-label>{{ result.place.Label }}</q-item-label>
            <q-item-label caption class="address">{{ result.place.Address }}</q-item-label>
            <div class="location-lectures">
              <q-chip v-for="id in result.courseIds" :key="id" class="chip--small">
                {{ us.getCourseById(id).acro }}
              </q-chip>
            </div>
          </q-item-section>
          <q-item-section side>
            <q-icon color="secondary" name="arrow_forward_ios"/>
          </q-item-section>
        </q-item>
      </template>

      <template v-if="completeAddress">
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

      <template v-if="!locationInput.length">
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
      </template>

      <template v-if="filteredRecentAddresses.length">
        <q-item-label header>Recent Searches</q-item-label>
        <q-item v-for="address in filteredRecentAddresses" :key="address" v-ripple clickable
                @click="selectAddress(address)">
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
      </template>

      <template v-if="filteredFavourites.length">
        <q-item-label header>Favourite Places</q-item-label>

        <q-item v-for="place in filteredFavourites" :key="place.Address" v-ripple clickable
                @click="selectPlace(place)">
          <q-item-section avatar>
            <q-avatar :icon="place.Icon" class="address-icon"/>
          </q-item-section>
          <q-item-section class="address-section">
            <q-item-label>{{ place.Label }}</q-item-label>
            <q-item-label caption class="address">{{ place.Address }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon color="secondary" name="arrow_forward_ios"/>
          </q-item-section>
        </q-item>

      </template>

      <template v-if="!locationInput.length">
        <q-item-label header>Courses’ Facilities</q-item-label>

        <q-item v-for="place in campuses" :key="place.Address" v-ripple clickable
                @click="selectPlace(place)">
          <q-item-section avatar>
            <q-avatar class="address-icon" icon="school"/>
          </q-item-section>
          <q-item-section class="address-section">
            <q-item-label>{{ place.Label }}</q-item-label>
            <q-item-label caption class="address">{{ place.Address }}</q-item-label>
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
  display: flex;
  color: $on-surface-variant;
  background-color: $surface-variant;
  border-radius: 8px;
  margin: 8px;
  padding-right: 16px;
  width: calc(100% - 32px);
}

.search-box-form {
  flex: 5;
}

.search-box-input {
  font-size: medium;
  flex-grow: 5;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  align-items: center;
}

.locations-list {
  padding-right: 16px; // matches the search box' clear button alignment
  font-size: medium;
  width: 100%;
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

.address {
  opacity: 80%;
  font-size: small;
  color: $on-background;
}

.location-lectures {
  display: flex;
  justify-content: flex-start;
  flex-grow: 1;
}

</style>
