<template>
  <q-page>

    <div class="page-column">

      <div class="text-h4 text-center">
        {{ userName }}
      </div>

      <div class="justify-center row" style="background-color:#2a331e; width:100vw;">
        <q-avatar class='avatar' size="30vh">
          <img :src="profilePictureURL">
        </q-avatar>
      </div>

      <div style="padding-top: 10px">
        <div class="icon-text">

          <div>
            <q-icon color='primary' name='las la-user' size="40px"/>
          </div>

          <div class="only-text">
            <div class="text-overline text-weight-light">
              User Rating
            </div>
            <div class='q-gutter-y-md column'>
              <q-rating
                v-model='ratingModel'
                color="grey"
                size="3.5em"
              />
            </div>
          </div>

        </div>

        <div class="icon-text">

          <div>
            <q-icon color='primary' name='las la-user' size="40px"/>
          </div>

          <div class="only-text">
            <div class="text-overline text-weight-light">
              User Bio
            </div>
            <div class="text-subtitle2 text-bold text-left">
              {{ userBio }}
            </div>
          </div>

        </div>
      </div>

      <q-icon color="secondary" name="keyboard_double_arrow_up" size='lg'  style="padding-bottom: 2%;"/>

    </div>
  </q-page>
</template>

<style scoped>

.page-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  justify-content: space-between;
  padding-right: 2%;
  padding-left: 2%;
}

.icon-text {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 20px;
}

</style>

<script setup>

import { ref } from 'vue'

const profilePictureURL = 'https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg'
const userName = 'Esteban hugo de la rosa immediata'

const userBio = 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\''

const ratingModel = ref(4)

</script>
