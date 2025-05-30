<template>
    <div class="single-video wrapper">
        <div class="content-area p-4 bg-base-100 card">
            <!-- 标签页骨架 -->
            <div class="tabs tabs-border h-16 items-center">
                <div class="flex gap-6">
                    <div class="skeleton h-7 w-20 rounded-md"></div>
                    <div class="skeleton h-7 w-20 rounded-md"></div>
                    <div class="skeleton h-7 w-20 rounded-md"></div>
                </div>
            </div>

            <!-- 内容区域骨架 -->
            <div class="tabs-content mt-6">
                <div class="mg-t">
                    <!-- 视频介绍骨架 -->
                    <article class="single-article box min-h-[50vh]">
                        <div class="space-y-3">
                            <div class="skeleton h-4 w-full rounded-md"></div>
                            <div class="skeleton h-4 w-full rounded-md"></div>
                            <div class="skeleton h-4 w-5/6 rounded-md"></div>
                            <div class="skeleton h-4 w-full rounded-md"></div>
                            <div class="skeleton h-4 w-4/5 rounded-md"></div>
                            
                            <div class="mt-6 mb-2">
                                <div class="skeleton h-40 w-2/3 rounded-md mx-auto"></div>
                            </div>
                            
                            <div class="skeleton h-4 w-full rounded-md"></div>
                            <div class="skeleton h-4 w-11/12 rounded-md"></div>
                            <div class="skeleton h-4 w-3/4 rounded-md"></div>
                            <div class="skeleton h-4 w-4/5 rounded-md"></div>
                        </div>
                    </article>

                    <!-- 视频目录骨架 -->
                    <article class="min-h-[50vh] mt-8">
                        <div class="chapter box mg-b p-4 card bg-base-200/50">
                            <!-- 章节标题骨架 -->
                            <div class="skeleton h-6 w-40 rounded-md mb-3"></div>
                            <!-- 章节描述骨架 -->
                            <div class="skeleton h-4 w-full rounded-md mb-4"></div>
                            <!-- 视频列表骨架 -->
                            <ul class="video-list space-y-3 pl-1">
                                <li v-for="i in 4" :key="i" class="flex items-center gap-3">
                                    <div class="skeleton h-5 w-5 rounded-full"></div>
                                    <div class="skeleton h-4 w-64 rounded-md"></div>
                                </li>
                            </ul>
                        </div>
                        
                        <div class="chapter box mg-b mt-5 p-4 card bg-base-200/50">
                            <div class="skeleton h-6 w-44 rounded-md mb-3"></div>
                            <div class="skeleton h-4 w-full rounded-md mb-4"></div>
                            <ul class="video-list space-y-3 pl-1">
                                <li v-for="i in 3" :key="i" class="flex items-center gap-3">
                                    <div class="skeleton h-5 w-5 rounded-full"></div>
                                    <div class="skeleton h-4 w-72 rounded-md"></div>
                                </li>
                            </ul>
                        </div>
                    </article>

                    <!-- 评论区骨架 -->
                    <div class="min-h-[30vh] mt-8">
                        <div class="skeleton h-7 w-24 rounded-md mb-6"></div>
                        
                        <!-- 评论输入框骨架 -->
                        <div class="skeleton h-24 w-full rounded-lg mb-6"></div>
                        
                        <!-- 评论列表骨架 -->
                        <div class="space-y-5">
                            <div v-for="i in 2" :key="i" class="card bg-base-200/50 p-4">
                                <div class="flex items-start gap-3">
                                    <div class="skeleton h-9 w-9 rounded-full"></div>
                                    <div class="flex-1">
                                        <div class="skeleton h-5 w-32 rounded-md mb-2"></div>
                                        <div class="skeleton h-4 w-full rounded-md mb-1"></div>
                                        <div class="skeleton h-4 w-11/12 rounded-md mb-1"></div>
                                        <div class="skeleton h-4 w-3/4 rounded-md"></div>
                                        <div class="flex justify-between mt-3">
                                            <div class="skeleton h-4 w-20 rounded-md"></div>
                                            <div class="flex gap-3">
                                                <div class="skeleton h-4 w-12 rounded-md"></div>
                                                <div class="skeleton h-4 w-12 rounded-md"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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