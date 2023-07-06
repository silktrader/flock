<template>

  <q-page>

    <div v-touch-swipe.up.down="nextSlide">

      <Transition name='fade'>

        <div v-if='isWelcomePage' key="welcomepage">
          <ProfileWelcome/>
        </div>

        <div v-else key="contentpage">
          <ProfileInfo/>
        </div>

      </Transition>

    </div>
    <q-page-sticky :offset="[18,18]" position="bottom-right">
      <q-fab color="primary" direction="up" glossy icon="add" vertical-actions-align="right">
        <q-fab-action color="secondary" icon='las la-calendar-plus' label="Book Ride" label-position="left"
                      text-color="black"/>
        <q-fab-action color="secondary" icon='las la-phone' label="Call" label-position="left" text-color="black"/>
        <q-fab-action color="secondary" icon='las la-star' label="Save in Favourites" label-position="left"
                      text-color="black"/>
      </q-fab>
    </q-page-sticky>

  </q-page>

</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>

<script setup>
import ProfileWelcome from 'src/components/ProfileWelcome.vue'
import ProfileInfo from 'src/components/ProfileInfo.vue'
import { ref } from 'vue'

const isWelcomePage = ref(true)

function nextSlide (evt) {
  if (evt.direction === 'up' && isWelcomePage.value) {
    isWelcomePage.value = !isWelcomePage.value
  } else if (evt.direction === 'down' && !isWelcomePage.value) {
    isWelcomePage.value = !isWelcomePage.value
  }
}

</script>
