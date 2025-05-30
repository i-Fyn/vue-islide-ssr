<template>
  <div class="relative w-full h-full bg-base-100">
    <div class="drawer-content flex flex-col h-full overflow-hidden">
      <!-- 网站数据统计 -->
      <section class="p-4 card bg-base-100 shadow-sm border-b border-base-200 group">
        <div class="relative flex items-center justify-between pb-2 mb-3 border-b border-base-200">
          <div class="flex items-center gap-2">
            <span class="w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full"></span>
            <h2 class="text-base font-bold text-base-content relative ">站点数据
              <span class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </h2>
          </div>
        </div>
        
        <div class="stats scrollbar-none w-full bg-base-200/50 shadow-sm">
          <div v-for="(item, index) in siteData" :key="index" 
            class="stat group hover:bg-base-200 transition-colors duration-300 cursor-pointer"
            @click="go(item.link)">
            <div class="stat-figure text-primary opacity-70 group-hover:opacity-100 transition-opacity">
              <i :class="`ri-${item.icon} text-xl`"></i>
            </div>
            <div class="stat-title text-xs">{{ item.title }}</div>
            <div class="stat-value text-primary text-xl">{{ item.count }}</div>
          </div>
        </div>
      </section>

      <!-- 频道菜单 -->
      <div class="scroll-y flex-1 overflow-auto">
        <section class="p-4 card bg-base-100 shadow-inner group">
          <div class="relative flex items-center justify-between pb-2 mb-3 border-b border-base-200">
            <div class="flex items-center gap-2">
              <span class="w-1 h-6 bg-gradient-to-b from-secondary to-accent rounded-full"></span>
              <h2 class="text-base font-bold text-base-content relative">频道菜单
                <span class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-secondary to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </h2>
            </div>
          </div>
          
          <div v-for="(menu, menuIndex) in config.menu['channel-menu']" :key="menu.id" 
            class="collapse collapse-arrow bg-base-200/50 mb-2 rounded-box border border-base-200/50 hover:border-base-300 transition-all duration-300">
            <input type="checkbox" class="peer" :checked="menuIndex === 0" /> 
            <div class="collapse-title font-medium flex items-center gap-2">
              <i :class="`ri-${getMenuIcon(menu.title)} text-secondary`"></i>
              <span v-html="menu.title"></span>
            </div>
            <div class="collapse-content">
              <ul class="menu menu-compact">
                <li v-for="(child, childIndex) in menu.children" :key="child.id"
                  class="transform hover:translate-x-1 transition-transform duration-200">
                  <a @click.prevent="go(child.url)" 
                    class="flex items-center gap-2 my-1 hover:bg-primary/10 active:bg-primary/20 rounded-lg">
                    <i :class="`ri-${getChildIcon(child.title, childIndex)} text-sm opacity-70`"></i>
                    <span v-html="child.title"></span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- 标签云 -->
        <section class="p-4 card bg-base-100 shadow-inner border-t border-base-200 group">
          <div class="relative flex items-center justify-between pb-2 mb-3 border-b border-base-200">
            <div class="flex items-center gap-2">
              <span class="w-1 h-6 bg-gradient-to-b from-accent to-info rounded-full"></span>
              <h2 class="text-base font-bold text-base-content relative">热门标签
                <span class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </h2>
            </div>
          </div>
          
          <div class="flex flex-wrap gap-2">
            <a v-for="(tag, index) in config.tax.tags" :key="tag.id"
              @click.prevent="go('/tag/' + tag.id)"
              class="relative px-3 py-1.5 rounded-full inline-flex items-center gap-1 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:shadow-md text-sm"
              :class="tagColorClasses[index % tagColorClasses.length]">
              <i class="ri-price-tag-3-line text-xs"></i>
              {{ tag.name }}
              <span class="badge badge-sm ml-1 opacity-80">{{ tag.count }}</span>
            </a>
          </div>
        </section>

        <!-- 网站信息 -->
        <section class="p-4 card bg-base-100 shadow-inner border-t border-base-200 group">
          <div class="relative flex items-center justify-between pb-2 mb-3 border-b border-base-200">
            <div class="flex items-center gap-2">
              <span class="w-1 h-6 bg-gradient-to-b from-info to-success rounded-full"></span>
              <h2 class="text-base font-bold text-base-content relative">网站信息
                <span class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-info to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </h2>
            </div>
          </div>
          
          <div class="flex items-center gap-2 justify-between bg-base-200/50 p-3 rounded-box">
            <span class="flex items-center gap-2"><i class="ri-file-word-fill text-success"></i>全站字数:</span>
            <span class="font-bold text-success">{{ totalWordCount }}</span>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>


<script setup>
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import { watch, ref, computed, onMounted } from 'vue';

const emit = defineEmits(['close-modal']);
const store = useStore();

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

const siteData = ref([
  { title: "文章", count: 0, link: "/archives/", icon: "article-line" },
  { title: "标签", count: store.config.tax.tags.length, link: "/tags/", icon: "price-tag-3-line" },
  { title: "分类", count: store.config.tax.cats.length, link: "/categories/", icon: "folders-line" },
  { title: "评论", count: 0, link: "/recentcomments/", icon: "chat-3-line" },
])

const totalWordCount = ref(0); // 全站字数
const router = useRouter();

const config = computed(() => {
  return store.config;
})

// 根据菜单标题获取图标
const getMenuIcon = (title) => {
  const iconMap = {
    '首页': 'home-line',
    '文章': 'article-line',
    '分类': 'folders-line',
    '标签': 'price-tag-3-line',
    '关于': 'information-line',
    '专题': 'bookmark-line',
    '站点': 'global-line',
    '动态': 'chat-quote-line',
    '友链': 'links-line'
  };
  
  for (const key in iconMap) {
    if (title.includes(key)) return iconMap[key];
  }
  
  return 'menu-line';
};

// 为子菜单项获取图标
const getChildIcon = (title, index) => {
  const iconMap = {
    '首页': 'home-line',
    '文章': 'article-line',
    '分类': 'folders-line',
    '标签': 'price-tag-3-line',
    '关于': 'information-line',
    '专题': 'bookmark-line',
    '动态': 'chat-quote-line',
    '归档': 'archive-line',
    '友链': 'links-line'
  };
  
  for (const key in iconMap) {
    if (title.includes(key)) return iconMap[key];
  }
  
  // 默认图标根据索引不同
  const defaultIcons = ['arrow-right-s-line', 'apps-line', 'file-list-line', 'menu-line'];
  return defaultIcons[index % defaultIcons.length];
};

const go = (path) => {
  emit('close-modal');
  router.push(path);
}

onMounted(() => {
  store.fetchSiteStats().then((res) => {
    siteData.value[0].count = res.total_posts;
    siteData.value[3].count = res.total_comments;
    totalWordCount.value = res.total_words || 0;
  }).catch((err) => {
    console.error(err);
  })
})
</script>

<style scoped>
.scroll-y {
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.2) transparent;
}

.scroll-y::-webkit-scrollbar {
  width: 4px;
}

.scroll-y::-webkit-scrollbar-track {
  background: transparent;
}

.scroll-y::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.1);
  border-radius: 3px;
}

.scroll-y::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0,0,0,0.2);
}
</style>