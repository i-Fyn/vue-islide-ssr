<template>
    <li>
        <div class="filter-name">{{ fliter_group.title.trim() == '' ? '分类' : fliter_group.title.trim() }}</div>
        <div class="filter-items">
            <a :class="{ 'current': current_meta_value == '' }" :href="getFullUrl(fliter_group.meta_key,'')" target="_self" title="全部" @click.prevent="go(fliter_group.meta_key,'')">全部</a>
            <a v-for="item in fliter_group.metas" :class="{ 'current': item.meta_value == current_meta_value }"
                :title="item.meta_name" 
                :href="getFullUrl(fliter_group.meta_key,item.meta_value)"
                @click.prevent="router.push(getFullUrl(fliter_group.meta_key,item.meta_value))"
                target="_self"
                >
                {{ item.meta_name }}
            </a>
        </div>
    </li>
</template>

<script setup>
import { ref, onMounted,watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const props = defineProps({
    fliter_group: {
        type: Object,
        default: () => ({})
    }
})
const current_meta_value = ref('');



onMounted(() => {
    const k = props.fliter_group.meta_key;
    const v = route.query[k];
    if (v) {
        current_meta_value.value = v;
    }else {
        current_meta_value.value = '';
    }
})

watch(() => route.query[props.fliter_group.meta_key], (newVal) => {
    if (newVal) {
        current_meta_value.value = newVal;
    }else{
        current_meta_value.value = '';
    }
    
});




const go = (key,value)=> {
    if(current_meta_value.value === value) return;
    router.push(getFullUrl(key,value));
}

const getFullUrl = (key,value) => {
    let newQuery = { ...route.query };
    if (value === '') {
        delete newQuery[key];
    } else {
        newQuery[key] = value;
    }
    return '/category/'+route.params.cat_id + '?' + Object.entries(newQuery).map(([k, v]) => `${k}=${v}`).join('&');
}

</script>

