// useScrollFixed.js
import { ref, computed, onMounted, onBeforeUnmount, reactive } from 'vue'
import { debounce } from '@/dist/theme'
import { useOptimizedScroll } from '@/dist/scrollUtils'

export function useScrollFixed() {
  const headerState = reactive({
    drawerShow: false,
    startScrollTop: 0,
    headerClass: "",
    footerClass: "",
    activeIndex: 0,
    scrollTop: 0,
  });

  // 使用优化的滚动事件监听，基于requestAnimationFrame
  useOptimizedScroll((scrollTop) => {
    headerState.scrollTop = scrollTop;

    // 当滚动距离很小时，总是显示header
    if (scrollTop <= 50) {
      headerState.headerClass = "fixed-header";
      headerState.footerClass = "fixed-footer";
      headerState.startScrollTop = scrollTop;
      return;
    }

    // 根据滚动方向决定header的显示/隐藏
    if (headerState.startScrollTop > scrollTop) {
      // 向上滚动，显示header
      headerState.headerClass = "fixed-header";
      headerState.footerClass = "fixed-footer";
    } else if (headerState.startScrollTop <= scrollTop) {
      // 向下滚动，隐藏header
      headerState.headerClass = "hide-header";
      headerState.footerClass = "hide-footer";
    }

    // 更新起始滚动位置，用于下次比较
    headerState.startScrollTop = scrollTop;
  });

  return {
    headerState
  }
}
