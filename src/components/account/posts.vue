<template>
  <div class="flex flex-col gap-4">
    <!-- 稿件数据卡片 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <div v-for="(item, index) in stats_count" 
           class="flex items-center gap-4 p-4 rounded-xl shadow-sm transition-all hover:-translate-y-1"
           :class="`bg-${getStatColor(index)}/10`">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl text-2xl" 
             :class="`text-${getStatColor(index)}`">
          <i :class="getStatIcon(index)"></i>
        </div>
        <div class="flex flex-col">
          <div class="text-2xl font-semibold leading-tight">{{ item.count }}</div>
          <div class="text-sm text-base-content/70">{{ item.name }}</div>
        </div>
      </div>
    </div>

    <!-- 稿件管理卡片 -->
    <div class="card bg-base-100 ">
      <div class="card-body p-0">
        <!-- 标签页 -->
        <div class="p-4 border-b border-base-200">
          <div class="scroll-x">
            <div class="tabs tabs-boxed bg-base-200/50 p-1">
              <a v-for="tab in tabs" 
                 @click="changeTab(tab.value)"
                 :class="['tab', {'tab-active': tab.value == param.post_type}]">
                {{ tab.name }}
              </a>
            </div>
          </div>
        </div>

        <!-- 文章列表 -->
        <div v-if="data.length" class="p-4">
          <div class="flex flex-col gap-4">
            <div v-for="item in data" 
                 class="flex gap-4 p-4 rounded-lg hover:bg-base-200/50 transition-all">
              <!-- 缩略图 -->
              <div v-if="item.thumb" class="w-[120px] h-[90px] min-w-[120px] rounded-lg overflow-hidden">
                <a :href="item.link" class="block h-full">
                  <img :src="item.thumb" alt="缩略图" class="w-full h-full object-cover" loading="lazy" />
                </a>
              </div>

              <!-- 文章信息 -->
              <div class="flex-1 min-w-0 flex flex-col justify-between">
                <div class="flex items-center gap-2 mb-2">
                  <a :href="item.id" class="font-medium text-base-content truncate max-w-full">{{ item.title }}</a>
                  <span class="px-2 py-0.5 rounded-full text-xs whitespace-nowrap"
                        :class="{
                          'bg-success/10 text-success': item.post_status === 'publish',
                          'bg-warning/10 text-warning': item.post_status === 'draft', 
                          'bg-info/10 text-info': item.post_status === 'pending',
                          'bg-error/10 text-error': item.post_status === 'trash'
                        }">{{ item.status }}</span>
                </div>

                <div class="flex flex-wrap gap-4">
                  <div class="flex items-center gap-1 text-xs text-base-content/70">
                    <i class="ri-calendar-line"></i>
                    <span>{{ item.date }}</span>
                  </div>
                  <div class="flex items-center gap-1 text-xs text-base-content/70">
                    <i class="ri-eye-line"></i>
                    <span>{{ item.post_meta.views }}</span>
                  </div>
                  <div class="flex items-center gap-1 text-xs text-base-content/70">
                    <i class="ri-message-2-line"></i>
                    <span>{{ item.post_meta.comment }}</span>
                  </div>
                  <div class="flex items-center gap-1 text-xs text-base-content/70">
                    <i class="ri-heart-line"></i>
                    <span>{{ item.post_meta.like }}</span>
                  </div>
                  <div class="flex items-center gap-1 text-xs text-base-content/70">
                    <i class="ri-bookmark-line"></i>
                    <span>{{ item.post_meta.collect }}</span>
                  </div>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div v-if="['draft','pending'].includes(item.post_status)" class="flex items-center">
                <a :href="'/write?id=' + item.id" 
                  @click.prevent="router.push('/write?id=' + item.id)"
                  class="btn btn-primary btn-sm gap-1">
                  <i class="ri-edit-line"></i>
                  <span>编辑</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载中 -->
        <div class="flex flex-col items-center justify-center py-16" v-else-if="!data.length && loading && !isDataEmpty">
          <span class="loading loading-spinner loading-lg text-primary"></span>
          <span class="mt-4 text-base-content/60 text-sm">加载稿件中...</span>
        </div>

        <!-- 空状态 -->
        <div class="flex flex-col items-center justify-center py-16" v-else-if="!data.length && isDataEmpty">
          <div class="text-6xl opacity-20 mb-4">
            <i class="ri-draft-line"></i>
          </div>
          <p class="text-base-content/60">暂无内容</p>
          <button class="btn btn-sm btn-outline mt-4" @click="fetchData">添加新稿件</button>
        </div>

        <!-- 分页 -->
        <div class="p-4 border-t border-base-200">
          <PageNav ref="jsonPageNav" :paged="paged" :pages="pages" 
            navtype="json" type="page" :api="api" :param="param" 
            @change="change" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onServerPrefetch, nextTick } from 'vue'
import PageNav from "@/components/footer/PageNav.vue"
import axios from '@/dist/axios'
import { useStore } from '@/store';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useStore();
const data = ref('');
// 分页数据
const locked = ref(false);
const api = ref('getUserPostList');
const param = ref({
    size: 6,
    post_type: 'post'
});

const tabs = ref([{
    name: '文章管理',
    value: 'post'
}, {
    name: '帖子管理',
    value: 'circle'
}, {
    name: '视频管理',
    value: 'video'
}, {
    name: '商品管理',
    value: 'shop'
}]);


const isDataEmpty = ref(false);
const loading = ref(true);
const jsonPageNav = ref(null);
const stats_count = ref([]);
const pages = ref(1);
const paged = ref(1);

// 获取统计卡片的颜色
const getStatColor = (index) => {
  const colors = ['primary', 'success', 'warning', 'info'];
  return colors[index % colors.length];
};

// 获取统计卡片的图标
const getStatIcon = (index) => {
  const icons = [
    'ri-article-line',
    'ri-discuss-line',
    'ri-video-line',
    'ri-shopping-bag-line'
  ];
  return icons[index % icons.length];
};

const getPostStats = async () => {
    try {
        let res = await axios.get('/postStats')
        stats_count.value = res.data;
    } catch (error) {
    }
}

const change = (recievedData) => {
    data.value = recievedData.data;
    isDataEmpty.value = data.value == '';
    pages.value = recievedData.pages;
    loading.value = !loading.value;
}

const changeTab = async (tab) => {
    // 根据索引设置 API 地址
    param.value.post_type = tab;
    data.value = '';
    isDataEmpty.value = false;
    await fetchData()
}

onMounted(async () => {
    await getPostStats();
    await fetchData()
});

const fetchData = async () => {
    try {
        locked.value = true
        loading.value = true
        let res = await store.fetchApiPostData(api.value, Object.assign(param.value, { paged: paged.value }))
        change(res)
    } catch (error) {
    }
}

onServerPrefetch(async () => {
    await getPostStats()
    await fetchData()
})
</script>