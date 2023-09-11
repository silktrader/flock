<script lang="ts" setup>

import { ref } from 'vue'

const modeDialog = ref<boolean>(false)

function toggleModeDialog (): void {
  modeDialog.value = !modeDialog.value
}

</script>

<template>

  <div class="ums__container">

    <div class="ums__icon-box">
      <q-icon color="secondary" name="svguse:icons/person-seat.svg#icon-1" size="22px"/>
    </div>

    <div v-ripple class="ums__mode-button" @click="toggleModeDialog()">
      <span>Passenger</span>
      <q-icon name="expand_more" size="sm"/>
    </div>

  </div>

  <q-dialog v-model="modeDialog" persistent position="top">
    <main class="ums__dialog">

      <div class="ums__dialog__header">
        Select Mode
      </div>

      <div class="ums__options">

        <div class="ums__option">
          <q-icon color="secondary" name="svguse:icons/person-seat.svg#icon-1" size="22px"/>
          <span>Passenger</span>
          <q-radio val="line"/>
        </div>

        <div class="ums__option ums__option--inactive">
          <q-icon color="secondary" name="svguse:icons/person-seat.svg#icon-1" size="22px"/>
          <span>Driver</span>
          <q-radio val="line"/>
        </div>

      </div>

    </main>
  </q-dialog>

</template>

<style lang="scss" scoped>
@import "src/css/quasar.variables.scss";

.ums__container {
  display: flex;
  align-items: center;
  flex-grow: 1;
  cursor: pointer;
}

.ums__icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  padding: 8px;
  height: 38px;
  //background-color: $tertiary-container;
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
  background-color: #23261e;
  color: rgb(228, 227, 221);
  border-radius: 12px !important; // the important tag is necessary when in dialogs
  width: 80vw;
  max-width: 600px;
  min-height: 300px;
  padding: 24px;
}

.ums__options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ums__option {
  display: flex;
  justify-content: space-between;
  padding: 12px 12px;
  align-items: center;
  border-radius: 24px;
  min-height: 40px;
  font-size: medium;
  color: $on-tertiary-container;
  background-color: $tertiary-container;
}

.ums__option--inactive {
  background-color: $surface-variant;
  color: $on-surface-variant;
}

</style>
