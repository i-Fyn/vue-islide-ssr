<template>
    <div v-if="loaded && taxDetail" class=" wrapper mg-t"
        :class="[tax, Number(taxDetail.show_sidebar) ? 'single-sidebar-show' : 'single-sidebar-hidden']">
        <div id="primary-home" class="content-area">
            <TaxHeader v-if="loaded && taxDetail" :taxDetail="taxDetail" />
            <component  :is="getTaxComp(tax)" :id="taxDetail.id" :key="route.fullPath" />
        </div>
        <Secondary :enabled="enabled" :key="taxDetail.id" />
    </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent, watch, computed,onServerPrefetch } from 'vue'
import { useStore } from '@/store';
import { useRoute } from 'vue-router';
import TaxHeader from '@/components/single/container/header/TaxHeader.vue';
import Secondary from '@/components/secondary/SecondarySingle.vue';
const props = defineProps({
    tax_id: {
        type: String,
        required: true
    },
    tax: {
        type: String,
        required: true
    }
})

const route = useRoute();
const store = useStore();
const taxDetail = ref(null);
const loaded = ref(false);
const enabled = ref({});


const config = computed(() => {
    return store.config;
});

const getTaxDetail = async (id) => {
    try {
        let res = await store.fetchTaxonomy(id);
        taxDetail.value = res;
        taxDetail.value['type'] = props.tax;
        loaded.value = true;
    } catch (error) {
        loaded.value = true;
    }
}

const getTaxComp = (tax) => {
    switch (tax) {
        case 'category':
            return defineAsyncComponent(() => import('@/components/archive/ArchiveCats.vue'));
        case 'post_tag':
            return defineAsyncComponent(() => import('@/components/archive/ArchiveTags.vue'));
    }
}

onMounted(async () => {
    if(props.tax == 'category'){
        enabled.value = config.value.islide_tax_group_cat.sidebar_select.enabled;
    }else if(props.tax == 'post_tag'){
        enabled.value = config.value.islide_tax_group_tag.sidebar_select.enabled;
    }
    await getTaxDetail(props.tax_id);
});


onServerPrefetch(async () => {
    if(props.tax == 'category'){
        enabled.value = config.value.islide_tax_group_cat.sidebar_select.enabled;
    }else if(props.tax == 'post_tag'){
        enabled.value = config.value.islide_tax_group_tag.sidebar_select.enabled;
    }
    await getTaxDetail(props.tax_id);

})





watch(() => route.params.tax_id, async (newVal, oldVal) => {
    if (newVal !== oldVal) {
        loaded.value = false;
        await getTaxDetail(newVal);
    }
},
    {
        deep: true,
    })




</script>