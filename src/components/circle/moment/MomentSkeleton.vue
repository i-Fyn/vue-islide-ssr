<template>
    <div class="moment-skeleton h-full pt-18 lg:pt-0">
        <div class="wrapper flex gap-4">
            <div class="content-area lg:p-4 bg-base-100 card w-full">
                <article class="single-article mb-4">
                    <!-- 顶部大图骨架 -->
                    <div class="article-content">
                        <div class="mb-6">
                            <div class="skeleton w-full aspect-square md:aspect-[2/1] rounded-none"></div>
                        </div>
                        <div class="p-4">
                        <!-- 标题骨架 -->
                        <div class="skeleton h-7 w-1/3 mb-4"></div>
                        <!-- 正文骨架 -->
                        <div class="skeleton h-5 w-2/3 mb-2"></div>
                        <div class="skeleton h-5 w-1/2 mb-4"></div>
                        <!-- 标签骨架 -->
                        <div class="skeleton h-4 w-20 mb-4"></div>
                        <!-- 分组骨架 -->
                        <div class="flex items-center gap-2 mb-4">
                            <div class="skeleton h-7 w-24 rounded-full"></div>
                        </div>
                        <!-- 时间地点骨架 -->
                        <div class="flex justify-between items-center mb-2">
                            <div class="skeleton h-4 w-16"></div>
                            <div class="skeleton h-4 w-32"></div>
                        </div>
                    </div>
                    </div>
                </article>
                <!-- 评论区入口骨架 -->
                <div class="flex items-center gap-2 mb-4">
                    <div class="skeleton h-5 w-24"></div>
                    <div class="skeleton h-5 w-20"></div>
                </div>
                <!-- 评论骨架 -->
                <div class="space-y-4 pb-4">
                    <div class="flex gap-3">
                        <div class="skeleton h-10 w-10 rounded-full"></div>
                        <div class="flex-1">
                            <div class="skeleton h-5 w-32 mb-2"></div>
                            <div class="skeleton h-4 w-full"></div>
                        </div>
                    </div>
                    <div class="flex gap-3">
                        <div class="skeleton h-10 w-10 rounded-full"></div>
                        <div class="flex-1">
                            <div class="skeleton h-5 w-32 mb-2"></div>
                            <div class="skeleton h-4 w-full"></div>
                        </div>
                    </div>
                </div>
                <div class="space-y-4 pb-4">
                    <div class="flex gap-3">
                        <div class="skeleton h-10 w-10 rounded-full"></div>
                        <div class="flex-1">
                            <div class="skeleton h-5 w-32 mb-2"></div>
                            <div class="skeleton h-4 w-full"></div>
                        </div>
                    </div>
                    <div class="flex gap-3">
                        <div class="skeleton h-10 w-10 rounded-full"></div>
                        <div class="flex-1">
                            <div class="skeleton h-5 w-32 mb-2"></div>
                            <div class="skeleton h-4 w-full"></div>
                        </div>
                    </div>
                </div>
                
            </div>

        </div>
    </div>
</template>

<script setup>
import { useIsMobile } from '@/dist/mobile';
import SecondarySingle from '@/components/secondary/SecondarySingle.vue';

const { isMobile } = useIsMobile();
</script> 