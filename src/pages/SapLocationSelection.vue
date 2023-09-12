<template>
  <main class="container">

    <header class="secondary-header">
      <q-btn aria-label="Back" flat icon="arrow_back" size="lg" @click="closeModal()"/>
      <section class="secondary-header-title">
        <span>Select a {{ props.target === 'origin' ? 'starting point' : 'destination' }}</span>
      </section>
    </header>

    <ul class="locations-list">
      <li v-for="item in places" :key="item.Location.Label" v-ripple class="location-item"
          @click="selectPlace(item.Location)">

        <section class="location-image">
          <!--            <img :src="item.Location.Avatar">-->
          <q-img src="~/assets/sapienza-logo.png" width="64px"/>
        </section>

        <section class="location-description">
          <span class="location-label">{{ item.Location.Label }}</span>
          <span class="location-address">{{ item.Location.Address }}</span>
          <section class="location-lectures">
            <q-chip v-for="id in item.CourseIds" :key="id" class="chip">
              {{ us.getCourseById(id).acro }}
            </q-chip>
          </section>
        </section>

        <q-icon color="secondary" name="navigate_next" size="lg"/>

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

const props = defineProps<{ target: 'origin' | 'destination', task: 'ride' | 'drive' }>()

const places = computed<Array<{ Location: SapienzaPlace, CourseIds: Set<string> }>>(() => {
  return ls.sapienzaPlaces.map(location => ({
    Location: location,
    CourseIds: new Set(us.lectures.filter(l => l.location.Address === location.Address).map(l => l.courseId))
  })).sort((a, b) => b.CourseIds.size - a.CourseIds.size || a.Location.Label.localeCompare(b.Location.Label))
})

function closeModal (): void {
  router.go(-1)
}

async function selectPlace (place: SapienzaPlace): Promise<void> {
  if (props.task === 'drive') {
    router.push('/create-ride/dest')
    return
  }
  if (props.target === 'destination') {
    rs.mockSearchDelay()
    rs.updateParameters({ Destination: place })
  } else if (props.target === 'origin') {
    rs.mockSearchDelay()
    rs.updateParameters({ Origin: place })
  } else {
    throw new Error('invalid parameter while selecting location')
  }
  router.go(-1)
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
  padding: 8px 16px;
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
  color: $secondary;
}

.location-address {
  opacity: 80%;
  font-size: small;
  color: $on-background;
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
