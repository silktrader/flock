<script lang="ts" setup>

import { Lecture } from 'src/models/lecture'
import { ExtractTime } from 'src/tools/date-tools'
import { useUserStore } from 'stores/user-store'
import { Course } from 'src/models/course'
import { date } from 'quasar'
import { computed } from 'vue'

const props = defineProps<{ lecture: Lecture }>()

const us = useUserStore()

const course = computed<Course>(() => us.getCourseById(props.lecture.courseId))

</script>

<template>

  <q-item class="lht__container" clickable>
    <q-item-section class="lht__lecture__name">
      <q-item-label lines="2">{{ course.name }}</q-item-label>
    </q-item-section>
    <q-item-section class="lht__lecture__details">
      <q-item-label lines="1">
        <q-icon name="schedule"/>
        {{
          ExtractTime(lecture.date)
        }} - {{ ExtractTime(date.addToDate(lecture.date, { minute: lecture.duration })) }}
      </q-item-label>
      <q-item-label caption class="lht__lecture__location" lines="1">
        <q-icon name="map"/>
        {{ lecture.location.Label }}
      </q-item-label>
    </q-item-section>
  </q-item>

</template>

<style lang="scss" scoped>

@import "src/css/quasar.variables.scss";

.lht__container {
  position: relative;
  margin-top: 16px;
  border-radius: 12px;
  cursor: pointer;
}

.lht__lecture__name, .lht__lecture__details {
  color: $on-background;
  font-size: medium;
}

.lht__lecture__name {
  flex-grow: 2;
}

.lht__lecture__details {
  flex-grow: 3;
}

.lht__lecture__location {
  color: $on-background;
  font-size: small;
}

</style>
