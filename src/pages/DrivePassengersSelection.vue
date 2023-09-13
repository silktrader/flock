<template>
    <q-page class="column">
      <header class="modal-header">
        <q-btn aria-label="Back" flat icon="arrow_back" size="lg" @click="router.go(-2)"/>
        <div class="modal-header-spacer"/>
        <section class="modal-header-title">
          <span style="padding-right: 1em; font-weight: bolder;"></span>
          <!--        <span class="modal-header-subtitle">Results</span>-->
        </section>
        <section>
          <q-btn aria-label="Close" flat icon="close" size="lg" @click="abort()"/>
        </section>
      </header>
      <q-separator/>
      <div class="column general-container">
      <div class="instruction" style="text-align: center;">How many passengers are you willing to take? </div>
      <div class="row justify-evenly" style="padding-top: 1em;">
        <q-btn icon="remove" glossy rounded flat class="operation-button" @click="decreaseSeats()"></q-btn>
        <div style="min-width: 140px; text-align: center;">
          <q-icon v-for="index in seatsNumber" :key="index" name="emoji_people" size="2.5em"></q-icon>
        </div>
        <q-btn icon="add" glossy rounded flat class="operation-button" @click="increaseSeats()"></q-btn>
      </div>
      <div class="row justify-evenly" style="font-size: large;">{{ seatsNumber }}</div>
      <div class="instruction" style="text-align: center;">How much will the pay? (Each) </div>
      <div class="row justify-evenly" style="padding-top: 1em;">
        <q-btn icon="remove" glossy rounded flat class="operation-button" @click="decreasePrice()"></q-btn>
        <div style="min-width: 140px; text-align: center;">
          <q-icon v-if="price === 0" name="block" size="2.5em"></q-icon>
          <q-icon v-else v-for="ind in price" :key="ind" name="euro_symbol" size="2.5em"></q-icon>
        </div>
        <q-btn icon="add" glossy rounded flat class="operation-button" @click="increasePrice()"></q-btn>
      </div>
      <div class="row justify-evenly" style="font-size: large;">{{ price !== 0 ? priceString: 'free' }}</div>
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

const ds = useDriveStore()
const router = useRouter()
const seatsNumber = ref<number>(1)
const priceString = ref<string>('0$')
const price = ref<number>(0)

function abort (): void {
  ds.clearTemporaryDrive()
  router.push('/')
}

function increaseSeats (): void {
  if (seatsNumber.value < 4) {
    seatsNumber.value += 1
  }
}

function decreaseSeats (): void {
  if (seatsNumber.value > 1) {
    seatsNumber.value -= 1
  }
}

function increasePrice (): void {
  if (price.value < 4) {
    price.value += 1
    price.value = parseFloat(price.value.toFixed(2))
    priceString.value = price.value.toString() + '$'
  }
}

function decreasePrice (): void {
  if (price.value > 0) {
    price.value -= 1
    price.value = parseFloat(price.value.toFixed(2))
    priceString.value = price.value.toString() + '$'
  }
}

function lastStep (): void {
  ds.updateField('Earning', price.value * seatsNumber.value)
  ds.updateField('FreeSeats', seatsNumber.value)
  router.push('/create-ride/recap')
}

</script>

<style lang="scss" scoped>

@import "src/css/quasar.variables.scss";

.operation-button {
  color: $on-tertiary-container;
  background-color: $tertiary-container;
}

</style>
