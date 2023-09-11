<template>
    <q-page class="column">
      <div
        style="text-align: center; padding-top: 4%; font-weight: 400; font-size: x-large; font-family:Georgia, 'Times New Roman', Times, serif;">
        Create Ride
      </div>
      <div class="column col q-pa-md">
        <q-stepper
          v-model="step"
          animated
          class="col"
          color="secondary"
          style="background-color: rgba(0, 0, 0, 0.75);"
          vertical
        >
          <q-step
            :done="step > 1"
            :name="1"
            active-icon="route"
            title="Your route"
          >
            <div style="padding-bottom: 1em; font-size:small; font-weight: 300; padding-right: 1em;">
              Choose your starting position, your destination, and maximum detour time for picking up the passengers:
            </div>
            <div class="row">
              <div class="column justify-center">
                <q-icon name="radio_button_unchecked" size="sm"/>
                <q-icon name="more_vert" size="sm"/>
                <q-icon name="location_on" size="sm"/>
              </div>
              <div class="col" style="margin-right:0.5em; margin-left: 0.5em;">

                <q-input ref="inputRef" v-model="startingAddress" :style="styleStart" dense label="From" outlined
                         rounded style="padding-bottom: 0.7em;">
                  <!--
                  <template v-slot:prepend>
                  <q-icon name="pin_drop" size="xs" />
                  </template>
                  -->
                </q-input>
                <q-select ref="selectRef" v-model="destinationAddress" :class="{ 'pulsing-effect': isPulsing }"
                          :options="options" behavior="menu" dense fill-input
                          hide-selected input-debounce="0" label="To" outlined
                          rounded style="white-space:nowrap; overflow: hidden;" use-input
                          @filter="filterFn">
                  <!--
                  <template v-slot:prepend>
                  <q-icon name="near_me" size="xs" />
                  </template>
                  -->
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>
            <div class="column" style="padding: 2em;">
              <!--
              <div style="text-align: center;">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d11992.638799841721!2d12.514236988292213!3d41.90253478353268!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sit!4v1687501489911!5m2!1sen!2sit"
                      width="200" height="200" style="border: 1.5px solid black;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
                  </iframe>
              </div>
              -->
              <div style="font-size: small; text-align: center;">
                Rendezvous distance: {{ value }} min
              </div>

              <q-slider
                v-model="value"
                :label-value="value + ' min'"
                :max="10"
                :min="1"
                color="primary"
                label
                label-always
                style="padding-top: 0.3em;"
                switch-label-side
              />
            </div>
            <q-stepper-navigation>
              <q-btn color="primary" icon-right="keyboard_double_arrow_down" label="Continue" @click="stepFront"/>
            </q-stepper-navigation>
          </q-step>

          <q-step
            :done="step > 2"
            :name="2"
            active-icon="event"
            icon="event"
            title="Date & Time"
          >
            <div class="column">
              <div style="padding-bottom: 1em; font-size:small; font-weight: 300; padding-right: 1em;">
                Choose the date of the ride, the departure time, and if it's recurrent:
              </div>
              <div class="row" style="margin-bottom: 1em">
                <q-checkbox
                  v-model="recurrentCheck"
                  :class="{ 'disabled-checkbox': date === '' }"
                  :disable="date === ''"
                  dense
                  label="Repeated ride"
                  rigth-label
                  @click="checkboxMakePulse"
                />
                <q-btn color="primary" dense flat icon="help" round size="sm" @click="helpDiag = true"/>
                <q-dialog v-model="helpDiag">
                  <q-card>
                    <q-card-section>
                      <div class="text-h6">Ride Repetition</div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                      If you want to set a recurrent ride, first select a date and then check the box.
                      The ride will be repeated every week, the same day of the week you choose,
                      at the time you selected.
                    </q-card-section>

                    <q-card-actions align="right">
                      <q-btn v-close-popup color="primary" flat label="OK"/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>
              </div>
              <q-input v-if="recurrentCheck" v-model="everyWeekdayModel" :class="{ 'square-pulsing-effect': isPulsing }"
                       dense disable filled
                       label="Repeated:" style="margin-bottom: 1em;"/>
              <q-input v-if="! recurrentCheck" v-model="displayedDate" :class="{ 'pulsing-effect': isPulsing }" dense
                       label="Select date" outlined readonly
                       rounded style="margin: 0 0 1em">
                <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                  <q-date v-model="date" :options="dateLimiter" mask="dddd, MMMM Do YYYY">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup color="primary" flat label="Next"/>
                    </div>
                  </q-date>
                </q-popup-proxy>
                <template v-slot:prepend>
                  <q-icon class="cursor-pointer" name="event"/>
                </template>
              </q-input>
              <q-input v-model="time" :class="{ 'pulsing-effect': isPulsing }" dense label="Select time" outlined readonly
                       rounded>
                <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                  <q-time v-model="time" :minute-options="[0,5,10,15,20,25,30,35,40,45,50,55]" format24h mask="HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup color="primary" flat label="Next"/>
                    </div>
                  </q-time>
                </q-popup-proxy>
                <template v-slot:prepend>
                  <q-icon class="cursor-pointer" name="access_time"/>
                </template>
              </q-input>
            </div>
            <q-stepper-navigation>
              <q-btn color="primary" label="Continue" @click="stepFront"/>
              <q-btn class="q-ml-sm" color="primary" label="Back" outline @click="stepBack"/>
            </q-stepper-navigation>
          </q-step>

          <q-step
            :done="step > 3"
            :name="3"
            active-icon="hail"
            icon="hail"
            title="Passengers and price"
          >
            <div style="padding-bottom: 1em; font-size:small; font-weight: 300; padding-right: 1em;">
              Choose your vehicle, the number of passengers you are willing to take and their monetary contribution:
            </div>
            <div class="row">
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
                <q-select v-model="carModel" :options="['Panda', 'Tesla']" dense filled options-dense
                          style="padding-left: 1em; padding-bottom: 1em;"/>
                <q-select v-model="seatsNumber" :options="seats" dense filled options-dense
                          style="padding-left: 1em; padding-bottom: 1em;"/>
                <q-input v-model="priceString" dense filled style="padding-left: 1em; max-width: 123px;">
                  <template v-slot:prepend>
                    <q-btn dense flat icon="remove" size="sm" @click="decreasePrice"/>
                  </template>
                  <template v-slot:append>
                    <q-btn dense flat icon="add" size="sm" @click="increasePrice"/>
                  </template>
                </q-input>
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn color="primary" label="Continue" @click="createDiag = true"/>
              <q-btn class="q-ml-sm" color="primary" label="Back" outline @click="stepBack"/>
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
        <q-dialog v-model="createDiag" @hide="resetDialog">

          <q-card style="padding: 0 1em 0 1em; width: 300px; height: 300px;">

            <q-card-section v-show="showInfos">
              <div class="text-h6">Confirm</div>
              <q-separator spaced/>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <div v-show="showInfos">
                <div style="text-align: center; font-size:medium;">
                  {{ recurrentCheck ? everyWeekdayModel : date.slice(0, -5) }}
                </div>
                <div style="padding-bottom: 1em; text-align: center;">
                  {{ time }}
                </div>
                <div style="min-width: 200px;">
                  <div class="row">
                    <div style="font-weight: bold; padding-right: 2px; padding-bottom: 0.2em;">From:</div>
                    <div style="font-style: italic;"> {{ startingAddress }}</div>
                  </div>

                  <div class="row">
                    <div style="font-weight: bold; padding-right: 2px;">To:</div>
                    <div style="font-style: italic;"> {{ destinationAddress }}</div>
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
                      : {{ value }} min
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
              <q-btn v-show="showInfos" color="primary" dense label="Create"
                     style="font-size:smaller; margin-bottom: 1em;" @click="confirmation"/>
            </div>

            <q-inner-loading :showing="circle_progress">
              <q-spinner-gears color="primary" size="100px"/>
            </q-inner-loading>
          </q-card>
        </q-dialog>
      </div>
    </q-page>
  </template>

<script>
import { ref } from 'vue'
import { date } from 'quasar'

const stringOptions = ['Città Universitaria', 'Castro Laurenziano',
  'Centro Sportivo', 'Laboratorio d\'informatica',
  'Via Salaria 113', 'Via della A.Lungimira']

export default {

  setup () {
    const options = ref(stringOptions)

    return {
      options,

      filterFn (val, update, abort) {
        update(() => {
          const needle = val.toLowerCase()
          options.value = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
        })
      },

      dateLimiter (day) {
        return day >= date.formatDate(new Date(), 'YYYY/MM/DD')
      }

    }
  },

  data () {
    return {
      destinationAddress: '',
      startingAddress: 'Your location',
      weekDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      step: 1,
      value: 1,
      searchDate: '',
      time: '06:30',
      recurrentCheck: false,
      carModel: 'Panda',
      seats: [1, 2, 3, 4, 5, 6],
      seatsNumber: 1,
      price: 0,
      priceString: '0$',
      isPulsing: false,
      isRotated: false,
      helpDiag: false,
      createDiag: false,
      moreRecap: false,
      circle_progress: false,
      showInfos: true,
      showCreatedMessage: false
    }
  },

  computed: {
    everyWeekdayModel () {
      return 'Every ' + this.searchDate.slice(0, this.searchDate.indexOf(','))
    },
    displayedDate () {
      return this.searchDate.slice(0, -5)
    },
    styleStart () {
      if (this.startingAddress === 'Your location') {
        return 'font-style: italic;'
      } else {
        return ''
      }
    },
    styleDest () {
      if (this.destinationAddress === 'Your location') {
        return 'font-style: italic;'
      } else {
        return ''
      }
    }
  },
  methods: {

    stepBack () {
      if (this.step !== 1) {
        this.step -= 1
      }
    },
    stepFront () {
      if (this.step === 1 && this.destinationAddress === '') {
        this.makePulse()
        return
      }
      if (this.step === 2) {
        if (!this.recurrentCheck && (this.time === '' || this.searchDate === '')) {
          this.makePulse()
          return
        }
        if (this.recurrentCheck && this.time === '') {
          this.makePulse()
          return
        }
      }
      if (this.step !== 3) {
        this.step += 1
      }
    },
    increasePrice () {
      if (this.price < 10) {
        this.price += 0.50
        this.price = parseFloat(this.price.toFixed(2))
        this.priceString = this.price.toString() + '$'
      }
    },
    decreasePrice () {
      if (this.price > 0) {
        this.price -= 0.50
        this.price = parseFloat(this.price.toFixed(2))
        this.priceString = this.price.toString() + '$'
      }
    },
    makePulse () {
      this.isPulsing = true
      setTimeout(() => {
        this.isPulsing = false
      }, 1250) // 1250 milliseconds, same duration as the CSS animation
    },
    checkboxMakePulse () {
      if (this.searchDate === '') {
        this.makePulse()
      }
    },
    confirmation () {
      this.circle_progress = true
      this.showInfos = false
      setTimeout(() => {
        this.circle_progress = false
        this.showCreatedMessage = true
        this.step = 1
        this.value = 0
        this.destinationAddress = ''
        this.date = ''
        this.time = '06:30'
        this.recurrentCheck = false
        this.seatsNumber = 1
        this.price = 0
        this.priceString = '0$'
      }, 2500)
    },
    resetDialog () {
      this.createDiag = false
      this.showInfos = true
      this.showCreatedMessage = false
    }
  },
  mounted () {
    const inputWidth = this.$refs.inputRef.$el.offsetWidth
    this.$refs.selectRef.$el.style.maxWidth = inputWidth + 'px'
  }
}
</script>

  <style>
  .disabled-checkbox {
    color: rgb(156, 156, 156)
  }

  .pulsing-effect {
    animation: pulse 1.25s infinite;
    border-radius: 30px;
  }

  .square-pulsing-effect {
    animation: pulse 1.25s infinite;
    border-radius: 5px;
  }

  .q-dialog__backdrop {
    backdrop-filter: blur(2px);
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 white
    }
    50% {
      box-shadow: 0 0 0 2px red
    }
    100% {
      box-shadow: 0 0 0 0 white
    }
  }

  </style>
