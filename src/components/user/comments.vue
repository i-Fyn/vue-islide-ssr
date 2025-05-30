<template>
    <div id="comments-page" class="bg-base-200" ref="commentsPage" v-cloak>
        <div class="container mx-auto ">
            <ul class="space-y-4" v-if="data.length">
                <li v-for="(item, index) in data" :key="index" 
                    class="card bg-base-100 animate__animated animate__fadeIn">
                    <div class="card-body">
                        <div class="flex items-center justify-between">
                            <div class="text-sm text-base-content/70" v-text="item.comment.date"></div>
                        </div>
                        
                        <p class="text-base-content mt-2 line-clamp-3" v-html="item.comment.content"></p>
                        
                        <div class="mt-4 pt-4 border-t border-base-300">
                            <span class="text-sm text-base-content/80">
                                {{ item.comment_parent ? '回复评论：' : '回复帖子：' }}
                                <template v-if="item.comment_parent">
                                    <a :href="item.comment_post.link + '#comment-' + item.comment_parent.id"
                                        class="link link-primary" v-html="item.comment_parent.content"></a>
                                </template>
                                <template v-else>
                                    <a :href="item.comment_post.link" 
                                        class="link link-primary" v-text="item.comment_post.title"></a>
                                </template>
                            </span>
                        </div>
                    </div>
                </li>
            </ul>

        
            <template v-else-if="!data.length && isDataEmpty">
                <div class="flex flex-col items-center justify-center py-12">
                    <van-empty image-size="10rem" description="暂无内容" />
                </div>
            </template>

            <PageNav ref="jsonPageNav" :paged="paged" :pages="pages" navtype="json" type="auto" :api="api" :param="param"
                @change="change">
            </PageNav>
        </div>
    </div>
</template>


<script setup>

import { ref, onMounted, computed,onServerPrefetch,nextTick } from 'vue'
import PageNav from '@/components/footer/PageNav.vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'

const store = useStore()
const data = ref([])
const loading = ref(false)
const isDataEmpty = ref(false)
const paged = ref(1)
const pages = ref(1)
const api = ref('getUserCommentList')
const route = useRoute()
const jsonPageNav = ref(null)


const param = ref({
    size: 10,
    user_id: route.params.user_id,
});

const change = (res) => {
    data.value = data.value.concat(res.data);
    loading.value = false;
    pages.value = res.pages
    isDataEmpty.value = data.value.length === 0
}




const fetchData = async () => {
    try {
        loading.value = true
        let res = await store.fetchApiPostData(api.value,Object.assign(param.value, { paged: paged.value }))
        change(res)
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