<script lang="ts" setup>

import { useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { Place } from 'src/models/place'
import { useRideStore } from 'stores/ride-store'
import { useLocationStore } from 'stores/location-store'

const props = defineProps<{ target: 'origin' | 'destination' }>()
const router = useRouter()
const rs = useRideStore()
const ls = useLocationStore()

const locationInput = ref<string>()
const places = ref<ReadonlyArray<Place>>([])

function closeModal (): void {
  router.replace('/search-results')
}

function selectPlace (place: Place): void {
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
  if (newValue === '' || newValue === undefined) {
    places.value = []
  } else if (newValue !== oldValue) {
    places.value = ls.genAddresses(newValue)
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

      <q-item v-for="place in places" :key="place.Address" v-ripple clickable @click="selectPlace(place)">
        <q-item-section avatar>
          <q-avatar icon="location_on"/>
        </q-item-section>
        <q-item-section no-wrap>
          <q-item-label lines="1">{{ place.Address }}</q-item-label>
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
