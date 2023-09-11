<script lang="ts" setup>

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'stores/user-store'
import { useNavigationStore } from 'stores/navigation-store'
import PassengerHome from 'components/home/PassengerHome.vue'

const tab = ref<'rides' | 'drives'>('rides')

const props = defineProps<{ skipIntro: boolean }>()

const router = useRouter()
const us = useUserStore()
const ns = useNavigationStore()

const slide = ref<string>('introduction')

// Provide a shortcut to skip the introduction from '/home' instead of '/'
if (props.skipIntro) ns.skipIntroduction()

function quitIntroduction (): void {
  slide.value = 'introduction'
  ns.skipIntroduction()
  ns.toggleFullscreen()
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
            <q-img :src="us.user.avatarUrl" alt="Christiane's Avatar" spinner-color="secondary"/>
          </q-avatar>
          <div class="q-mt-md text-center">
            <p>You're <b>Christiane F.</b> — an ACSAI
              <q-icon name="info" size="xs">
                <q-tooltip anchor="top middle" max-width="300px" self="bottom middle">
                  ACSAI stands for "Applied Computer Science and Artificial Intelligence".
                </q-tooltip>
              </q-icon>
              student living near Rome's zoo, at Via Aldrovandi.
            </p>

            <p>Have a look around. Then we'd like you to:</p>
            <ul class="carousel-tasks">
              <li>Book a ride from home to Sapienza, in time for Monday's first lecture, at 10:00.
              </li>
              <li>Arrange a ride to the Sport Center for the coming Sunday morning. Fingers crossed for a clear
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

          <PassengerHome/>

        </q-tab-panel>

        <q-tab-panel name="drives">

          <q-page-sticky :offset="[18, 18]" position="bottom-right">
            <q-btn class="pulsingButton fab-button" fab icon="add" @click="createRide()"/>
          </q-page-sticky>

        </q-tab-panel>

      </q-tab-panels>

      <footer>
      </footer>

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

.q-tab-panel {
  padding: 0 !important;
}

.card-spacer {
  min-width: 16px;
}

footer {
  min-height: 100px; // ensure there's enough bottom space to accomodate the FAB without overlapping elements
}

</style>
