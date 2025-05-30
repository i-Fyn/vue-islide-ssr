// stores/theme.js
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: 'white-theme', // 默认主题
  }),
  actions: {
    setTheme(value) {
      this.theme = value
    }
  },
  persist: true
})


