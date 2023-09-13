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

  // How long before route changes occur after a user interacts with navigation elements, to display animations mostly.
  const defaultRoutWait = 250

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

  function delayRoutePush (path: string): void {
    setTimeout(() => {
      router.push(path)
    }, defaultRoutWait
    )
  }

  function goHome (): void {
    delayRoutePush('/')
  }

  function goBack (): void {
    setTimeout(() => {
      router.go(-1)
    }, defaultRoutWait)
  }

  function goDetailsPage (): void {
    if (us.options.debug.rideDetails === RideDetails.Scroll) {
      delayRoutePush('/rides/details/')
    } else {
      delayRoutePush('/rides/details-alt')
    }
  }

  function goRequestSent (): void {
    delayRoutePush('/rides/search/request-sent')
  }

  function goDebugOptions (): void {
    delayRoutePush('/settings/debug')
  }

  function goSearchRides (): void {
    delayRoutePush(us.options.debug.searchControls === SearchControls.FullPage ? '/rides/search-full' : '/rides/search')
  }

  function goOldSearchResults (): void {
    delayRoutePush('/rides/search')
  }

  function goPendingRideRequests (): void {
    delayRoutePush('/rides/requests')
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
    goOldSearchResults,
    goPendingRideRequests
  }
})
