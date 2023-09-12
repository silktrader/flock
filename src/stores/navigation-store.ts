import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useUserStore } from 'stores/user-store'
import { RideDetails, SearchControls } from 'src/models/options'

export enum UserMode {
  Passenger,
  Driver
}

export const useNavigationStore = defineStore('navigation', () => {
  const $q = useQuasar()
  const router = useRouter()
  const us = useUserStore()

  // Determines whether the user opens the application for the first time.
  const firstUse = ref<boolean>(true)

  // Tracks changes to passenger or driver modes.
  const userMode = ref<UserMode>(UserMode.Passenger)

  function skipIntroduction (): void {
    firstUse.value = false
  }

  function setUserMode (mode: UserMode): void {
    userMode.value = mode
  }

  async function toggleFullscreen (): Promise<void> {
    await $q.fullscreen.toggle()
  }

  function goHome (): void {
    router.push('/')
  }

  function goBack (): void {
    router.go(-1)
  }

  function goDetailsPage (): void {
    if (us.options.debug.rideDetails === RideDetails.Scroll) {
      router.push('/rides/details/')
    } else {
      router.push('/rides/details-alt')
    }
  }

  function goRequestSent (): void {
    router.push('/rides/search/request-sent')
  }

  function goDebugOptions (): void {
    router.push('/settings/debug')
  }

  function goSearchRides (): void {
    router.push(us.options.debug.searchControls === SearchControls.FullPage ? '/rides/search-full' : '/rides/search')
  }

  function goOldSearchResults (): void {
    router.push('/rides/search')
  }

  return {
    firstUse: readonly(firstUse),
    userMode: readonly(userMode),
    setUserMode,
    skipIntroduction,
    toggleFullscreen,
    goHome,
    goBack,
    goDetailsPage,
    goRequestSent,
    goDebugOptions,
    goSearchRides,
    goOldSearchResults
  }
})
