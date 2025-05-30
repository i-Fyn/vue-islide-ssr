<!-- 基础骨架屏组件 -->
<template>
    <div 
        class="skeleton-item card bg-base-200 shadow-sm rounded-xl overflow-hidden"
        :class="[animationClass]">
        <slot></slot>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    animation: {
        type: String,
        default: 'pulse',  // 可选值：pulse, wave, none
    }
});

const animationClass = computed(() => {
    switch (props.animation) {
        case 'pulse':
            return 'animate-pulse';
        case 'wave':
            return 'animate-wave';
        default:
            return '';
    }
});
</script>

<style scoped>
/* 骨架屏基础样式 */
.skeleton-item {
    position: relative;
    height: 100%;
    transition: all 0.3s ease;
    overflow: hidden;
}

/* 骨架块样式 */
:deep(.skeleton) {
    display: block;
    background: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.06) 25%,
        rgba(0, 0, 0, 0.1) 50%,
        rgba(0, 0, 0, 0.06) 75%
    );
    background-size: 200% 100%;
    border-radius: 4px;
}

/* 波浪动画 */
@keyframes wave {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}

.animate-wave :deep(.skeleton) {
    animation: wave 1.5s infinite;
}

/* 缩略图 */
:deep(.skeleton-thumb) {
    position: relative;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.08);
}

/* 禁用SSR中的动画，防止客户端/服务端渲染不一致 */
@media print {
    .animate-pulse, 
    .animate-wave :deep(.skeleton) {
        animation: none !important;
    }
}
</style> 