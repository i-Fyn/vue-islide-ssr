<template>
    <div id="post-list">
        <div class="hidden-line relative"  >
            <postArticle :postList="data" :module="module" >
                <template #pagination>
                    <PageNav ref="jsonPageNav" :paged="paged" :pages="pages" navtype="json" type="auto" :api="api"
                        :param="param" @change="change" />
                </template>
            </postArticle>
        </div>
        
    </div>
</template>

<script setup>

import { ref, onMounted, onServerPrefetch } from 'vue'
import PageNav from '@/components/footer/PageNav.vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'
import postArticle from '../home/post/postArticle.vue'
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
    post_row_count: 4,
    post_count: 8,
    post_thumb_ratio: '1/0.4',
    _post_type: 'post',
    post_type: 'post-1',
    waterfall_show: '0',
    post_meta: ['date', 'views', 'like', 'cats', 'edit'],
})


const param = ref({
    size: module.value.post_count,
    type: module.value._post_type,
    sort: module.value.post_order,
    author: [Number(route.params.user_id)],
});


const change = (res) => {
    data.value.push(...res.data)
    pages.value = res.pages
    isDataEmpty.value = data.value.length === 0
    loading.value = false
}


const fetchData = async () => {
    try {
        loading.value = true
        let res = await store.fetchApiPostData(api.value, Object.assign(param.value, { paged: paged.value }))
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