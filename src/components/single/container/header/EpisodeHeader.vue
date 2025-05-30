<template>
  <div class="wrapper">
    <div id="islide-player-wrap" class="flex gap-4 mb-4 flex-col lg:flex-row">
      <!-- Left: Video Area -->
      <div class="flex-1">
        <div class="relative aspect-video rounded-lg overflow-hidden bg-base-100 p-4">
          <VideoPlayer v-if="videoList.length" :videoList="videoList" :videoIndex="videoIndex" ref="videoPlayer"
            class="" @loaded="videoLoaded" />

          <!-- Overlay if access restricted -->
          <div v-if="(!videos.length || !allowList[videoIndex]) && !preview"
            class="absolute inset-0 z-20 rounded-lg overflow-hidden">
            <div class="h-full bg-cover bg-center relative"
              :style="`background-image: url(${postDetail.thumb['default']})`">
              <div class="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20 z-10"></div>
              <div v-if="videos.length" class="absolute inset-0 flex items-center justify-center z-20 p-6">
                <div class="text-center text-white space-y-6 max-w-md">
                  <!-- 积分购买选项 -->
                  <template v-if="user.type === 'credit'">
                    <h3 class="text-xl font-semibold">本视频需积分观看</h3>
                    <p class="text-3xl text-primary">总价 {{ user.total_value }} 积分</p>
                    <div class="flex justify-center gap-4">
                      <button class="btn btn-primary" @click="pay(false)">单集购买</button>
                      <button class="btn btn-outline" @click="pay(true)">整季购买</button>
                    </div>
                  </template>

                  <!-- 付费购买选项 -->
                  <template v-else-if="user.type === 'money'">
                    <h3 class="text-xl font-semibold">本视频需付费观看</h3>
                    <p class="text-3xl text-primary">总价 ￥{{ user.total_value }}</p>
                    <div class="flex justify-center gap-4">
                      <button class="btn btn-primary" @click="pay(false)">单集购买</button>
                      <button class="btn btn-outline" @click="pay(true)">整季购买</button>
                    </div>
                  </template>

                  <!-- 登录选项 -->
                  <template v-else-if="user.type === 'login'">
                    <h3 class="text-xl font-semibold">请登录后免费观看</h3>
                    <button class="btn btn-primary" @click="login">登录 / 注册</button>
                  </template>

                  <!-- 密码选项 -->
                  <template v-else-if="user.type === 'password'">
                    <h3 class="text-xl font-semibold">请输入密码观看</h3>
                    <button class="btn btn-primary" @click="pay(false)">输入密码</button>
                  </template>

                  <!-- 评论选项 -->
                  <template v-else-if="user.type === 'comment'">
                    <h3 class="text-xl font-semibold">请先评论后免费观看</h3>
                    <p class="text-base text-gray-300">评论完成后刷新本页即可观看</p>
                  </template>

                  <!-- 用户权限选项 -->
                  <template v-else-if="user.type === 'roles'">
                    <h3 class="text-xl font-semibold">仅限以下用户等级观看</h3>
                    <div class="flex justify-center flex-wrap gap-2">
                      <span v-for="(item, idx) in user.roles" :key="idx"
                        class="px-3 py-1 rounded bg-base-100 text-black text-sm">{{ item.name }}</span>
                    </div>
                    <p class="text-sm text-gray-300">您当前未达到观看权限</p>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Sidebar Info -->
      <div class="lg:w-[var(--sidebar-width)] w-full flex flex-col">
        <!-- Post Info -->
        <div class="bg-base-100 p-4">
          <div class="flex gap-3">
            <div class="w-20 min-w-20 aspect-4/5 overflow-hidden">
              <van-image v-if="data.post" lazy-load :src="data.post.thumb"
                class="w-full h-full object-cover card overflow-hidden" />
            </div>
            <div class="flex-1">
              <h2 class="font-semibold text-sm">{{ data.post?.title }}</h2>
              <p class="text-sm text-base-content/60 mt-1 line-clamp-2">{{ data.post?.desc }}</p>
              <a :href="data.post?.user.link" class="mt-2 text-sm flex items-center hover:text-primary">
                <avatarVue :data="data.post?.user" class="w-5 h-5 mr-2" style="--avatar-size:25px" />{{
                  data.post?.user.name
                }}
              </a>
            </div>
          </div>
        </div>

        <!-- Playlist -->
        <div class="bg-base-100 flex-1 flex flex-col overflow-hidden p-4">
          <div class="pb-4 border-b border-base-200 flex justify-between items-center">
            <h4 class="font-semibold">视频目录</h4>
            <button class="btn btn-ghost btn-sm" @click="changeListStyle">
              <i :class="[listStyle ? 'ri-grid-fill' : 'ri-list-check', 'text-lg']"></i>
            </button>
          </div>

          <div class="flex-1 scroll-y mt-4">
            <template v-for="(item, i) in videos" :key="i">
              <div v-if="item.chapter_title" class="px-4 pt-2 font-semibold text-sm text-base-content/60">{{
                item.chapter_title }}</div>
              <ul :class="listStyle ? 'grid grid-cols-5 gap-2 p-4' : 'space-y-2 px-4 pt-2'">
                <li v-for="(video, j) in item.video_list" :key="j" :class="[
                  listStyle ? 'aspect-square flex items-center justify-center rounded-lg bg-base-200 relative' : 'flex gap-3 items-center py-2 px-2 rounded-lg transition hover:bg-base-200',
                  { 'bg-primary/10': videoIndex == getEpisodeNumber(i, j) - 1 }
                ]">
                  <a :href="'/episode/' + video.id" @click.prevent="switchVideo(video, getEpisodeNumber(i, j) - 1)"
                    class="w-full h-full flex items-center justify-center gap-1">
                    <template v-if="!listStyle">
                      <div class="w-16 aspect-video rounded overflow-hidden flex-shrink-0">
                        <van-image lazy-load :src="video.thumb" class="w-full h-full object-cover" />
                      </div>
                      <span class="truncate text-sm flex-1">第{{ getEpisodeNumber(i, j) }}集 - {{ video.title }}</span>
                    </template>
                    <template v-else>
                      <span class="text-sm">{{ getEpisodeNumber(i, j) }}</span>
                      <div v-if="videoIndex == getEpisodeNumber(i, j) - 1"
                        class="playing absolute bottom-1 left-1/2 -translate-x-1/2">
                        <i></i><i></i><i></i><i></i>
                      </div>
                    </template>
                  </a>
                </li>
              </ul>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { onMounted, ref, onServerPrefetch, computed, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VideoPlayer from '@/components/video/VideoPlayer.vue'
import { createMessage as message } from '@/dist/message'
import { useStore } from '@/store';
import avatarVue from '../../../user/avatarVue.vue'
import { islidepay, passwordVerify, payVip } from '@/dist/pay';

// 状态和逻辑处理
const store = useStore()
const config = computed(() => store.config)
const props = defineProps({
  postDetail: {
    type: Object,
    required: true
  }
});

const route = useRoute()
const router = useRouter()
const post_id = ref(route.params.postId)
const data = ref({
  "id": 0,
  "current_user": {
    "allow": false,
    "type": "money",
    "value": 0,
    "total_value": 10,
    "not_login_pay": false,
    "roles": 0,
    "allowList": [
      false,
      false
    ],
    "free_count": 0,
    "free_video": false
  },
  "list": [
    {
      "chapter_title": "",
      "chapter_desc": "",
      "video_list": [
        {
          "title": "-",
          "id": "0",
          "thumb": "",
          "url": "",
          "preview_url": "",
          "link": "",
          "pic": ""
        },
        {
          "preview_url": "",
          "url": "",
          "id": 0,
          "title": "-",
          "thumb": "",
          "link": "",
          "pic": ""
        }
      ]
    }
  ],
  "post": {
    "id": 3540,
    "title": "-",
    "link": "",
    "thumb": "",
    "desc": "",
    "user": {
      "id": "1",
      "name": "-",
      "name_html": "",
      "link": "",
      "avatar": "",
      "avatar_html": "",
      "desc": "",
      "pendant": "",
      "badge": "",
      "lv": {
        "name": "-",
        "exp": "0",
        "icon": "",
        "lv": 1,
        "next_lv_name": "-",
        "next_lv_exp": 0,
        "next_lv_icon": "",
        "exp_ratio": "0"
      },
      "vip": {
        "name": "-",
        "lv": "0",
        "image": "",
        "icon": "",
        "color": "",
        "time": 0,
        "date": "2029-01-11"
      },
      "verify": {
        "icon": "",
        "name": "-",
        "title": "-",
        "type": ""
      },
      "ip": "",
      "stats": {
        "posts_views_count": 0,
        "posts_like_count": 0,
        "posts_count": "0",
        "dynamic_count": "0",
        "comments_count": "0",
        "favorites_count": 0
      },
      "followers": {
        "follow": 0,
        "fans": 0
      },
      "login": true,
      "cover": ""
    }
  }
})
const videos = ref([])
const videoList = ref([
  {
    "id": "0",
    "url": "",
    "preview_url": "",
    "pic": "",
    "title": "-",
    "link": ""
  },
  {
    "id": 0,
    "url": "",
    "preview_url": "",
    "pic": "",
    "title": "-",
    "link": ""
  }
])
const videoIndex = ref(0)
const listStyle = ref(true)
const allowList = ref([])
const preview = ref(false)
const url = ref('')
const player = ref(null)
const user = ref('')
const videoPlayer = ref(null)
const _videoList = ref([])
const payVipRef = ref(null)
const changePreviewRef = ref(null)
const getVideoList = async () => {
  try {
    const res = await store.fetchVideoList(post_id.value);
    data.value = res;
    videos.value = res.list;
    user.value = res.current_user;
    console.log(res)
    allowList.value = user.value.allowList;

    _videoList.value = convertDataToVideoList(videos.value);

    // 查找当前视频索引
    const targetIndex = _videoList.value.findIndex(video => video.id == post_id.value);
    if (targetIndex !== -1) {
      videoIndex.value = targetIndex;
    }

    videoList.value = _videoList.value;

    // 检查是否有预览
    if (videoList.value[videoIndex.value]?.preview_url && allowList.value[videoIndex.value] === false) {
      preview.value = true;
    }
  } catch (error) {
    console.error('获取视频列表失败', error);
  }
}

const convertDataToVideoList = (_data) => {
  if (!_data?.length) return [];

  return _data.flatMap(item =>
    item.video_list?.map(video => ({
      id: video.id,
      url: video.url || video.preview_url,
      preview_url: video.preview_url,
      pic: video.pic,
      title: video.title,
      link: video.link
    })) || []
  );
}

const getEpisodeNumber = (chapterIndex, _videoIndex) => {
  let episodeNumber = 1;
  for (let i = 0; i < chapterIndex; i++) {
    episodeNumber += videos.value[i].video_list.length;
  }
  return episodeNumber + _videoIndex;
}

const changeListStyle = () => {
  listStyle.value = !listStyle.value;
  localStorage.setItem('videoListStyle', String(listStyle.value));
}

const switchVideo = (video, index) => {
     videoIndex.value = index;
  if (video.preview_url || video.url) {
    videoPlayer.value?.switchVideo(index);
  } else {
    if (allowList.value[index] == false) 
     changePreview();
  }
}

const videoLoaded = () => {
  const currentVideo = videoList.value[videoIndex.value];
  const hasPreview = currentVideo?.preview_url && allowList.value[videoIndex.value] === false;

  if (hasPreview) {
    preview.value = true;

    // 预览结束事件
    videoPlayer.value.player.on('Ended', () => {
      preview.value = false;
    });

    if (!user.value.free_video) {
      // 添加预览提示
      const toastContent = `
                <div class="prompt-bar-container">
                    <div>
                        <div class="title">本片是限制内容</div>
                        <div class="desc">试看中 · <span class="video-pay-vip" style="cursor: pointer;">成为会员</span> 免费看本片</div>
                    </div>
                    <div class="action-wrap">
                        <button class="btn btn-primary btn-sm  rounded-4xl">完整观看</button>
                    </div>
                </div>
            `;

      videoPlayer.value.player.toast.show(toastContent, 'left-bottom', 9e6);

      // 添加事件监听
      nextTick(() => {
        payVipRef.value = document.querySelector('.video-pay-vip');
        changePreviewRef.value = document.querySelector('.video-change-preview');

        if (payVipRef.value) {
          payVipRef.value.addEventListener('click', payVip);
        }

        if (changePreviewRef.value) {
          changePreviewRef.value.addEventListener('click', changePreview);
        }
      });
    } else {
      // 会员提示
      const toastContent = `
                <div class="title">您正在享受会员免费观看视频特权</div>
                <div class="desc">今日剩余免费观看 ${user.value.free_count} 次</div>
            `;

      videoPlayer.value.player.toast.show(toastContent, 'left-bottom', 100000);
    }
  }
}

const pay = (allpay) => {
  if (allowList.value[videoIndex.value] !== false) return;

  const userType = user.value.type;

  if (userType === 'credit' || userType === 'money') {
    const payData = {
      title: allpay ? data.value.title : videoList.value[videoIndex.value].title,
      order_price: allpay ? user.value.total_value : user.value.value,
      order_type: 'video',
      post_id: data.value.id,
      type: userType,
      tag: '付费视频'
    };

    if (!allpay) {
      payData.order_key = videoIndex.value;
    }

    islidepay(payData, userType);
  } else if (userType === 'password') {
    config.value.password_verify.post_id = data.value.id;
    passwordVerify(config.value.password_verify);
  } else {
    message({ message: '您无权观看，请升级权限！', type: 'warning' });
  }
}

const login = () => {
  // 跳转到登录页或打开登录弹窗
  // 实现登录逻辑
}

const changePreview = () => {
  preview.value = false;
  videoPlayer.value?.player.pause();
}

onMounted(async () => {
  await getVideoList();

  // 从本地获取列表样式设置
  const savedStyle = localStorage.getItem('videoListStyle');
  if (savedStyle !== null) {
    listStyle.value = savedStyle === 'true';
  }
})

onServerPrefetch(async () => {
  await getVideoList();
})

onBeforeUnmount(() => {
  if (payVipRef.value) {
    payVipRef.value.removeEventListener('click', payVip);
  }
  if (changePreviewRef.value) {
    changePreviewRef.value.removeEventListener('click', changePreview);
  }
})
</script>
