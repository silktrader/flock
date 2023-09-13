<script lang="ts" setup>
import { ref } from 'vue'
import YourDrivesCard from '../YourDrivesCard.vue'
import { useDriveStore } from 'src/stores/driveStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const ds = useDriveStore()
const yourDrives = ref(ds.getDrives)
function createRide (): void {
  router.push('/create-ride/date')
}

</script>

<template>

  <main>

    <section class="home__row">
      <span class="home__row__title">Your Next Driving Jobs</span>
      <div v-if="yourDrives.length === 0" style="margin: auto; margin-top: 2em">
        <q-card class="card createCard" style="min-height: 200px; margin-bottom: 0.8em; padding-left: 1em; padding-right: 1em;">
          <div class="column">
          <a>You have 0 driving commitments.</a>
         <a style="font-style: italic; color: aqua;" @click="createRide">Create</a>
        </div>
        </q-card>
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
  .createCard{
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  }
</style>
