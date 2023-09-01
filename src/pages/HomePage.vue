<script lang="ts" setup>

import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRideStore } from 'stores/ride-store'
import { useUserStore } from 'stores/user-store'
import UpcomingLectureCard from 'components/UpcomingLectureCard.vue'
import UpcomingRideCard from 'components/UpcomingRideCard.vue'
import { Ride } from 'src/models/ride'
import { useNavigationStore } from 'stores/navigation-store'

const tab = ref<'rides' | 'drives'>('rides')

const router = useRouter()
const rs = useRideStore()
const us = useUserStore()
const ns = useNavigationStore()

const slide = ref<string>('introduction')

const now = new Date()

const upcomingRides = computed<ReadonlyArray<Ride>>(
  () => rs.bookedRides
    .filter(r => r.Departure >= now)
    .sort((a, b) => a.Departure.getTime() - b.Departure.getTime()))

const pendingRequests = computed<number>(() => rs.bookedRides.filter(r => r.requested && !r.accepted).length)

function quitIntroduction (): void {
  slide.value = 'introduction'
  ns.skipIntroduction()
  ns.toggleFullscreen()
}

function searchRides (): void {
  rs.mockSearchDelay()
  rs.updateParameters({})
  ns.goSearchRides()
}

function createRide (): void {
  router.push('/create-ride')
}

</script>

<template>

  <q-page>

    <template v-if="ns.firstUse">

      <q-carousel
          v-model="slide"
          animated
          class="introduction-carousel"
          control-color="primary"
          control-type="flat"
          height="100vh"
          navigation
          padding
          swipeable
          transition-next="slide-left"
          transition-prev="slide-right"
      >
        <q-carousel-slide class="column no-wrap flex-center" name="introduction">
          <q-icon color="primary" name="las la-car-side" size="100px"/>
          <div class="q-mt-md text-center">
            <p>Ciao cavia!</p>
            <p>We're developing <b>Flock</b> to encourage carpooling among Sapienza students wanting to save time,
              pennies and lessen traffic around campus.</p>
            <p>You're looking at a rudimentary user interface. We need testers! Can you help?</p>
          </div>
        </q-carousel-slide>
        <q-carousel-slide class="column no-wrap flex-center" name="instructions">
          <q-avatar size="120px">
            <img :src="us.user.avatarUrl" alt="Christiane F. picture"/>
          </q-avatar>
          <div class="q-mt-md text-center">
            <p>You impersonate <b>Christiane F.</b> — an ACSAI
              <q-icon name="info" size="xs">
                <q-tooltip anchor="top middle" self="bottom middle">
                  ACSAI stands for "Applied Computer Science and Artificial Intelligence".
                </q-tooltip>
              </q-icon>
              student living near Rome's zoo, at Via Aldrovandi, tired
              of long campus commutes.
            </p>

            <p>Feel free to explore the app and consider its perks or drawbacks. Your tasks are:</p>
            <ul class="carousel-tasks">
              <li>Book a comfy ride from home to Sapienza, in time for Monday's "Human Computer Interaction" lecture
                (HCI),
                at 10:00.
              </li>
              <li>Arrange a ride to Sapienza's Sport Center for the next Sunday morning. Fingers crossed for a clear
                sky!
              </li>
            </ul>
          </div>
        </q-carousel-slide>
        <q-carousel-slide class="column no-wrap flex-center" name="thanks">
          <q-icon color="primary" name="accessibility_new" size="100px"/>
          <div class="q-mt-md text-center">
            <p>Please, comment aloud your actions and thoughts as you go — even throw in the occasional curse. We
              can
              take it!
            </p>
            <p>Thanks for your feedback.</p>

            <q-btn class="filled-button quit-introduction-button" @click="quitIntroduction()">Let's start!</q-btn>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </template>

    <template v-else>

      <header key="header" class="home-header">
        <span>Flock</span>

        <section class="home-header-actions">
          <q-btn flat icon="chat" round></q-btn>
          <q-btn flat icon="notifications" round></q-btn>

          <q-btn flat round @click="ns.goDebugOptions()">
            <q-avatar size="xl">
              <img :src="us.user.avatarUrl" alt="User Avatar"/>
            </q-avatar>
          </q-btn>
        </section>
      </header>

      <q-tabs key="tabs" v-model="tab" align="center" class="tabs" indicator-color="primary" no-caps>
        <q-tab label="Rides" name="rides"/>
        <q-tab label="Drives" name="drives"/>
      </q-tabs>

      <q-tab-panels key="tab-panels" v-model="tab" animated class="tab-container">
        <q-tab-panel name="rides">

          <main class="tab-sections">

            <section v-if="pendingRequests" class="notice-box">

              <q-icon name="las la-stamp" size="lg"/>

              <span>You have <b>{{ pendingRequests }}</b> pending ride request{{ pendingRequests > 1 ? 's' : '' }} waiting to be approved.</span>

              <q-btn dense flat icon="arrow_forward_ios" to="/rides/requests"/>

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
                <UpcomingLectureCard v-for="lecture in us.upcomingLectures" :key="lecture.id" :lecture="lecture"/>
                <div class="card-spacer"/>
              </div>
            </section>

          </main>

          <q-page-sticky :offset="[18, 18]" position="bottom-right">
            <q-btn class="pulsingButton fab-button" fab icon="search" @click="searchRides()"/>
          </q-page-sticky>
        </q-tab-panel>

        <q-tab-panel name="drives">

          <section class="upcoming-cards-container">
            <span class="section-title">Upcoming Rides</span>
            <div class="upcoming-cards">
              <div class="card-spacer"/>
              <UpcomingRideCard v-for="ride in upcomingRides" :key="ride.Id" :ride="ride"/>
              <div class="card-spacer"/>
            </div>
          </section>

          <q-page-sticky :offset="[18, 18]" position="bottom-right">
            <q-btn class="pulsingButton fab-button" fab icon="add" @click="createRide()"/>
          </q-page-sticky>

        </q-tab-panel>

      </q-tab-panels>
    </template>

  </q-page>
</template>

<style lang="scss" scoped>
@import "src/css/quasar.variables.scss";

.pulsingButton {
  box-shadow: 0 0 0 0 $primary-container;
  animation: pulsing 3s infinite cubic-bezier(0.66, 0, 0, 0.8);
  font-size: 22px;
  font-weight: normal;
  font-family: sans-serif;
  text-decoration: none !important;
  color: #ffffff;
  transition: all 300ms ease-in-out;
}

/* Comment-out to have the button continue to pulse on mouseover */
/* Animation */
@keyframes pulsing {
  0% {
    box-shadow: 0 0 0 0 $primary-container;
  }
  50% {
    box-shadow: 0 0 0 18px rgba(0, 0, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 18px rgba(0, 0, 0, 0);
  }
}

.introduction-carousel {
  color: $on-surface-variant;
  background-color: $surface-variant;
  font-size: medium;
}

.carousel-tasks li {
  margin-top: 8px;
}

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

.quit-introduction-button {
  margin-top: 24px;
  font-size: medium;
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
