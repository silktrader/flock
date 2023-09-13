<template>
  <q-page-sticky position="top-right">
    <div class="modal-header-spacer"/>
    <section>
      <q-btn aria-label="Close" flat icon="close" size="lg" @click="ns.goBack()"/>
    </section>
  </q-page-sticky>

  <div class="named-avatar">
    <q-avatar size='40vw' style="">
      <img :src='user.avatarUrl'/>
    </q-avatar>
    <div class='text-h5' style="padding-top: 10px;"> {{ user.firstName }} {{ user.lastName }}</div>
    <div class='text-caption'> {{ user.degree }}</div>
  </div>

  <div class="row justify-center" style="padding-top: 10px;">
    <q-rating
      v-model="userRating"
      color='secondary'
      readonly
      size='7vw'
    />
  </div>

  <div class="actions-container">
    <q-btn class="action-button" label="Follow" outline/>
    <q-btn class="action-button" label="Message" outline/>
  </div>

  <div class='badge-container'>

    <q-chip v-for='(badge, index) in user.languages' :key='index' class="chip">
      {{ badge }}
    </q-chip>

    <q-chip v-for='(badge, index) in user.badges' :key='index' class="chip">
      {{ badge }}
    </q-chip>
  </div>

  <div style="padding:20px">
    <div class="text-h5 text-weight-bolder" style="padding-bottom: 5px;">
      About
    </div>
    <div class="text-body1 ">
      {{ lorem }}
    </div>
  </div>

  <div class="info-cards-container">
    <div v-if="isDriver">
      <q-card class="cert-driver-card">
        <q-img :ratio="1"
               src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHJpdmVyfGVufDB8fDB8fHww&w=1000&q=80">
          <div class="absolute-bottom text-h6">
            Certified Driver
          </div>
        </q-img>
        <q-card-section class="row items-center justify-between">
          <div class="text-h4">
            {{ numDrives }}
          </div>
          <div class="test-body bold">
            Rides Given
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div v-if="isRider">
      <q-card class="usual-passenger-card">
        <q-img ratio="1"
               src="https://static.vecteezy.com/system/resources/previews/000/238/596/non_2x/hitch-hiker-vector-illustration.jpg">
          <div class="absolute-bottom text-h6">
            Usual Passenger
          </div>
        </q-img>
        <q-card-section class="row items-center justify-between">
          <div class="text-h4">
            {{ numRides }}
          </div>
          <div class="test-body bold">
            Rides Taken
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>

  <div class="prefered-dest-container">
    <q-card class="prefered-dest-card">
      <q-img :ratio="1" :src='prefDest.Avatar'>
        <div class="absolute-bottom text-h6">
          {{ prefDest.Label }}
        </div>
      </q-img>
      <q-card-section>
        {{ prefDest.Address }}
      </q-card-section>
    </q-card>
  </div>

</template>

<style lang="scss" scoped>

.actions-container {
  display: flex;
  justify-content: space-evenly;
  padding-top: 30px;

}

.action-button {
  color: $primary;

}

.rides-drives-container {
  display: flex;
  justify-content: space-evenly;
}

.rides-given {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rides-taken {
  display: flex;
  flex-direction: column;
  align-items: center;
}

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

.named-avatar {
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.badge-container {
  display: flex;
  flex-direction: row;
  gap: 8px;
  flex-wrap: wrap;
  margin: 48px 24px 24px;
  align-items: center;
  justify-content: center;
}

.badge {
  background-color: $secondary-container;
  color: $on-secondary-container;
}

.lang {
  color: $primary-container;
}

.desc-back {
  background-color: $secondary-container;
}

.info-cards-container {
  padding-top: 20px;
  display: flex;
  align-items: stretch;
  justify-content: space-evenly;
  column-gap: 20px;
  flex-wrap: wrap;
}

.usual-passenger-card {
  width: 40vw;
  background-color: $secondary-container;
}

.cert-driver-card {
  width: 40vw;
  background-color: $secondary-container;
}

.prefered-dest-card {
  width: 100vw;
  background-color: $secondary-container;
}

.prefered-dest-container {
  display: flex;
  width: 100%;
  padding: 20px;
}
</style>

<script lang='ts' setup>
import { ref } from 'vue'
import { useUserStore } from 'stores/user-store'
import { useLocationStore } from 'stores/location-store'
import { useNavigationStore } from 'src/stores/navigation-store'
import { User } from 'src/models/user'
import { RandomFloat, RandomInt } from 'src/tools/random-tools'

const us = useUserStore()
const ls = useLocationStore()
const ns = useNavigationStore()

const user = ref<User>(us.generateUser(new Set()))
const lorem = `Greetings fellow travelers! I'm ${user.value.firstName}, your carpool companion on journeys through both books and roads. When I'm not engrossed in novels, you'll find me on the open road, always up for an adventure. I love to discover hidden gems and cozy coffee shops along the way. Join me for great conversations and unforgettable road trips.`
const userRating = RandomFloat(2.4, 4.9)

const prefDest = ls.sapienzaPlaces[RandomInt(0, ls.sapienzaPlaces.length)]

const isDriver = true
const isRider = true

const numRides = RandomInt(8, 25)
const numDrives = RandomInt(8, 25)

</script>
