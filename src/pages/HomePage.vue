<script lang="ts" setup>

import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRideStore } from 'stores/ride-store'
import { useUserStore } from 'stores/user-store'
import { useNavigationStore, UserMode } from 'stores/navigation-store'
import PassengerHome from 'components/home/PassengerHome.vue'
import UserModeSelector from 'components/home/UserModeSelector.vue'
import DriverHome from 'components/home/DriverHome.vue'

const props = defineProps<{ skipIntro?: boolean }>()

const tab = ref<'passenger' | 'driver'>('passenger')

const router = useRouter()
const rs = useRideStore()
const us = useUserStore()
const ns = useNavigationStore()

const slide = ref<string>('introduction')
const loading = ref<boolean>(true) // tk look into offloading this to the navigation store

watch(tab, async (newValue) => {
  ns.setUserMode(newValue === 'passenger' ? UserMode.Passenger : UserMode.Driver)
})

const showPassengerFab = computed<boolean>(() => !loading.value && ns.userMode === UserMode.Passenger)

const showDriverFab = computed<boolean>(() => !loading.value && ns.userMode === UserMode.Driver)

if (props.skipIntro) ns.skipIntroduction()

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
  router.push('/create-ride/date')
}

// mimic the wait due to network activity
setTimeout(() => {
  loading.value = false
}, 500)

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
            <q-img :src="us.user.avatarUrl" alt="Christiane's Avatar" spinner-color="secondary"/>
          </q-avatar>
          <div class="q-mt-md text-center">
            <p>You're <b>Christiane F.</b> — an ACSAI
              <q-icon name="info" size="xs">
                <q-tooltip anchor="top middle" max-width="300px" self="bottom middle">
                  ACSAI stands for "Applied Computer Science and Artificial Intelligence".
                </q-tooltip>
              </q-icon>
              student living near Rome's zoo, at Via Aldrovandi, tired
              of long campus commutes.
            </p>

            <p>Have a look around. Then we'd like you to:</p>
            <ul class="carousel-tasks">
              <li>Book a comfy ride from home to Sapienza, in time for Monday's "Human Computer Interaction" lecture
                (HCI), at 10:00.
              </li>
              <li>Arrange a ride to the Sport Center for the coming Sunday morning. Fingers crossed for a clear sky!
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

      <div :class="{'home__container--permanent-header': us.options.debug.fixedHeader}" class="home__container">

        <header :class="{'home-header--tabs': us.options.debug.tabbedHome}" class="home-header">
          <span v-if="us.options.debug.tabbedHome">Flock</span>
          <UserModeSelector v-else/>

          <div style="flex-grow: 5"/>

          <section class="home-header-actions">
            <q-btn flat icon="chat" round></q-btn>
            <q-btn flat icon="notifications" round></q-btn>

            <q-btn flat round @click="ns.goDebugOptions()">
              <q-avatar size="50px">
                <img :src="us.user.avatarUrl" alt="User Avatar"/>
              </q-avatar>
            </q-btn>
          </section>

        </header>

        <div v-if="us.options.debug.tabbedHome">
          <q-tabs v-model="tab" align="center" class="tabs" indicator-color="primary" no-caps>
            <q-tab label="Passenger" name="passenger"/>
            <q-tab label="Driver" name="driver"/>
          </q-tabs>
        </div>

        <div class="home__contents">

          <q-tab-panels v-if="us.options.debug.tabbedHome" v-model="tab" animated class="tab-container">
            <q-tab-panel name="passenger">

              <passenger-home/>

            </q-tab-panel>

            <q-tab-panel name="driver">

              <driver-home/>

            </q-tab-panel>

          </q-tab-panels>

          <template v-else>

            <passenger-home v-if="ns.userMode === UserMode.Passenger"/>
            <driver-home v-else/>

          </template>

          <footer/>

        </div>

      </div>

      <!--In order to be stickied the FAB must be anchored to the main page, so can't be featured in children components.-->

      <q-page-sticky v-if="showPassengerFab" :offset="[18, 18]" position="bottom-right">
        <transition
          appear
          enter-active-class="animated heartBeat"
        >
          <q-btn key="search-fab" class="fab-button" fab icon="search" size="lg" @click="searchRides()">Search
          </q-btn>
        </transition>
      </q-page-sticky>

      <q-page-sticky v-if="showDriverFab" :offset="[18, 18]" position="bottom-right">
        <q-btn class="pulsingButton fab-button" fab icon="add" @click="createRide()" label="New" size="lg"/>
      </q-page-sticky>

    </template>

  </q-page>
</template>

<style lang="scss" scoped>
@import "src/css/quasar.variables.scss";

.introduction-carousel {
  color: $on-surface-variant;
  background-color: $surface-variant;
  font-size: medium;
}

.carousel-tasks li {
  margin-top: 8px;
}

.home__container {
  display: flex;
  flex-direction: column;
}

.home__container--permanent-header {
  height: 100vh;
}

.home-header {
  display: flex;
  width: 100vw;
  padding: 8px 16px 0;
  align-items: center;
  justify-content: space-between;
  font-size: large;
  color: $on-background;
  margin-bottom: 12px;

  span {
    font-weight: bold;
  }
}

.home-header--tabs {
  color: $on-secondary-container;
  background-color: $secondary-container;
  margin-bottom: 0;
}

.home__contents {
  overflow: auto;
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

.q-tab-panel {
  padding: 0 !important;
}

footer {
  min-height: 80px; // ensure there's enough bottom space to accomodate the FAB without overlapping elements
}

</style>
