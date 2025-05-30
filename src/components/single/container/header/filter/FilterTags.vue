<template>
    <li>
        <div class="filter-name">{{ fliter_group.title.trim()==''?'分类':fliter_group.title.trim() }}</div>
        <div class="filter-items">
            <a :class="{ 'current': currentTags === 0 }" target="_self" :href="getFullUrl('tag_id',0)" title="全部"  @click.prevent="go('tag_id',0)" >全部</a>
            <a v-for="item in tags" :class="{ 'current': item.id === currentTags }" 
               :href="getFullUrl('tag_id',item.id)"
               @click.prevent="router.push(getFullUrl('tag_id',item.id))"
               target="_self"
               :title="item.name">
                {{ item.name }}
            </a>
        </div>
    </li>
</template>


<script setup>
import {ref,onMounted,watchEffect,computed} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import { useStore } from '@/store'
const store = useStore()

const config = computed(() =>store.config)
const router = useRouter()
const route = useRoute()
const tags = ref([]); //['1','2']
const props = defineProps({
    fliter_group:{
        type:Object,
        default:()=>({})
    }
})
const currentTags = ref(0)

// ✅ 监听路由变化，更新 currentTags 的值
watchEffect(() => {
    let newQuery = { ...route.query };
    if (newQuery.tag_id) {
        currentTags.value = Number(newQuery.tag_id);
    }else{
        currentTags.value = 0;
    }
});

// ✅ 获取所有分类标签
const allTags = ref(config.value.tax.tags)

onMounted(() => {
    // ✅ 获取所有分类标签
    tags.value = allTags.value.filter(({ id }) => props.fliter_group.tags.includes(String(id)));

    let newQuery = { ...route.query };
    if (newQuery.tag_id) {
        currentTags.value = Number(newQuery.tag_id);
    }

});


const go = (key,value)=> {
    if(currentTags.value === value) return;
    router.push(getFullUrl(key,value));
}


const getFullUrl = (key,value) => {
    let newQuery = { ...route.query };
    if (value === ''||value === 0 ) {
        delete newQuery[key];
    } else {
        newQuery[key] = value;
    }
    return '/category/'+route.params.cat_id + '?' + Object.entries(newQuery).map(([k, v]) => `${k}=${v}`).join('&');
}

</script>