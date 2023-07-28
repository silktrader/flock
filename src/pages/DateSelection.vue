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

      <date-selector v-model="dateValue"/>

      <section class="hints">
        <q-btn v-if="dateMode === DateMode.Arrive && lectureTomorrow" @click="updateDate(lectureTomorrow?.Date)">
          First lecture tomorrow
        </q-btn>
      </section>

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

const router = useRouter()
const us = useUserStore()
const rs = useRideStore()

const tomorrow = date.addToDate(new Date(), { day: 1 })
tomorrow.setHours(8)
tomorrow.setMinutes(5)

const dateMode = ref<DateMode>(DateMode.Arrive)
const dateValue = ref<Date>(tomorrow)

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

function selectDate (): void {
  rs.updateParameters({
    Date: dateValue.value,
    DateMode: dateMode.value
  })
  closeModal()
}

// informs whether there's a lecture the next day
const lectureTomorrow = computed<Lecture | null>(
  () => us.lectures.filter(lecture => date.getDateDiff(lecture.Date, tomorrow) === 0).sort((a, b) => +(a.Date > b.Date))[0] ?? null
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
  margin-top: 24px;
}

.date-mode-select {
  font-size: medium;
}

.lectures {
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
