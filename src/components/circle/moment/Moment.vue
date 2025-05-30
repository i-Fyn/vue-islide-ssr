<template>
    <div class="single-page"  v-if="postDetail">
        <div class=" wrapper flex gap-4">
            <div class="content-area">
                <article class="moment-article mb-2 lg:mb-4 lg:p-4 bg-base-100 card">
                    <div>
                        <MomentContent :item="postDetail" v-if="postDetail.type == 'card'" />
                        <MomentAskVote :item="postDetail" v-else />
                    </div>
                    <MomentFooter class="p-4 lg:p-0" :item="postDetail" />
                </article>
                <Comment 
                    :postDetail="postDetail" 
                    v-if="postDetail.type !== 'question'" 
                />
                <MomentQuestion 
                    v-if="postDetail.type == 'question'" 
                    :postDetail="postDetail" 
                />
            </div>
            <SecondarySingle 
                class="w-72 lg:w-80 shrink-0"
                :enabled="config.circle_layout.sidebar_select.enabled" 
                v-if="!isMobile" 
                v-show="Object.keys(config.circle_layout.sidebar_select.enabled).length > 0"
            >
                <widgetCircle class="bg-base-100 rounded-lg border border-base-200" />
            </SecondarySingle>
        </div>
    </div>
    <div v-if="!loaded" class="lg:hidden z-10000 fixed inset-0 h-full w-full bg-base-100 ">
        <MomentSkeleton />
    </div>
</template>

<script setup>
import Comment from '@/components/single/container/comment/Comment.vue';
import SecondarySingle from '@/components/secondary/SecondarySingle.vue';
import { useStore } from '@/store';
import MomentContent from './MomentContent.vue';
import { ref, onMounted, computed, onServerPrefetch } from 'vue';
import { useSeoMeta, useHead } from '@unhead/vue';
import { useRoute } from 'vue-router';
import MomentFooter from './MomentFooter.vue';
import widgetCircle from '@/components/widget/widgetCircle.vue';
import { useIsMobile } from '@/dist/mobile';
import MomentSkeleton from './MomentSkeleton.vue';
import MomentQuestion from './MomentQuestion.vue';
import MomentAskVote from './MomentAskVote.vue';
const { isMobile } = useIsMobile();

const route = useRoute();
const store = useStore();

const config = computed(() => {
    return store.config;
});
const props = defineProps({
    postId: {
        type: [Number, String],
        required: true
    }
});
const postDetail = ref(null);
const loaded = ref(false);


const fetchMomentData = async () => {
    try {
        let res = await store.fetchMoment(props.postId);
        postDetail.value = res;
        if(isMobile.value){
            setTimeout(() => {
                loaded.value = true;
            }, 1000)
        }else{
            loaded.value = true;    
        }
    } catch (e) { }

};

useSeoMeta({
    title: computed(() => postDetail.value?.seo?.title),
    ogType: 'article',
    ogDescription: computed(() => postDetail.value?.seo?.description),
    ogTitle: computed(() => postDetail.value?.seo?.title),
    ogSiteName: computed(() => config.value.blog_name),
    ogImage: computed(() => postDetail.value?.seo?.image),
    articleModifiedTime: computed(() => postDetail.value?.seo?.updated_time),
    articlePublishedTime: computed(() => postDetail.value?.seo?.published_time),
    articleAuthor: computed(() => postDetail.value?.seo?.author),
    articleSection: computed(() => postDetail.value?.seo?.category),
    articleTag: computed(() => postDetail.value?.seo?.tag),
    ogUrl: computed(() => route.fullPath),
    twitterCard: "summary_large_image",
    twitterTitle: computed(() => postDetail.value?.seo?.title),
    twitterDescription: computed(() => postDetail.value?.seo?.description),
    twitterImage: computed(() => postDetail.value?.seo?.image),
})


onMounted(async () => {
    await fetchMomentData();
});

onServerPrefetch(async () => {
    await fetchMomentData();
})


</script>

