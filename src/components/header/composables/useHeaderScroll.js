// useHeaderScroll.js
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { getRootColor, updateThemeColor, updateRootColor } from '@/dist/theme'
import { useIsMobile } from '@/dist/mobile'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store'
import { useOptimizedScroll } from '@/dist/scrollUtils'

export function useHeaderScroll(isPageFn, headerFixed, showCenterMenu) {
  const lastScrollY = ref(0)
  const { isMobile } = useIsMobile();
  const lastThemeColor = ref(null)
  const route = useRoute();
  const router = useRouter();
  const store = useStore();

  const titleAction = (y) => {
    if (Math.abs(y - lastScrollY.value) < 20) {
      return; // 小于20px的滚动不处理，减少不必要的更新
    }
    
    // 根据滚动方向更新UI状态
    headerFixed.value = y > 0
    showCenterMenu.value = y < lastScrollY.value
    lastScrollY.value = y
  }

  // 使用优化的滚动函数，基于requestAnimationFrame
  useOptimizedScroll((scrollY) => {
    titleAction(scrollY);
    
    // 主题颜色根据滚动位置更新
    if (!isMobile.value) return;
    
    // 主题颜色更新的逻辑暂时注释，如果需要可以取消注释
    // const themeColor = scrollY > 0 
    //   ? getRootColor('--bg-main-color')
    //   : isPageFn('post') && route.params.postId && store.article[route.params.postId]?.thumb?.color
    //     ? store.article[route.params.postId].thumb.color
    //     : getRootColor('--bg-main-color');
    
    // if (lastThemeColor.value !== themeColor) {
    //   updateThemeColor(themeColor);
    //   lastThemeColor.value = themeColor;
    // }
  });
  
  return {
    lastScrollY
  }
}

// 以下为原throttle函数，保留但不再使用
function throttle(func, limit, leading = true, trailing = true) {
  let inThrottle, lastCall, timer
  return function (...args) {
    const now = Date.now()
    if (!inThrottle) {
      if (leading) func.apply(this, args)
      inThrottle = true
      lastCall = now
    } else if (trailing) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        func.apply(this, args)
        lastCall = Date.now()
        inThrottle = false
      }, limit - (now - lastCall))
    }
  }
}
