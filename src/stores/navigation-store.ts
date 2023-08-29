import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'
import { useQuasar } from 'quasar'

export interface Page {
  route: string,
  rank: number
}

export interface AnimationClass {
  enterClass: string,
  exitClass: string
}

export const useNavigationStore = defineStore('navigation', () => {
  const debugButton = ref<boolean>(false)
  const firstUse = ref<boolean>(false)
  const currentPage = ref<Page>({
    route: '/',
    rank: 1
  })

  const $q = useQuasar()

  function toggleDebugButton (): void {
    debugButton.value = !debugButton.value
  }

  function skipIntroduction (): void {
    firstUse.value = false
  }

  async function toggleFullscreen (): Promise<void> {
    await $q.fullscreen.toggle()
  }

  function getAnimation (rank: number): AnimationClass {
    if (rank > currentPage.value.rank) {
      return {
        enterClass: 'animated fadeInRight',
        exitClass: 'animated fadeOutLeft'
      }
    } else {
      return {
        enterClass: 'animated fadeInLeft',
        exitClass: 'animated fadeOutLeft'
      }
    }
  }

  function changePage (newPage: Page): { enterClass: string, exitClass: string } {
    // the new page is coming in from the right
    if (newPage.rank > currentPage.value.rank) {
      console.log('HERE')
      currentPage.value = newPage
      return {
        enterClass: 'animated fadeInRight',
        exitClass: 'animated fadeOutLeft'
      }
    } else {
      console.log('here')
      currentPage.value = newPage
      return {
        // enterClass: 'animated fadeInLeft',
        // exitClass: 'animated fadeOutLeft'
        enterClass: 'animated bounceOutUp',
        exitClass: 'animated bounceOutUp'
      }
    }
  }

  return {
    firstUse: readonly(firstUse),
    toggleDebugButton,
    skipIntroduction,
    toggleFullscreen,
    getAnimation,
    changePage
  }
}
)
