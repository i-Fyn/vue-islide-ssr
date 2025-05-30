<template>
    <div class="post-ai bg-base-100 p-4 card card-border border-base-300 mb-4" v-if="postDetail.summary" >
        <div class="ai-title flex items-center py-3 justify-between">
            <a class="ai-title-left flex items-center gap-1"  title="查看详情">
            <i class="ri-robot-line"></i>
                <div class="ai-title-text font-bold mr-2">文章摘要</div>
                <div class="ai-link ml-0.5 h-5 flex">
                    <i class="ri-arrow-right-s-line text-xl opacity-40 content-center"></i>
                </div>
            </a>
            <div class="ai-tag text-sm justify-center items-center flex py-1.5 px-2 ml-auto font-bold bg-primary text-white rounded-xl" id="ai-tag">DeepSeek</div>
        </div>
        <div class="ai-explanation mt-3 py-2 px-3 bg-base-200 flex text-left"  >
            {{ postDetail.summary }}
        </div>
        <div class="ai-suggestions flex flex-wrap "></div>
        <div class="ai-bottom w-full mt-3 flex text-sm text-secondaary-content whitespace-nowrap">
            <div class="ai-tips ml-2">此内容根据文章生成，并经过人工审核，仅用于文章内容的解释与总结</div>
            <a class="ai-report text-sm ml-auto"
                @click="report" rel="external nofollow" title="投诉" target="_blank">投诉</a>
        </div>
    </div>
</template>

<script setup>
import { createVanModal } from '@/dist/createVanModal'


const props = defineProps({
    postDetail: {
        type: Object,
        required: true
    },
});



const report = async() => {
    const singleReport = (await import('@/components/single/container/article/ArticleReport.vue')).default;
    createVanModal(singleReport,{
        size:356,
        props:{
            id:props.postDetail.id
        }
    })
}

</script>
