<template>
    <div class="single-post relative z-2  bg-base-200">
        <div class="wrapper flex flex-col lg:flex-row">
            <div class="content-area overflow-hidden   lg:card min-w-0 flex-1 flex flex-col space-y-4">
                <ArticleSummary :postDetail="postDetail" />
                <article class="single-article card bg-base-100 lg:card-border border-base-300">
                    <Articles :postDetail="postDetail" />
                </article>
                <ArticleDownload :postDetail="postDetail" />
                <ArticleAuthor :post_id="postDetail.id" />
                <Comment :postDetail="postDetail" />
            </div>
            <div class="secondary-container lg:block hidden lg:w-[300px] min-w-[300px] ml-4" v-if="!isMobile">
                <SecondarySingle :postDetail="postDetail"
                    :enabled="config.single_sidebar_select.enabled" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { useStore } from '@/store'
import { useIsMobile } from '@/dist/mobile'
import { useArticleSections } from './composables/useArticleSections'
import ArticleSummary from '@/components/single/container/article/ArticleSummary.vue'
import Articles from '@/components/single/container/article/Articles.vue'
import ArticleAuthor from '@/components/single/container/article/ArticleAuthor.vue'
import Comment from '@/components/single/container/comment/Comment.vue'

const { isMobile } = useIsMobile()

const props = defineProps({
    postDetail: {
        type: Object,
        required: true
    }
})

const store = useStore()
const config = store.config

const { ArticleDownload, SecondarySingle } = useArticleSections(props.postDetail, config)


</script>
