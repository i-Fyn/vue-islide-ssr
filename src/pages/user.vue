<template>
    <div id="author" class="author" v-if="user_data">
    <div class="author-header relative bg-base-100 overflow-hidden">
      <div class="mask-wrapper bg-gradient-to-br from-primary to-accent p-4">
        <div class="wrapper container mx-auto px-4">
          <div class="author-container pt-[calc(var(--top-menu-height)+1rem)]">
            <div class="author-info">
              <div class="author-profile flex items-start gap-4 lg:gap-6">
                <div class="left w-20 lg:w-24">
                  <avatar-vue :size="80" :data="user_data"></avatar-vue>
                </div>
                <div class="right flex-1">
                  <div class="user-info mb-3 lg:mb-4 flex flex-col gap-2">
                    <name-vue class="text-base lg:text-lg font-bold text-white" :data="user_data"></name-vue>
                    <div class="desc text-white/90">
                      <a v-if="!user_data['verify']['name']" class="link link-hover text-sm lg:text-base">
                        暂未认证，去认证 <i class="ri-arrow-right-s-line"></i>
                      </a>
                      <div v-else class="user-auth badge badge-accent gap-1 text-sm ">
                        <span>
                          {{ user_data['verify']['name'] }}：{{ user_data['verify']['title'] }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="statistics flex gap-4 lg:gap-8 flex-nowrap scroll-x whitespace-nowrap">
                    <a :class="{ 'text-accent': page == 'follow' }"
                      
                      @click.prevent="router.push({ name: 'user_page', params: { page: 'follow' },query:{type:'follow'} })"
                      class="flex flex-col items-center">
                      <span class="text text-white/80 text-sm lg:text-sm">关注</span>
                      <span class="num font-bold text-lg lg:text-xl text-white">{{ user_data['followers']['follow'] }}</span>
                    </a>
                    <a :class="{ 'text-accent': page == 'fans' }"
                      @click.prevent="router.push({ name: 'user_page', params: { page: 'follow' },query:{type:'fans' } })"
                      class="flex flex-col items-center">
                      <span class="text text-white/80 text-sm lg:text-sm">粉丝</span>
                      <span class="num font-bold text-lg lg:text-xl text-white">{{ user_data['followers']['fans'] }}</span>
                    </a>
                    <div :title="'视频、动态、专栏累计获赞' + user_data['stats']['posts_like_count']" 
                      class="flex flex-col items-center">
                      <span class="text text-white/80 text-sm lg:text-sm">获赞</span>
                      <span class="num font-bold text-lg lg:text-xl text-white">{{ user_data['stats']['posts_like_count'] }}</span>
                    </div>
                    <div :title="'截止现在，阅读数总计为' + user_data['stats']['posts_views_count']"
                      class="flex flex-col items-center">
                      <span class="text text-white/80 text-sm lg:text-sm">阅读</span>
                      <span class="num font-bold text-lg lg:text-xl text-white">{{ user_data['stats']['posts_views_count'] }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-sm author-profile-bottom flex flex-wrap justify-between items-center mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-white/10 gap-4">
                <div class="left-desc">
                  <div class="list mb-2">
                    <div class="tag-item inline-flex items-center text-white/90 ">
                      <i class="ri-map-pin-fill mr-1"></i>
                      <span class="text">IP属地：{{ user_data['ip'] }}</span>
                    </div>
                  </div>
                  <div class="desc text-ellipsis text-white/80 ">
                    {{ user_data['desc'] ? user_data['desc'] : "这个人很懒，什么都没有留下！" }}
                  </div>
                </div>
                <div class="right-action flex gap-2 lg:gap-3" v-cloak>
                  <div style="--btn-fg:white" class="profile-info-button btn btn-primary btn-sm lg:btn-md btn-ghost text-white border-white/20" @click="whisper()" v-show="!is_self">私信</div>
                  <div style="--btn-fg:white" class="profile-primary-button btn btn-primary text-white btn-sm lg:btn-md" :class="[is_follow ? 'btn-ghost text-white border-white/20' : 'btn-accent']"
                    @click="onFollow()" v-show="!is_self && loaded" v-cloak>
                    {{ is_follow ? '已关注' : '关注 TA' }}
                  </div>
                  <a style="--btn-fg:white" class="profile-primary-button btn btn-sm lg:btn-md btn-ghost text-white border-white/20 mobile-hidden" v-show="!is_self" v-cloak>个人中心</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!---#author-header----->
    <div class="author-body wrapper container mx-auto px-4 relative ">
      <div class="author-tabsbar box tabs tabs-boxed bg-base-100 p-2 lg:p-4 sticky top-0 z-10" ref="tabsbar">
        <div class="tab-links tabs-border overflow-auto whitespace-nowrap scrollbar-none">
          <a :class="['tab tab-md lg:tab-lg font-medium', { 'tab tab-active': page == 'index' }]" @click="changePage('index')">
            <span class="text">发布</span>
            <span v-if="user_data['stats']['posts_count']" class="badge badge-accent badge-sm ml-1 text-white">
              {{ user_data['stats']['posts_count'] }}
            </span>
          </a>
          <a :class="['tab tab-md lg:tab-lg font-medium', { 'tab-active': page == 'dynamic' }]"
            @click="changePage('dynamic')">
            <span class="text">动态</span>
            <span v-if="user_data['stats']['dynamic_count']" class="badge badge-accent badge-sm ml-1 text-white">
              {{ user_data['stats']['dynamic_count'] }}
            </span>
          </a>
          <a :class="['tab tab-md lg:tab-lg font-medium', { 'tab-active': page == 'favorite' }]"
            @click="changePage('favorite')">
            <span class="text">收藏</span>
            <span class="badge badge-accent badge-sm ml-1 text-white">{{ user_data['stats']['favorites_count'] }}</span>
          </a>
          <a :class="['tab tab-md lg:tab-lg font-medium', { 'tab-active': page == 'comments' }]"
            @click="changePage('comments')">
            <span class="text">评论</span>
            <span class="badge badge-accent badge-sm ml-1 text-white">{{ user_data['stats']['comments_count'] }}</span>
          </a>
          <a :class="['tab tab-md lg:tab-lg font-medium', { 'tab-active': page == 'follow' }]"
            @click="changePage('follow')">
            <span class="text">关注</span>
            <span class="badge badge-accent badge-sm ml-1 text-white">{{ user_data['followers']['follow'] }}</span>
          </a>
        </div>
      </div>
      <!---#author-tabsbar----->
      <div class="author-page-content mt-2 lg:mt-6 min-h-screen p-2 lg:p-0">
        <div class="author-page-left">
          <component :is="get_component_name(page)" :key="page + (route.query.type || '')" v-bind="get_component_props(page)" />
        </div>
      </div>
      <!---#author-page-content----->
    </div>
  </div>
 
</template>


<script setup>

import { ref, onMounted, defineAsyncComponent, onServerPrefetch, markRaw } from 'vue'
import axios from '@/dist/axios'
import { useRouter, useRoute } from 'vue-router'
import { createMessage as message } from '@/dist/message'
import { useStore } from '@/store';
import nameVue from '../components/user/nameVue.vue';
import avatarVue from '../components/user/avatarVue.vue';

defineOptions({
    name: 'user',
})

const store = useStore()
const router = useRouter()
const route = useRoute() 
const props = defineProps({
    user_id: {
        type: [Number, String],
        required: true
    },
    page: {
        type: String,
        default: 'index'
    }
})
const page = ref(props.page)
const locked = ref(false)
const is_self = ref(false)
const is_follow = ref(false)
const loaded = ref(false)
const tabsbar = ref(null)

const user_id = ref(props.user_id)

const user_data = ref(null)

// 组件预注册
const UserIndex = markRaw(defineAsyncComponent({
  loader: () => import('@/components/user/index.vue'),
  name: 'UserIndex'
}))

const UserDynamic = markRaw(defineAsyncComponent({
  loader: () => import('@/components/user/dynamic.vue'),
  name: 'UserDynamic'
}))

const UserFavorite = markRaw(defineAsyncComponent({
  loader: () => import('@/components/user/favorite.vue'),
  name: 'UserFavorite'
}))

const UserComments = markRaw(defineAsyncComponent({
  loader: () => import('@/components/user/comments.vue'),
  name: 'UserComments'
}))

const UserFans = markRaw(defineAsyncComponent({
  loader: () => import('@/components/user/fans.vue'),
  name: 'UserFans'
}))

// 组件名称映射
const componentMap = {
  index: UserIndex,
  dynamic: UserDynamic,
  favorite: UserFavorite,
  comments: UserComments,
  follow: UserFans
}

const getUserData = async () => {
    try {
        let res = await store.fetchUserInfo(user_id.value)
        user_data.value = res;
    } catch (err) {
    }
}


const checkFollow = async () => {
    try {
        let res = await axios.post('checkFollow', {
            user_id: user_id.value
        })
        is_follow.value = res.data.is_follow
        is_self.value = res.data.is_self
    } catch (err) {
    }
}

const onFollow = () => {
    if (locked.value == true) return
    locked.value = true

    axios.post('/userFollow', 'user_id=' + user_id.value).then(res => {
        is_follow.value = !is_follow.value

        locked.value = false

        message({ message: '操作成功', type: 'success' });
    }).catch(err => {
        locked.value = false
        message({ message: err.response.data.message, type: 'error' });
    })
}

const changePage = (p) => {
    page.value = p 
  // 滚动到tabsbar顶部
  // if (tabsbar.value) {
  //   const tabsbarRect = tabsbar.value.getBoundingClientRect()
  //   const tabsbarTop = tabsbarRect.top
  //   const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    
  //   window.scrollTo({
  //     top: tabsbarTop + scrollTop - 72,
  //     behavior: 'smooth'
  //   })
  // }
}


const whisper = () => {
    router.push('/message?whisper=' + user_id.value)
}

const get_component_name = (page) => {
  return componentMap[page] || UserIndex;
}


const get_component_props = (page) => {
    switch (page) {
        case 'follow':
            return { user_data: user_data.value }
        default:
            return {}
    }
}
            


onMounted(async () => {
    console.log('mounted')
    await checkFollow()
    await getUserData()
})


onServerPrefetch(async () => {
    await getUserData()
})


</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
