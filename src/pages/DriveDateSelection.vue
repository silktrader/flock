<script lang="ts" setup>
import DateSelector from 'components/date-selection/DateSelector.vue'
import { useDriveStore } from 'src/stores/driveStore'
import { useRouter } from 'vue-router'
import { ExtractTime, FormatShortDate } from 'src/tools/date-tools'
import { date } from 'quasar'
import { computed, ref } from 'vue'
import { Lecture } from 'src/models/lecture'
import { useUserStore } from 'stores/user-store'
import { Drive } from 'src/models/drive'

const us = useUserStore()
const ds = useDriveStore()
const router = useRouter()
// const dateValue = ref<Date>(ds.temporaryDrive.Departure ? ds.temporaryDrive.Departure : new Date())
const tempDrive : Drive = {
  Id: 0,
  Origin: {
    Label: '',
    Address: ''
  },
  Destination: {
    Label: '',
    Address: ''
  },
  Arrival: new Date(),
  Departure: new Date(),
  CarS: {
    model: 'Tesla Model 3',
    seats: 3,
    electric: true,
    airConditioning: true,
    airBag: true
  },
  Earning: 0,
  FreeSeats: 3,
  Recurring: false
}

ds.setTemporaryDrive(tempDrive)

const dateValue = ref<Date>(ds.temporaryDrive.Departure)

const dayLectures = computed<Array<Lecture>>(() => {
  return us.lectures.filter(lecture => date.getDateDiff(dateValue.value, lecture.date) === 0)
})

const actionLabel = computed<string>(() => {
  const modeModifiers = ['Leave', 'at']
  return `${modeModifiers[0]} ${FormatShortDate(dateValue.value)} ${modeModifiers[1]} ${ExtractTime(dateValue.value)}`
})

function selectDriveDate (): void {
  ds.updateField('Departure', dateValue.value)
  router.push('/create-ride/start')
}

function abort (): void {
  ds.clearTemporaryDrive()
  router.push('/')
}

</script>

<template>
  <q-page class="column">
    <header class="modal-header">
      <q-btn aria-label="Back" flat icon="arrow_back" size="lg" @click="abort()"/>
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
      <div class="instruction" style="text-align: center;">When do you leave?</div>
      <date-selector v-model="dateValue" :minuteStep="5" class="time-sel"/>
      <section class="lectures">
        <q-list>
          <q-item-label header>Lectures of the Day</q-item-label>

          <q-item v-if="dayLectures.length === 0">
            <span class="no-lectures">No Lectures</span>
          </q-item>
            <q-item v-for="lecture in dayLectures" v-else :key="lecture.courseId">
                <q-item-section class="lecture-name">
                <q-item-label lines="2">{{ us.getCourseById(lecture.courseId).name }}</q-item-label>
                </q-item-section>
                <q-item-section class="lecture-details">
                <q-item-label lines="1">
                    <q-icon name="schedule"/>
                    {{
                    ExtractTime(lecture.date)
                    }} - {{ ExtractTime(date.addToDate(lecture.date, { minute: lecture.duration })) }}
                </q-item-label>
                </q-item-section>
            </q-item>
            </q-list>
        </section>
        <footer style="margin-top: 30px;">
          <q-page-sticky :offset="[55, 200]" position="bottom-right">
            <q-btn class="pulsingButton fab-button" fab icon="arrow_forward" @click="selectDriveDate()"/>
          </q-page-sticky>
        </footer>
      </div>
    </q-page>
  </template>

<style lang="scss" scoped>
@import "src/css/quasar.variables.scss";

.time-sel {
  margin: auto;
  margin-bottom: 30px;
}

.filled-button--full-width {
  width: 100%;
}

</style>
