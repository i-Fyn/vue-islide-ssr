<template>
  <section class="p-4 card bg-base-100  shadow-sm hover:shadow-md transition-shadow duration-300  group sticky top-0" v-if="open">
    <div class="w-full overflow-hidden">
      <!-- 标题栏 带装饰效果 -->
      <div class="relative flex items-center justify-between mb-4 pb-2 border-b border-base-200">
        <div class="flex items-center gap-2">
          <span class="w-1 h-6 bg-gradient-to-b from-info to-primary rounded-full"></span>
          <h2 class="text-base font-bold text-base-content relative">
            {{ title }}
            <span class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-info to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </h2>
        </div>
      </div>
      
      <!-- 文章目录列表 -->
      <div class="post-toc mt-4">
        <ul class="space-y-0.5">
          <li 
            v-for="(item, index) in tocList" 
            :key="index"
            :class="['toc-level-' + item.level, { 'active-toc-item': activeIndex === index }]"
            :style="{animationDelay: `${index * 30}ms`}"
            class="animate-fadeIn"
          >
            <a 
              :href="'#' + item.anchor" 
              @click.prevent="scrollToHeading(item.anchor)"
              class="toc-link relative flex items-center py-2.5 px-3 rounded-full text-base-content/80 hover:bg-base-200 transition-all duration-200 text-sm"
              :class="{
                'bg-info/10 text-info font-medium': activeIndex === index,
                'bg-base-300/10 text-base-content/80 opacity-50': activeIndex !== index,
                'pl-4': item.level === 0,
                'pl-6': item.level === 1,
                'pl-8': item.level === 2
              }"
            >
            
              <!-- 标题文本 -->
              <span class="truncate">{{ item.title }}</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- 空状态 -->
      <div v-if="tocList.length === 0" class="py-6 flex flex-col items-center">
        <div class="text-4xl text-base-content/20 mb-2">
          <i class="ri-file-list-line"></i>
        </div>
        <p class="text-sm text-base-content/60">暂无目录内容</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const title = computed(() => '文章目录');
const tocList = ref([]);
const activeIndex = ref(-1);
const headings = ref([]);
let lastScrollPosition = 0;
const open = ref(false);
const throttledUpdate = ref(null);

const props = defineProps({
  postDetail: {
    type: Object,
    default: () => ({})
  }
});

const generateToc = (content) => {
  const regex = /<h([2-3])[^>]*>(.*?)<\/h\1>/gs;
  const matches = [...content.matchAll(regex)];
  if (matches.length === 0) {
    return;
  }
  open.value = true;
  tocList.value = matches.map((match, index) => ({
    level: parseInt(match[1]) - 2, // 转换为我们的层级系统 (h2->0, h3->1)
    title: match[2].replace(/<[^>]*>/g, ''),
    anchor: `toc-${index}`
  }));
};

// 获取CSS变量值
const getRootVariable = (name) => {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;
};

const updateStickyPositions = () => {
  const newHeaderHeight = getRootVariable('--top-menu-height');

  let newActiveIndex = -1;
  headings.value.forEach((heading, index) => {
    const rect = heading.getBoundingClientRect();
    if (rect.top - 60 <= newHeaderHeight) {
      newActiveIndex = index;
    }
  });

  activeIndex.value = newActiveIndex;
};

// 节流函数
const throttle = (fn, delay) => {
  return () => {
    const now = Date.now();
    if (now - lastScrollPosition > delay) {
      fn();
      lastScrollPosition = now;
    }
  };
};

// 滚动到标题
const scrollToHeading = (anchor) => {
  const target = document.getElementById(anchor);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
};

onMounted(async () => {
  if (!props.postDetail?.content?.content) return;
  
  //匹配h标签
  const regex = /<h([2-3])[^>]*>(.*?)<\/h\1>/gs;
  const matches = [...props.postDetail.content.content.matchAll(regex)];
  if (matches.length === 0) {
    return;
  }

  generateToc(props.postDetail?.content?.content);

  if (open.value) {
    // 初始化标题元素
    headings.value = tocList.value.map(item =>
      document.getElementById(item.anchor)
    ).filter(Boolean);

    // 设置滚动监听
    throttledUpdate.value = throttle(updateStickyPositions, 100);
    window.addEventListener('scroll', throttledUpdate.value, { passive: true });
    updateStickyPositions();
  }
});

onBeforeUnmount(() => {
  if (throttledUpdate.value) {
    window.removeEventListener('scroll', throttledUpdate.value);
  }
});
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.4s ease forwards;
  opacity: 0;
}

.active-toc-item a {
  transform: translateX(3px);
}
</style>