<template>
    <article class=" bg-base-100 card card-border border-base-300 overflow-hidden post-list-item group"
        :class="'item-' + item['type']" :id="'item-' + item['id']">
        <div class="flex items-center gap-3 mb-1 p-4 pb-0">
            <van-image :src="item.author.avatar"
                class="w-5 h-5  object-cover border border-base-200 card overflow-hidden" />
            <span class="text-sm font-medium text-base-content/80 truncate ">{{ item.author.name }}</span>
        </div>
        <div class="item-in  flex h-full p-4 pt-1 relative gap-8 justify-between">
            <!-- 内容区域 -->
            <div class="post-info flex flex-col flex-1  w-0">
                <!-- 文章标题 -->
                <h2
                    class="font-medium mb-1.5 line-clamp-1 leading-normal text-base-content group-hover:text-primary-content">
                    <a @click.prevent="saveArticle(item)" :href="'/' + item['type'] + '/' + item['id']" :title="item['title']"
                        target="_self" class="hover:text-blue-600">
                        {{ item['title'] }}
                    </a>
                </h2>
                <!-- 文章摘要 -->
                <div class="hidden md:block mb-2" v-if="module.post_meta && module.post_meta.includes('desc')">
                    <p class="post-excerpt text-sm text-base-content/60 line-clamp-1 leading-normal mb-auto relative">
                        {{ item['excerpt'] }}
                    </p>
                </div>

                <div
                    class="post-info-bottom flex flex-wrap text-sm justify-start items-center mt-auto text-base-content/60 gap-2">
                    <div class="buttom-left">
                        <!-- 文章类型 -->
                        <span class="post-cats flex flex-wrap gap-2"
                            v-if="module.post_meta && module.post_meta.includes('cats')">
                            <a v-for="(cat, index) in item['cats'].slice(0, 1)"
                                @click.prevent="go('/category/' + cat['term_id'])" :key="index"
                                class="post-cat-item text-base-content/60 hover:text-gray-700 truncate max-w-[80px]"
                                :href="'/category/' + cat['term_id']" :title="cat['name']" target="_self">
                                {{ cat['name'] }}
                            </a>
                        </span>
                    </div>
                    <div class="buttom-right flex items-center gap-2.5 flex-wrap">
                        <!-- 文章分类 -->
                        <span v-if="module.post_meta && module.post_meta.includes('cat')"
                            class="post-date flex items-center whitespace-nowrap">
                            <i class="ri-time-line mr-1"></i>{{ item['date'] }}
                        </span>
                        <!-- 文章阅读数 -->
                        <span v-if="module.post_meta && module.post_meta.includes('views')"
                            class="post-views flex items-center whitespace-nowrap">
                            <i class="ri-eye-line mr-1"></i>{{ handleNumber(item['meta']['views']) }}
                        </span>
                        <!-- 文章点赞数 -->
                        <span v-if="module.post_meta && module.post_meta.includes('like')"
                            class="post-like flex items-center whitespace-nowrap">
                            <i class="ri-thumb-up-line mr-1"></i>{{ handleNumber(item['meta']['like']['count']) }}
                        </span>
                        <!-- 文章评论数 -->
                        <span v-if="module.post_meta && module.post_meta.includes('comment')"
                            class="comment flex items-center whitespace-nowrap">
                            <i class="ri-message-3-line mr-1"></i>{{ handleNumber(item['meta']['comment']) }}
                        </span>
                    </div>
                </div>
            </div>
            <!-- 缩略图区域 -->
            <div class="post-module-thumb w-1/4 flex-shrink-0">
                <div class="post-thumbnail relative h-0 overflow-hidden card" :style="thumbStyle">
                    <a @click.prevent="saveArticle(item)" class="thumb-link absolute inset-0"
                        :href="'/' + item['type'] + '/' + item['id']" :title="item['title']" target="_self">
                        <van-image lazy-load :src="item['thumb']['default']"
                            class="post-thumb w-full h-full object-cover" :alt="item['title']" />
                    </a>
                </div>
            </div>
        </div>
    </article>
</template>

<script setup>

import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { computed } from 'vue';
import { handleNumber } from '@/dist/theme';


const store = useStore();
const router = useRouter();
const props = defineProps({
    item: {
        type: Object,
        required: true
    },
    module: {
        type: Object,
        required: true
    }
})

const saveArticle = (article) => {
    store.article[article.id] = article;
    router.push(`/${article.type}/${article.id}`); // 手动导航
};




const go = (path) => {
    router.push(path);
}


const marginTop = computed(() => {
    //格式：1/0.5
    var ratio = props.module.post_thumb_ratio;
    var arr = ratio.split('/');
    return (arr[1] / arr[0]).toFixed(6);
});

const thumbStyle = computed(() => {
    var thumb = props.item.thumb['full'];
    var waterfall_top = thumb[2] ? (thumb[2] / thumb[1]).toFixed(6) : 1;
    var ratio = props.module.waterfall_show == '1' ? waterfall_top : marginTop.value;
    var ratio = ratio > 2 ? 2 : ratio;
    return {
        'height': '100%',
        'padding-top': ratio * 100 + '%',
    }
});


</script>