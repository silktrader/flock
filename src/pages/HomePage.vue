<script lang="ts" setup>

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRideStore } from 'stores/ride-store'

const tab = ref<'rides' | 'drives'>('rides')

const router = useRouter()
const rs = useRideStore()

function searchRides (): void {
  rs.updateParameters({})
  router.replace('/search-results')
}

</script>

<template>
  <q-page>

    <header class="home-header">
      <span>Flock</span>

      <section class="home-header-actions">
        <q-btn flat icon="chat" round></q-btn>
        <q-btn flat icon="notifications" round></q-btn>

        <q-btn flat round>
          <q-avatar size="lg">
            <q-img src="https://cdn.quasar.dev/img/avatar2.jpg"/>
          </q-avatar>
        </q-btn>
      </section>
    </header>

    <q-tabs v-model="tab" align="center" class="home-header" no-caps>
      <q-tab label="Rides" name="rides"/>
      <q-tab label="Drives" name="drives"/>
    </q-tabs>

    <q-tab-panels v-model="tab" animated class="tab-container">
      <q-tab-panel name="rides">

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

.tab-container {
  background-color: $background;
}

</style>
