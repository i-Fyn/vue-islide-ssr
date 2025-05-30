<template>
    <BaseSkeleton animation="wave">
        <div class="relative">
            <div class="skeleton-thumb relative w-full h-0" :style="{ 'padding-top': thumbRatio }"></div>
        </div>
        <div class="p-4">
            <div class="flex flex-wrap gap-2 mb-2">
                <div class="skeleton h-5 w-16 rounded-full"></div>
                <div class="skeleton h-5 w-20 rounded-full"></div>
            </div>
            <div class="skeleton h-5 w-full rounded mb-2"></div>
            <div class="skeleton h-4 w-3/4 rounded mb-4"></div>
            <div class="flex items-center justify-between pt-2 border-t border-base-300">
                <div class="skeleton h-4 w-20 rounded"></div>
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
import { defineProps, defineAsyncComponent } from 'vue';
const BaseSkeleton = defineAsyncComponent(() => import('./BaseSkeleton.vue'));

const props = defineProps({
    thumbRatio: {
        type: String,
        default: '61.8%'  // 默认黄金比例
    }
});
</script> 