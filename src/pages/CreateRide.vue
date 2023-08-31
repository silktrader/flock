<script lang="ts" setup>
</script>

<template>
  <q-page class="column">
    <header class="modal-header">
      <!--      <q-btn aria-label="Back" flat icon="arrow_back" size="lg" @click="router.go(-1)"/>-->
      <div class="modal-header-spacer"/>
      <section class="modal-header-title">
        <span style="padding-right: 1em;">Drive Creation</span>
        <!--        <span class="modal-header-subtitle">Results</span>-->
      </section>
      <section>
        <q-btn aria-label="Close" flat icon="close" size="lg"/>
      </section>
    </header>
    <q-separator/>
    <div class="column general-container ">
      <div class="instruction">Select your starting position:</div>
      <div class="locations-boxes">
        <q-btn class="place-button" />
      </div>
    </div>
  </q-page>
</template>

<style  lang="scss" scoped>
@import "src/css/quasar.variables.scss";
.general-container{
  padding: 0.5em 20px
}
.instruction {
  font-size: 1.6em;
  text-align: center;
  padding: 30px 0;
 
}
.locations-boxes {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 3;
  min-width: 0;
}
.place-button {
  display: flex;
  flex-direction: row;
  font-size: medium;
  border-radius: $border-radius;
  background-color: $primary;
  color: $on-primary;
  cursor: pointer;
  text-transform: none;
  font-weight: normal;
  min-height: 60px;
}
</style>
