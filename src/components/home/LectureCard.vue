<script lang="ts" setup>

import { Lecture } from 'src/models/lecture'
import { DateMode, ExtractTime, FormatShortDate } from '../../tools/date-tools'
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
  rs.mockSearchDelay()
  rs.updateParameters({
    Date: props.lecture.date,
    DateMode: DateMode.Arrive,
    Origin: ls.getDefaultHomeLocation(),
    Destination: props.lecture.location,
    results: props.lecture.ridesAvailable,
    drivers: props.lecture.drivers
  })
  ns.goSearchRides()
}

</script>

<template>

  <transition
    appear
    enter-active-class="animated slideInRight"
  >

    <div key="lecture-card" v-ripple class="lc-container" @click="searchRides()">
      <!--    sets up the ripple effect-->
      <span class="q-focus-helper"/>
      <!--      <q-card-section class="card-header">-->
      <!--        <span class="ul__date">{{ FormatShortDate(lecture.date) }}</span>-->
      <!--      </q-card-section>-->

      <div class="lc-course">

        <div :style="`background-color: ${course.color}`" class="lc-course__avatar">{{ course.acro }}</div>
      </div>

      <section class="lc-schedule">
        <span class="lc-schedule__date">{{ FormatShortDate(lecture.date) }}</span>
        <div class="lecture-schedule-time">
          <q-icon name="schedule" size="xs"/>
          <span>{{ ExtractTime(lecture.date) }}</span>
        </div>
      </section>

      <!--      <section v-if="lecture.ridesAvailable" class="lecture-rides">-->
      <!--        <q-icon name="las la-car-side" size="sm"/>-->
      <!--        <span>{{ lecture.ridesAvailable }}</span>-->
      <!--      </section>-->

      <section v-if="lecture.ridesAvailable" class="lecture-rides">

        <div class="lc-drivers">
          <q-avatar
            v-for="driver in lecture.drivers" :key="driver.id"
            class="lc-drivers__driver"
          >
            <q-img :src="driver.avatarUrl"/>
          </q-avatar>
        </div>
      </section>

    </div>
  </transition>

</template>

<style lang="scss" scoped>

@import "src/css/quasar.variables";

.lc-drivers__driver {
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  width: 40px;
  height: 40px;
}

.lc-drivers__driver:not(:last-child) {
  margin-left: -12px;
}

.lc-drivers {
  display: inline-flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
  padding-left: 8px;
}

.lc-container {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 140px;
  justify-content: flex-start;
  align-items: center;
  align-items: flex-start;
  gap: 8px;
  color: $on-background;
  font-size: medium;
  cursor: pointer;
  margin-bottom: 8px;
}

.lc-schedule {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 8px;
}

.lc-schedule__date {
  text-transform: capitalize;
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

.lc-course__avatar {
  height: 100px;
  width: 100px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: large;
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
