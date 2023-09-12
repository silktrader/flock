<script lang="ts" setup>

import { useUserStore } from 'stores/user-store'
import { ResultCards, RideDetails, SearchControls } from 'src/models/options'
import { useNavigationStore } from 'stores/navigation-store'

const us = useUserStore()
const ns = useNavigationStore()

</script>

<template>

  <q-page>

    <header class="secondary-header">
      <q-btn aria-label="Back" flat icon="arrow_back" size="lg" @click="ns.goBack()"/>
      <section class="secondary-header-title">
        <span>Debug Options</span>
      </section>
      <span class="q-space"/>
    </header>

    <q-list padding>

      <q-item-label header>Home</q-item-label>

      <q-item>
        <q-item-section>
          <q-item-label>Home Header</q-item-label>
          <q-item-label caption>Choose whether the home header should always be visible, or scrolled out of view during
            vertical gestures.
          </q-item-label>
          <div class="segmented-button-container">
            <q-btn-toggle
              v-model="us.options.debug.fixedHeader"
              :options="[{label: 'Fixed Header', value: true}, {label: 'Scrollable Header', value: false}]"
              class="button-toggle"
            />
          </div>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label>User Mode Switch</q-item-label>
          <q-item-label caption>Choose how to switch between the passenger and driver views.
          </q-item-label>
          <div class="segmented-button-container">
            <q-btn-toggle
              v-model="us.options.debug.tabbedHome"
              :options="[{label: 'Tabs', value: true}, {label: 'Selector', value: false}]"
              class="button-toggle"
            />
          </div>
        </q-item-section>
      </q-item>

      <q-item-label header>Ride Search</q-item-label>

      <q-item>
        <q-item-section>
          <q-item-label>Search Controls</q-item-label>
          <q-item-label caption>Choose between the initial full screen search controls, requiring a second search result
            screen, or a compact alternative.
          </q-item-label>
          <div class="segmented-button-container">
            <q-btn-toggle
              v-model="us.options.debug.searchControls"
              :options="[{label: 'Full Page Controls', value: SearchControls.FullPage}, {label: 'Compact Controls', value: SearchControls.Compact}]"
              class="button-toggle"
            />
          </div>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label>Results Cards</q-item-label>
          <q-item-label caption>Choose between the initial obscure version, or the simplified final one.</q-item-label>
          <div class="segmented-button-container">
            <q-btn-toggle
              v-model="us.options.debug.resultCards"
              :options="[{label: 'Intricate Cards', value: ResultCards.Intricate}, {label: 'Streamlined Cards', value: ResultCards.Streamlined}]"
              class="button-toggle"
            />
          </div>
        </q-item-section>
      </q-item>

      <q-item-label header>Ride Details</q-item-label>
      <q-item>
        <q-item-section>
          <q-item-label>Details</q-item-label>
          <q-item-label caption>Interact with ride details in a long scrollable page, or in separate views.
          </q-item-label>
          <div class="segmented-button-container">
            <q-btn-toggle v-model="us.options.debug.rideDetails"
                          :options="[{label: 'Scrollable Page', value: RideDetails.Scroll}, {label: 'Multiple Views', value: RideDetails.Views}]"
                          class="button-toggle"/>
          </div>
        </q-item-section>
      </q-item>

      <q-item-label header>Date Selection</q-item-label>

      <q-item>
        <q-item-section>
          <q-item-label>Date Hints</q-item-label>
          <q-item-label caption>Choose whether to display suggested dates and lecture starting times in the relevant
            selector.
          </q-item-label>
          <div class="segmented-button-container">
            <q-btn-toggle
              v-model="us.options.debug.dateHints"
              :options="[{label: 'Show Date Hints', value: true}, {label: 'Hide Date Hints', value: false}]"
              class="button-toggle"
            />
          </div>
        </q-item-section>
      </q-item>

    </q-list>

  </q-page>

</template>

<style lang="scss" scoped>

.segmented-button-container {
  display: flex;
  width: 100%;
  margin-top: 16px;
}

</style>
