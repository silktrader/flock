<template>
  <q-layout view="lHr LpR lFr">

    <!--    <q-header v-if="ns.toolbar" class="toolbar" elevated>-->
    <!--      <q-toolbar>-->
    <!--        <q-btn v-if="ns.leftButton === LeftButton.Menu" aria-label="Menu" flat icon="menu" size="lg"-->
    <!--               @click="toggleLeftDrawer"/>-->
    <!--        <q-btn v-else-if="ns.leftButton === LeftButton.Back" aria-label="Back" flat icon="arrow_back" size="lg"-->
    <!--               @click="goBack"/>-->

    <!--        <q-toolbar-title>-->
    <!--          <section class="toolbar-title">-->
    <!--            <span>{{ ns.title }}</span>-->
    <!--            <span class="subtitle">{{ ns.subtitle }}</span>-->
    <!--          </section>-->
    <!--        </q-toolbar-title>-->
    <!--      </q-toolbar>-->
    <!--    </q-header>-->

    <!--    <q-drawer v-model="leftDrawerOpen" behavior="mobile" bordered elevated side="left">-->
    <!--      <q-list>-->
    <!--        <q-item v-ripple clickable to="ride-search">-->
    <!--          <q-item-section avatar>-->
    <!--            <q-icon name="travel_explore"/>-->
    <!--          </q-item-section>-->
    <!--          <q-item-section>-->
    <!--            Search Rides-->
    <!--          </q-item-section>-->
    <!--        </q-item>-->
    <!--      </q-list>-->
    <!--    </q-drawer>-->

    <q-page-container>
      <router-view/>
    </q-page-container>

  </q-layout>

</template>

<script lang="ts" setup>

import { ref } from 'vue'
import { useNavigationStore } from 'stores/navigation-store'
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

<style lang="scss" scoped>
@import "src/css/quasar.variables.scss";

.toolbar {
  color: $on-primary;
  background-color: $primary;

}

.toolbar-title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 64px;
}

.toolbar-title span {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.subtitle {
  font-size: small;
  color: black;
  opacity: 0.8;
}

</style>
