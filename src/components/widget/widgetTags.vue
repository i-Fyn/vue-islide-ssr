<template>
  <section class="p-4 card bg-base-100  shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
    <div class="w-full">
      <!-- 标题栏 带装饰效果 -->
      <div class="relative flex items-center justify-between  pb-2 border-b border-base-200">
        <div class="flex items-center gap-2">
          <span class="w-1 h-6 bg-gradient-to-b from-secondary to-primary rounded-full"></span>
          <h2 class="text-base font-bold text-base-content relative">热门标签
            <span class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-error to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </h2>
        </div>
        <button class="btn btn-ghost btn-sm btn-circle" title="刷新" @click="refreshTags">
          <i class="ri-refresh-line" :class="{'animate-spin': isLoading}"></i>
        </button>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="isLoading && !tags.length" class="py-4 flex flex-col items-center">
        <div class="loading loading-spinner loading-md text-secondary mb-2"></div>
        <p class="text-sm text-base-content/60">加载标签数据...</p>
      </div>
      
      <!-- 内容为空状态 -->
      <div v-else-if="!isLoading && !tags.length" class="py-4 flex flex-col items-center">
        <div class="text-4xl text-base-content/20 mb-2">
          <i class="ri-price-tag-3-line"></i>
        </div>
        <p class="text-sm text-base-content/60">暂无标签数据</p>
      </div>
      
      <!-- 标签云 - 彩虹渐变风格 -->
      <div v-else>
        <div class="relative overflow-hidden" :class="{'max-h-64': !showAll}">
          <div class="flex flex-wrap gap-2 pt-4">
            <router-link 
              v-for="(tag, index) in tags" 
              :key="tag.id"
              :to="{ name: 'tags', params: { tag_id: tag.id } }" 
              class="relative px-3 py-1.5 rounded-full inline-flex items-center gap-1 transition-all duration-300 transform hover:scale-101 hover:-translate-y-1 hover:shadow-md text-sm"
              :class="tagColorClasses[index % tagColorClasses.length]"
            >
              <i class="ri-price-tag-3-line text-xs"></i>
              <span>{{ tag.name }}</span>
              <span class="badge badge-sm ml-1 opacity-80">{{ tag.count }}</span>
            </router-link>
          </div>
          
          <!-- 渐变遮罩 -->
          <div v-if="!showAll" class="absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t from-base-100 to-transparent pointer-events-none"></div>
        </div>
        
        <!-- 展开/收起按钮 -->
        <button 
          class="btn btn-sm btn-outline btn-secondary w-full mt-3 rounded-full !text-sm"
          @click="toggleShowAll"
        >
          {{ showAll ? '收起标签' : '查看全部标签' }}
          <i :class="showAll ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"></i>
        </button>
      </div>
      
      <!-- 站点统计 - 卡片式布局 -->
      <div class="mt-6">
        <div class="stats stats-vertical lg:stats-horizontal shadow bg-base-200 w-full">
          <div class="stat">
            <div class="stat-figure text-primary">
              <i class="ri-file-text-line text-2xl"></i>
            </div>
            <div class="stat-title text-xs">文章总数</div>
            <div class="stat-value text-primary text-base">{{ siteSats.total_posts || 0 }}</div>
          </div>
          
          <div class="stat">
            <div class="stat-figure text-secondary">
              <i class="ri-calendar-line text-2xl"></i>
            </div>
            <div class="stat-title text-xs">建站天数</div>
            <div class="stat-value text-secondary text-base">{{ siteSats.site_days || 0 }}</div>
          </div>
          
          <div class="stat">
            <div class="stat-figure text-accent">
              <i class="ri-eye-line text-2xl"></i>
            </div>
            <div class="stat-title text-xs">访问量</div>
            <div class="stat-value text-accent text-base">{{ siteSats.total_views || 0 }}k</div>
          </div>
          
          <div class="stat">
            <div class="stat-figure text-info">
              <i class="ri-message-3-line text-2xl"></i>
            </div>
            <div class="stat-title text-xs">评论数</div>
            <div class="stat-value text-info text-base">{{ siteSats.total_comments || 0 }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/dist/axios';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
const tags = ref([]);
const showAll = ref(false);
const isLoading = ref(false);

// 为标签提供多种颜色组合
const tagColorClasses = [
  'bg-primary/10 text-primary hover:bg-primary hover:text-primary-content',
  'bg-secondary/10 text-secondary hover:bg-secondary hover:text-secondary-content',
  'bg-accent/10 text-accent hover:bg-accent hover:text-accent-content',
  'bg-info/10 text-info hover:bg-info hover:text-info-content',
  'bg-success/10 text-success hover:bg-success hover:text-success-content',
  'bg-warning/10 text-warning hover:bg-warning hover:text-warning-content',
  'bg-error/10 text-error hover:bg-error hover:text-error-content',
];

const toggleShowAll = () => {
  showAll.value = !showAll.value;
};

const siteSats = ref({
  'site_days': 0,
  'total_posts': 0,
  'total_comments': 0,
  'total_views': 0,
});

const getTags = async (refresh = false) => {
  if (store.config.tax?.tags?.length && !refresh) {
    tags.value = store.config.tax.tags;
    return;
  }
  
  isLoading.value = true;
  try {
    // 假设这里应该有获取标签的API，但目前从store直接获取
    tags.value = store.config.tax?.tags || [];
  } catch (error) {
    console.error('获取标签失败', error);
  } finally {
    isLoading.value = false;
  }
};

const getSiteStats = async (refresh = false) => {
  isLoading.value = true;
  try {
    let res = await axios.get('/site-stats', { params: { refresh } });
    siteSats.value = res.data;
  } catch (error) {
    console.error('获取站点统计失败', error);
  } finally {
    isLoading.value = false;
  }
};

const refreshTags = async () => {
  await getTags(true);
  await getSiteStats(true);
};

onMounted(async () => {
  await getTags();
  await getSiteStats();
});
</script>

<style scoped>
/* 不需要额外的自定义CSS，全部使用Tailwind类 */
</style>