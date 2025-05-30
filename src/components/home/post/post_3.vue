<template>
    <article class="card card-border border-base-300 overflow-hidden post-list-item relative" :class="'item-' + item['type']" :id="'item-' + item['id']">
        <div class="item-in relative group">
            <div class="post-module-thumb">
                <div class="post-thumbnail  relative h-0 overflow-hidden" :style="thumbStyle()">
                    <a :href="getArticleUrl(item)" @click.prevent="saveArticle(item)" class="thumb-link absolute inset-0" target="_self"
                        :title="item['title']">
                        <van-image lazy-load :src="item['thumb']['default']" class="post-thumb w-full h-full object-cover"
                            :alt="item['title']" />
                    </a>
                </div>
            </div>
            <a :href="getArticleUrl(item)" @click.prevent="saveArticle(item)" class="post-info absolute inset-0 flex items-end bg-black/30 opacity-0 group-hover:opacity-100 z-10 transition-opacity duration-300 rounded-lg p-4" :title="item['title']"
                target="_self">
                <h2 class="post-title text-white text-sm font-semibold m-0 flex-1">{{ item['title'] }}</h2>
            </a>
            <div v-if="module.post_meta && module.post_meta.includes('cats')" class="post-module-badges absolute left-0 top-0 flex flex-wrap z-20 translate-x-3 translate-y-3">
                <a v-for="(cat, ind) in item['cats'].slice(0, 1)" :key="ind" class="badge-item no-hover inline-block text-sm mr-1 bg-black/50 text-white px-3 py-1 rounded-full"
                    :href="/category/ + cat['term_id']" target="_self"
                    @click.prevent="go('/category/' + cat['term_id'])" :title="cat['name']">
                    {{ cat['name'] }}
                </a>
            </div>
        </div>
    </article>
</template>

<script setup>

import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { computed, ref, onMounted } from 'vue';


const store = useStore();
const router = useRouter();
const props = defineProps({
    module: {
        type: Object,
        required: true
    },
    item: {
        type: Object,
        required: true
    }
})


const saveArticle = (article) => {
    store.article[article.id] = article;
    router.push(`/${article.type}/${article.id}`); // 手动导航
};


const getArticleUrl = (article) => {
    return '/' + article.type + '/' + article.id;
}


const go = (path) => {
    router.push(path);
}
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
    var ratio = ratio > 1.4 ? 1.4 : ratio;

    console.log(ratio);
    return {
        'height': '100%',
        'padding-top': ratio * 100 + '%',
    }
}


onMounted(() => {
    console.log(props.module)
})

</script>

