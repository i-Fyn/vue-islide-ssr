<template>
    <div class="video-single-top relative min-h-[20rem] md:min-h-[24rem] -mt-4">
        <!-- 背景骨架 -->
        <div class="absolute inset-0 overflow-hidden z-0">
            <div class="absolute inset-0 bg-black/20 z-10"></div>
            <div class="skeleton absolute inset-0 bg-base-300/70 blur-sm rounded-none"></div>
        </div>

        <!-- 内容骨架 -->
        <div class="wrapper h-full flex items-center">
            <div class="relative z-20 w-full pt-14">
                <div class="flex flex-row gap-2 md:gap-6 items-start">
                    <!-- 封面图骨架 -->
                    <div class="w-28 md:w-40 flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
                        <div class="skeleton aspect-[3/4] w-full animate-pulse"></div>
                    </div>

                    <!-- 信息区骨架 -->
                    <div class="flex-1 space-y-4 justify-between flex flex-col h-full">
                        <!-- 标题骨架 -->
                        <div class="skeleton h-7 w-3/4 rounded-md"></div>

                        <!-- 作者信息骨架 -->
                        <div class="flex items-center gap-2 mt-1">
                            <div class="skeleton h-6 w-6 rounded-full"></div>
                            <div class="skeleton h-4 w-20 rounded-md"></div>
                            <div class="skeleton h-4 w-4 rounded-md mx-1"></div>
                            <div class="skeleton h-4 w-28 rounded-md"></div>
                        </div>

                        <!-- 描述骨架 -->
                        <div class="space-y-1.5 mt-1">
                            <div class="skeleton h-3.5 w-full rounded-md"></div>
                            <div class="skeleton h-3.5 w-11/12 rounded-md"></div>
                            <div class="skeleton h-3.5 w-10/12 rounded-md"></div>
                        </div>

                        <!-- 按钮骨架 -->
                        <div class="right-bottom mt-4 md:mt-auto z-10">
                            <div class="action-buttons flex gap-2">
                                <div class="skeleton h-8 w-24 rounded-lg"></div>
                                <div class="skeleton h-8 w-32 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// 骨架屏组件不需要任何逻辑
</script> 