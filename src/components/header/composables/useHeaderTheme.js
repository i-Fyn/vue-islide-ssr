// useHeaderTheme.js
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { updateThemeColor, updateRootColor, getRootColor, handleSwitchTheme } from '@/dist/theme'
import { useStore } from '@/store'

export function useHeaderTheme(headerFixed, showCenterMenu, isPageFn) {
  const route = useRoute()
  const store = useStore()

  watch(
    () => route.fullPath,
    () => {
      // const currentPath = route.path
      // if (!currentPath.includes('/post/')) {
      //   updateThemeColor(getRootColor('--bg-main-color'))
      //   updateRootColor(getRootColor('--color-primary'))
      // }
      headerFixed.value = false
      showCenterMenu.value = true
    },
    { immediate: true }
  )


  return {
    route
  }
}
