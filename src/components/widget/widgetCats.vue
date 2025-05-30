<template>
  <section class="p-4 card bg-base-100  shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
    <div class="w-full">
      <!-- 标题栏 带装饰效果 -->
      <div class="relative flex items-center justify-between mb-4 pb-2 border-b border-base-200">
        <div class="flex items-center gap-2">
          <span class="w-1 h-6 bg-gradient-to-b from-info to-secondary rounded-full"></span>
          <h2 class="text-base font-bold text-base-content relative">分类目录
            <span
              class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-info to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </h2>
        </div>
        <button class="btn btn-ghost btn-sm btn-circle text-info" title="刷新分类" @click="refreshCats">
          <i class="ri-refresh-line" :class="{ 'animate-spin': isLoading }"></i>
        </button>
      </div>

      <!-- 分类网格 -->
      <div class="grid grid-cols-3 gap-3">
        <router-link to="/category"
          class="flex flex-col items-center justify-center p-3 rounded-lg bg-base-200/50 hover:bg-info hover:text-info-content transition-all duration-300 transform hover:scale-105 hover:shadow-md cursor-pointer relative overflow-hidden group/cat">

          <!-- 波纹效果 -->
          <span
            class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-base-content/5 to-transparent -translate-x-full group-hover/cat:translate-x-full transition-transform duration-1000"></span>

          <!-- 图标 -->
          <div class="mb-1 text-lg">
            <i class="ri-folder-fill"></i>
          </div>

          <!-- 分类名和计数 -->
          <span class="text-sm font-medium mb-0.5 truncate max-w-full">全部</span>
          <span class="badge badge-sm bg-base-100/80 border-0 text-xs">-</span>

        </router-link>
        <a v-for="(cat, index) in cats" :key="cat.id"
          @click.prevent="router.push({ name: 'categories', params: { cat_id: cat.id } })"
          class="flex flex-col items-center justify-center p-3 rounded-lg bg-base-200/50 hover:bg-info hover:text-info-content transition-all duration-300 transform hover:scale-105 hover:shadow-md cursor-pointer relative overflow-hidden group/cat"
          :class="{ 'animate-fadeIn': true }" :style="{ animationDelay: `${index * 50}ms` }">
          <!-- 波纹效果 -->
          <span
            class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-base-content/5 to-transparent -translate-x-full group-hover/cat:translate-x-full transition-transform duration-1000"></span>

          <!-- 图标 -->
          <div class="mb-1 text-lg">
            <i class="ri-folder-fill"></i>
          </div>

          <!-- 分类名和计数 -->
          <span class="text-sm font-medium mb-0.5 truncate max-w-full">{{ cat.name }}</span>
          <span class="badge badge-sm bg-base-100/80 border-0 text-xs">{{ cat.count || 0 }}</span>
        </a>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading && !cats.length" class="py-6 flex flex-col items-center">
        <div class="loading loading-spinner loading-md text-info mb-2"></div>
        <p class="text-sm text-base-content/60">加载分类数据...</p>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!cats.length" class="py-6 flex flex-col items-center">
        <div class="text-4xl text-base-content/20 mb-2">
          <i class="ri-folder-2-line"></i>
        </div>
        <p class="text-sm text-base-content/60">暂无分类数据</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
const cats = ref(store.config.tax?.cats || []);
const isLoading = ref(false);

// 从API获取更新的分类数据
const refreshCats = async () => {
  isLoading.value = true;
  try {
    // 假设这里可以调用API获取最新分类数据
    // 目前直接从store获取
    cats.value = store.config.tax?.cats || [];
    // 如果有实际API调用，可以添加延时模拟
    await new Promise(resolve => setTimeout(resolve, 500));
  } catch (error) {
    console.error('获取分类数据失败', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  refreshCats();
});
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