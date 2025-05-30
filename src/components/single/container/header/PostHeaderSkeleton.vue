<template>
    <header class="post-header post-bg relative w-full flex justify-center bg-center bg-cover bg-no-repeat overflow-hidden h-[30rem] bg-base-300 z-0">
        <div class="post-cover-wrapper fixed lg:relative w-full lg:w-7/10 h-full m-0 lg:m-[0_-20%_0_auto] overflow-hidden blur-none z-0 ">
            <div class="skeleton w-full h-7/10 lg:h-full min-w-[50vw] min-h-60 lg:min-h-[20rem] rounded-none"></div>
        </div>
        <div class="post-info  wrapper absolute bottom-0 lg:top-0 w-full mb-0 lg:m-[20px_auto_40px] z-10 flex flex-col items-center lg:items-start h-fit lg:h-full justify-normal lg:justify-center gap-4">
            <!-- 分类和标签骨架 -->
            <div class="post-first-info w-full justify-center lg:justify-start flex whitespace-nowrap my-0 mx-auto">
                <div class="meta-firstline flex items-center h-8 mx-2 py-2 mb-1.5 gap-2">
                    <div class="skeleton h-8 w-20 rounded-3xl"></div>
                </div>
            </div>
            
            <!-- 标题骨架 -->
            <div class="skeleton h-8 w-1/2"></div>
            
            <!-- 元信息骨架 -->
            <div class="post-meta mt-1.5 flex mb-8">
                <div class="meta-secondline text-center flex flex-wrap mb-10 justify-center items-center gap-3">
                    <div class="skeleton h-4 w-24"></div>
                    <div class="skeleton h-4 w-24"></div>
                    <div class="skeleton h-4 w-24"></div>
                    <div class="skeleton h-4 w-24"></div>
                </div>
            </div>
        </div>
        <div class="post-radius-bottom absolute bottom-0 left-0 right-0 transform h-8 w-full bg-base-200 rounded-t-xl z-10"></div>
    </header>
</template>

<script setup>
// 骨架屏组件不需要任何逻辑
</script> 