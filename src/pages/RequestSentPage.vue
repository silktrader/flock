<script lang="ts" setup>

import { useRideStore } from 'stores/ride-store'
import { computed, ref } from 'vue'
import { Ride } from 'src/models/ride'
import { useNavigationStore } from 'stores/navigation-store'
import { useUserStore } from 'stores/user-store'

const rs = useRideStore()
const ns = useNavigationStore()
const us = useUserStore()

const commentDialog = ref<boolean>(false)
const commentText = ref<string>()
const commentSent = ref<boolean>(false)

const ride = computed<Ride>(() => {
  if (rs.ride === undefined) {
    throw new Error('Missing ride')
  }
  return rs.ride
})

function leaveComment (): void {
  commentSent.value = true
  commentDialog.value = false
}

function discardComment (): void {
  commentText.value = undefined
  commentDialog.value = false
}

async function abort (): Promise<void> {
  ns.goHome()
}

</script>

<template>

  <q-page class="rqs">

    <header class="rqs__header">
      <q-btn aria-label="Close" flat icon="close" size="lg" @click="abort()"/>
    </header>

    <div style="flex-grow: 1"/>

    <transition
        appear
        enter-active-class="animated heartBeat"
        leave-active-class="animated fadeOut">
      <section key="front" class="rqs__front">
        <div class="rqs__image">
          <q-img alt="Success" fit="contain" height="200px" src="~/assets/success-car.svg"/>
        </div>
        <span>Request Sent</span>
      </section>

    </transition>

    <div style="flex-grow: 3"/>

    <section class="rqs__message">
      <div class="rqs__message__header">
        <q-icon name="las la-check-circle" size="lg"/>
        <div class="rqs__message__header__text">
          <span>We'll notify you when {{ ride.Driver.firstName }} approves your request. Fingers crossed!</span>
          <div class="rqs__message__header__icons">
            <q-icon name="las la-at" size="sm"/>
            <q-icon name="las la-bell" size="sm"/>
          </div>
        </div>
      </div>

      <div v-if="!commentSent" class="rqs__action">
        <q-btn :label="`Leave ${ride.Driver.firstName} a comment`" class="outline-button"
               @click="commentDialog = true"/>
      </div>

      <template v-else>
        <transition appear enter-active-class="animated fadeIn">
          <div key="comment-text" class="rqs__comment">
            <span>Request comment added:</span>
            <q-chat-message v-if="ride.comment"
                            :avatar="us.user.avatarUrl"
                            :text="[commentText]"
                            bg-color="amber-4"
                            size="8"
                            text-color="gray-10"
            />
          </div>
        </transition>
      </template>

      <q-dialog v-model="commentDialog" persistent>
        <q-card class="card card--with-header" flat style="min-width: 300px">
          <q-card-section class="card-header">
            <span>Comment for {{ ride.Driver.firstName }}</span>
          </q-card-section>

          <q-card-section class="rqs__dialog__input">
            <q-input
                v-model="commentText"
                autofocus
                autogrow
                clearable
                counter
                filled
                maxlength="160"
                rows="3"
                type="textarea"
                @keyup.enter="commentDialog = false"/>
          </q-card-section>

          <q-card-actions align="between">
            <q-btn class="flat-button" flat label="Discard" @click="discardComment()"/>
            <q-btn class="filled-button" label="Leave Message" @click="leaveComment()"/>
          </q-card-actions>
        </q-card>
      </q-dialog>

    </section>

  </q-page>

</template>

<style lang="scss" scoped>
@import "src/css/quasar.variables.scss";

.rqs {
  display: flex;
  height: 100vh;
  flex-direction: column;
  background-color: $background;
  color: $on-background;
  align-items: center;
  font-size: medium;
}

.rqs__header {
  display: flex;
  align-self: flex-end;
  padding: 8px;
}

.rqs__image {
  display: flex;
  align-items: center;
  height: 150px;
  width: 150px;
  background-color: $positive;
  border-radius: 100%;
  padding: 16px;
}

.rqs__front {
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-size: x-large;
  font-weight: bold;
  align-items: center;
  color: $positive;
}

.rqs__message {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 2; // allow for chat message space
  background-color: $surface-variant;
  color: $on-surface-variant;
  border-top-right-radius: 24px;
  border-top-left-radius: 24px;
  justify-content: space-between;
}

.rqs__message__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 24px 24px 0;
  flex-grow: 1;
}

.rqs__message__header__text {
  display: flex;
  flex-direction: column;
  margin: 2rem;
  text-align: center;
}

.rqs__message__header__icons {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.rqs__action, .rqs__comment {
  display: flex;
  flex-direction: column;
  flex-grow: 3;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

.rqs__comment {
  justify-content: flex-start;
}

.rqs__dialog__input {
  padding: 24px;
}

</style>
