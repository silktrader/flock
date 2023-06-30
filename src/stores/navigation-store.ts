import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'

export enum LeftButton {
  Menu = 'menu',
  Back = 'back',
}

export const useNavigationStore = defineStore('navigation', () => {
  const title = ref<string>('Flock')
  const subtitle = ref<string>('')
  const leftButton = ref<string>(LeftButton.Menu)

  function setTitle (newTitle: string): void {
    title.value = newTitle
  }

  function setSubtitle (newSubtitle: string) {
    subtitle.value = newSubtitle
  }

  function setButton (newValue: LeftButton): void {
    leftButton.value = newValue
  }

  return {
    title: readonly(title),
    subtitle: readonly(subtitle),
    leftButton: readonly(leftButton),
    setTitle,
    setSubtitle,
    setButton
  }
}
)
