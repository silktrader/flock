<script lang="ts" setup>

import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRideStore } from 'stores/ride-store'
import { useUserStore } from 'stores/user-store'
import UpcomingLectureCard from 'components/UpcomingLectureCard.vue'
import { Lecture } from 'src/models/lecture'
import UpcomingRideCard from 'components/UpcomingRideCard.vue'
import { Ride } from 'src/models/ride'

const tab = ref<'rides' | 'drives'>('rides')

const router = useRouter()
const rs = useRideStore()
const us = useUserStore()

function searchRides (): void {
  rs.updateParameters({})
  router.replace('/search-results')
}

const now = new Date()

// assume lectures are already sorted
const upcomingLectures = computed<ReadonlyArray<Lecture>>(
  () => us.lectures
    .filter(l => l.date >= now)
    .slice(0, 5))

const upcomingRides = computed<ReadonlyArray<Ride>>(
  () => rs.bookedRides
    .filter(r => r.Departure >= now)
    .sort((a, b) => Number(a.Departure > b.Departure)))

const pendingRequests = computed<number>(() => rs.bookedRides.filter(r => r.requested && !r.accepted).length)

</script>

<template>
  <q-page>

    <header class="home-header">
      <span>Flock</span>

      <section class="home-header-actions">
        <q-btn flat icon="chat" round></q-btn>
        <q-btn flat icon="notifications" round></q-btn>

        <q-btn flat round>
          <q-avatar size="xl">
            <img :src="us.user.avatarUrl" alt="User Avatar"/>
          </q-avatar>
        </q-btn>
      </section>
    </header>

    <q-tabs v-model="tab" align="center" class="tabs" indicator-color="primary" no-caps>
      <q-tab label="Rides" name="rides"/>
      <q-tab label="Drives" name="drives"/>
    </q-tabs>

    <q-tab-panels v-model="tab" animated class="tab-container">
      <q-tab-panel name="rides">

        <main class="tab-sections">

          <section v-if="pendingRequests" class="pending-requests-container">

            <q-icon name="las la-stamp" size="lg"/>

            <span>You have <b>{{ pendingRequests }}</b> pending ride request {{ pendingRequests > 1 ? 's' : '' }} waiting to be approved.</span>

            <q-btn dense flat icon="arrow_forward_ios" to="/pending-ride-requests"/>

          </section>

          <section class="upcoming-cards-container">
            <span class="section-title">Upcoming Rides</span>
            <div class="upcoming-cards">
              <div class="card-spacer"/>
              <UpcomingRideCard v-for="ride in upcomingRides" :key="ride.Id" :ride="ride"/>
              <div class="card-spacer"/>
            </div>
          </section>

          <section class="upcoming-cards-container">
            <span class="section-title">Upcoming Lectures</span>
            <div class="upcoming-cards">
              <div class="card-spacer"/>
              <UpcomingLectureCard v-for="lecture in upcomingLectures" :key="lecture.id" :lecture="lecture"/>
              <div class="card-spacer"/>
            </div>
          </section>

        </main>

        <q-page-sticky :offset="[18, 18]" position="bottom-right">
          <q-btn class="fab-button" fab icon="search" @click="searchRides()"/>
        </q-page-sticky>
      </q-tab-panel>

      <q-tab-panel name="drives">
      </q-tab-panel>

    </q-tab-panels>

  </q-page>
</template>

<style lang="scss" scoped>
@import "src/css/quasar.variables.scss";

.home-header {
  display: flex;
  width: 100vw;
  padding: 8px 16px 0;
  align-items: center;
  justify-content: space-between;
  color: $on-secondary-container;
  background-color: $secondary-container;
  font-size: large;

  span {
    font-weight: bold;
  }
}

.home-header-actions {
  display: flex;
  justify-content: flex-end;
}

.tabs {
  padding-top: 8px;
  font-size: x-large;
  font-weight: bold;
  color: $on-secondary-container;
  background-color: $secondary-container;
}

.tab-container {
  background-color: $background;
}

.tab-sections {
  display: flex;
  flex-direction: column;
}

.pending-requests-container {
  display: flex;
  flex-direction: row;
  gap: 12px;
  color: $on-tertiary-container;
  background-color: $tertiary-container;
  align-items: center;
  border-radius: 12px;
  padding: 12px;
  margin: 16px 24px 0;
  min-height: 30px;
}

.upcoming-cards-container {
  display: flex;
  flex-direction: column;
  margin-top: 24px;
}

.section-title {
  color: $on-background;
  font-size: medium;
  margin-left: 24px;
}

.upcoming-cards {
  display: flex;
  flex-direction: row;
  gap: 8px;
  width: 100%;
  padding-top: 8px;
  padding-bottom: 8px;
  overflow-y: hidden;
  overflow-x: auto;
  height: min-content;
}

.q-tab-panel {
  padding: 0 !important;
}

.card-spacer {
  min-width: 16px;
}

</style>
