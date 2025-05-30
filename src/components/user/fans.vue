<template>
    <div id="follows-page"  ref="followsPage" v-cloak>
        <div class="container mx-auto">
            <!-- 标签页 -->
            <div class="tabs tabs-boxed  mb-8">
                <a :class="['tab', index == 0 ? 'tab-active' : '']" 
                   :href="route.fullPath + '?type=fans'"
                   @click.prevent.stop="changeTab(0)">
                   {{ user_data.login ? '我' : 'TA' }}的粉丝
                </a>
                <a :class="['tab', index == 1 ? 'tab-active' : '']"
                   :href="route.fullPath + '?type=follow'" 
                   @click.prevent.stop="changeTab(1)">
                   {{ user_data.login ? '我' : 'TA' }}的关注
                </a>
            </div>

            <!-- 用户列表 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 " v-if="data.length">
                <div v-for="(item, index) in data" :key="index"
                    class="card bg-base-100 animate__animated animate__fadeIn">
                    <div class="card-body flex-row items-center justify-between p-4">
                        <div class="flex items-center gap-4">
                            <avatar-vue :data="item"></avatar-vue>
                            <div>
                                <name-vue :data="item"></name-vue>
                                <p class="text-sm text-base-content/70 mt-1 line-clamp-1" v-text="item.desc"></p>
                            </div>
                        </div>
                        <button @click="onFollow(item)" 
                            :class="[
                                'btn btn-sm btn-soft',
                                item.followers.is_follow ? 'btn-neutral' : 'btn-primary'
                            ]">
                            {{ item.followers.is_follow ? '已关注' : '关注' }}
                        </button>
                    </div>
                </div>
            </div>

        
            <!-- 空状态 -->
            <template v-else-if="!data.length && isDataEmpty">
                <div class="flex flex-col items-center justify-center py-12">
                    <van-empty image-size="10rem" description="暂无内容" />
                </div>
            </template>

            <!-- 分页 -->
            <PageNav ref="jsonPageNav" :paged="paged" :pages="pages" navtype="json" type="auto" :api="api" :param="param"
                @change="change">
            </PageNav>
        </div>
    </div>
</template>


<script setup>
import { ref, computed, onMounted, onServerPrefetch } from 'vue'
import PageNav from '../footer/PageNav.vue'
import nameVue from './nameVue.vue'
import avatarVue from './avatarVue.vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store'
import axios from '@/dist/axios'
import { createMessage as message } from '../../dist/message'
import { useLoginStatus } from '../header/composables/useLoginStatus'

const props = defineProps({
    user_data: {
        type: Object,
        required: true
    }
})
const { isLogin, checkIsLogin } = useLoginStatus()
const store = useStore()
const route = useRoute()
const router = useRouter()
const user_id = computed(() => route.params.user_id)
const index = ref(0)
const data = ref([])
const loading = ref(false)
const isDataEmpty = ref(false)
const paged = ref(1)
const pages = ref(1)
const param = ref({
    user_id: user_id.value,
    size: 10
})
const jsonPageNav = ref(null)
const apis = ref(['getFansList', 'getFollowList']);
const api = computed(() => apis.value[index.value])


const changeTab = (i) => {
    index.value = i
    paged.value = 1
    pages.value = 1
    data.value = []
    isDataEmpty.value = false
    loading.value = false
    param.value.type = i === 0 ? 'fans' : 'follow'
    fetchData()
}

const change = (res) => {
    data.value = res.data;
    pages.value = res.pages;
    isDataEmpty.value = (data.value.length === 0)
    loading.value = false
    console.log(data.value, pages.value)
}

const fetchData = async () => {
    try {
        loading.value = true
        let res = await store.fetchApiPostData(api.value, Object.assign(param.value, { paged: paged.value }))
        change(res)
    } catch (error) {
        console.log(error)
    }
}


const onFollow = (item) => {
    if (!isLogin.value) return checkIsLogin()
    if (loading.value) return
    loading.value = true;
    axios.post('/userFollow', 'user_id=' + item.id).then(res => {
        item.followers.is_follow = !item.followers.is_follow
        loading.value = false;
        message({ message: '操作成功', type: 'success' })
    }).catch(err => {
        loading.value = false;
        message({ message: err.response.data.message, type: 'error' })
    })
}




onMounted(async () => {
    await fetchData()
})

onServerPrefetch(async () => {
    await fetchData()
})


</script>