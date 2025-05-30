<template>
    <div class="islide-tax-header">
                    <div class="tax-fliter mg-b  box" v-if="filter.filter_open=='1' && filter.fliter_group " >
                        <div class="filters-box">
                            <ul>
                                <component    v-for="filter in filter.fliter_group" :is="getFilterComponent(filter.type)" :current_id="taxDetail.term.term_id" :current_tax="taxDetail.term.taxonomy"  :fliter_group="filter" :key="taxDetail.id"></component>
                            </ul>
                            
                        </div>
                    </div>
            </div>
</template>

<script setup>
import {ref,defineAsyncComponent,onMounted,computed,onServerPrefetch} from 'vue'
import { useStore } from '@/store'
const filter = ref({})
const store = useStore()
const props = defineProps({
    taxDetail: {
        type: Object,
        required: true
    }
})

const config = computed(() => store.config);

const getFilterComponent = (type) => {
    switch (type) {
        case 'cats':
            return defineAsyncComponent(() => import('./filter/FilterCats.vue'))
        case 'tags':
            return defineAsyncComponent(() => import('./filter/FilterTags.vue'))
        case 'metas':
            return defineAsyncComponent(() => import('./filter/FilterMetas.vue'))
        case 'orderbys':
            return defineAsyncComponent(() => import('./filter/FilterOrderbys.vue'))
        default:
            return defineAsyncComponent(() => import('./filter/FilterCats.vue'))
    }
}

onMounted(() => {
    if(props.taxDetail.type=='category'){
    filter.value = config.value.tax_fliter_group[0] || {}
    }
})

onServerPrefetch(() => {
    if(props.taxDetail.type=='category'){
    filter.value = config.value.tax_fliter_group[0] || {}
    }

})

</script>
