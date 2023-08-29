<template>
  <q-layout view="lHr LpR lFr">

    <q-page-container>
      <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transition" mode="out-in">
          <component :is="Component"/>
        </transition>
      </router-view>
    </q-page-container>

  </q-layout>

</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>

// Slide left

.slide-left-enter-active,
.slide-left-leave-active {
  transition: opacity 150ms, transform 150ms;
}

.slide-left-enter-from {
  opacity: 1;
  transform: translateX(-100%);
}

.slide-left-leave-to {
  opacity: 1;
  transform: translateX(100%);
}

// Slide right

.slide-right-enter-active,
.slide-right-leave-active {
  transition: opacity 150ms, transform 150ms;
}

.slide-right-enter-from {
  opacity: 1;
  transform: translateX(100%);
}

.slide-right-leave-to {
  opacity: 1;
  transform: translateX(-100%);
}

</style>
