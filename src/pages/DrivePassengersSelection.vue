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
          <q-btn class="pulsingButton fab-button" fab icon="arrow_forward" @click="createDiag = true"/>
      </q-page-sticky>
      <q-dialog v-model="createDiag" @hide="resetDialog">
        <q-card style="padding: 0 1em 0 1em; width: 300px; height: 320px;" class="diagColor">

          <q-card-section v-show="showInfos">
            <div class="text-h6">Confirm</div>
            <q-separator spaced/>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div v-show="showInfos">
              <div style="text-align: center; font-size:medium;">
                {{ ExtractDate(ds.temporaryDrive.Departure) }}
                <!--{{ recurrentCheck ? everyWeekdayModel : date.slice(0, -5) }} -->
              </div>
              <div style="padding-bottom: 1em; text-align: center;">
                {{ ExtractTime(ds.temporaryDrive.Departure) }}
              </div>
              <div style="min-width: 200px;">
                <div class="row">
                  <div style="font-weight: bold; padding-right: 2px; padding-bottom: 0.2em;">From:</div>
                  <div style="font-style: italic;"> {{ds.temporaryDrive.Origin.Address}}</div>
                </div>

                <div class="row">
                  <div style="font-weight: bold; padding-right: 2px;">To:</div>
                  <div style="font-style: italic;"> {{ds.temporaryDrive.Destination.Address}}</div>
                </div>

                <div
                  style="color:lightseagreen; text-align: center; padding-top: 0.4em; padding-bottom: 0.5em; font-style: italic; font-size:small;"
                  @click="moreRecap= !moreRecap">
                  <u> More </u>
                </div>

                <div v-if="moreRecap" class="row justify-around" style="padding-top: 0.5em;">
                  <div>
                    <q-icon name="emoji_people" size="1.5em"/>
                    : {{ seatsNumber }}
                  </div>
                  <div style="padding: 0 1.2em 0 1.6em;">
                    <q-icon name="savings" size="1.5em"/>
                    : {{ price * seatsNumber + '$' }}
                  </div>
                  <div>
                    <q-icon name="mode_of_travel" size="1.5em"/>
                    : 40 min
                  </div>
                </div>

              </div>
            </div>
            <div v-show="showCreatedMessage">
              <div style="text-align: center; padding-top: 30%;">
                <q-icon color="green" name="check_circle" size="xl"/>
                <div style="padding-top: 0.5em; padding-bottom: 2em; font-size: large;"> Ride successfully created !
                </div>
              </div>
              <div class="column" style="padding: 0 3em">
                <q-btn color="primary" dense outline style="font-size: smaller; margin-bottom: 0.8em;">Your hosted
                  rides
                </q-btn>
                <q-btn color="primary" dense outline style="font-size: smaller;">Create return ride</q-btn>
              </div>
              <div
                style="font-style: italic; font-size: smaller; text-align: center; padding-left: 1em; padding-top: 0.2em; color: greenyellow;">
                *After the end of your last lecture
              </div>
            </div>
          </q-card-section>

          <div class="row justify-center">
            <q-btn v-show="showInfos" class="createButton" label="Create"
                  style="font-size:smaller;" @click="confirmation"/>
          </div>

          <q-inner-loading :showing="circleProgress">
            <q-spinner-gears color="primary" size="100px"/>
          </q-inner-loading>
        </q-card>
      </q-dialog>
    </q-page>
</template>

<script lang="ts" setup>
import { useDriveStore } from 'src/stores/driveStore'
import { useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { cars, CarSpec } from 'src/models/car'
import { ExtractDate, ExtractTime } from 'src/tools/date-tools'

const carsArray = ['Tesla Model', 'Nissan Leaf', 'Mazda 2']
const selectedCar = ref<CarSpec>()
const selectCarString = ref('Nissan Leaf')
const ds = useDriveStore()
const router = useRouter()
const seatsNumber = ref<number>(1)
const priceString = ref<string>('0$')
const price = ref<number>(0)

const createDiag = ref(false)
const showInfos = ref(true)
const showCreatedMessage = ref(false)
const moreRecap = ref(false)
const circleProgress = ref(false)

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

function resetDialog (): void {
  createDiag.value = false
  showInfos.value = true
  showCreatedMessage.value = false
}

function confirmation (): void {
  ds.updateField('CarS', selectedCar.value)
  ds.updateField('Earning', price.value * seatsNumber.value)
  ds.updateField('FreeSeats', seatsNumber.value)
  ds.addDrive(ds.temporaryDrive)
  circleProgress.value = true
  showInfos.value = false
  setTimeout(() => {
    circleProgress.value = false
    showCreatedMessage.value = true
  }, 2500)
  console.log(ds.drives[0])
}

</script>

<style lang="scss" scoped>

@import "src/css/quasar.variables.scss";

.pulsingButton {
  box-shadow: 0 0 0 0 $primary-container;
  animation: pulsing 2s infinite cubic-bezier(0.66, 0, 0, 0.8);
  font-size: 22px;
  font-weight: normal;
  font-family: sans-serif;
  text-decoration: none !important;
  color: #ffffff;
  transition: all 300ms ease-in-out;
}
/* Comment-out to have the button continue to pulse on mouseover */
/* Animation */
@keyframes pulsing {
  0% {
    box-shadow: 0 0 0 0 $primary-container;
  }
  80% {
    box-shadow: 0 0 0 18px rgba(0,0,0,0);
  }
  100% {
    box-shadow: 0 0 0 18px rgba(0,0,0,0);
  }
}

.diagColor {
  background-color: rgb(31, 31, 31);
}

.createButton {
  background-color: $primary-container;
  color: white
}

</style>
<style>
.q-dialog__backdrop {
    backdrop-filter: blur(5px);
  }
</style>
