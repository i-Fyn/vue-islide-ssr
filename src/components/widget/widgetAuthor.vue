<template>
    <section class="card bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group" v-if="author_stats">
        <div class="w-full">
            
            <!-- 作者卡片 -->
            <div class="relative flex flex-col items-center bg-gradient-to-br from-primary to-secondary rounded-xl p-4 text-primary-content overflow-hidden">
                <!-- 顶部提示语句 -->
                <div class="mb-4 w-auto z-2 relative">
                    <div class="p-1 px-2 rounded-full bg-base-100/20 backdrop-blur-sm border-0 text-white hover:bg-base-100 hover:text-base-content transition-all duration-300 transform hover:scale-105 cursor-pointer select-none text-xs"
                        @click="router.push({ name: 'user', params: { user_id, page: 'index' } })">
                        出门走走，休息一下吧
                    </div>
                </div>

                <!-- 作者头像区域 -->
                <div class="relative z-10 mb-4 transition-all duration-500 transform group-hover:scale-90 group-hover:opacity-0">
                    <avatarVue class="rounded-full border-4 border-primary-content/20 shadow-lg" style="--avatar-size:100px" :data="author_stats"></avatarVue>
                </div>

                <!-- 作者描述 - 悬停时显示 -->
                <div class="absolute inset-0  flex flex-col items-center top-15 p-6 bg-gradient-to-br from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-1">
                    <p class="text-center text-primary-content/90 mb-3 text-sm">{{ author_stats.desc || '这个人很懒，什么都没留下' }}</p>
                    <p class="text-center text-primary-content/90 text-sm">你可以点击私信联系我：</p>
                </div>

                <!-- 作者信息底部 -->
                <div class="w-full mt-2 z-2 relative">
                    <div class="flex justify-between items-center">
                        <a class="hover:opacity-80 transition-opacity" href="/about">
                            <h3 class="font-bold text-base text-primary-content">{{ author_stats.name || '博主' }}</h3>
                            <p class="text-xs text-primary-content/70">分享设计与科技生活</p>
                        </a>
                        
                        <div class="flex gap-2">
                            <!-- 关注按钮 -->
                            <button 
                                class="btn btn-circle btn-sm bg-base-100/20 hover:bg-base-100 text-primary-content hover:text-primary border-0 shadow-sm"
                                @click="onFollow()"
                                title="关注作者"
                            >
                                <i v-if="!is_follow" class="ri-heart-add-line text-lg"></i>
                                <i v-else class="ri-heart-fill text-lg text-error"></i>
                            </button>
                            
                            <!-- 私信按钮 -->
                            <button 
                                class="btn btn-circle btn-sm bg-base-100/20 hover:bg-base-100 text-primary-content hover:text-primary border-0 shadow-sm"
                                @click="whisper()"
                                title="私信作者"
                            >
                                <i class="ri-chat-3-line text-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 作者统计信息 -->
                <div class="stats stats-horizontal bg-base-100/10 text-primary-content w-full mt-4 shadow-sm backdrop-blur-sm text-center relative z-2">
                    <div class="stat p-2 flex flex-col items-center justify-center">
                        <div class="stat-title text-xs text-primary-content/70">文章</div>
                        <div class="stat-value text-lg">{{ author_stats.stats?.posts_count || 0 }}</div>
                    </div>
                    <div class="stat p-2 flex flex-col items-center justify-center">
                        <div class="stat-title text-xs text-primary-content/70">粉丝</div>
                        <div class="stat-value text-lg">{{ author_stats.follow?.fans || 0 }}</div>
                    </div>
                    <div class="stat p-2 flex flex-col items-center justify-center">
                        <div class="stat-title text-xs text-primary-content/70">关注</div>
                        <div class="stat-value text-lg">{{ author_stats.follow?.follow || 0 }}</div>
                    </div>
                </div>
                
                <!-- 悬浮装饰元素 -->
                <div class="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-secondary/30 blur-xl"></div>
                <div class="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-primary/30 blur-xl"></div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, onServerPrefetch } from 'vue'
import axios from '@/dist/axios';
import { useRouter, useRoute } from 'vue-router';
import { createMessage as message } from '@/dist/message';
import { useStore } from '@/store'
import avatarVue from '../user/avatarVue.vue';
import { useLoginStatus } from '@/components/header/composables/useLoginStatus.js'
const { isLogin, checkIsLogin } = useLoginStatus()

const route = useRoute()
const is_follow = ref(false)
const is_self = ref(false)
const locked = ref(false)
const router = useRouter()
const store = useStore()
const author_stats = ref({
    "id": "0",
    "name": "-",
    "desc": "-",
    "avatar": "/assets/image/default-avatar.png",
    "badge": "",
    "stats": {
        "posts_views_count": 0,
        "posts_like_count": 0,
        "posts_count": 0,
        "comments_count": 0,
        "favorites_count": 0
    },
    "follow": {
        "follow": 0,
        "fans": 0
    }
})
const user_id = ref(1)


const checkFollow = async () => {
    if (!store.token) {
        return
    }
    try {
        let res = await axios.post('/checkFollow', 'user_id=' + user_id.value)
        is_self.value = res.data.is_self
        is_follow.value = res.data.is_follow
    } catch (error) {
    }
}

const onFollow = () => {
    if (!isLogin.value) {
        return checkIsLogin()
    }
    if (locked.value || is_self.value) return;
    locked.value = true
    axios.post('/userFollow', 'user_id=' + user_id.value).then(res => {
        is_follow.value = !is_follow.value;
        locked.value = false
    }).catch(err => {
        message({ message: err.response.data.message, type: 'error' });
        locked.value = false
    })
}


const whisper = () => {
    if (!isLogin.value) {
        return checkIsLogin()
    }
    router.push({ name: 'message', query: { whisper: user_id.value } })
}

const getAuthorStats = async () => {
    try {
        let res = await store.fetchAuthorStats(route.params.postId || 0)
        author_stats.value = res
        user_id.value = res.id
    } catch (error) {
    }
}

onMounted(async () => {
    await getAuthorStats();
    await checkFollow();
})

onServerPrefetch(async () => {
    await getAuthorStats();
    await checkFollow();
})
</script>

<style>
/* 移除所有自定义样式，使用Tailwind类代替 */
</style>