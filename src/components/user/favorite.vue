<template>
    <div id="favorite-page" class="favorite-page w-h" ref="favoritePage">
        <div id="tabs" class="tabs tabs-border">
            <li v-for="(value, key) in tabs" :key="key" class="tab" :class="{ 'tab-active': key === activeTab }"
                @click="changeTab(key)">{{ value }}
            </li>
        </div>
        <div class="tabs-content">
            <div class="post-list mt-8">
                <postArticle v-if="activeTab === 'post' || activeTab === 'episode' || activeTab === 'shop'"
                    :postList="data" :module="module" >
                    <template #pagination>
                        <PageNav ref="jsonPageNav_post" :paged="paged" :pages="pages" navtype="json" type="auto" :api="api"
                            :param="param" @change="change" />
                    </template>
                </postArticle>
                <CircleArticle v-if="activeTab === 'circle'" :momentLists="data" :selectTabs="selectTabs" >
                    <template #pagination>
                        <PageNav ref="jsonPageNav_circle" :paged="paged" :pages="pages" navtype="json" type="auto" :api="api"
                            :param="param" @change="change" />
                    </template>
                </CircleArticle>
                <template v-if="!data.length && isDataEmpty">
                    <div class="empty ">
                        <van-empty image-size="10rem" description="暂无内容" />
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted, onServerPrefetch, computed, nextTick } from 'vue'
import PageNav from '@/components/footer/PageNav.vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'
import postArticle from '../home/post/postArticle.vue'
import CircleArticle from '../circle/CircleArticle.vue';


const store = useStore()
const data = ref([])
const loading = ref(false)
const isDataEmpty = ref(false)
const paged = ref(1)
const pages = ref(1)
const api = ref('getUserFavoritesList')
const route = useRoute()
const jsonPageNav_post = ref(null)
const jsonPageNav_circle = ref(null)
const activeTab = ref('post')
const locked = ref(false)
const tabs = ref(
    {
        'post': '文章',
        'shop': '商品',
        'episode': '视频',
        'circle': '动态',
    }
)

const changeTab = (tab) => {
    if (locked.value) return;
    locked.value = true;
    loading.value = true;
    activeTab.value = tab
    param.value.post_type = tab;
    paged.value = 1;
    pages.value = 1;
    data.value = [];
    if (tab === 'episode') {
        module.value.post_type = 'post-3'
        module.value.post_thumb_ratio = '1/1.3';
        module.value.post_row_count = 5;
    } else if (tab === 'post') {
        module.value.post_type = 'post-1'
        module.value.post_thumb_ratio = '1/0.5'
        module.value.post_row_count = 4
    } else if (tab === 'shop') {
        module.value.post_type = 'post-5'
        module.value.post_thumb_ratio = '1/1.3'
        module.value.post_row_count = 5
    }
    nextTick(() => {
        if (activeTab.value !== 'circle') {
            jsonPageNav_post.value.load(1)
        }else{
            jsonPageNav_circle.value.load(1)
        }
    })
}


const module = ref({
    post_order: 'date',
    post_row_count: 4,
    post_count: 10,
    post_thumb_ratio: '1/0.5',
    post_type: 'post-1',
    waterfall_show: '0',
    post_meta: ['date', 'views', 'like', 'cats', 'edit'],
})

const selectTabs = {
    list_grid_column: 5,
    type: 'card',
    style: 'grid',
    waterFall:false,
}




const param = ref({
    size: module.value.post_count,
    post_type: activeTab.value,
    sort: module.value.post_order,
    user_id: route.params.user_id,
});

const change = (res) => {
    data.value.push(...res.data)
    locked.value = false
    pages.value = res.pages
    isDataEmpty.value = data.value.length === 0
    loading.value = false;
}


const fetchData = async () => {
    try {
        locked.value = true
        loading.value = true
        let res = await store.fetchApiPostData(api.value, Object.assign(param.value, { paged: paged.value }))
        change(res)
    } catch (error) {
    }
}


onMounted(async () => {
    await fetchData()
    // 确保分页组件在初次加载后可见
    setTimeout(() => {
        if (jsonPageNav_post.value) {
            jsonPageNav_post.value.$forceUpdate();
        }
    }, 500);
})

onServerPrefetch(async () => {
    await fetchData()
})


</script>