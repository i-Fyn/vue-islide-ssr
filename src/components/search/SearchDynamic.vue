<template>
    <div id="dynamic-page" class="dynamic-page w-h" ref="dynamicPage" v-cloak>
        <div class="circle-moment-list"  >
            <CircleArticle  :momentLists="momentLists" :selectTabs >
                <template #pagination>
                    <PageNav ref="jsonPageNav" :paged="paged" :pages="pages" navtype="json" type="" :api="api" :param="param"
                        @change="listChange">
                    </PageNav>
                </template>
            </CircleArticle>
        </div>
        <template v-if="!momentLists.length && isDataEmpty">
            <div class="empty ">
                <van-empty image-size="10rem" description="暂无内容" />
            </div>
        </template>
    </div>
</template>


<script setup>

import { onMounted, ref,onServerPrefetch } from 'vue'
import { useRoute } from 'vue-router';
import PageNav from '@/components/footer/PageNav.vue'
import CircleArticle from '@/components/circle/CircleArticle.vue';
import { useHead } from '@unhead/vue';

import { useStore } from '@/store';

const store = useStore();
const route = useRoute();
const loading = ref(false);
const isDataEmpty = ref(false);
const momentLists = ref([]);
const paged = ref(1);
const pages = ref(1);
const locked = ref(false);
const api = ref('getMomentList');
const param = ref({
    size: 5,
    search: route.query.s || '',
})
const jsonPageNav = ref(null);
const dynamicPage = ref(null);
const selectTabs = {
    list_grid_column: 6,
    type: 'card',
    style: 'grid',
}

const listChange = (data) => {
    isDataEmpty.value = data.data.length == 0;
    pages.value = data.pages;
    paged.value = data.paged;
    if (data.paged && paged.value == 1) {
        momentLists.value = data.data;
    }
    if (data.paged && paged.value > 1) {
        momentLists.value = momentLists.value.concat(data.data);
    }
    locked.value = false;
    loading.value = false;

}

const fetchData = async () => {
    try {
        loading.value = true
        let res = await store.fetchApiPostData(api.value,Object.assign(param.value, { paged: paged.value }))
        listChange(res)
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