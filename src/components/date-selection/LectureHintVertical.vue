<script lang="ts" setup>

import { DateMode, ExtractTime } from 'src/tools/date-tools'
import { Lecture } from 'src/models/lecture'
import { useUserStore } from 'stores/user-store'
import { Course } from 'src/models/course'
import { computed } from 'vue'
import { date } from 'quasar'

const props = defineProps<{ lecture: Lecture, dateMode: DateMode }>()

const us = useUserStore()

const course = computed<Course>(() => us.getCourseById(props.lecture.courseId))

// const timeslot = computed<string>(() =>
//     `${ExtractTime(props.lecture.date)} → ${ExtractTime(date.addToDate(props.lecture.date, { minute: props.lecture.duration }))}`
// )

</script>

<template>

  <q-item class="lhv__container" clickable>

    <q-item-section class="lhv__lecture">
      <q-item-label lines="1">{{ course.name }}</q-item-label>

      <q-item-label class="lhv__lecture__location" lines="1">
        <q-icon name="map"/>
        {{ lecture.location.Label }}
      </q-item-label>

    </q-item-section>
    <q-item-section side>
      <q-item-label class="lhv__lecture__time2">
        <aside>
          <span :class="{'lhv__lecture__time--highlight': dateMode === DateMode.Arrive}">
            {{ ExtractTime(lecture.date) }}
          </span>
        </aside>
        <aside>
          <span :class="{'lhv__lecture__time--highlight': dateMode === DateMode.Leave}">
            {{ ExtractTime(date.addToDate(props.lecture.date, { minute: props.lecture.duration })) }}
          </span>
        </aside>
      </q-item-label>
    </q-item-section>

  </q-item>

</template>

<style lang="scss" scoped>

@import "src/css/quasar.variables.scss";

.lhv__container {
  position: relative; // necessary for the ripple effect
  margin-top: 16px;
  border-radius: 12px;
  color: $on-background;
  cursor: pointer;
}

.lhv__lecture {
  font-size: large;
}

.lhv__lecture__location {
  font-size: medium;
  opacity: 0.8;
}

.lhv__course-avatar {
  height: 60px;
  width: 60px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
}

.lhv__lecture__time {
  gap: 4px;
  display: flex;
  align-items: center;
  font-family: "Roboto Mono", monospace;
  padding-top: 8px;
  font-size: medium;
}

.lhv__lecture__time2 {
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: right;
  align-items: center;
  font-family: "Roboto Mono", monospace;
  font-size: small;

  aside {
    display: flex;
    gap: 4px;
    align-items: center;
  }
}

.lhv__lecture__time--highlight {
  font-size: large;
  color: $secondary;
}

</style>
