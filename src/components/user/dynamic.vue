<template>
    <div id="dynamic-page" class="dynamic-page w-h" ref="dynamicPage" v-cloak>
        <div class="dynamic-article" >
            <CircleArticle :selectTabs="selectTabs" :momentLists="data" >
                <template #pagination>
                    <PageNav ref="jsonPageNav" :paged="paged" :pages="pages" navtype="json" type="auto" :api="api"
                        :param="param" @change="change" />
                </template>
            </CircleArticle>
        </div>
        <!-- 加载中 -->
        <template v-if="!data.length && isDataEmpty">
            <div class="empty ">
                <van-empty image-size="10rem" description="暂无内容" />
            </div>
        </template>
    </div>
</template>


<script setup>

import { onMounted, ref, onServerPrefetch } from 'vue'
import { useRoute } from 'vue-router';
import PageNav from '@/components/footer/PageNav.vue'
import { useStore } from '@/store';
import CircleArticle from '../circle/CircleArticle.vue';

const store = useStore();
const route = useRoute();
const loading = ref(false);
const isDataEmpty = ref(false);
const data = ref([]);
const paged = ref(1);
const user_id = ref(route.params.user_id);
const pages = ref(1);
const api = ref('getMomentList');
const param = ref({
    author__in: user_id.value,
    size: 10
})
const selectTabs = {
    list_grid_column: 5,
    type:'card',
    style:'grid',
    waterFall:false,
}
const jsonPageNav = ref(null);
const dynamicPage = ref(null);


const change = (res) => {
    data.value.push(...res.data);
    pages.value = res.pages;
    isDataEmpty.value = (data.value.length === 0);
    loading.value = false;
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