<template>
  <header class="home-header">
    <span>Flock</span>

    <section class="home-header-actions">
      <q-btn flat icon="chat" round></q-btn>
      <q-btn flat icon="notifications" round></q-btn>
    </section>
  </header>

  <div class="named-avatar">
    <q-avatar size='40vw'>
      <img :src='user.avatarUrl'/>
    </q-avatar>
    <div class='text-h5' style="padding-top: 10px;"> {{ user.firstName }} {{ user.lastName }}</div>
    <div class='text-caption'> {{ user.degree }} </div>
  </div>

  <div class="row justify-center" style="padding-top: 10px;">
    <q-rating
      v-model="userRating"
      size='7vw'
      color='secondary'
      readonly
      />
  </div>

  <div v-if='user.badges.length' class='badge-container'>
    <q-chip v-for='(badge, index) in user.badges' :key='index' class='badge' size='14px' :clickable="false" :ripple="false">
       {{ badge }}
    </q-chip>
  </div>

    <div class="text-center text-body1 desc-back" style="padding: 20px;">
      {{ lorem }}
    </div>

  <q-scroll-area style="height: 35vh; max-width: 200vw;">
    <div class="info-cards-container">
      <q-card class="prefered-dest-card">
        <q-icon rounded name="las la-heart" size="20px"/>
          <q-img :src='prefDest.Avatar' :ratio="1">
            <div class="absolute-bottom text-h6">
              {{ prefDest.Label }}
            </div>
          </q-img>
          <q-card-section>
            {{ prefDest.Address }}
          </q-card-section>
      </q-card>

      <div v-if="isDriver">
        <q-card class="prefered-dest-card">
          <q-icon name="las la-car" size="20px" />
            <q-img :ratio="1" src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHJpdmVyfGVufDB8fDB8fHww&w=1000&q=80">
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
        <q-card class="prefered-dest-card">
          <q-icon name="las la-hiking" size="20px"/>
            <q-img ratio="1" src="https://static.vecteezy.com/system/resources/previews/000/238/596/non_2x/hitch-hiker-vector-illustration.jpg">
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
  </q-scroll-area>

  <q-page-sticky :offset="[18,18]" position="bottom-right">
    <q-fab class="fab-button" direction="up" fab icon="add" vertical-actions-align="right">
      <q-fab-action v-if="isDriver" color="secondary" icon='las la-calendar-plus' label="Book Ride" label-position="left"
        text-color="black"/>
      <q-fab-action color="secondary" icon='las la-phone' label="Call" label-position="left" text-color="black"/>
      <q-fab-action color="secondary" icon='las la-star' label="Save in Favourites" label-position="left"
        text-color="black"/>
    </q-fab>
  </q-page-sticky>

</template>

<style lang="scss" scoped>
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
  padding-top: 20px;
  align-items: center;
  justify-content: space-evenly;
  padding-bottom: 20px;
}

.badge {
  background-color: $secondary-container;
  color: $on-secondary-container;
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
}

.prefered-dest-card {
  width: 40vw;
  background-color: $secondary-container;
}
</style>

<script setup lang='ts'>
import { ref } from 'vue'
import { useUserStore } from 'stores/user-store'
import { useLocationStore } from 'stores/location-store'
import { User } from 'src/models/user'
import { RandomFloat, RandomInt } from 'src/tools/random-tools'

const us = useUserStore()
const ls = useLocationStore()

const lorem = "Lorem ipsum dolor sit a met, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

const user = ref<User>(us.generateUser(new Set(), false))
const userRating = RandomFloat(2.4, 4.9)

const prefDest = ls.sapienzaPlaces[RandomInt(0, ls.sapienzaPlaces.length)]

const isDriver = true
const isRider = true

const numRides = RandomInt(8, 25)
const numDrives = RandomInt(8, 25)
</script>
