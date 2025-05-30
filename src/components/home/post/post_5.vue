<template>
    <article class="card  overflow-hidden  post-list-item relative transition-transform duration-300 ease-in-out hover:-translate-y-1 rounded-lg group" :class="'item-' + item['type']" :id="'item-' + item['id']">
        <div class="item-in bg-base-100 relative" v-cloak>
            <div class="post-module-thumb">
                <div class="post-thumbnail relative h-0 overflow-hidden rounded-t-lg" :style="thumbStyle()">
                    <a :title="item['title']" :href="getArticleUrl(item)" target="_self"
                        @click.prevent="saveArticle(item)" class="thumb-link absolute inset-0">
                        <van-image lazy-load :src="item['thumb']['default']" class="post-thumb w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 rounded-t-lg"
                            :alt="item['title']" />
                    </a>
                </div>
            </div>

            <div class="product-info flex flex-col gap-2 p-3 px-1.5 text-sm">
                <h3 class="product-title text-sm leading-[1.4] m-0 line-clamp-2">
                    <router-link :to="`/shop/${item.id}`" class="text-base-content group-hover:text-primary-content transition-colors duration-300">{{ item['title'] }}</router-link>
                </h3>
                <div class="product-tags inline-block overflow-hidden text-ellipsis whitespace-nowrap w-full h-[18px] my-0.5"></div>
                <div class="product-price flex items-center gap-2 mt-auto" v-if="item.shop.type === 'single'">
                    <span class="font-bold text-base-content flex items-center gap-0.5"
                        :class="{ 'text-orange-400': item.shop.price !== item.shop.oldPrice }">
                        <i class="ri-coin-line text-base"></i>{{ item.shop.price }}
                    </span>
                    <span class="old-price text-sm text-base-content/60 line-through flex items-center gap-0.5" v-if="item.shop.oldPrice !== item.shop.price">
                        <i class="ri-coin-line text-sm"></i>{{ item.shop.oldPrice }}
                    </span>
                </div>
                <div class="product-price flex items-center gap-2 mt-auto" v-else>
                    <span v-if="item.shop.priceRange[0] !== item.shop.priceRange[1]" class=" font-bold text-base-content flex items-center gap-0.5">
                        <i class="ri-coin-line text-base"></i>{{ item.shop.priceRange[0] + '-' + item.shop.priceRange[1] }}
                    </span>
                    <span v-else class=" font-bold text-base-content flex items-center gap-0.5">
                        <i class="ri-coin-line text-base"></i>{{ item.shop.priceRange[0] }}
                    </span>
                </div>
            </div>

            <div class="hover-border absolute -inset-1 border-2 border-transparent rounded-lg transition-colors duration-300 ease-in-out pointer-events-none group-hover:border-blue-600"></div>
        </div>
    </article>
</template>

<script setup>

import { useRouter } from 'vue-router';
import { useStore } from '@/store/index';
import { computed } from 'vue';

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
    return 'shop/' + article.id;
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
    var ratio = ratio > 2 ? 2 : ratio;

    return {
        'height': '100%',
        'padding-top': ratio * 100 + '%',
    }
}


</script>
