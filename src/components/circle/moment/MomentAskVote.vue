<template>
    <div class="moment-content-wrap flex flex-col lg:flex-row gap-4 relative">
        <div class="moment-article-wrapper p-4 lg:p-0 w-full  overflow-hidden">
            <div class="moment-article-container overflow-hidden">
                <div class="article-title mb-4">
                    <h1 class="text-xl font-bold">Q:  {{ item.title }}</h1>
                </div>
                <MomentHeader :postDetail="item" />
                <Articles :postDetail="item" />
                <ArticleHide v-if="item['content']['content_hide']" :roles="item['content']['content_hide']" />
                <div class="moment-topic-container" v-if="item['topics'].length" style="margin-top: 20px;">
                    <div class="moment-topic-title text-primary" style="display: flex; gap: 10px;">
                        <a v-for="topic in item['topics']" :href="'/topic/' + topic['id']"
                            class="btn btn-primary btn-soft btn-sm"
                            @click.prevent="router.push('/topic/' + topic['id'])">
                            {{ topic['name'] }}
                        </a>
                    </div>
                </div>
            </div>
            <MomentVote :item="item.vote" v-if="item.vote" />
        </div>
    </div>
</template>


<script setup>
import ArticleHide from '@/components/single/container/article/ArticleHide.vue'
import MomentHeader from '@/components/single/container/header/MomentHeader.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import MomentVote from './MomentVote.vue';
import Articles from '../../single/container/article/Articles.vue';


const router = useRouter();
const headerPlaceholder = ref(null);

const props = defineProps({
    item: {
        type: Object,
    }
})

</script>