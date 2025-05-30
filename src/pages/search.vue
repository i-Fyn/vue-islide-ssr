<template>
    <div class="single-page search-page">
    <div class=" wrapper">
        <div id="primary-home" class="content-area">
            <div class="tabs mb-4">
                <li v-for="{ types, name } in search_type" @click.prevent="router.push(getTabsUrl(types))"
                        :href="getTabsUrl(types)" :class="{ active: types == type }" class="tab">
                        <a href="">{{ name }}</a>
                    </li>
            </div>
            <component :is="currentComponent" ></component>
        </div>

        <!-- sidebar -->

    </div>
    </div>
</template>


<script setup>
import { ref, onMounted, defineAsyncComponent, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '../store'


const store = useStore()
const route = useRoute()
const router = useRouter()
const s = ref(route.query.s)
const type = ref(route.query.type)


const search_type = ref([
    { types: 'post', name: '文章' },
    { types: 'video', name: '视频' },
    { types: 'circle', name: '帖子' },
])

const searchComponent = {
    post: defineAsyncComponent(() => import('@/components/search/SearchPost.vue')),
    video: defineAsyncComponent(() => import('@/components/search/SearchVideo.vue')),
    circle: defineAsyncComponent(() => import('@/components/search/SearchDynamic.vue')),
}

const currentComponent = computed(() => {
    return searchComponent[type.value]
})

const getTabsUrl = (types) => {
    let query = { ...route.query }
    query.type = types
    const resolvedRoute = router.resolve({
        name: 'search',
        query: {
            s: s.value,
            type: types,
        },
    })
    return resolvedRoute.href
}


onMounted(() => {
    if (!type.value) {
        type.value = 'post'
    }
})

watch(() => route.query, (newVal, oldVal) => {
    if (newVal) {
        if (newVal.type) {
            type.value = newVal.type
        }
        if (newVal.s) {
            s.value = newVal.s
        }
    }
}, {
    deep: true,
})

</script>