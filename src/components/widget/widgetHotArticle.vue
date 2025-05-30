<template>
  <section class="p-4 card bg-base-100  shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
    <div class="w-full">
      <!-- 标题栏 带装饰效果 -->
      <div class="relative flex items-center justify-between mb-4 pb-2 border-b border-base-200">
        <div class="flex items-center gap-2">
          <span class="w-1 h-6 bg-gradient-to-b from-secondary to-accent rounded-full"></span>
          <h2 class="text-base-content font-bold relative">热门文章
            <span class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-secondary to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </h2>
        </div>
        <button class="btn btn-ghost btn-sm btn-circle text-secondary" title="刷新热门文章" @click="refreshArticles">
          <i class="ri-refresh-line" :class="{'animate-spin': isLoading}"></i>
        </button>
      </div>
      
      <!-- 热门文章列表 -->
      <div class="post-widget text-sm">
        <ul class="space-y-3">
          <li 
            v-for="(item, index) in hotArticle" 
            :key="item.id"
            class="widget-post relative"
            :class="{'animate-fadeIn': true}"
            :style="{animationDelay: `${index * 50}ms`}"
          >
            <a 
              @click.prevent="router.push({ name: 'article', params: { postId: item.id } })"
              class="flex items-center p-2  rounded-lg bg-base-200/50 hover:bg-secondary hover:text-secondary-content transition-all duration-300 transform hover:scale-[1.01] cursor-pointer relative overflow-hidden group/item"
            >
              <!-- 波纹效果 -->
              <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-base-content/5 to-transparent -translate-x-full group-hover/item:translate-x-full transition-transform duration-1000"></span>
              
              <!-- 序号 - 为前三名添加不同颜色，确保完美圆形 -->
              <div 
                class="flex-shrink-0 flex items-center justify-center min-w-[28px] min-h-[28px] w-7 h-7 rounded-full font-medium mr-3 shadow-sm"
                :class="{
                  'bg-primary text-primary-content': index === 0,
                  'bg-secondary text-secondary-content': index === 1, 
                  'bg-accent text-accent-content': index === 2,
                  'bg-base-300 text-base-content': index > 2
                }"
              >
                <span class="text-center">{{ index + 1 }}</span>
              </div>
              
              <!-- 标题 -->
              <div class="flex-grow truncate mr-2">
                {{ item.title }}
              </div>
              
              <!-- 浏览量 -->
              <div class="flex items-center text-sm text-base-content/70 shrink-0">
                <i class="ri-eye-line mr-1"></i>
                <span>{{ item.meta.views }}</span>
              </div>
            </a>
          </li>
        </ul>

        <!-- 加载状态 -->
        <div v-if="isLoading && isEmpty" class="py-6 flex flex-col items-center">
          <div class="loading loading-spinner loading-md text-secondary mb-2"></div>
          <p class="text-sm text-base-content/60">加载热门文章...</p>
        </div>

        <!-- 空状态 -->
        <div v-else-if="isEmpty" class="py-6 flex flex-col items-center">
          <div class="text-4xl text-base-content/20 mb-2">
            <i class="ri-file-list-3-line"></i>
          </div>
          <p class="text-sm text-base-content/60">暂无热门文章</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onServerPrefetch,computed } from 'vue'
import { useStore } from '@/store';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useStore();
const hotArticle = ref([]);
const isLoading = ref(false);
const isEmpty = computed(() => hotArticle.value.length === 0);

const getHotArticles = async (refresh = false) => {
  isLoading.value = true;
  try {
    let res = await store.fetchHotArticles(refresh);
    hotArticle.value = res?.data || [];
    console.log(hotArticle.value);
  } catch (error) {
    console.error('获取热门文章失败', error);
  } finally {
    isLoading.value = false;
  }
}

const refreshArticles = () => {
  getHotArticles(true);
}

onServerPrefetch(async () => {
  await getHotArticles();
})

onMounted(async () => {
  await getHotArticles();
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease forwards;
  opacity: 0;
}
</style>