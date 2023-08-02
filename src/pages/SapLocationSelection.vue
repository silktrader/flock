<template>
  <main class="container">

    <header class="modal-header">
      <div class="modal-header-spacer"></div>
      <section class="modal-header-title">
        <span>Select a location</span>
      </section>
      <section>
        <q-btn aria-label="Close" flat icon="close" size="lg" @click="closeModal()"/>
      </section>
    </header>

    <ul class="locations-list">
      <li v-for="item in places" :key="item.Location.Label" v-ripple class="location-item"
          @click="selectPlace(item.Location)">

        <section class="location-image">
          <!--            <img :src="item.Location.Avatar">-->
          <q-img src="/src/assets/SapLogo.png" width="64px"/>
        </section>

        <section class="location-description">
          <span class="location-label">{{ item.Location.Label }}</span>
          <span class="location-address">{{ item.Location.Address }}</span>
          <section class="location-lectures">
            <q-chip v-for="course in item.Courses" :key="course" class="chip">
              {{ us.getCourseAcro(course) }}
            </q-chip>
          </section>
        </section>

        <q-icon color="primary" name="navigate_next" size="lg"/>

      </li>
    </ul>

  </main>
</template>

<script lang="ts" setup>

import { useRouter } from 'vue-router'
import { useLocationStore } from 'stores/location-store'
import { useUserStore } from 'stores/user-store'
import { computed } from 'vue'
import { SapienzaPlace } from 'src/models/place'
import { useRideStore } from 'stores/ride-store'

const router = useRouter()
const ls = useLocationStore()
const us = useUserStore()
const rs = useRideStore()

const props = defineProps<{ target: 'origin' | 'destination' }>()

const places = computed<Array<{ Location: SapienzaPlace, Courses: Set<string> }>>(() => {
  return ls.sapienzaLocations.map(location => ({
    Location: location,
    Courses: new Set(us.lectures.filter(l => l.Location.Address === location.Address).map(l => l.Course))
  }))
})

function closeModal (): void {
  router.replace('/search-results')
}

async function selectPlace (place: SapienzaPlace): Promise<void> {
  if (props.target === 'destination') {
    rs.updateParameters({ Destination: place })
  } else if (props.target === 'origin') {
    rs.updateParameters({ Origin: place })
  } else {
    throw new Error('invalid parameter while selecting location')
  }
  await router.replace('/search-results')
}

</script>

<style lang="scss" scoped>

@import "src/css/quasar.variables.scss";

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  align-items: center;
}

.locations-list {
  list-style: none;
  font-size: medium;
  width: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.location-item {
  position: relative; // needed for ripple effects
  display: flex;
  gap: 16px;
  padding: 16px;
  justify-content: space-between;
  align-items: center;
  line-height: normal;
  cursor: pointer;
  height: min-content;
}

.location-description {
  display: flex;
  flex-grow: 5;
  flex-direction: column;
  gap: 8px;
}

.location-label {
  font-size: medium;
  color: $primary;
}

.location-address {
  font-size: small;
  color: $secondary;
}

.location-image {
}

.location-lectures {
  display: flex;
  justify-content: flex-start;
  flex-grow: 1;
}

.chip {
  height: 24px;
  padding-left: 12px;
  padding-right: 12px;
  color: $on-surface-variant;
  background-color: $surface-variant;
  font-size: smaller;
}

</style>
