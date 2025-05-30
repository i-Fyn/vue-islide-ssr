<template>
    <transition-group name="post-lists" tag="div" class="posts-lists" :style="gridStyle()"
    @before-enter="beforeEnter" @enter="enter" appear>
    <article v-for="(v, k) in postList" class="post-list-item" :class="'item-' + v['type']" :id="'item-' + v['id']" :key="k" :data-index="k">
        <div class="item-in">
            <div class="post-module-thumb">
                <div class="post-thumbnail " :style="thumbStyle">
                    <a :href="getArticleUrl(v)" @click.prevent="saveArticle(v)" class="thumb-link" target="_self" :title="v['title']" >
                        <van-image lazy-load :src="v['thumb']['default']"  class="post-thumb w-h" :alt="v['title']"  />
                    </a>
                </div>
            </div>
            <a :href="getArticleUrl(v)" @click.prevent="saveArticle(v)" class="post-info" :title="v['title']" target="_self" >
                <h2 class="text-ellipsis">{{ v['title'] }}</h2>
            </a>
            <div v-if="module.post_meta && module.post_meta.includes('cats')" class="post-module-badges">
                <a v-for="(cat, index) in v['cats'].slice(0, 1)" :key="index" class="badge-item no-hover"
                :href="/category/+ cat['term_id']" 
                target="_self"
                @click.prevent="go('/category/' + cat['term_id'])"
                :title="cat['name']"
                >
                    {{ cat['name']}}
                </a>
            </div>
        </div>
    </article>
    </transition-group>

</template>

<script setup>

import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import {   computed,ref } from 'vue';


const store = useStore();
const router = useRouter();
const props = defineProps({
    module: {
        type: Object,
        required: true
    },
    postList: {
        type: Array,
        required: true
    }
})


const saveArticle = (article) => {
    store.article[article.id] = article;
    router.push(`/moment/${article.id}`); // 手动导航
};


const getArticleUrl = (article) => {
return  '/moment/' + article.id;
}



const gridStyle = () => {
    if (props.module.waterfall_show !== '1') {
        return {
            'grid-template-columns': `repeat(${props.module.post_row_count}, minmax(0, 1fr))`,
            'display': 'grid',
            'gap': 'var(--gap)',
        }
    }
};

const beforeEnter = (el) => {
    el.style.opacity = 0
}

const enter = (el, done) => {
    const delay = el.dataset.index * 50
    setTimeout(() => {
        el.style.transition = 'all 0.6s ease-out'
        el.style.opacity = 1
        done()
    }, delay)
}
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
    var thumb = props.postList[0].thumb['full'];
    var waterfall_top = thumb[2] ? (thumb[2] / thumb[1]).toFixed(6) : 1;
    var ratio = props.module.waterfall_show == '1' ? waterfall_top : marginTop.value;
    var ratio = ratio > 2 ? 2 : ratio;
    return {
        'height': '100%',
        'padding-top': ratio * 100 + '%',
    }
});


</script>



