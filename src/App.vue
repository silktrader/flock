<template>
  <router-view/>
</template>

<script lang="ts" setup>

import { useQuasar } from 'quasar'

const $q = useQuasar()

// set status
$q.dark.set(true)

</script>
