<template>
    <BaseSkeleton animation="wave" class="relative">
        <!-- 缩略图区域 -->
        <div class="relative group">
            <div class="post-module-thumb">
                <div class="skeleton-thumb relative w-full h-0" :style="{ 'padding-top': thumbRatio || '130%' }"></div>
            </div>
            
            <!-- 悬停信息区域骨架 -->
            <div class="absolute inset-0 flex items-end p-4">
                <div class="skeleton h-5 w-full rounded"></div>
            </div>
            
            <!-- 分类标签骨架 -->
            <div class="absolute left-0 top-0 flex flex-wrap translate-x-3 translate-y-3">
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
        default: '130%'  // post_3默认缩略图比例
    }
});
</script>

<style scoped>
.skeleton-thumb {
    border-radius: 8px;
}
</style> 