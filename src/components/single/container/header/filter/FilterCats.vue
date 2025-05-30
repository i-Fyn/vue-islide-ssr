<template>
    <li>
        <div class="filter-name">{{ fliter_group.title?.trim() === '' ? '分类' : fliter_group.title?.trim() }}</div>
        <div class="filter-items">
            <a v-for="item in cats" 
               :class="{ 'current': item.id === currentCats }" 
               :href="getArchiveLink(item.taxonomy, item.id)"
               target="_self"
               @click.prevent="router.push(getArchiveLink(item.taxonomy, item.id))"
               :title="item.name">
                {{ item.name }}
            </a>
        </div>
    </li>
</template>

<script setup>
import { ref,  watch, onMounted,computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '@/store'


const store = useStore()
const config = computed(() =>store.config)

const props = defineProps({
    fliter_group: {
        type: Object,
        default: () => ({})
    },
    current_id: {
        type: Number,
        required: true
    },
    current_tax: {
        type: String,
        required: true
    }
})
const cats = ref([])
const allCats = ref(config.value.tax.cats)
const currentCats = ref(props.current_id)
const currentTax = ref(props.current_tax)
const router = useRouter()
const route = useRoute()


function getArchiveLink(taxonomy, id) {
    return router.resolve({
        path: `/category/${id}`,
        query: route.query
    }).href
}


// 监听路由变化，确保 `currentCats` 和 `currentTax` 正确更新
watch(() => route.params, (newParams) => {
    currentCats.value = parseInt(newParams.tax_id) || props.current_id
    currentTax.value = newParams.tax || props.current_tax
})

onMounted(() => {
    cats.value = allCats.value.filter(({ id }) => props.fliter_group.cats.includes(String(id)));
})


</script>