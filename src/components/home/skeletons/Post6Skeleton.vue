<template>
    <BaseSkeleton animation="wave">
        <div class="relative">
            <!-- 封面图片 -->
            <div class="skeleton-thumb relative w-full h-0" :style="{ 'padding-top': '75%' }"></div>
            
            <!-- 封面徽章/标签 -->
            <div class="absolute top-3 left-3 flex gap-2">
                <div class="skeleton h-6 w-16 rounded-full"></div>
                <div class="skeleton h-6 w-16 rounded-full"></div>
            </div>
        </div>
        
        <div class="p-4">
            <!-- 标题 -->
            <div class="skeleton h-6 w-full rounded mb-3"></div>
            
            <!-- 摘要/描述 -->
            <div class="skeleton h-4 w-full rounded mb-1.5"></div>
            <div class="skeleton h-4 w-3/4 rounded mb-3"></div>
            
            <!-- 底部信息区 -->
            <div class="flex items-center justify-between">
                <!-- 作者信息 -->
                <div class="flex items-center gap-2">
                    <div class="skeleton h-8 w-8 rounded-full"></div>
                    <div class="skeleton h-4 w-20 rounded"></div>
                </div>
                
                <!-- 元数据 -->
                <div class="flex gap-3">
                    <div class="skeleton h-4 w-8 rounded"></div>
                    <div class="skeleton h-4 w-8 rounded"></div>
                    <div class="skeleton h-4 w-8 rounded"></div>
                </div>
            </div>
        </div>
    </BaseSkeleton>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
const BaseSkeleton = defineAsyncComponent(() => import('./BaseSkeleton.vue'));
</script> 