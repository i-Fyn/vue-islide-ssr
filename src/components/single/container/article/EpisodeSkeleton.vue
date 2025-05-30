<template>
    <div class="wrapper">
        <div id="primary-home" class="content-area p-4 bg-base-100">
            <!-- 文章头部骨架 -->
            <article class="single-article">
                <div class="article-content">
                    <div class="article-header">
                        <!-- 标题骨架 -->
                        <div class="skeleton h-8 w-3/4 mb-4"></div>
                        
                        <!-- 元信息骨架 -->
                        <div class="post-meta mb-4">
                            <div class="post-meta-row flex items-center gap-4">
                                <div class="left flex items-center gap-4">
                                    <div class="skeleton h-4 w-32"></div>
                                    <div class="skeleton h-4 w-24"></div>
                                </div>
                                <div class="right">
                                    <div class="skeleton h-4 w-24"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            <!-- 评论区骨架 -->
            <div class="min-h-[50vh] mt-8">
                <div class="skeleton h-8 w-24 mb-4"></div>
                <div class="space-y-4">
                    <div class="skeleton h-20 w-full"></div>
                    <div class="skeleton h-20 w-full"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// 骨架屏组件不需要任何逻辑
</script> 