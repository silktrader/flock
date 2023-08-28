import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'
import { useQuasar } from 'quasar'

export const useNavigationStore = defineStore('navigation', () => {
  const debugButton = ref<boolean>(false)
  const firstUse = ref<boolean>(true)
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

  return {
    firstUse: readonly(firstUse),
    toggleDebugButton,
    skipIntroduction,
    toggleFullscreen
  }
}
)
