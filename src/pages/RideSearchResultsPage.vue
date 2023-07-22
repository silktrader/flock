<template>

  <main class="results-container">

    <header class="modal-header">
      <q-btn aria-label="Back" flat icon="arrow_back" size="lg" @click="router.go(-1)"/>
      <section class="modal-header-title">
        <span>Ride Search</span>
        <span class="modal-header-subtitle">Results</span>
      </section>
      <section>
        <q-btn aria-label="Close" flat icon="las la-bug" size="sm" @click="showOptions = true"/>
        <q-btn aria-label="Close" flat icon="close" size="lg" @click="abort()"/>
      </section>
    </header>

    <search-controls-v1/>

    <q-separator/>

    <div v-if="resultCardVersion === 'a'" class="ride-cards">
      <search-result-v1 v-for='ride in rides' :key='ride.Id' :r="ride"/>
    </div>

    <div v-else-if="resultCardVersion === 'b'" class="ride-cards">
      <search-result-v2 v-for='ride in rides' :key='ride.Id' :r="ride"/>
    </div>

    <q-dialog v-model="showOptions">
      <q-card class="dialog">
        <q-card-section>
          <div class="text-h6">Component Versions</div>
        </q-card-section>

        <q-item-label header>Results Cards</q-item-label>
        <q-item dense>
          <q-item-section>
            <q-btn-toggle
              v-model="resultCardVersion"
              :options="[{label: 'Initial', value: 'a'}, {label: 'Streamlined', value: 'b'}]"
              outline
              toggle-color="primary"
            />
          </q-item-section>
        </q-item>

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Close" no-caps/>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </main>

</template>

<script lang="ts" setup>

import { useRideStore } from 'stores/ride-store'
import { computed, ref } from 'vue'
import SearchResultV1 from 'components/SearchResultV1.vue'
import SearchResultV2 from 'components/SearchResultV2.vue'
import { useRouter } from 'vue-router'
import { Ride } from 'src/models/ride'
import SearchControlsV1 from 'components/SearchControlsV1.vue'

const rs = useRideStore()
const router = useRouter()

const showOptions = ref<boolean>(false)
const resultCardVersion = ref<string>('b')

const rides = computed<ReadonlyArray<Ride>>(() => [...rs.rides].sort(sortByRecurring))

function sortByRecurring (a: Ride, b: Ride): number {
  if (a.Recurring && !b.Recurring) return -1
  if (b.Recurring && !a.Recurring) return 1
  return 0
}

async function abort (): Promise<void> {
  await router.replace('/')
  rs.reset()
}

</script>

<style lang="scss" scoped>
@import "src/css/quasar.variables.scss";

.results-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: 0;
}

.ride-cards {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
  overflow: auto;
}

.dialog {
  background-color: $surface-variant;
  color: $on-surface-variant;
}

</style>
