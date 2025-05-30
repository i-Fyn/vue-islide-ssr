<template>
  <div v-if="postDetail" class="single-page">
    <!-- 视频头部 -->
    <div class="video-single-top relative mb-4 min-h-[20rem] md:min-h-[24rem] lg:-mt-[calc(var(--top-menu-height)+1rem)] -mt-4">
      <!-- 背景 -->
      <div class="absolute inset-0 overflow-hidden z-0">
        <div class="absolute inset-0 bg-black/30 z-10"></div>
        <div class="absolute inset-0 bg-cover bg-center blur-2xl scale-110"
          v-lazy:background-image="postDetail.thumb"></div>
      </div>

      <!-- 内容 -->
      <div class="wrapper h-full flex items-center">
        <div class="relative z-20 w-full pt-18 lg:pt-30">
          <div class="flex flex-row gap-2 md:gap-6 items-start">
            <!-- 封面图 -->
            <div class="w-28 md:w-40 flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
              <van-image lazy-load :src="postDetail.thumb" :alt="'「' + postDetail.title + '」封面'"
                class="w-full h-full object-cover card overflow-hidden" />
            </div>

            <!-- 信息区 -->
            <div class="flex-1 text-white space-y-4 justify-between flex flex-col h-full">
              <h1 class="text-2xl font-semibold">{{ postDetail.title }}</h1>
              <div class="flex items-center text-sm text-gray-200 space-x-2">
                <a  class="flex items-center hover:text-primary transition-colors">
                  <avatarVue :data="postDetail.user" class="mr-1.5" style="--avatar-size:25px" />
                  <span>{{ postDetail.user.name }}</span>
                </a>
                <span>·</span>
                <span v-html="postDetail.date" />
              </div>
              <p class="text-sm leading-relaxed line-clamp-3 text-gray-100">
                {{ postDetail.desc }}
              </p>
              <div class="right-bottom mt-4 md:mt-auto z-10">
                <div class="action-buttons flex gap-2">
                  <button class="buy-button btn card btn-sm btn-primary" @click="watchVideo" >立即播放</button>
                  <button class="vip-button btn card btn-sm btn-soft btn-warning"
                    >
                    VIP 免费观看
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 视频内容 -->
    <singleVideo :postDetail="postDetail" :videoList="videoList" />
  </div>
  <div v-if="skeleton" class="single-page fixed inset-0  bg-base-100 z-10000">
    <video-header-skeleton  />
    <video-skeleton />
  </div>
</template>

<script setup>
import { onMounted, watch, onServerPrefetch, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import { createMessage as message } from '@/dist/message'
import VideoHeaderSkeleton from '@/components/single/container/header/VideoHeaderSkeleton.vue'
import VideoSkeleton from '@/components/single/container/article/VideoSkeleton.vue'
import avatarVue from '@/components/user/avatarVue.vue'
import singleVideo from '@/components/single/singleVideo.vue'

const props = defineProps({
  postId: String,
})


const store = useStore()
const router = useRouter()
const videoList = ref([])
const postDetail = ref(null)
const skeleton = ref(true)


const watchVideo = () => {
  if (videoList.value.length > 0) {
    if(videoList.value[0].video_list.length > 0){
      router.push(`/episode/${videoList.value[0].video_list[0].id}`)
    }else{
      message({message:'暂无视频',type:'error'})
    }
  }else{
    message({message:'暂无视频',type:'error'})
  }
}

const fetchData = async () => {
  try {
    const res = await store.fetchVideoList(props.postId)
    postDetail.value = res.post;
    videoList.value = res.list;
    setTimeout(() => {
      skeleton.value = false
    }, 300) // 添加短暂延迟，使过渡更平滑
  } catch (error) {
    message({message:'获取视频数据失败',type:'error'})
    skeleton.value = false
  }
}

onMounted(async () => {
  await fetchData()
})

onServerPrefetch(() =>  fetchData())

watch(() => props.postId, async () => {
  skeleton.value = true
  postDetail.value = null
  videoList.value = []
  await fetchData()
})
</script>

<style scoped>
.fade-in-animation {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>