<template>
    <div class="post-list post-3">
        <postArticle :postList="data" :module="module" >
            <template #pagination>
                <PageNav ref="jsonPageNav" :paged="paged" :pages="pages" navtype="json" type="" :api="api" :param="param"
                    @change="change">
                </PageNav>
            </template>
        </postArticle>
        <template v-if="!data.length && isDataEmpty">
            <div class="empty ">
                <van-empty image-size="10rem" description="暂无内容" />
            </div>
        </template>
    </div>
</template>

<script setup>

import { ref, onMounted, onServerPrefetch } from 'vue'
import PageNav from '@/components/footer/PageNav.vue'
import postArticle from '../home/post/postArticle.vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'

const data = ref([])
const loading = ref(false)
const isDataEmpty = ref(false)
const paged = ref(1)
const pages = ref(1)
const api = ref('posts')
const route = useRoute()
const jsonPageNav = ref(null)
const store = useStore()

const module = ref({
    post_order: 'date',
    post_row_count: 5,
    post_count: 10,
    post_thumb_ratio: '1/1.46',
    _post_type: 'video',
    post_type: 'post-3',
    waterfall_show: '0',
    post_meta: ['date', 'views', 'like', 'cats', 'edit'],
    search: route.query.s || '',
})


const param = ref({
    size: module.value.post_count,
    type: module.value._post_type,
    sort: module.value.post_order,
    search: module.value.search,
});

const change = (res) => {
    data.value = res.data
    loading.value = false
    isDataEmpty.value = data.value.length === 0
}


const fetchData = async () => {
    try {
        loading.value = true
        let res = await store.fetchApiPostData(api.value,Object.assign(param.value, { paged: paged.value }))
        change(res)
    } catch (error) {
    }
}


onMounted(async () => {
    await fetchData()
})

onServerPrefetch(async () => {
    await fetchData()
})


</script>