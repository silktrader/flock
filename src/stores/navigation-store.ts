import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'

export enum LeftButton {
  Menu = 'menu',
  Back = 'back',
}

export const useNavigationStore = defineStore('navigation', () => {
  const toolbar = ref<boolean>(true)
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

  function hideToolbar (): void {
    toolbar.value = false
  }

  function showToolbar (): void {
    toolbar.value = true
  }

  return {
    toolbar: readonly(toolbar),
    title: readonly(title),
    subtitle: readonly(subtitle),
    leftButton: readonly(leftButton),
    setTitle,
    setSubtitle,
    setButton,
    showToolbar,
    hideToolbar
  }
}
)
