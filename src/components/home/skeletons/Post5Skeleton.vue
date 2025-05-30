<template>
    <BaseSkeleton animation="wave">
        <div class="relative">
            <!-- 产品图片 -->
            <div class="skeleton-thumb relative w-full h-0" :style="{ 'padding-top': '100%' }"></div>
            
            <!-- 价格标签 -->
            <div class="absolute top-3 right-3">
                <div class="skeleton h-6 w-16 rounded"></div>
            </div>
        </div>
        
        <div class="p-3">
            <!-- 产品标题 -->
            <div class="skeleton h-5 w-full rounded mb-2"></div>
            
            <!-- 产品描述 -->
            <div class="skeleton h-4 w-3/4 rounded mb-3"></div>
            
            <!-- 底部信息 -->
            <div class="flex items-center justify-between">
                <!-- 销量信息 -->
                <div class="skeleton h-4 w-20 rounded"></div>
                
                <!-- 购买按钮 -->
                <div class="skeleton h-8 w-8 rounded-full"></div>
            </div>
        </div>
    </BaseSkeleton>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
const BaseSkeleton = defineAsyncComponent(() => import('./BaseSkeleton.vue'));
</script>

<style scoped>
.skeleton-thumb {
    border-radius: 8px 8px 0 0;
}
</style> 