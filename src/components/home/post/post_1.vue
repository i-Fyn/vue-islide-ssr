<template>
    <div class="w-full animate-fadeIn">
        <article class="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group rounded-xl border border-base-200" :class="'item-' + item['type']" :id="'item-' + item['id']" :key="item['id']">
            <div class="relative">
                <div class="relative h-0 overflow-hidden" :style="thumbStyle()">
                    <a :title="item['title']" :href="getArticleUrl(item)" target="_self"
                        @click.prevent="saveArticle(item)" class="absolute inset-0 z-1">
                        <van-image lazy-load :src="item['thumb']['default']" 
                            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            :alt="item['title']" />
                    </a>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
            </div>
            <div class="p-4">
                <div class="flex flex-wrap gap-2 mb-2" v-if="module.post_meta && module.post_meta.includes('cats')">
                    <span class="badge badge-sm badge-warning gap-1" v-if="item['comments'] > 5">
                        <i class="ri-fire-fill"></i>多人互动
                    </span>
                    <span class="badge badge-sm badge-info gap-1" v-if="item['download'] == '1'">
                        <i class="ri-download-cloud-fill"></i>资源下载
                    </span>
                    <span class="badge badge-sm badge-error gap-1" v-if="item['content']['content_hide'].content">
                        <i class="ri-lock-2-line"></i>限制阅读
                    </span>
                    <a v-for="(cat, inde) in item['cats'].slice(0, 3)"
                        @click.prevent="go('/category/' + cat['term_id'])" :key="inde"
                        :href="'/category/' + cat['term_id']" target="_self" :title="cat['name']"
                        class="badge badge-sm badge-ghost hover:badge-primary transition-colors duration-200">
                        {{ cat['name'] }}
                    </a>
                </div>
                <h2 class="text-sm  line-clamp-1 mb-2 group-hover:text-primary transition-colors duration-200">
                    <a :title="item['title']" :href="getArticleUrl(item)" target="_self"
                        @click.prevent="saveArticle(item)">
                        {{ item['title'] }}
                    </a>
                </h2>
                <p  
                    class="text-base-content/70 text-sm break-all line-clamp-1 mb-2 text-ellipsis overflow-hidden text-xs">
                    {{ module.post_meta && module.post_meta.includes('desc') ? item['excerpt'] : '' }}
                </p>
                <div class="flex items-center justify-between text-xs text-base-content/60 pt-2 border-t border-base-200">
                    <div class="flex items-center">
                        <span class="flex items-center gap-1">
                            <i class="ri-time-line"></i>{{ item['date'] }}
                        </span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span v-if="module.post_meta && module.post_meta.includes('views')" 
                            class="flex items-center gap-1 hover:text-info transition-colors">
                            <i class="ri-eye-line"></i>{{ handleNumber(item['meta']['views']) }}
                        </span>
                        <span v-if="module.post_meta && module.post_meta.includes('like')" 
                            class="flex items-center gap-1 hover:text-primary transition-colors">
                            <i class="ri-thumb-up-line"></i>{{ handleNumber(item['meta']['like']['count']) }}
                        </span>
                        <span v-if="module.post_meta && module.post_meta.includes('comment')" 
                            class="flex items-center gap-1 hover:text-secondary transition-colors">
                            <i class="ri-message-3-line"></i>{{ handleNumber(item['meta']['comment']) }}
                        </span>
                    </div>
                </div>
            </div>
        </article>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useStore } from '@/store/index';
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
    },
});

const saveArticle = (article) => {
    store.article[article.id] = article;
    router.push(`/${article.type}/${article.id}`);
};

const getArticleUrl = (article) => {
    return '/' + article.type + '/' + article.id;
};

const go = (path) => {
    router.push(path);
};

const marginTop = computed(() => {
    //格式：1/0.5
    var ratio = props.module.post_thumb_ratio;
    //判断格式是否正确
    const [w, h] = ratio.split('/').map(Number);
    const safeRatio = h && w ? h / w : '1/0.618';
    return safeRatio;
});

const thumbStyle = () => {
    var thumb = props.item.thumb['full'];
    var waterfall_top = thumb[2] ? (thumb[2] / thumb[1]).toFixed(6) : 1;
    //瀑布流获取原图尺寸
    var ratio = props.module.waterfall_show == '1' ? waterfall_top : marginTop.value;
    var ratio = ratio > 2 ? 2 : ratio;

    return {
        'height': '100%',
        'padding-top': ratio * 100 + '%',
    };
};
</script>

<style scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fadeIn {
    animation: fadeIn 0.5s ease forwards;
}
</style>





