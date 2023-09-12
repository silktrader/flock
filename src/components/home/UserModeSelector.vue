<script lang="ts" setup>

import { computed, ref } from 'vue'
import { useNavigationStore, UserMode } from 'stores/navigation-store'

const modeDialog = ref<boolean>(false)
const ns = useNavigationStore()

const isPassenger = computed<boolean>(() => ns.userMode === UserMode.Passenger)

function toggleModeDialog (): void {
  modeDialog.value = !modeDialog.value
}

function setUserMode (mode: UserMode): void {
  ns.setUserMode(mode)

  // delay closing the window to provide feedback
  setTimeout(() => {
    modeDialog.value = false
  }, 350)
}

</script>

<template>

  <div class="ums__container">

    <div class="ums__icon-box">
      <q-icon :name="`svguse:icons/${isPassenger ? 'person-seat' : 'steering-wheel'}.svg#icon-1`" size="24px"/>
    </div>

    <div v-ripple class="ums__mode-button" @click="toggleModeDialog()">
      <span>{{ isPassenger ? 'Passenger' : 'Driver' }}</span>
      <q-icon name="expand_more" size="sm"/>
    </div>

  </div>

  <q-dialog v-model="modeDialog" persistent position="top">
    <div class="ums__dialog">

      <div class="ums__header">
        <q-icon name="expand_more" size="sm"/>
        <span>{{ isPassenger ? 'Passenger' : 'Driver' }}</span>
      </div>

      <span
        class="ums__header__note">Find rides as a passenger, or schedule new ones as a driver.</span>

      <div class="ums__options">

        <div v-ripple :class="{'ums__option--selected': isPassenger}"
             class="ums__option" @click="setUserMode(UserMode.Passenger)">
          <div class="ums__option__label">
            <q-icon name="svguse:icons/person-seat.svg#icon-1" size="24px"/>
            <span>Passenger</span>
          </div>
          <div class="ums__option__radio">
            <div class="ums__option__radio__inside"/>
          </div>

        </div>

        <div v-ripple :class="{'ums__option--selected': !isPassenger}"
             class="ums__option" @click="setUserMode(UserMode.Driver)">
          <div class="ums__option__label">
            <q-icon name="svguse:icons/steering-wheel.svg#icon-1" size="24px"/>
            <span>Driver</span>
          </div>
          <div class="ums__option__radio">
            <div class="ums__option__radio__inside"/>
          </div>
          <!--          <div class="ums__option__off"></div>-->
        </div>

      </div>

    </div>
  </q-dialog>

</template>

<style lang="scss" scoped>
@import "src/css/quasar.variables.scss";

.ums__container {
  display: flex;
  align-items: center;
  flex-grow: 1;
  cursor: pointer;
  color: $on-background;
}

.ums__header {
  display: flex;
  gap: 16px;
  font-size: large;
  align-items: center;
}

.ums__header__note {
  font-size: medium;
}

.ums__icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  padding: 8px;
  height: 38px;
  width: 38px;
  background-color: $teal-9;
}

.ums__mode-button {
  position: relative;
  height: 40px;
  font-size: large;
  display: flex;
  gap: 4px;
  border-radius: 12px;
  align-items: center;
  padding: 0 12px;
}

.ums__dialog {
  display: flex;
  flex-direction: column;
  background-color: $grey-10;
  color: rgb(228, 227, 221);
  border-radius: 24px !important; // the important tag is necessary when in dialogs
  border-top-right-radius: 0 !important;
  border-top-left-radius: 0 !important;
  max-width: 100vw;
  padding: 12px 24px 36px;
  gap: 16px;
}

.ums__options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ums__option {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 12px 24px;
  align-items: center;
  border-radius: 24px;
  min-height: 80px;
  font-size: large;
  background-color: $surface-variant;
  color: $on-surface-variant;
  cursor: pointer;
}

.ums__option__label {
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
}

.ums__option__radio {
  height: 20px;
  width: 20px;
  border-radius: 100%;
  border: solid 2px $on-surface-variant;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ums__option__radio__inside {
  visibility: hidden;
  padding: 5px;
  border-radius: 100%;
  background-color: $primary;
}

.ums__option--selected {
  color: $on-tertiary-container;
  background-color: $tertiary-container;

  .ums__option__radio {
    border: solid 2px $primary;

    .ums__option__radio__inside {
      visibility: visible;
    }
  }
}

</style>
