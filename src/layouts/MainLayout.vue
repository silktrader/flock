<template>
  <q-layout view="lHr LpR lFr">

    <q-header class="bg-primary text-white" elevated>
      <q-toolbar>
        <q-btn v-if="ns.leftButton === LeftButton.Menu" aria-label="Menu" flat icon="menu"
               @click="toggleLeftDrawer"/>
        <q-btn v-else-if="ns.leftButton === LeftButton.Back" aria-label="Back" flat icon="arrow_back"
               @click="goBack"/>

        <q-toolbar-title>{{ ns.title }}</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" behavior="mobile" bordered elevated side="left">
      <q-list>
        <q-item v-ripple clickable to="ride-search">
          <q-item-section avatar>
            <q-icon name="travel_explore"/>
          </q-item-section>
          <q-item-section>
            Search Rides
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>

  </q-layout>

</template>

<script lang="ts" setup>

import { ref } from 'vue'
import { LeftButton, useNavigationStore } from 'stores/navigation-store'
import { useRouter } from 'vue-router'

const leftDrawerOpen = ref(false)

const ns = useNavigationStore()
const router = useRouter()

function toggleLeftDrawer (): void {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function goBack (): void {
  router.back()
}

</script>

<style scoped>

</style>
