import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'

export enum LeftButton {
  Menu = 'menu',
  Back = 'back',
}

export const useNavigationStore = defineStore('navigation', () => {
  const title = ref<string>('Flock')
  const leftButton = ref<string>(LeftButton.Menu)

  function setTitle (newTitle: string): void {
    title.value = newTitle
  }

  function setButton (newValue: LeftButton): void {
    leftButton.value = newValue
  }

  return {
    title: readonly(title),
    leftButton: readonly(leftButton),
    setTitle,
    setButton
  }
}
)
