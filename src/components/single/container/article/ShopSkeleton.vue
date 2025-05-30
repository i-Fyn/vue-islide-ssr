<template>
    <div class="single-shop wrapper bg-base-100">
        <div class="content-area p-4">
            <!-- 标签页骨架 -->
            <div class="tabs tabs-border h-20">
                <div class="flex gap-4">
                    <div class="skeleton h-8 w-24"></div>
                    <div class="skeleton h-8 w-24"></div>
                    <div class="skeleton h-8 w-24"></div>
                </div>
            </div>

            <!-- 内容区域骨架 -->
            <div class="tabs-content mt-4">
                <div class="mg-t">
                    <!-- 商品介绍骨架 -->
                    <article class="min-h-[50vh]">
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

                    <!-- 商品参数骨架 -->
                    <article class="min-h-[50vh] mt-8">
                        <div class="skeleton h-8 w-32 mb-6"></div>
                        <div class="space-y-6">
                            <div class="pdsection-panel flex flex-row mt-6 pt-6 border-t border-base-200">
                                <div class="pdsection-sidepanel flex-1 max-w-37">
                                    <div class="skeleton h-6 w-24 mb-3"></div>
                                </div>
                                <div class="pdsection-mainpanel flex-3">
                                    <div class="space-y-2.5">
                                        <div class="skeleton h-4 w-32"></div>
                                        <div class="skeleton h-4 w-40"></div>
                                        <div class="skeleton h-4 w-36"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="pdsection-panel flex flex-row mt-6 pt-6 border-t border-base-200">
                                <div class="pdsection-sidepanel flex-1 max-w-37">
                                    <div class="skeleton h-6 w-24 mb-3"></div>
                                </div>
                                <div class="pdsection-mainpanel flex-3">
                                    <div class="space-y-2.5">
                                        <div class="skeleton h-4 w-32"></div>
                                        <div class="skeleton h-4 w-40"></div>
                                        <div class="skeleton h-4 w-36"></div>
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
        </div>
    </div>
</template>

<script setup>
// 骨架屏组件不需要任何逻辑
</script> 