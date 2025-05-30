<template>
    <article class="overflow-hidden post-list-item" :id="'item-' + item['id']">
        <div class="item-in relative group">
            <div class="post-module-thumb" v-if="item.attachment?.image?.length">
                <div class="post-thumbnail relative h-0 card card-border border-base-300" :style="thumbStyle(item.attachment?.image[0]?.full)">
                    <a :href="getArticleUrl(item)" @click.prevent="saveArticle(item)" class="thumb-link absolute inset-0" target="_self"
                        :title="item['title']">
                        <van-image lazy-load :src="item['attachment']['image'][0]['thumb']" class="post-thumb w-full h-full object-cover"
                            :alt="item['title']"   />
                    </a>
                </div>
            </div>
            <div class="post-module-thumb" v-else-if="item.attachment?.video?.length">
                <div class="post-thumbnail relative h-0 overflow-hidden card card-border border-base-300" :style="thumbStyle(item.attachment?.video[0]?.full)">
                    <a :href="getArticleUrl(item)" @click.prevent="saveArticle(item)" class="thumb-link absolute inset-0" target="_self"
                        :title="item['title']">
                        <van-image lazy-load :src="item['attachment']['video'][0]['poster']" class="post-thumb w-full h-full object-cover"
                            :alt="item['title']" />
                        <div class="play-icon absolute top-1.5 right-2.5 w-5 h-5 text-white text-xl flex items-center justify-center bg-black/25 backdrop-blur-md rounded-full">
                            <i title="ri-play-circle-line" class="ri-play-circle-line"></i>
                        </div>
                    </a>
                </div>
            </div>
            <a :href="getArticleUrl(item)" @click.prevent="saveArticle(item)" class="post-info absolute inset-0 flex items-end flex-row bg-black/30 transition-opacity duration-300 opacity-0 card card-border border-base-300 z-10 p-4 will-change-opacity group-hover:opacity-100" :title="item['title']"
                target="_self"
                v-if="item.attachment?.image?.length || item.attachment?.video?.length"
                >
                <h2 class="m-0 text-white font-semibold flex-1 text-sm line-clamp-1">{{ item['excerpt'] }}</h2>
            </a>
        </div>
        <div class="post-bottom py-3 px-1">
            <div class="line-clamp-2 mb-2">
                <a :href="getArticleUrl(item)" @click.prevent="saveArticle(item)" class="post-title-link text-sm font-medium"
                    :title="item['title']" target="_self">{{ item['title'] }}</a>
            </div>
            <div class="post-meta flex items-center justify-between h-5 text-base-content/60 text-sm transition-colors duration-1000">
                <div class="post-meta-item-left flex gap-1.5 items-center text-sm">
                    <avatarVue :data="item.author" :icon="false" :size="20" />
                    <nameVue :data="item.author" :icon="false" />
                </div>
                <div class="post-meta-item-right">
                    <van-icon name="like-o">  </van-icon>
                    {{ handleNumber(item['meta']['like']['count']) }}
                </div>
            </div>
        </div>
    </article>
</template>

<script setup>

import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import nameVue from '../../user/nameVue.vue';
import avatarVue from '../../user/avatarVue.vue';
import { handleNumber } from '../../../dist/theme';

const store = useStore();
const router = useRouter();
const props = defineProps({
    item: {
        type: Object,
        required: true
    },
    index: {
        type: Number,
        required: true
    },
    selectTabs: {
        type: Object,
    }
})


const saveArticle = (article) => {
    store.article[article.id] = article;
    router.push(`/moment/${article.id}`); // 手动导航
};


const getArticleUrl = (article) => {
    return '/moment/' + article.id;
}


const thumbStyle = (thumb) => {
    var waterfall_top = thumb[2] ? (thumb[2] / thumb[1]).toFixed(6) : 1.2;
    var ratio = props.selectTabs['waterFall'] == '1' ? waterfall_top : 1.2;
    var ratio = ratio > 1.4 ? 1.4 : ratio;
    return {
        'padding-top': ratio * 100 + '%',
    }
}


</script>

<style lang="scss" scoped>
.user-avatar {
    --avatar-size: 20px;
}

.user-info-name {
    --name-size: 14px;
}

.post-meta i {
    margin-right: 1px;
}
</style>
