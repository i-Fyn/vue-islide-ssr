<template>
    <BaseSkeleton animation="wave" class="post-list-item">
        <div class="item-in">
            <!-- 缩略图区域 -->
            <div class="post-module-thumb">
                <div class="skeleton-thumb relative w-full h-0" :style="{ 'padding-top': thumbRatio || '100%' }"></div>
            </div>
            
            <!-- 标题区域骨架 -->
            <div class="p-3">
                <div class="skeleton h-5 w-full rounded mb-3"></div>
            </div>
            
            <!-- 分类标签骨架 -->
            <div class="absolute top-2 left-2">
                <div class="skeleton h-6 w-16 rounded-full"></div>
            </div>
        </div>
    </BaseSkeleton>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
const BaseSkeleton = defineAsyncComponent(() => import('./BaseSkeleton.vue'));

defineProps({
    thumbRatio: {
        type: String,
        default: '100%'
    }
});
</script>

<style scoped>
.post-list-item {
    position: relative;
}

.skeleton-thumb {
    border-radius: 8px 8px 0 0;
}
</style> 