<template>
  <q-page>

    <div class="trip">

      <div style="flex-grow: 1"></div>

      <div class="trip-box">
        <div class="trip-box-indicators">
          <q-icon name="trip_origin" size="sm"/>
          <div id="route-dots"/>
          <q-icon name="location_on" size="sm"/>
        </div>
        <div class="trip-box-fields">
          <q-select
            v-model="origin"
            :options="originOptions"
            behavior="menu"
            dense
            fill-input
            hide-dropdown-icon
            hide-selected
            input-debounce="0" label-color="secondary"
            option-label="Label"
            option-value="Address"
            outlined
            rounded
            use-input
            @filter="filterOrigins"
          >
            <template v-if="origin === null" v-slot:selected>
              <div>Enter an address</div>
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-italic text-grey">
                  No address found
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-select
            v-model="destination"
            :options="ls.sapienzaPlaces"
            behavior="menu"
            dense
            option-label="Label"
            option-value="Address" outlined
            rounded/>
        </div>
      </div>

      <div style="flex-grow: 1"></div>

      <div class="trip-date-time">
        <span>Arriving</span>
        <q-input v-model="friendlyDate" class="trip-date" dense>
          <template v-slot:append>
            <q-icon class="cursor-pointer" name="event">
              <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                <q-date v-model="arrivalDate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close"/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <span>by</span>

        <q-input v-model="arrivalTime" :rules="['time']" autogrow class="trip-time" dense mask="time">
          <template v-slot:append>
            <q-icon class="cursor-pointer" name="access_time">
              <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                <q-time v-model="arrivalTime">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close"/>
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

      </div>

      <div style="flex-grow: 1"></div>

      <div class="trip-options">
        <div class="trip-options-pickup">
          <div>
            <span>Time to reach a pickup spot</span>
            <q-btn dense flat icon="help" round>
              <q-tooltip style="text-align: center">
                How long are you willing to travel to reach a specific spot on a driver's route where you'll be picked
                up.
              </q-tooltip>
            </q-btn>
          </div>
          <span v-if="maxPickupTime === pickupTimeLimit" class="time-result">{{
              pickupTimeLimit
            }} minutes or more</span>
          <span v-else class="time-result">{{ maxPickupTime }} minutes</span>
          <q-slider
            v-model="maxPickupTime"
            :label-value="maxPickupTime + ' min.'"
            :max="30"
            :min="5"
            label
            switch-label-side
          />
        </div>
        <div class="trip-options-toggles">
          <q-toggle
            v-model="bus"
            :disable="maxPickupTime === 0"
            label="I can ride a bus"
          />
          <q-toggle
            v-model="subway"
            :disable="maxPickupTime === 0"
            label="I can take the subway"
          />
        </div>
      </div>

      <div style="flex-grow: 5"></div>

      <div class="trip-action">
        <q-btn class="filled-button" label="Search" no-caps rounded size="lg" @click="search"/>
      </div>

      <div style="flex-grow: 1"></div>

    </div>

  </q-page>

</template>

<script lang="ts" setup>

import { computed, Ref, ref } from 'vue'
import { date, useQuasar } from 'quasar'
import { LeftButton, useNavigationStore } from 'stores/navigation-store'
import { useRouter } from 'vue-router'
import { useRideStore } from 'stores/ride-store'
import { useLocationStore } from 'stores/location-store'
import { Place } from 'src/models/place'

const ns = useNavigationStore()
const rs = useRideStore()
const ls = useLocationStore()
const router = useRouter()
const q = useQuasar()

// tk remove these
ns.setTitle('Ride Search')
ns.setSubtitle('')
ns.setButton(LeftButton.Menu)
rs.reset()

// location
const originOptions: Ref<string[]> = ref([])

const origin = ref<Place>(ls.getDefaultHomeLocation())
const destination = ref<Place>(ls.getDefaultSapienzaLocation())

function filterOrigins (val: string, update: (fn: () => void) => void, abort: () => void): void {
  if (val.length < 2) {
    abort()
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    originOptions.value = ls.favouritePlaces.filter(v => v.Address.toLowerCase().indexOf(needle) > -1).map(l => l.Address)
  })
}

// date
const today = new Date()
const tomorrowString = date.formatDate(date.addToDate(today, { days: 1 }), 'YYYY/MM/DD')
const arrivalDate = ref(tomorrowString)
const arrivalTime = ref('09:00')

const friendlyDate = computed(() => {
  const diff = date.getDateDiff(date.extractDate(arrivalDate.value, 'YYYY/MM/DD'), today, 'days')
  switch (diff) {
    case 0:
      return 'today'
    case 1:
      return 'tomorrow'
    default:
      return arrivalDate.value
  }
})

// trip options
const bus = ref(true)
const subway = ref(true)
const pickupTimeLimit = 30
const maxPickupTime = ref(20)

function search (): void {
  // prevent submission when missing fields
  if (origin.value?.Address === undefined) {
    q.notify({
      type: 'warning',
      message: 'Please enter an origin address',
      position: 'bottom'
    })
  } else {
    // store the search parameters for display and random results generation
    const rs = useRideStore()
    rs.updateParameters({
      Origin: origin.value,
      Destination: destination.value,
      Date: date.extractDate(`${arrivalDate.value} ${arrivalTime.value}`, 'YYYY/MM/DD HH:mm'),
      reachTime: maxPickupTime.value,
      busAllowed: bus.value,
      subwayAllowed: subway.value
    })
    router.push('/search-results')
  }
}

</script>

<style lang="scss" scoped>
@import "src/css/quasar.variables.scss";

.trip {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(99vh - 50px);
  width: 85vw;
  margin: auto;
}

.trip-box {
  display: flex;
  flex-direction: row;
  background-color: #23261d;
  //color: $on-secondary-container;
  color: rgb(228, 227, 221);
  width: 100%;
  border-radius: 24px;
  padding: 2rem 1rem 2rem 1rem;
  gap: 1rem;
}

.trip-box-indicators {
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 4;
}

.trip-box-indicators i {
  width: 100%;
  padding-top: 5px;
  padding-bottom: 5px;
}

#route-dots {
  position: relative;
  height: 24px;
  width: 24px;
  background-size: 24px 24px;
  background-image: url(//maps.gstatic.com/consumer/images/icons/1x/route_3dots_grey650_24dp.png);
  background-repeat: no-repeat;
}

.trip-box-fields {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 3;
}

.trip-date-time {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: baseline;
  gap: 6px;
  max-width: 400px;
  margin: auto;
  font-size: medium;
  font-style: italic;
}

.trip-date {
  min-width: 14ch;
  width: min-content;
  font-size: medium;
}

.trip-time {
  min-width: 9ch;
  width: min-content;
  font-size: medium;
}

.trip-options {
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  gap: 2rem;
  font-size: medium;
}

.trip-options span {
  text-align: center;
}

.trip-options-pickup {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 90vw;
}

.trip-options-toggles {
  display: flex;
  flex-direction: column;
  margin: auto;
}

/*.pickup-time {*/
/*  border: 1px solid #027be3*/
/*}*/

.time-result {
  font-style: italic;
  font-size: small;
}

.trip-action {
}

</style>
