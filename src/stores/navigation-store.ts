import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

export const useNavigationStore = defineStore('navigation', () => {
  const debugButton = ref<boolean>(false)
  const firstUse = ref<boolean>(false)

  const detailsPage = ref<number>(2)

  const $q = useQuasar()
  const router = useRouter()

  function toggleDebugButton (): void {
    debugButton.value = !debugButton.value
  }

  function skipIntroduction (): void {
    firstUse.value = false
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
    if (detailsPage.value === 1) {
      router.push('/rides/details/')
    } else {
      router.push('/rides/details-alt')
    }
  }

  function goRequestSent (): void {
    router.push('/rides/search/request-sent')
  }

  return {
    firstUse: readonly(firstUse),
    toggleDebugButton,
    skipIntroduction,
    toggleFullscreen,
    goHome,
    goBack,
    goDetailsPage,
    goRequestSent
  }
})
