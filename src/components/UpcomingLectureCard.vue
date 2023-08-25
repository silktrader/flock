<script lang="ts" setup>

import { Lecture } from 'src/models/lecture'
import { ExtractTime, FormatShortDate } from '../tools/date-tools'
import { computed } from 'vue'
import { Course } from 'src/models/course'
import { useUserStore } from 'stores/user-store'
import { date } from 'quasar'

const props = defineProps<{ lecture: Lecture }>()

const us = useUserStore()

const course = computed<Course>(() => us.getCourseById(props.lecture.courseId))

</script>

<template>

  <q-card class="lecture-card card" flat>
    <q-card-section class="card-header">
      <span>{{ FormatShortDate(lecture.date) }}</span>
    </q-card-section>

    <q-card-section class="lecture-details">
      <div :style="`background-color: ${course.color}`" class="lecture-course">{{ course.acro }}</div>
      <section class="lecture-schedule">
        <span class="lecture-schedule-time">{{
            ExtractTime(lecture.date)
          }} — {{ ExtractTime(date.addToDate(lecture.date, { minute: lecture.duration })) }}</span>
      </section>
      <section v-if="lecture.ridesAvailable" class="lecture-rides">
        <q-icon name="las la-car-side" size="sm"/>
        <span>{{ lecture.ridesAvailable }}</span>
      </section>
      <!--      <section v-else class="lecture-no-rides">-->
      <!--        <q-icon name="las la-car-side" size="sm"/>-->
      <!--        <span>no rides yet</span>-->
      <!--      </section>-->
      <!--        <span class="lecture-address">{{ lecture.location.Address }}</span>-->
    </q-card-section>

  </q-card>

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
  gap: 8px;
}

.lecture-schedule {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.lecture-schedule-time {
  white-space: nowrap;
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
