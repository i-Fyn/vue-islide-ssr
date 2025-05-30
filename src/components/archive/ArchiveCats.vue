<template>
    <div class="archive-row bg-base-100 card">
        <div :class="config.islide_tax_group_cat['post_type']" id="post-list">
            <div>
                <!-- 渲染 postList 内容-->
                <div class="article-sort-title font-bold text-3xl p-4">{{ getCatName }}<sup  class="ml-1 text-base font-bold opacity-40 -top-4 relative">{{ postCount }}</sup></div>
                <postArticle :postList="postList" :module="config.islide_tax_group_cat" />
                <div class="empty" v-if="isDataEmpty">
                    <van-empty image-size="10rem" description="暂无内容" />
                </div>
            </div>
        </div>
        <div class="pagenavn json-nav">
            <PageNav ref="jsonPageNav" :paged="paged" :pages="pages" navtype="json"
                :type="config.islide_tax_group_cat['tax_pagination_type']" :api="api" :param="param" @change="change">
            </PageNav>
        </div>
    </div>
</template>

<script setup>
import PageNav from '@/components/footer/PageNav.vue';
import { ref, onMounted, computed, defineAsyncComponent, onServerPrefetch } from 'vue';
import { useStore } from '@/store/index';
import { useRouter, useRoute } from 'vue-router';
import { useSeoMeta } from '@unhead/vue';
import postArticle from '../home/post/postArticle.vue';

const store = useStore();
const config = computed(() => {
    return store.config;
});
const date = ref({
    year: '',
    month: '',
    day: ''
})


const emit = defineEmits(['changeFilter']);
const route = useRoute();
const jsonPageNav = ref(null);

const meta_key = computed(() => {
    const filters = config.value.tax_fliter_group[0]?.filter_open == '1' ? config.value.tax_fliter_group[0]?.fliter_group || [] : [];
    const meta_filter = filters.find(filter => filter.type === 'metas');
    return meta_filter ? meta_filter.meta_key : '';
});
const currentQuery = ref({});

// 分页数据
const api = ref('posts');

const param = ref({
    post_order: config.value.islide_tax_group_cat.post_order,
    size: config.value.islide_tax_group_cat.post_count,
    metas: {
        "meta_key": meta_key.value,
        "meta_value": currentQuery.value[meta_key.value] || ''
    },
    date: date.value
});

// 仅当cat_id不为0时添加到param中
if (Number(route.params.cat_id) !== 0) {
    param.value.cat_id = Number(route.params.cat_id);
}

const paged = ref(1);
const pages = ref(1);
const postList = ref([]);
const loading = ref(true);
const isDataEmpty = ref(false);
const postCount = ref(0);
const module = ref(config.value.islide_tax_group_cat);


const seo = computed(() => {
    const catId = Number(route.params.cat_id);
    if (catId === 0) {
        return {
            name: '全部文章',
            seo: {
                title: '全部文章列表',
                description: '浏览全站所有文章',
                image: ''
            }
        };
    }
    return config.value.tax.cats.find(cat => cat.id === catId) || {
        name: '未知分类',
        seo: {
            title: '未知分类',
            description: '未知分类',
            image: ''
        }
    };
})

const getCatName = computed(() => {
    const catId = Number(route.params.cat_id);
    if (catId === 0 || !catId) {
        return '全部文章';
    }
    return config.value.tax.cats.find(cat => cat.id === catId)?.name || '未知分类';
})



const change = (recievedData) => {
    console.log(recievedData)
    if (config.value.islide_tax_group_cat['tax_pagination_type'] === 'page') {
        postList.value.splice(0, postList.value.length, ...recievedData.data)
    } else {
        postList.value.push(...recievedData.data)
    }
    paged.value = recievedData.paged;
    pages.value = recievedData.pages;
    postCount.value = recievedData.count;
    isDataEmpty.value = postList.value.length === 0;
    console.log(postList.value)
    loading.value = false;
}




const reset = () => {
    module.value['setYear'] = true;
    currentQuery.value = { ...route.query };
    if (route.query['tag_id']) {
        param.value.tag_id = Number(route.query['tag_id']);
    }
    
    // 修改cat_id参数处理
    const catId = Number(route.params.cat_id);
    if (catId === 0) {
        // 如果cat_id为0，则不传递cat_id参数，显示所有分类
        delete param.value.cat_id;
    } else {
        param.value.cat_id = catId;
    }
    
    if (route.query['year']) {
        param.value.date['year'] = Number(route.query['year']);
    }
    if (route.query['month']) {
        param.value.date['month'] = Number(route.query['month']);
    }
    if (route.query['day']) {
        param.value.date['day'] = Number(route.query['day']);
    }
    if (meta_key.value == '' || !currentQuery.value[meta_key.value]) {
        delete param.value.metas;
    } else {
        param.value.metas = {
            "meta_key": meta_key.value,
            "meta_value": currentQuery.value[meta_key.value]
        }
    }
    store.center_title = seo.value.seo.title;
    console.log(param.value)
}


onServerPrefetch(async () => {
    if (!postList.value.length) {
        try {
            reset();
            loading.value = true;
            isDataEmpty.value = false;
            const res = await store.getList(param.value);
            if (res) change(res);
        } catch (e) {
            isDataEmpty.value = true;
        } finally {
            loading.value = false;
        }
    }
})


onMounted(async () => {
    if (!postList.value.length) {
        try {
            reset();
            loading.value = true;
            isDataEmpty.value = false;
            const res = await store.getList(param.value);
            if (res) change(res);
        } catch (e) {
            isDataEmpty.value = true;
        } finally {
            loading.value = false;
        }
    }
});


useSeoMeta({
    title: seo.value.seo.title || '文章列表',
    description: seo.value.seo.description || '文章列表',
    ogDescription: seo.value.seo.description || '文章列表',
    ogTitle: seo.value.seo.title || '文章列表',
    ogImage: seo.value.seo.image || '',
    ogUrl: import.meta.env.VITE_BASE_URL + route.fullPath,
})


</script>
