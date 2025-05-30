<template>
    <div v-if="loaded && taxDetail" class=" wrapper flex gap-4" >
        <div class="single-page flex gap-4">   
        <div  class="content-area flex-1">
            <TaxHeader v-if="loaded && taxDetail" :taxDetail="taxDetail" />
            <TagBody v-if="loaded && taxDetail" />
        </div>
            <Secondary :enabled="config.islide_tax_group_tag.sidebar_select.enabled" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed,onServerPrefetch } from 'vue'
import { useStore } from '@/store';
import { useRoute } from 'vue-router';
import TaxHeader from '@/components/single/container/header/TaxHeader.vue';
import Secondary from '@/components/secondary/SecondarySingle.vue';
import TagBody from '@/components/archive/ArchiveTags.vue';
const props = defineProps({
    tag_id: {
        type: String,
        default: '0'
    },
})

const route = useRoute();
const store = useStore();
const taxDetail = ref(null);
const loaded = ref(false);


const config = computed(() => {
    return store.config;
});

const getTaxDetail = async (id) => {
    try {
        if (id === '0' || !id) {
            taxDetail.value = {
                name: '全部标签',
                desc: '浏览全站所有标签文章',
                count: 0,
                cover: '',
                type: 'post_tag',
                seo: {
                    title: '全部标签文章',
                    description: '浏览全站所有标签文章',
                    image: ''
                }
            };
            loaded.value = true;
        } else {
            let res = await store.fetchTaxonomy(id);
            taxDetail.value = res;
            taxDetail.value['type'] = 'post_tag';
            loaded.value = true;
        }
    } catch (error) {
        console.error('Failed to get tag details:', error);
        loaded.value = true;
    }
}


onMounted(async () => {
    await getTaxDetail(props.tag_id);
});


onServerPrefetch(async () => {
    await getTaxDetail(props.tag_id);
})


watch(() => route.params.tag_id, async (newVal, oldVal) => {
    if (newVal !== oldVal) {
        loaded.value = false;
        await getTaxDetail(newVal);
    }
},
    {
        deep: true,
    })




</script>