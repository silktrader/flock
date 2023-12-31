<script lang="ts" setup>

import { useRouter } from 'vue-router'
import { DateMode, ExtractTime, FormatLongDate, FormatShortDate, today } from 'src/tools/date-tools'
import { date } from 'quasar'

import { computed, ref } from 'vue'
import { Lecture } from 'src/models/lecture'
import { useUserStore } from 'stores/user-store'
import DateSelector from 'components/date-selection/DateSelector.vue'
import { useRideStore } from 'stores/ride-store'
import LectureHintVertical from 'components/date-selection/LectureHintVertical.vue'
import { LectureHints } from 'src/models/options'
import LectureHintTable from 'components/date-selection/LectureHintTable.vue'

const router = useRouter()
const us = useUserStore()
const rs = useRideStore()

const tomorrow = date.addToDate(today, { day: 1 })

const selectorMinuteStep = 5

const dateMode = ref<DateMode>(DateMode.Arrive)
const dateValue = ref<Date>(rs.searchParameters.Date)

function closeModal (): void {
  router.go(-1)
}

const actionLabel = computed<string>(() => {
  const modeModifiers = dateMode.value === DateMode.Arrive ? ['Arrive', 'by'] : ['Leave', 'at']
  return `${modeModifiers[0]} ${FormatShortDate(dateValue.value)} ${modeModifiers[1]} ${ExtractTime(dateValue.value)}`
})

// Lists all the lectures occurring on the selected day, sorted according to their start time.
const dayLectures = computed<Array<Lecture>>(() => {
  return us.lectures
    .filter(lecture => date.getDateDiff(dateValue.value, lecture.date) === 0)
    .sort((a, b) => a.date > b.date ? 1 : -1)
})

const dateLabel = computed<string>(() => {
  const formattedDate = FormatLongDate(dateValue.value)
  return ['tomorrow', 'today'].includes(formattedDate.toLowerCase())
    ? `Lectures ${formattedDate.toLowerCase()}`
    : `Lectures on ${formattedDate}`
})

function getLectureDate (lecture: Lecture): Date {
  return (dateMode.value === DateMode.Arrive)
    ? lecture.date
    : date.addToDate(lecture.date, { minutes: lecture.duration })
}

function updateDate (date: Date): void {
  dateValue.value = date
}

const oneHourFromNow = () => date.addToDate(new Date(), { minutes: 60 })

function selectDate (): void {
  rs.mockSearchDelay()
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
  () => us.lectures.filter(lecture => date.getDateDiff(lecture.date, tomorrow) === 0).sort((a, b) => a.date > b.date ? 1 : -1)[0] ?? null
)

const endLectureTomorrow = computed<Date | null>(
  () => {
    const lecture = us.lectures.filter(lecture => date.getDateDiff(lecture.date, tomorrow) === 0).sort((a, b) => b.date > a.date ? 1 : -1)[0]
    return lecture ? date.addToDate(lecture.date, { minutes: lecture.duration }) : null
  })

const endLectureToday = computed<Date | null>(
  () => {
    const lecture = us.lectures.filter(lecture => date.getDateDiff(lecture.date, today) === 0).sort((a, b) => b.date > a.date ? 1 : -1)[0]
    return lecture ? date.addToDate(lecture.date, { minutes: lecture.duration }) : null
  })

const lectureNextWeek = computed<Lecture | null>(
  () => {
    const sameDayNextWeek = date.addToDate(today, { days: 7 })
    const day = sameDayNextWeek.getDate()
    const month = sameDayNextWeek.getMonth()
    return us.lectures.filter(lecture => lecture.date.getDate() === day && lecture.date.getMonth() === month)
      .sort((a, b) => a.date > b.date ? 1 : -1)[0] ?? null
  }
)

</script>

<template>

  <q-page class="ds">

    <header class="secondary-header">
      <q-btn aria-label="Back" flat icon="arrow_back" size="lg" @click="closeModal()"/>
      <section class="secondary-header-title">
        <span>Date and Time Selection</span>
      </section>
    </header>

    <!--    <q-tabs v-model="dateMode" active-color="secondary" align="center" no-caps>-->
    <!--      <q-tab label="Arrive By" name="arrive"/>-->
    <!--      <q-tab label="Leave At" name="leave"/>-->
    <!--    </q-tabs>-->

    <div class="ds-segmented-button-container">
      <q-btn-toggle v-model="dateMode"
                    :options="[{label: 'Arrive By', value: DateMode.Arrive}, {label: 'Leave At', value: DateMode.Leave}]"
                    class="button-toggle-large"/>
    </div>

    <main class="ds-contents">

      <section style="flex-grow: 1"/>

      <date-selector v-model="dateValue" :minute-step="selectorMinuteStep"/>

      <section v-if="us.options.debug.dateHints" class="ds-hints">
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
          <q-btn class="outline-button" @click="updateDate(oneHourFromNow())">
            One hour from now
          </q-btn>
          <q-btn v-if="endLectureToday" class="outline-button" @click="updateDate(endLectureToday)">
            After last lecture today
          </q-btn>
          <q-btn v-if="endLectureTomorrow" class="outline-button" @click="updateDate(endLectureTomorrow)">
            After last lecture tomorrow
          </q-btn>
        </template>
      </section>

      <section style="flex-grow: 2"/>

      <section class="ds-lectures">
        <q-list>
          <q-item-label header>{{ dateLabel }}</q-item-label>

          <q-item v-if="dayLectures.length === 0">
            <span class="ds-no-lectures">No Lectures</span>
          </q-item>

          <template v-if="us.options.debug.lectureHints === LectureHints.Vertical">
            <LectureHintVertical v-for="lecture in dayLectures" :key="lecture.courseId" v-ripple
                                 :date-mode="dateMode" :lecture="lecture" @click="updateDate(getLectureDate(lecture))"/>
          </template>

          <template v-else>
            <LectureHintTable v-for="lecture in dayLectures" :key="lecture.courseId" v-ripple :lecture="lecture"
                              @click="updateDate(getLectureDate(lecture))"/>
          </template>

        </q-list>
      </section>

    </main>

    <footer>
      <q-btn :label="actionLabel" class="filled-button filled-button--full-width" size="lg" @click="selectDate()"/>
    </footer>
  </q-page>

</template>

<style lang="scss" scoped>

@import "src/css/quasar.variables.scss";

.ds {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.ds-contents {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 24px;
  align-items: center;
}

.ds-segmented-button-container {
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 32px;
}

.ds-hints {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.ds-lectures {
  flex-grow: 3;
  padding-left: 16px;
  padding-right: 16px;
  height: 25vh; // fix height to avoid layout changes when no lectures are included
  min-height: 200px;
  width: 100vw;
  min-width: 300px;
}

.ds-no-lectures {
  font-size: large;
  font-style: italic;
  text-align: center;
  width: 100%;
}

footer {
  margin: 24px;
}

.filled-button--full-width {
  width: 100%;
}

</style>
