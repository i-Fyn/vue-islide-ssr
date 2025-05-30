<template>
  <transition
    enter-active-class="animate__animated animate__fadeInRight animate__faster"
    leave-active-class="animate__animated animate__fadeOutRight animate__faster"
  >
    <div 
      v-show="isVisible" 
      class="scroll-to-top" 
      @click="animatedScrollToTop"
      role="button"
      aria-label="回到顶部"
      ref="scrollBtn"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path fill="none" d="M0 0h24v24H0z"/>
        <path d="M12 10.828l-4.95 4.95-1.414-1.414L12 8l6.364 6.364-1.414 1.414z"/>
      </svg>
      <span class="tooltip">返回顶部</span>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useScrollToTop } from '@/dist/scrollUtils';
import gsap from 'gsap';

const scrollBtn = ref(null);

const props = defineProps({
  visibleOffset: {
    type: Number,
    default: 300
  },
  scrollDuration: {
    type: Number,
    default: 1.2
  },
  right: {
    type: Number,
    default: 30
  },
  bottom: {
    type: Number,
    default: 100
  },
  zIndex: {
    type: Number,
    default: 1000
  }
});

const { isVisible } = useScrollToTop(props.visibleOffset);

// 使用GSAP平滑滚动到顶部
const animatedScrollToTop = () => {
  // 点击效果动画
  gsap.to(scrollBtn.value, {
    scale: 0.9,
    duration: 0.2,
    ease: 'power2.in',
    onComplete: () => {
      gsap.to(scrollBtn.value, {
        scale: 1,
        duration: 0.3,
        ease: 'elastic.out(1, 0.3)'
      });
    }
  });

  // 滚动到顶部
  gsap.to(window, {
    scrollTo: {
      y: 0,
      autoKill: false
    },
    duration: props.scrollDuration,
    ease: 'power3.inOut'
  });
};

// 添加悬停动画
onMounted(() => {
  if (typeof window !== 'undefined' && scrollBtn.value) {
    // 初始化按钮
    gsap.set(scrollBtn.value, { rotation: 0 });
    
    // 创建悬停动画
    const animateOnHover = () => {
      gsap.to(scrollBtn.value, {
        y: -5,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      // 箭头动画
      const arrowEl = scrollBtn.value.querySelector('svg');
      gsap.to(arrowEl, {
        y: -3,
        duration: 0.4,
        ease: 'power2.out',
        repeat: 1,
        yoyo: true
      });
    };
    
    const resetHoverAnimation = () => {
      gsap.to(scrollBtn.value, {
        y: 0,
        duration: 0.3,
        ease: 'power2.in'
      });
    };
    
    // 添加事件监听
    scrollBtn.value.addEventListener('mouseenter', animateOnHover);
    scrollBtn.value.addEventListener('mouseleave', resetHoverAnimation);
  }
});
</script>

<style scoped>
.scroll-to-top {
  position: fixed;
  right: v-bind('`${props.right}px`');
  bottom: v-bind('`${props.bottom}px`');
  z-index: v-bind('props.zIndex');
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: var(--color-primary, #3490dc);
  color: white;
  border-radius: 50%;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  will-change: transform;
}

.scroll-to-top svg {
  fill: currentColor;
  transition: transform 0.3s ease;
}

/* 添加发光阴影效果 */
.scroll-to-top::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.scroll-to-top:hover::before {
  opacity: 1;
}

/* 提示文字 */
.tooltip {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  white-space: nowrap;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
}

.scroll-to-top:hover .tooltip {
  opacity: 1;
}

/* Animate.css 需要的类 */
.animate__animated {
  animation-duration: 0.5s;
}

.animate__faster {
  animation-duration: 0.3s;
}
</style> 