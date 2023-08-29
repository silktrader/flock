<template>

  <main key="date-selection" class="container">

    <header class="secondary-header">
      <q-btn aria-label="Back" flat icon="arrow_back" size="lg" @click="closeModal()"/>
      <section class="secondary-header-title">
        <span>Date and Time Selection</span>
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
          <q-btn v-if='nextLectureToday' class="outline-button" @click="updateDate(nextLectureToday?.date)">
            Next lecture today
          </q-btn>
          <q-btn v-if="firstLectureTomorrow" class="outline-button" @click="updateDate(firstLectureTomorrow?.date)">
            First lecture tomorrow
          </q-btn>
          <q-btn v-if="lectureNextWeek" class="outline-button" @click="updateDate(lectureNextWeek?.date)">
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
              <q-item-label caption lines="1">
                <q-icon name="map"/>
                {{ lecture.location.Label }}
              </q-item-label>
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
  router.go(-1)
}

const actionLabelHour = computed<string>(() => {
  return `${dateMode.value === DateMode.Arrive ? 'Arrive by' : 'Leave at'} ${ExtractTime(dateValue.value)}`
})

const actionLabelDate = computed<string>(() => {
  return `${FormatShortDate(dateValue.value)}`
})

const dayLectures = computed<Array<Lecture>>(() => {
  return us.lectures.filter(lecture => date.getDateDiff(dateValue.value, lecture.date) === 0)
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
    return us.lectures.find(lecture => lecture.date > now && date.getDateDiff(lecture.date, now) === 0) ?? null
  }
)

// informs whether there's a lecture the next day
const firstLectureTomorrow = computed<Lecture | null>(
  () => us.lectures.filter(lecture => date.getDateDiff(lecture.date, tomorrow) === 0).sort((a, b) => +(a.date > b.date))[0] ?? null
)

const endLectureTomorrow = computed<Date | null>(
  () => {
    const lecture: Lecture | null = us.lectures.filter(lecture => date.getDateDiff(lecture.date, tomorrow) === 0).sort((a, b) => +(b.date > a.date))[0] ?? null
    return addToDate(lecture.date, { minutes: lecture.duration })
  })

const endLectureToday = computed<Date | null>(
  () => {
    const lecture: Lecture | null = us.lectures.filter(lecture => date.getDateDiff(lecture.date, today) === 0).sort((a, b) => +(b.date > a.date))[0] ?? null
    return addToDate(lecture.date, { minutes: lecture.duration })
  })

const lectureNextWeek = computed<Lecture | null>(
  () => {
    const sameDayNextWeek = date.addToDate(today, { days: 7 })
    const day = sameDayNextWeek.getDate()
    const month = sameDayNextWeek.getMonth()
    return us.lectures.filter(lecture => lecture.date.getDate() === day && lecture.date.getMonth() === month)
      .sort((a, b) => +(a.date > b.date))[0] ?? null
  }
)

</script>

<style lang="scss" scoped>

@import "src/css/quasar.variables.scss";

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  align-items: center;
}

.contents {
  display: flex;
  flex-direction: column;
  flex: 1;
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
  padding-left: 16px;
  padding-right: 16px;
  min-width: 0;
  height: 200px; // fix height to avoid layout changes when no lectures are included
}

.no-lectures {
  font-style: italic;
  text-align: center;
  width: 100%;
}

.lecture-name {
  flex-grow: 2;
}

.lecture-details {
  flex-grow: 3;
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
