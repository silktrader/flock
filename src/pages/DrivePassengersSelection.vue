<template>
    <q-page class="column">
      <header class="modal-header">
        <q-btn aria-label="Back" flat icon="arrow_back" size="lg" @click="router.go(-2)"/>
        <div class="modal-header-spacer"/>
        <section class="modal-header-title">
          <span style="padding-right: 1em; font-weight: bolder;">Drive Creation</span>
          <!--        <span class="modal-header-subtitle">Results</span>-->
        </section>
        <section>
          <q-btn aria-label="Close" flat icon="close" size="lg" @click="abort()"/>
        </section>
      </header>
      <q-separator/>
      <div class="column general-container">
      <div class="instruction" style="text-align: center;">How many passengers are you willing to take? </div>
        <div class="row justify-center" style="padding-top: 1em">
          <div class="column justify-around">
            <div style="padding-bottom: 1em;">
              <q-icon name="directions_car" size="xs"/>
              Select Vehicle:
            </div>
            <div style="padding-bottom: 1em;">
              <q-icon name="airline_seat_recline_extra" size="xs"/>
              Available seats:
            </div>
            <div>
              <q-icon name="paid" size="xs"/>
              Price per seat:
            </div>
          </div>
          <div class="column">
            <q-select v-model="selectCarString" :options="carsArray" filled
                      style="padding-left: 1em; padding-bottom: 1em;"/>
            <q-input v-model="seatsNumber" filled style="padding-left: 1em; max-width: 157px; padding-bottom: 1em;">
              <template v-slot:prepend>
                <q-btn round icon="remove" size="sm" @click="decreaseSeats" style="margin-right: 1.4em"/>
              </template>
              <template v-slot:append>
                <q-btn round icon="add" size="sm" @click="increaseSeats"/>
              </template>
            </q-input>
            <q-input v-model="priceString" filled style="padding-left: 1em; max-width: 157px;">
              <template v-slot:prepend>
                <q-btn round icon="remove" size="sm" @click="decreasePrice"  style="margin-right: 0.75em"/>
              </template>
              <template v-slot:append>
                <q-btn round icon="add" size="sm" @click="increasePrice"/>
              </template>
            </q-input>
          </div>
        </div>
      </div>
      <q-page-sticky :offset="[45, 210]" position="bottom-right">
          <q-btn class="pulsingButton fab-button" fab icon="arrow_forward" @click="lastStep()"/>
      </q-page-sticky>
    </q-page>
</template>

<script lang="ts" setup>
import { useDriveStore } from 'src/stores/driveStore'
import { useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { cars, CarSpec } from 'src/models/car'

const carsArray = ['Tesla Model', 'Nissan Leaf', 'Mazda 2']
const selectedCar = ref<CarSpec>()
const selectCarString = ref('Nissan Leaf')
const ds = useDriveStore()
const router = useRouter()
const seatsNumber = ref<number>(1)
const priceString = ref<string>('0$')
const price = ref<number>(0)

watch(selectCarString, (newVal) => {
  if (newVal) {
    selectedCar.value = cars.find((car) => car.model === newVal)
  }
})

function abort (): void {
  ds.clearTemporaryDrive()
  router.push('/')
}

function increaseSeats (): void {
  if (seatsNumber.value < 5) {
    seatsNumber.value += 1
  }
}

function decreaseSeats (): void {
  if (seatsNumber.value > 0) {
    seatsNumber.value -= 1
  }
}

function increasePrice (): void {
  if (price.value < 10) {
    price.value += 0.50
    price.value = parseFloat(price.value.toFixed(2))
    priceString.value = price.value.toString() + '$'
  }
}

function decreasePrice (): void {
  if (price.value > 0) {
    price.value -= 0.50
    price.value = parseFloat(price.value.toFixed(2))
    priceString.value = price.value.toString() + '$'
  }
}

function lastStep (): void {
  ds.updateField('CarS', selectedCar.value)
  ds.updateField('Earning', price.value * seatsNumber.value)
  ds.updateField('FreeSeats', seatsNumber.value)
  router.push('/create-ride/recap')
}

</script>

<style lang="scss" scoped>

@import "src/css/quasar.variables.scss";

</style>
