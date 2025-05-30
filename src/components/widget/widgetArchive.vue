<template>
  <section class="p-4 card bg-base-100  shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
    <div class="w-full">
      <!-- 标题栏 带装饰效果 -->
      <div class="relative flex items-center justify-between mb-4 pb-2 border-b border-base-200">
        <div class="flex items-center gap-2">
          <span class="w-1 h-6 bg-gradient-to-b from-primary to-info rounded-full"></span>
          <h2 class="text-base font-bold text-base-content relative">归档
            <span class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </h2>
        </div>
        <button class="btn btn-ghost btn-sm btn-circle text-primary" title="刷新归档" @click="refreshYears">
          <i class="ri-refresh-line" :class="{'animate-spin': isLoading}"></i>
        </button>
      </div>
      
      <!-- 归档列表 -->
      <ul class="list-none space-y-2">
        <li 
          v-for="(year, index) in years" 
          :key="year.year"
          class="archive-item"
          :class="{'animate-fadeIn': true}"
          :style="{animationDelay: `${index * 50}ms`}"
        >
          <a 
            @click.prevent="router.push({ name: 'category', query: { year: year.year } })"
            class="flex justify-between items-center py-2.5 px-4 rounded-lg bg-base-200/50 hover:bg-primary hover:text-primary-content transition-all duration-300 transform hover:scale-[1.02] cursor-pointer relative overflow-hidden group/item"
          >
            <!-- 波纹效果 -->
            <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-base-content/5 to-transparent -translate-x-full group-hover/item:translate-x-full transition-transform duration-1000"></span>
            
            <!-- 年份 -->
            <span class="font-medium flex items-center">
              <i class="ri-calendar-line mr-2"></i>
              {{ year.year }}
            </span>
            
            <!-- 计数 -->
            <span class="badge bg-base-100/80 border-0">{{ year.count }}</span>
          </a>
        </li>
      </ul>

      <!-- 加载状态 -->
      <div v-if="isLoading && !years.length" class="py-6 flex flex-col items-center">
        <div class="loading loading-spinner loading-md text-primary mb-2"></div>
        <p class="text-sm text-base-content/60">加载归档数据...</p>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!years.length" class="py-6 flex flex-col items-center">
        <div class="text-4xl text-base-content/20 mb-2">
          <i class="ri-archive-line"></i>
        </div>
        <p class="text-sm text-base-content/60">暂无归档数据</p>
      </div>
    </div>
  </section>
  </template>
  
  <script setup>
import { ref, onMounted, onServerPrefetch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import axios from '@/dist/axios';
  
  const router = useRouter();
  const route = useRoute();
  const years = ref([]);
const isLoading = ref(false);
  
  const getYearArchive = async () => {
  isLoading.value = true;
    try {
      let res = await axios.post('/post-years');
      years.value = res.data;
    } catch (error) {
    console.error('获取归档数据失败', error);
  } finally {
    isLoading.value = false;
    }
  };

const refreshYears = () => {
  getYearArchive();
};
  
  onMounted(getYearArchive);
  onServerPrefetch(getYearArchive);
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
