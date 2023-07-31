<template>

  <main class="date-selection-container">

    <header class="modal-header">
      <div class="modal-header-spacer"></div>
      <section class="modal-header-title">
        <span>Date and Time Selection</span>
      </section>
      <section>
        <q-btn aria-label="Close" flat icon="close" size="lg" @click="closeModal()"/>
      </section>
    </header>

    <q-tabs v-model="dateMode" active-color="secondary" align="center" content-class="date-mode-selector" no-caps>
      <q-tab label="Arrive By" name="arrive"/>
      <q-tab label="Leave At" name="leave"/>
    </q-tabs>

    <div class="contents">

      <section style="flex-grow: 1"/>

      <date-selector v-model="dateValue" :minute-step="selectorMinuteStep"/>

      <section class="hints">
        <template v-if="dateMode === DateMode.Arrive">
          <q-btn v-if='nextLectureToday' class="outline-button" outline rounded
                 @click="updateDate(nextLectureToday?.Date)">
            Next lecture today
          </q-btn>
          <q-btn v-if="firstLectureTomorrow" class="outline-button"
                 outline rounded @click="updateDate(firstLectureTomorrow?.Date)">
            First lecture tomorrow
          </q-btn>
          <q-btn v-if="lectureNextWeek" class="outline-button"
                 outline rounded @click="updateDate(lectureNextWeek?.Date)">
            First lecture next week
          </q-btn>
        </template>

        <template v-else>
          <q-btn class="outline-button"
                 outline rounded @click="updateDate(oneHourFromNow())">
            One hour from now
          </q-btn>
          <q-btn v-if="endLectureToday" class="outline-button"
                 outline rounded @click="updateDate(endLectureToday)">
            After last lecture today
          </q-btn>
          <q-btn v-if="endLectureTomorrow" class="outline-button"
                 outline rounded @click="updateDate(endLectureTomorrow)">
            After last lecture tomorrow
          </q-btn>
        </template>
      </section>

      <section style="flex-grow: 2"/>

      <section class="lectures">
        <q-list padding>
          <q-item-label header>Lectures of the Day</q-item-label>

          <q-item v-if="dayLectures.length === 0">
            <span class="no-lectures">No Lectures</span>
          </q-item>

          <q-item v-for="lecture in dayLectures" v-else :key="lecture.Date">
            <q-item-section>
              <q-item-label>{{ lecture.Course }}</q-item-label>
            </q-item-section>
            <q-item-section>
            <span class="lecture-details"><q-icon name="schedule"/>{{
                ExtractTime(lecture.Date)
              }} - {{ ExtractTime(date.addToDate(lecture.Date, { minute: lecture.Duration })) }}</span>
              <span class="lecture-details"><q-icon name="map"/>{{ lecture.Location.Label }}</span>
            </q-item-section>
          </q-item>
        </q-list>
      </section>

    </div>

    <section class="action-button">
      <q-btn class="filled-button" @click="selectDate()">
        <div class="action-button-contents">
          <span>{{ actionLabelHour }}</span>
          <span>{{ actionLabelDate }}</span>
        </div>
      </q-btn>
    </section>

  </main>

</template>

<script lang="ts" setup>

import { useRouter } from 'vue-router'
import { DateMode, ExtractTime, FormatShortDate } from 'src/tools/date-tools'
import { date } from 'quasar'

import { computed, ref } from 'vue'
import { Lecture } from 'src/models/lecture'
import { useUserStore } from 'stores/user-store'
import DateSelector from 'components/DateSelector.vue'
import { useRideStore } from 'stores/ride-store'
import addToDate = date.addToDate

const router = useRouter()
const us = useUserStore()
const rs = useRideStore()

const today = new Date()
today.setHours(8)
today.setMinutes(0)
today.setSeconds(0)
today.setMilliseconds(0)
const tomorrow = date.addToDate(today, { day: 1 })

const selectorMinuteStep = 5

const dateMode = ref<DateMode>(DateMode.Arrive)
const dateValue = ref<Date>(rs.searchParameters.Date)

function closeModal (): void {
  router.replace('/search-results')
}

const actionLabelHour = computed<string>(() => {
  return `${dateMode.value === DateMode.Arrive ? 'Arrive by' : 'Leave at'} ${ExtractTime(dateValue.value)}`
})

const actionLabelDate = computed<string>(() => {
  return `${FormatShortDate(dateValue.value)}`
})

const dayLectures = computed<Array<Lecture>>(() => {
  return us.lectures.filter(lecture => date.getDateDiff(dateValue.value, lecture.Date) === 0)
})

function updateDate (date: Date): void {
  dateValue.value = date
}

const oneHourFromNow = () => date.addToDate(new Date(), { minutes: 60 })

function selectDate (): void {
  rs.updateParameters({
    Date: dateValue.value,
    DateMode: dateMode.value
  })
  closeModal()
}

const nextLectureToday = computed<Lecture | null>(
  () => {
    const now = new Date()
    return us.lectures.find(lecture => lecture.Date > now && date.getDateDiff(lecture.Date, now) === 0) ?? null
  }
)

// informs whether there's a lecture the next day
const firstLectureTomorrow = computed<Lecture | null>(
  () => us.lectures.filter(lecture => date.getDateDiff(lecture.Date, tomorrow) === 0).sort((a, b) => +(a.Date > b.Date))[0] ?? null
)

const endLectureTomorrow = computed<Date | null>(
  () => {
    const lecture: Lecture | null = us.lectures.filter(lecture => date.getDateDiff(lecture.Date, tomorrow) === 0).sort((a, b) => +(b.Date > a.Date))[0] ?? null
    return addToDate(lecture.Date, { minutes: lecture.Duration })
  })

const endLectureToday = computed<Date | null>(
  () => {
    const lecture: Lecture | null = us.lectures.filter(lecture => date.getDateDiff(lecture.Date, today) === 0).sort((a, b) => +(b.Date > a.Date))[0] ?? null
    return addToDate(lecture.Date, { minutes: lecture.Duration })
  })

const lectureNextWeek = computed<Lecture | null>(
  () => {
    const sameDayNextWeek = date.addToDate(today, { days: 7 })
    const day = sameDayNextWeek.getDate()
    const month = sameDayNextWeek.getMonth()
    return us.lectures.filter(lecture => lecture.Date.getDate() === day && lecture.Date.getMonth() === month)
      .sort((a, b) => +(a.Date > b.Date))[0] ?? null
  }
)

</script>

<style lang="scss" scoped>

@import "src/css/quasar.variables.scss";

.date-selection-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  align-items: center;
}

.contents {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  gap: 24px;
  align-items: center;
}

.date-mode-select {
  font-size: medium;
}

.hints {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.lectures {
  flex-grow: 3;
  padding-left: 24px;
  padding-right: 24px;
  width: 100%;
}

.no-lectures {
  font-style: italic;
  text-align: center;
  width: 100%;
}

.lecture-details {
  display: flex;
  gap: 8px;
  align-items: center;
  white-space: nowrap;
  width: min-content;
}

.action-button {
  display: flex;
  justify-content: center;
  margin: 16px;
}

.action-button-contents {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 16px;
  padding-right: 16px;
}

.action-button-contents span:nth-child(2) {
  opacity: 65%;
}

</style>
