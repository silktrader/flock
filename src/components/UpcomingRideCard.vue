<script lang="ts" setup>

import { ExtractTime, FormatLongDate } from '../tools/date-tools'
import { Ride } from 'src/models/ride'
import { useRideStore } from 'stores/ride-store'
import { computed } from 'vue'
import { Course } from 'src/models/course'
import { useUserStore } from 'stores/user-store'
import { useNavigationStore } from 'stores/navigation-store'

const rs = useRideStore()
const us = useUserStore()
const ns = useNavigationStore()

const props = defineProps<{
  ride: Ride
}>()

const beforeCourse = computed<Course | null>(
  () => props.ride.before ? us.getCourseById(props.ride.before.courseId) : null
)

const afterCourse = computed<Course | null>(
  () => props.ride.after ? us.getCourseById(props.ride.after.courseId) : null
)

function reviewRide (): void {
  rs.selectRide(props.ride)
  ns.goDetailsPage()
}

</script>

<template>

  <transition
    appear
    enter-active-class="animated slideInRight"
  >

    <q-card key="upcoming-ride-card" v-ripple class="ride-card card q-hoverable cursor-pointer" flat
            @click="reviewRide()">
      <span class="q-focus-helper"/>

      <q-card-section class="card-header">
        <span>{{ FormatLongDate(ride.departure) }}</span>
      </q-card-section>

      <q-card-section class="ride-details">

        <section class="directions">
          <div class="directions-times">
            <span>{{ ExtractTime(ride.pickup.Date) }}</span>
            <span>{{ ExtractTime(ride.drop.Date) }}</span>
          </div>

          <div class="graph">
            <div class="graph-pickup"/>
            <div class="graph-route"/>
            <div class="graph-drop"/>
          </div>

          <div class="directions-locations">
            <span>{{ ride.pickup.Address }}</span>
            <span>{{ ride.drop.Address }}</span>
          </div>
        </section>

        <section class="ride-extra">
          <span class="ride-extra-prep">with</span>
          <q-avatar size="50px">
            <img :src="ride.driver.avatarUrl" alt="Driver's Avatar"/>
          </q-avatar>
          <template v-if="beforeCourse">
            <span>before</span>
            <div :style="`background-color: ${beforeCourse.color}`" class="lecture-course">{{ beforeCourse.acro }}</div>
          </template>

          <template v-if="afterCourse">
            <span>after</span>
            <div :style="`background-color: ${afterCourse.color}`" class="lecture-course">{{ afterCourse.acro }}</div>
          </template>

        </section>

      </q-card-section>
    </q-card>
  </transition>

</template>

<style lang="scss" scoped>
@import "src/css/quasar.variables.scss";
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap');

.ride-card {
  min-width: 288px;
}

.ride-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.directions {
  display: flex;
  flex-direction: row;
  gap: 12px;
}

.directions-locations, .directions-times {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
}

.directions-times {
  font-family: 'Roboto Mono', monospace;
}

.directions-locations {
  span {
    max-width: 24ch;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.graph {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 3px;
  margin-bottom: 4px;
}

.graph-route {
  display: flex;
  flex-grow: 1;
  border-left: 2px dashed $secondary;
  margin-left: 5px;
}

.graph-pickup, .graph-drop {
  width: 12px;
  height: 12px;
  border-radius: 100%;
}

.graph-drop {
  background-color: $secondary;
}

.graph-pickup {
  border: 2px solid $secondary;
}

.ride-extra {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 16px;

  span {
    font-style: italic;
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

</style>
