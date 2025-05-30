<template>
    <BaseSkeleton animation="wave">
        <div class="relative flex flex-row gap-4 p-4">
            <!-- 左侧缩略图 -->
            <div class="skeleton-thumb relative flex-none w-1/3 h-0" 
                style="padding-top: 25%;"></div>
            
            <!-- 右侧内容 -->
            <div class="flex flex-col justify-between flex-1">
                <div>
                    <!-- 分类标签 -->
                    <div class="flex flex-wrap gap-2 mb-2">
                        <div class="skeleton h-5 w-16 rounded-full"></div>
                        <div class="skeleton h-5 w-20 rounded-full"></div>
                    </div>
                    
                    <!-- 标题 -->
                    <div class="skeleton h-6 w-full rounded mb-2"></div>
                    
                    <!-- 摘要 -->
                    <div class="skeleton h-4 w-full rounded mb-1.5"></div>
                    <div class="skeleton h-4 w-3/4 rounded mb-4"></div>
                </div>
                
                <!-- 底部元信息 -->
                <div class="flex items-center justify-between pt-2 border-t border-base-300">
                    <div class="skeleton h-4 w-20 rounded"></div>
                    <div class="flex gap-3">
                        <div class="skeleton h-4 w-8 rounded"></div>
                        <div class="skeleton h-4 w-8 rounded"></div>
                        <div class="skeleton h-4 w-8 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    </BaseSkeleton>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
const BaseSkeleton = defineAsyncComponent(() => import('./BaseSkeleton.vue'));
</script> 