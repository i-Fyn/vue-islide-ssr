<template>
    <li>
        <div class="filter-name">{{ fliter_group.title.trim() === '' ? '排序' : fliter_group.title.trim() }}</div>
        <div class="filter-items">
            <a v-for="orderby in fliter_group.orderbys" 
               :class="{ 'current': orderby === currentOrderBy }"  
               :href="getFullUrl('post_order',orderby)"
               @click.prevent="router.push(getFullUrl('post_order',orderby))"
               :title="orderbysWords[orderby]" 
               target="_self"
               :key="orderby">
                {{ orderbysWords[orderby] }}
            </a>
        </div>
    </li>
</template>

<script setup name="FilterOrderBys">
import { ref,  onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
    fliter_group: {
        type: Object,
        default: () => ({})
    }
})

const router = useRouter();
const route = useRoute();

const orderbysWords = ref({
    'new': '最新',
    'random': '随机',
    'views': '浏览',
    'like': '喜欢',
    'comments': '评论',
    'modified': '更新',
})

const currentOrderBy = ref('')

onMounted(() => {
    // ✅ 从 URL 获取 `post_order`
    const postOrder = route.query.post_order;

    // ✅ 只有 `fliter_group.orderbys` 存在时，才设置默认值
    if (props.fliter_group.orderbys?.includes(postOrder)) {
        currentOrderBy.value = postOrder;
    } else {
        currentOrderBy.value = props.fliter_group.orderbys?.[0] || ''; // 避免 fliter_group.orderbys 为空时报错
    }
});

// ✅ 监听 Vue Router 的 URL 变化，动态更新 `currentOrderBy`
watch(() => route.query.post_order, (newOrder) => {
    if (props.fliter_group.orderbys?.includes(newOrder)) {
        currentOrderBy.value = newOrder;
    }
});


const go = (key,value)=> {
    if(currentOrderBy.value === value) return;
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