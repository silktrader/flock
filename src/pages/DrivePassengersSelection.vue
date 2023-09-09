<template>
    <q-page class="column">
      <header class="modal-header">
        <!--      <q-btn aria-label="Back" flat icon="arrow_back" size="lg" @click="router.go(-1)"/>-->
        <div class="modal-header-spacer"/>
        <section class="modal-header-title">
          <span style="padding-right: 1em; font-weight: bolder;">Drive Creation</span>
          <!--        <span class="modal-header-subtitle">Results</span>-->
        </section>
        <section>
          <q-btn aria-label="Close" flat icon="close" size="lg" @click="abort()"/>
        </section>
      </header>
    </q-page>
</template>

<script lang="ts" setup>
import { useDriveStore } from 'src/stores/driveStore'
import { useRouter } from 'vue-router'

const ds = useDriveStore()
const router = useRouter()

function abort (): void {
  ds.clearTemporaryDrive()
  router.push('/')
}

</script>
