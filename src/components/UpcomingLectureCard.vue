<script lang="ts" setup>

import { Lecture } from 'src/models/lecture'
import { DateMode, ExtractTime, FormatShortDate } from '../tools/date-tools'
import { computed } from 'vue'
import { Course } from 'src/models/course'
import { useUserStore } from 'stores/user-store'
import { useRideStore } from 'stores/ride-store'
import { useLocationStore } from 'stores/location-store'
import { useNavigationStore } from 'stores/navigation-store'

const props = defineProps<{ lecture: Lecture }>()

const us = useUserStore()
const rs = useRideStore()
const ls = useLocationStore()
const ns = useNavigationStore()

const course = computed<Course>(() => us.getCourseById(props.lecture.courseId))

function searchRides (): void {
  rs.updateParameters({
    Date: props.lecture.date,
    DateMode: DateMode.Arrive,
    Origin: ls.getDefaultHomeLocation(),
    Destination: props.lecture.location,
    results: props.lecture.ridesAvailable
  })
  ns.goSearchRides()
}

</script>

<template>

  <transition
      appear
      enter-active-class="animated slideInRight"
  >

    <q-card key="upcoming-lecture-card" v-ripple class="lecture-card card cursor-pointer q-hoverable" flat
            @click="searchRides()">
      <!--    sets up the ripple effect-->
      <span class="q-focus-helper"/>
      <q-card-section class="card-header">
        <span>{{ FormatShortDate(lecture.date) }}</span>
      </q-card-section>

      <q-card-section class="lecture-details">
        <div :style="`background-color: ${course.color}`" class="lecture-course">{{ course.acro }}</div>
        <section class="lecture-schedule">
          <div class="lecture-schedule-time">
            <q-icon name="schedule" size="xs"/>
            <span>{{ ExtractTime(lecture.date) }}</span>
          </div>
        </section>
        <section v-if="lecture.ridesAvailable" class="lecture-rides">
          <q-icon name="las la-car-side" size="sm"/>
          <span>{{ lecture.ridesAvailable }}</span>
        </section>
      </q-card-section>

    </q-card>
  </transition>

</template>

<style lang="scss" scoped>

@import "src/css/quasar.variables.scss";

.lecture-card {
  min-width: 140px;
}

.lecture-details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  font-size: small;
  gap: 12px;
}

.lecture-schedule {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.lecture-schedule-time {
  display: flex;
  gap: 4px;
  align-items: center;
  max-width: 140px;

  span {
    font-family: "Roboto Mono", monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.lecture-course {
  height: 50px;
  width: 50px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.lecture-rides, .lecture-no-rides {
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: x-small;
}

.lecture-rides {
  font-weight: bold;
  color: $on-secondary-container;
}

.lecture-no-rides {
  color: $on-secondary-container;
}

</style>
