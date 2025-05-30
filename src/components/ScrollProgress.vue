<template>
  <div class="scroll-progress-container" :style="containerStyle">
    <div class="scroll-progress-bar" :style="progressStyle"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useScrollProgress } from '@/dist/scrollUtils';

const props = defineProps({
  position: {
    type: String,
    default: 'top', // 'top', 'bottom', 'left', 'right'
    validator: (value) => ['top', 'bottom', 'left', 'right'].includes(value)
  },
  height: {
    type: Number,
    default: 4
  },
  color: {
    type: String,
    default: 'var(--color-primary, #3490dc)'
  },
  backgroundColor: {
    type: String,
    default: 'transparent'
  },
  zIndex: {
    type: Number,
    default: 1000
  }
});

const { scrollProgress } = useScrollProgress();

// 容器样式
const containerStyle = computed(() => {
  const baseStyle = {
    zIndex: props.zIndex,
    backgroundColor: props.backgroundColor
  };
  
  // 根据位置设置不同的样式
  if (props.position === 'top' || props.position === 'bottom') {
    return {
      ...baseStyle,
      height: `${props.height}px`,
      top: props.position === 'top' ? '0' : 'auto',
      bottom: props.position === 'bottom' ? '0' : 'auto',
      left: '0',
      right: '0'
    };
  } else {
    return {
      ...baseStyle,
      width: `${props.height}px`,
      left: props.position === 'left' ? '0' : 'auto',
      right: props.position === 'right' ? '0' : 'auto',
      top: '0',
      bottom: '0'
    };
  }
});

// 进度条样式
const progressStyle = computed(() => {
  const style = {
    backgroundColor: props.color
  };
  
  // 根据位置设置不同的进度条样式
  if (props.position === 'top' || props.position === 'bottom') {
    style.width = `${scrollProgress.value}%`;
    style.height = '100%';
  } else {
    style.height = `${scrollProgress.value}%`;
    style.width = '100%';
    // 从底部开始增长
    if (props.position === 'left' || props.position === 'right') {
      style.position = 'absolute';
      style.bottom = '0';
    }
  }
  
  return style;
});
</script>

<style scoped>
.scroll-progress-container {
  position: fixed;
  pointer-events: none;
  overflow: hidden;
}

.scroll-progress-bar {
  transition: width 0.1s ease, height 0.1s ease;
}
</style> 