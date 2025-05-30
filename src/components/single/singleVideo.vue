<template>
    <div class="single-video wrapper">
        <div class="content-area p-4 bg-base-100 card">
            <div id="tabs" class="tabs">
                <div class="tabs tabs-border h-20 items-center">
                    <a v-for="(tab, index) in tabs" :key="index" :class="[
                        'tab tab-bordered transition-all duration-300',
                        activeTab === index
                            ? 'tab-active border-primary text-primary font-medium'
                            : 'hover:border-primary/50 hover:text-primary/70'
                    ]" @click="changeTab(index)">
                        {{ tab }}
                    </a>
                </div>
            </div>
            <div class="tabs-content">
                    <div>
                        <article v-lazy-container="{ selector: 'img' }"
                            class="single-article  box min-h-[50vh] transition-all duration-300"
                            :class="activeTab === 0 ? 'opacity-100 visible block' : 'opacity-0 invisible hidden'">
                            <div class="article-content" v-html="postDetail.content">
                            </div>
                        </article>

                        <article class=" min-h-[50vh] transition-all duration-300" ref="videoChapters"
                            :class="activeTab === 1 ? 'opacity-100 visible block' : 'opacity-0 invisible hidden'">
                            <div id="video-chapters" ref="videoChapters">
                                <div class="chapter box mg-b" v-for="(item, i) in videoList">
                                    <h3 v-text="item.chapter_title" v-if="item.chapter_title"></h3>
                                    <div class="chapter-desc" v-text="item.chapter_desc" v-if="item.chapter_desc"></div>
                                    <ul class="video-list">
                                        <li v-for="(video, index) in item.video_list" class="mb-2.5 cursor-pointer">
                                            <a @click="go(video.id)" class="">
                                                <i class="ri-play-circle-fill"></i>
                                                {{ i + 1 }}-{{ index + 1 }} {{ video.title }}
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </article>
                        <Comment :postDetail="postDetail" class="min-h-[50vh] transition-all duration-300"
                            :class="activeTab === 2 ? 'opacity-100 visible block' : 'opacity-0 invisible hidden'" />
                    </div>
                </div>
        </div>
    </div>
</template>

<script setup>
import Comment from './container/comment/Comment.vue';
import { ref, onMounted, onServerPrefetch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';


const props = defineProps({
    postDetail: {
        type: Object,
        required: true,
    },
    videoList: {
        type: Array,
        required: true,
    },
});

const tabs = ref(['视频介绍', '视频目录', '视频讨论']); // 标签页名称
const activeTab = ref(0); // 当前激活的标签索引
const router = useRouter();

const go = (id) => {
    router.push('/episode/' + id);
};



// 切换标签页
const changeTab = (index) => {
    activeTab.value = index;
};


</script>
