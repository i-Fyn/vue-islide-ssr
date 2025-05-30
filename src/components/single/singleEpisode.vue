<template>
    <div class=" wrapper mg-t" v-if="postDetail">
        <div id="primary-home" class="content-area">
            <article class="single-article bg-base-100 p-4 card mb-4">
                <div class="article-content">
                    <div class="article-header">
                        <h1>{{ postDetail.title }}</h1> 
                        <div class="post-meta mb-4">
                            <div class="post-meta-row">
                                <div class="left"><span class="post_date"><i
                                            class="ri-time-line"></i><time itemprop="datePublished"
                                            class="islide-timeago">{{ postDetail.date }}</time></span> <span
                                        class="post_views"><i class="ri-eye-line"></i>{{ postDetail.meta.views
                                        }}</span></div>
                                <div class="right">
                                    <ul class="post-categories"></ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
            <Comment :postDetail="postDetail" :key="postDetail.id" class="card bg-base-100 p-4" />
        </div>
    </div>
</template>

<script setup>
import Comment from './container/comment/Comment.vue';
import { useStore } from '@/store';
import { useRoute } from 'vue-router';
import { computed, onServerPrefetch } from 'vue';
import { useIsMobile } from '@/dist/mobile'
const { isMobile } = useIsMobile()

const route = useRoute();
const store = useStore()


const config = computed(() => {
    return store.config;
})

const props = defineProps({
    postDetail: {
        type: Object,
        required: true
    }
})

onServerPrefetch(async () => {
    try {
    await store.fetchVideoList(props.postDetail.id);
    } catch (error) {
    }
})




</script>

