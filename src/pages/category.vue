<template>
    <div class="single-page">
    <div v-if="loaded && taxDetail" class=" wrapper flex gap-4">
        <div  class="content-area">
            <TaxHeader v-if="loaded && taxDetail" :taxDetail="taxDetail" />
            <CatBody v-if="loaded && taxDetail" class="p-4" />
        </div>
        <Secondary :enabled="config.islide_tax_group_cat.sidebar_select.enabled" v-if="!isMobile" />
    </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, onServerPrefetch } from 'vue'
import { useStore } from '@/store';
import { useRoute } from 'vue-router';
import TaxHeader from '@/components/single/container/header/TaxHeader.vue';
import Secondary from '@/components/secondary/SecondarySingle.vue';
import CatBody from '@/components/archive/ArchiveCats.vue';
import { useIsMobile } from '../dist/mobile';
const props = defineProps({
    cat_id: {
        type: Number,
        default: 0
    },
})

const route = useRoute();
const store = useStore();
const taxDetail = ref(null);
const loaded = ref(false);
const { isMobile } = useIsMobile();


const config = computed(() => {
    return store.config;
});

const getTaxDetail = async (id) => {
    try {
        if (id === 0 || !id) {
            // cat_id为0时创建一个默认的分类信息
            taxDetail.value = {
                name: '全部文章',
                desc: '浏览全站所有文章',
                count: 0,
                cover: '',
                type: 'category',
                seo: {
                    title: '全部文章列表',
                    description: '浏览全站所有文章',
                    image: ''
                }
            };
            loaded.value = true;
        } else {
            let res = await store.fetchTaxonomy(id);
            taxDetail.value = res;
            taxDetail.value['type'] = 'category';
            loaded.value = true;
        }
    } catch (error) {
        console.error('Failed to get taxonomy details:', error);
        loaded.value = true;
    }
}


onMounted(async () => {
    await getTaxDetail(props.cat_id);
});


onServerPrefetch(async () => {
    await getTaxDetail(props.cat_id);
})


watch(() => route.params.cat_id, async (newVal, oldVal) => {
    if (newVal !== oldVal) {
        loaded.value = false;
        await getTaxDetail(newVal);
    }
})




</script>