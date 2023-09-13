<script lang="ts" setup>
import { ref } from 'vue'
import YourDrivesCard from '../YourDrivesCard.vue'
import { useDriveStore } from 'src/stores/driveStore'

const ds = useDriveStore()
const yourDrives = ref(ds.getDrives)

</script>

<template>

  <main>

    <section class="home__row">
      <span class="home__row__title">Your Next Driving Jobs</span>
      <div v-if="yourDrives.length === 0" style="margin: auto; margin-top: 2em; font-style: italic;">
        You have 0 driving commitments.
      </div>
      <div v-else class="upcoming-cards">
        <div class="card-spacer"/>
          <YourDrivesCard v-for="drive in yourDrives" :key="drive.Id" :drive="drive"/>
        <div class="card-spacer"/>
      </div>
    </section>

  </main>

</template>

<style lang="scss" scoped>

</style>
