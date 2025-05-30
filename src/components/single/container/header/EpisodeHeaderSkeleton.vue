<template>
    <div class="wrapper">
        <div id="islide-player-wrap" class="flex  flex-col lg:flex-row lg:pt-18">
            <!-- 左侧：视频播放区域骨架 -->
            <div class="flex-1">
                <div class="relative aspect-video  overflow-hidden">
                    <div class="skeleton absolute inset-0" style="border-radius: 0;"></div>
                </div>
            </div>

            <!-- 右侧：侧边栏信息骨架 -->
            <div class="lg:w-[var(--sidebar-width)] w-full flex flex-col">
                <!-- 视频信息骨架 -->
                <div class="bg-base-100 p-4">
                    <div class="flex gap-3">
                        <div class="w-20 min-w-20 aspect-4/5 overflow-hidden">
                            <div class="skeleton w-full h-full"></div>
                        </div>
                        <div class="flex-1">
                            <div class="skeleton h-5 w-3/4 mb-2"></div>
                            <div class="skeleton h-4 w-full mb-2"></div>
                            <div class="skeleton h-4 w-2/3"></div>
                        </div>
                    </div>
                </div>

                <!-- 播放列表骨架 -->
                <div class="bg-base-100 flex-1 flex flex-col overflow-hidden p-4">
                    <div class="pb-4 border-b border-base-200 flex justify-between items-center">
                        <div class="skeleton h-6 w-24"></div>
                        <div class="skeleton h-8 w-8 rounded-lg"></div>
                    </div>

                    <div class="flex-1 scroll-y mt-4">
                       
                        <!-- 视频列表骨架 -->
                        <ul class="grid grid-cols-5 gap-2 p-4">
                            <li v-for="i in 2" :key="i" class="aspect-square">
                                <div class="skeleton w-full h-full rounded-lg"></div>
                            </li>
                        </ul>        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// 骨架屏组件不需要任何逻辑
</script> 