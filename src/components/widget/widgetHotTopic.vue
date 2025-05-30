<template>
    <section class="p-4 card bg-base-100  shadow-sm hover:shadow-md transition-shadow duration-300">
        <div class="w-full">
            <!-- 标题栏 带下划线和图标 -->
            <div class="flex items-center justify-between mb-4 group">
                <div class="flex items-center gap-2">
                    <i class="ri-hashtag text-primary"></i>
                    <h2 class="text-base font-bold relative">
                        热门话题
                        <span class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    </h2>
                </div>
                <button class="btn btn-ghost btn-sm btn-circle" title="刷新" @click="refreshTopics">
                    <i class="ri-refresh-line" :class="{'animate-spin': isLoading}"></i>
                </button>
            </div>
            
            <!-- 加载状态 -->
            <div v-if="isLoading && !hotTopic.length" class="py-6 flex flex-col items-center">
                <div class="loading loading-spinner loading-md text-primary mb-2"></div>
                <p class="text-sm text-base-content/60">加载热门话题...</p>
            </div>
            
            <!-- 内容为空状态 -->
            <div v-else-if="!isLoading && !hotTopic.length" class="py-6 flex flex-col items-center">
                <div class="text-4xl text-base-content/20 mb-2">
                    <i class="ri-hashtag"></i>
                </div>
                <p class="text-sm text-base-content/60">暂无热门话题</p>
            </div>
            
            <!-- 话题列表 -->
            <div v-else>
                <transition-group 
                    name="topic-list" 
                    tag="ul" 
                    class="flex flex-col space-y-2"
                >
                    <li v-for="(item, index) in hotTopic" 
                        :key="item.id" 
                        class="p-2 flex items-center gap-3 justify-between rounded-lg hover:bg-base-200 transition-all duration-200 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden group"
                        :class="{'animate-fadeIn': true}"
                        :style="{animationDelay: `${index * 50}ms`}"
                        @click="navigateToTopic(item.id)"
                    >
                        <!-- 波纹效果 -->
                        <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-base-content/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                        
                        <div class="flex gap-3 items-center flex-1">
                            <!-- 话题图标容器 -->
                            <div class="relative group/icon">
                                <div class="w-10 h-10 rounded-xl text-primary-content text-xl flex items-center justify-center font-bold bg-primary shadow-sm group-hover/icon:shadow-md transition-all duration-200 group-hover/icon:scale-105">
                                    <i class="ri-hashtag"></i>
                                </div>
                                <!-- 热度排名指示器 -->
                                <div v-if="index < 3" 
                                    class="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow-sm"
                                    :class="{
                                        'bg-error text-error-content': index === 0,
                                        'bg-warning text-warning-content': index === 1,
                                        'bg-info text-info-content': index === 2,
                                    }"
                                >
                                    {{ index + 1 }}
                                </div>
                            </div>
                            
                            <div class="leading-6 text-sm flex flex-col gap-1 flex-1 min-w-0">
                                <h2 class=" text-base-content truncate group-hover:text-primary transition-colors">{{ item.name }}</h2>
                                <div class="flex flex-wrap text-xs text-base-content/60 gap-2">
                                    <div class="flex items-center gap-1">
                                        <i class="ri-fire-line text-error"></i>
                                        <span>{{ item.weight || 0 }} 热度</span>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <i class="ri-file-list-line text-primary"></i>
                                        <span>{{ item.post_count || 0 }} 动态</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 右箭头按钮 -->
                            <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <i class="ri-arrow-right-s-line text-base text-primary"></i>
                            </div>
                        </div>
                    </li>
                </transition-group>
            </div>
            
        </div>
    </section>
</template>


<script setup>
import { ref, onMounted, onServerPrefetch } from 'vue'
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
const router = useRouter();
const store = useStore();
const hotTopic = ref([]);
const isLoading = ref(false);

const getHotTopic = async (refresh = false) => {
    isLoading.value = true;
    try {
        let res = await store.fetchHotTopics(refresh);
        hotTopic.value = res;
    } catch (error) {
        console.error('获取热门话题失败', error);
    } finally {
        isLoading.value = false;
    }
}

const refreshTopics = async () => {
    await getHotTopic(true);
}

const navigateToTopic = (topicId) => {
    router.push({name:'topics', params:{topic_id: topicId}});
}

onMounted(async() => {
    await getHotTopic();
})

onServerPrefetch(async () => {
    await getHotTopic();
})

</script>

<style scoped>
/* 仅保留必要的动画定义，其余使用Tailwind类 */
.topic-list-enter-active,
.topic-list-leave-active {
  transition: all 0.3s ease;
}

.topic-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.topic-list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
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