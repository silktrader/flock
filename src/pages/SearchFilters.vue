<script lang="ts" setup>

import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useRideStore } from 'stores/ride-store'

const router = useRouter()
const rs = useRideStore()

const maxPickupTime = ref<number>(rs.searchParameters.reachTime)
const pickupOptions: Array<{ label: string, value: number }> = [{
  label: '5',
  value: 5
}, {
  label: '10',
  value: 10
}, {
  label: '20',
  value: 20
}, {
  label: '30',
  value: 30
}]

const freeSeats = ref<number>(rs.searchParameters.freeSeats)
const freeSeatsOptions: Array<{ label: string, value: number }> = [{
  label: '1',
  value: 1
}, {
  label: '2',
  value: 2
}, {
  label: '3 or more',
  value: 3
}]

const busAllowed = ref<boolean>(rs.searchParameters.busAllowed)
const subwayAllowed = ref<boolean>(rs.searchParameters.subwayAllowed)
const ladiesOnly = ref<boolean>(rs.searchParameters.ladiesOnly)
const smokersAllowed = ref<boolean>(false)
const masksOnly = ref<boolean>(false)

function closeModal (): void {
  rs.updateParameters({
    reachTime: maxPickupTime.value,
    busAllowed: busAllowed.value,
    subwayAllowed: subwayAllowed.value,
    ladiesOnly: ladiesOnly.value
  })
  router.go(-1)
}

</script>

<template>

  <main class="container">

    <header class="secondary-header">
      <q-btn aria-label="Back" flat icon="arrow_back" size="lg" @click="closeModal()"/>
      <section class="modal-header-title">
        <span>Filters Selection</span>
      </section>
      <span class="q-space"/>
      <!--      <q-btn aria-label="Menu" flat icon="more_vert" round>-->
      <!--        <q-menu>-->
      <!--          <q-list style="min-width: 100px">-->
      <!--            <q-item v-close-popup clickable>-->
      <!--              <q-item-section>Reset</q-item-section>-->
      <!--            </q-item>-->
      <!--          </q-list>-->
      <!--        </q-menu>-->
      <!--      </q-btn>-->
    </header>

    <q-list padding>

      <q-item-label header>Pickup</q-item-label>
      <q-item>
        <q-item-section>
          <q-item-label>Pickup Time</q-item-label>
          <q-item-label caption>Maximum travel time, in minutes, to reach the driver's pickup location.
          </q-item-label>
          <div class="segmented-button-container">
            <q-btn-toggle v-model="maxPickupTime" :options="pickupOptions" class="button-toggle"/>
          </div>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label>Subway</q-item-label>
          <q-item-label caption>Ride the subway to reach the driver's pickup if needed.</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle v-model="subwayAllowed" :disable="maxPickupTime === 0"/>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label>Bus</q-item-label>
          <q-item-label caption>Take the bus to reach the driver's pickup if needed.</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle v-model="busAllowed" :disable="maxPickupTime === 0"/>
        </q-item-section>
      </q-item>

      <q-separator spaced/>

      <q-item-label header>Carpoolers</q-item-label>
      <q-item>
        <q-item-section>
          <q-item-label>Ladies Only</q-item-label>
          <q-item-label caption>Travel in a vehicle exclusively with women.</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle v-model="ladiesOnly"/>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label>Smokers</q-item-label>
          <q-item-label caption>Ride with other smoking or vaping passengers.</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle v-model="smokersAllowed"/>
        </q-item-section>
      </q-item>

      <q-separator spaced/>

      <q-item-label header>Comfort</q-item-label>

      <q-item>
        <q-item-section>
          <q-item-label>Free Seats</q-item-label>
          <q-item-label caption>Number of free seats in the car.</q-item-label>
          <div class="segmented-button-container">
            <q-btn-toggle v-model="freeSeats" :options="freeSeatsOptions" class="button-toggle"
            />
          </div>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label>Masks</q-item-label>
          <q-item-label caption>Ride in a mask-required car to avoid health concerns.</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle v-model="masksOnly"/>
        </q-item-section>
      </q-item>

    </q-list>

  </main>
</template>

<style lang="scss" scoped>

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  align-items: center;
}

.segmented-button-container {
  display: flex;
  width: 100%;
  //justify-content: center;
  margin-top: 16px;
}

.trip-options-toggles {
  display: flex;
  flex-direction: column;
}

</style>
