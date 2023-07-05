<template>

  <q-page>
    <section class="actions">
      <q-btn class="tonal-button" label="Search Rides" no-caps no-wrap rounded
             text-color="$on-tertiary" to='/ride-search'/>
    </section>
  </q-page>

</template>

<script lang="ts">

</script>

<style lang="scss" scoped>
@import "src/css/quasar.variables.scss";

.actions {
  display: flex;
  flex-direction: column;
  margin: auto;
  padding: 24px;
  gap: 16px;
  justify-content: center;
  width: min-content;
}

</style>
