<script lang="ts" setup>

import StatMoney from 'components/stats/StatMoney.vue'
import UpcomingLectureCard from 'components/UpcomingLectureCard.vue'
import StatAggregates from 'components/stats/StatRides.vue'
import UpcomingRideCard from 'components/UpcomingRideCard.vue'
import StatCO2Saved from 'components/stats/StatCO2Saved.vue'
import StatPeopleMet from 'components/stats/StatPeopleMet.vue'
import StatDistance from 'components/stats/StatDistance.vue'
import { useRideStore } from 'stores/ride-store'
import { useUserStore } from 'stores/user-store'
import { computed } from 'vue'
import { AcceptedRide } from 'src/models/ride'

const rs = useRideStore()
const us = useUserStore()

const now = new Date() // possible issue in a long-running instance, may need to be outsourced to an external ticker

const bookedRides = computed<ReadonlyArray<AcceptedRide>>(
  () => rs.acceptedRides
    .filter(r => r.departure >= now)
    .sort((a, b) => a.departure.getTime() - b.departure.getTime()))

</script>

<template>

  <main class="tab-sections">

    <section v-if="rs.requestedRides.length" class="notice-box">

      <q-icon name="las la-stamp" size="lg"/>

      <span>You have <b>{{
          rs.requestedRides.length
        }}</b> pending ride request{{ rs.requestedRides.length > 1 ? 's' : '' }} waiting to be approved.</span>

      <q-btn dense flat icon="arrow_forward_ios" to="/rides/requests"/>

    </section>

    <section class="home__row">
      <span class="home__row__title">Your Booked Rides</span>
      <div class="upcoming-cards">
        <div class="card-spacer"/>
        <UpcomingRideCard v-for="ride in bookedRides" :key="ride.id" :ride="ride"/>
        <div class="card-spacer"/>
      </div>
    </section>

    <section class="home__row">
      <span class="home__row__title">Your Next Lectures</span>
      <div class="upcoming-cards">
        <div class="card-spacer"/>
        <UpcomingLectureCard v-for="lecture in us.upcomingLectures" :key="lecture.id" :lecture="lecture"/>
        <div class="card-spacer"/>
      </div>
    </section>

    <section class="home__row">
      <span class="home__row__title">Facts & Figures</span>
      <div class="home__stats">

        <div class="home__stats__col">
          <StatAggregates/>
          <StatPeopleMet/>
          <StatDistance/>
          <!--          <StatRideCount/>-->
        </div>
        <div class="home__stats__col">
          <StatCO2Saved/>
          <StatMoney/>
        </div>
      </div>

    </section>

  </main>

</template>

<style lang="scss">
@import "src/css/quasar.variables.scss";

.home__row {
  display: flex;
  flex-direction: column;
  margin-top: 24px;
}

.home__row__title {
  color: $on-background;
  font-size: medium;
  margin-left: 24px;
}

.upcoming-cards {
  display: flex;
  flex-direction: row;
  gap: 8px;
  width: 100%;
  padding-top: 8px;
  padding-bottom: 8px;
  overflow-y: hidden;
  overflow-x: auto;
  height: min-content;
}

.home__stats {
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-left: 24px;
  margin-right: 24px;
  padding-top: 8px;
  padding-bottom: 8px;
}

.home__stats__col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1;
}

.card-spacer {
  min-width: 16px;
}

</style>
