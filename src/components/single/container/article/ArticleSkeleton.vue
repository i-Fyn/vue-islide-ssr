<template>
    <div class="wrapper gap-4 flex relative z-1">
        <div class="content-area bg-base-100 p-4 lg:card">
            <!-- 文章摘要骨架 -->
            <div class="card bg-base-100 lg:card-border border-base-300 mb-4 p-4">
                <div class="skeleton h-4 w-3/4 mb-4"></div>
                <div class="skeleton h-4 w-full mb-2"></div>
                <div class="skeleton h-4 w-full mb-2"></div>
                <div class="skeleton h-4 w-2/3"></div>
            </div>

            <!-- 文章内容骨架 -->
            <article class="single-article card bg-base-100 lg:card-border border-base-300 mb-4 p-4">
                <div class="space-y-4">
                    <div class="skeleton h-4 w-full"></div>
                    <div class="skeleton h-4 w-full"></div>
                    <div class="skeleton h-4 w-5/6"></div>
                    <div class="skeleton h-4 w-full"></div>
                    <div class="skeleton h-4 w-4/5"></div>
                    <div class="skeleton h-4 w-full"></div>
                    <div class="skeleton h-4 w-3/4"></div>
                </div>
            </article>

            <!-- 作者信息骨架 -->
            <div class="card bg-base-100 lg:card-border border-base-300 mb-4 p-4">
                <div class="flex items-center gap-4">
                    <div class="skeleton h-12 w-12 rounded-full"></div>
                    <div class="flex-1">
                        <div class="skeleton h-4 w-32 mb-2"></div>
                        <div class="skeleton h-4 w-48"></div>
                    </div>
                </div>
            </div>

            <!-- 评论区骨架 -->
            <div class="card bg-base-100 lg:card-border border-base-300 mb-4 p-4">
                <div class="skeleton h-8 w-24 mb-4"></div>
                <div class="space-y-4">
                    <div class="skeleton h-20 w-full"></div>
                    <div class="skeleton h-20 w-full"></div>
                </div>
            </div>
        </div>

        <!-- 侧边栏骨架 -->
        <div class="hidden lg:block w-80">
            <div class="card bg-base-100 lg:card-border border-base-300 p-4">
                <div class="skeleton h-4 w-24 mb-4"></div>
                <div class="space-y-3">
                    <div class="skeleton h-4 w-full"></div>
                    <div class="skeleton h-4 w-5/6"></div>
                    <div class="skeleton h-4 w-4/5"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// 骨架屏组件不需要任何逻辑
</script> 