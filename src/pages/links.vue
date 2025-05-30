<template>
  <div class='single-page min-h-screen'>
    <div class="wrapper pb-10">
      <!-- 页面头部 - 搜索和导航 -->
      <div class="page-header pt-8 pb-4">
        <div class="container mx-auto px-4">
          <div class="text-center max-w-4xl mx-auto">
            <h1 class="text-2xl md:text-3xl font-bold mb-4 flex items-center justify-center">
              <i class="ri-rss-line mr-2 text-primary"></i>
              RSS动态聚合
            </h1>
            
            <!-- 切换按钮 -->
            <div class="tabs tabs-boxed bg-base-200/50 inline-flex mb-4">
              <a 
                class="tab tab-sm"
                :class="{'tab-active': activeTab === 'rss'}"
                @click="switchTab('rss')"
              >
                <i class="ri-rss-line mr-1"></i> 动态
              </a>
              <a 
                class="tab tab-sm"
                :class="{'tab-active': activeTab === 'links'}"
                @click="switchTab('links')"
              >
                <i class="ri-links-line mr-1"></i> 友链
              </a>
            </div>
            
            <!-- 搜索框 -->
            <div class="search-form max-w-xl mx-auto mb-6">
              <div class="flex bg-base-100 rounded-full shadow-sm overflow-hidden border border-base-300">
                <input 
                  v-model="searchQuery" 
                  class="px-4 py-2 flex-1 focus:outline-none bg-transparent" 
                  :placeholder="activeTab === 'rss' ? '搜索动态内容...' : '搜索友链...'" 
                  @input="filterLinks"
                />
                <button 
                  class="px-5 btn btn-primary text-primary-content hover:bg-primary-focus transition-colors duration-200"
                  @click="filterLinks"
                >
                  <i class="ri-search-line"></i>
                </button>
              </div>
            </div>
            
            <!-- 分类导航标签 (仅在友链模式显示) -->
            <div v-if="activeTab === 'links'" class="nav-tabs overflow-x-auto pb-2">
              <div class="flex gap-1 justify-center min-w-max text-sm">
                <button 
                  @click="changeCat('all')"
                  class="btn nav-tab py-1 px-3 rounded-full transition-all whitespace-nowrap btn-sm"
                  :class="current_cat === 'all' ? 'btn-primary text-primary-content' : 'btn-base-200 hover:bg-base-300'"
                >
                  全部
                  <span class="badge badge-sm ml-1 bg-base-100 text-base-content">{{ links_sum }}</span>
                </button>
                <button 
                  v-for="item in page_links" 
                  :key="item.category_id"
                  @click="changeCat(item.category_id)"
                  class="btn nav-tab py-1 px-3 rounded-full transition-all whitespace-nowrap btn-sm"
                  :class="current_cat === item.category_id ? 'btn-primary text-primary-content' : 'btn-base-200 hover:bg-base-300'"
                >
                  {{ item.category_name }}
                  <span class="badge badge-sm ml-1 bg-base-100 text-base-content">{{ item.links.length }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RSS朋友动态内容区 -->
      <div class="container mx-auto my-6 px-0 sm:px-4 overflow-hidden">
        <!-- RSS动态面板 -->
        <div v-if="activeTab === 'rss'" class="mb-6 px-4">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold text-base-content flex items-center">
              <span class="w-1 h-5 bg-primary rounded-full mr-2 inline-block"></span>
              最新动态
              <span class="text-xs text-base-content/60 ml-2 font-normal">博客更新</span>
            </h2>
            
            <!-- 搜索结果显示 -->
            <div v-if="searchQuery" class="text-sm text-base-content/70">
              找到 {{ friendRss.length }} 条结果
              <button @click="clearSearch" class="text-primary hover:text-primary-focus ml-1">
                <i class="ri-close-circle-line"></i>
              </button>
            </div>
          </div>
          
          <!-- RSS文章列表 -->
          <div v-if="friendRss.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <a v-for="(item, index) in friendRss" 
              :key="index" 
              :href="item.link" 
              @click.prevent.stop="previewSite(item)"
              target="_blank"
              class="bg-base-100 border border-base-200 card p-3 shadow-sm transition-all hover:border-primary/30 flex flex-col"
              :data-aos="index % 2 === 0 ? 'fade-up' : 'fade-up'"
              :data-aos-delay="index * 50"
            >
              <div class="font-medium text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
                {{ item.title }}
              </div>
              <div class="text-xs text-base-content/70 flex-grow mb-3 line-clamp-2 overflow-hidden">
                {{ item.desc || '暂无描述' }}
              </div>
              <div class="flex items-center justify-between mt-auto pt-4 border-t border-base-200">
                <div class="flex items-center">
                  <span class="text-sm font-medium">{{ item.author }}</span>
                </div>
                <div class="text-xs text-base-content/60">
                  {{ item.date }}
                </div>
              </div>
            </a>
          </div>
          
          <!-- 无搜索结果显示 -->
          <div v-else-if="searchQuery && friendRss.length === 0" class="py-16 text-center">
            <div class="inline-flex mx-auto bg-base-200 rounded-full p-4 mb-4">
              <i class="ri-search-line text-4xl text-base-content/30"></i>
            </div>
            <h3 class="text-xl font-medium text-base-content mb-2">未找到相关动态</h3>
            <p class="text-base-content/70 max-w-md mx-auto mb-6">
              没有找到与"{{ searchQuery }}"相关的动态内容，请尝试其他关键词
            </p>
            <div class="flex justify-center">
              <button 
                @click="clearSearch" 
                class="btn btn-outline btn-sm gap-2"
              >
                <i class="ri-refresh-line"></i>
                清除搜索
              </button>
            </div>
          </div>
          
          <!-- 加载状态 -->
          <div v-else-if="loading" class="my-8 text-center">
            <div class="loading loading-spinner loading-md text-primary"></div>
            <p class="mt-2 text-sm text-base-content/70">加载文章中...</p>
          </div>
          
          <!-- 分页导航 -->
          <div v-if="friendRss.length > 0" class="mt-6 pagenavn json-nav">
            <PageNav ref="jsonPageNav" :paged="paged" :pages="pages" navtype="json" type="auto" :api="api"
              :param="param" @change="change" />
          </div>
        </div>
        
        <!-- 友链面板 -->
        <div v-if="activeTab === 'links'">
          <!-- 友链分类展示 -->
          <div v-if="!searchQuery && current_cat === 'all'" class="space-y-10">
            <!-- 每个分类块 -->
            <div v-for="category in page_links" :key="category.category_id" class="category-block last:mb-4">
              <div class="category-header mb-3 border-b border-base-200 pb-2 px-4">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-bold text-base-content flex items-center">
                    <span class="w-1 h-5 bg-primary rounded-full mr-2 inline-block"></span>
                    {{ category.category_name }}
                    <span class="text-xs text-base-content/60 ml-2 font-normal">{{ category.links.length }}个站点</span>
                  </h3>
                  <a @click="changeCat(category.category_id)" class="text-sm text-primary hover:text-primary-focus cursor-pointer">
                    查看全部 <i class="ri-arrow-right-line"></i>
                  </a>
                </div>
              </div>
              
              <!-- 分类下的链接网格 -->
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-2 sm:px-4">
                <a 
                  v-for="(link, linkIndex) in category.links.slice(0, 8)" 
                  :key="linkIndex"
                  :href="link.url" 
                  target="_blank" 
                  rel="noopener nofollow" 
                  class="link-card bg-base-100 border border-base-200 card shadow-sm p-3 hover:border-primary transition-all duration-200 group"
                  :data-aos="linkIndex % 2 === 0 ? 'fade-up' : 'fade-up'"
                  :data-aos-delay="linkIndex * 50"
                >
                  <div class="link-header flex items-center gap-2 mb-1.5">
                    <div class="avatar">
                      <div class="w-8 h-8 rounded overflow-hidden bg-base-200 border border-base-300">
                        <van-image 
                          lazy-load 
                          class="w-full h-full object-cover" 
                          :src="link.logo" 
                          :alt="link.name" 
                        />
                      </div>
                    </div>
                    <h4 class="font-medium text-base-content truncate text-sm group-hover:text-primary transition-colors duration-200">
                      {{ link.name }}
                    </h4>
                  </div>
                  <div class="text-xs text-base-content/70 overflow-hidden text-ellipsis" style="word-break: break-word; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical;">
                    {{ link.desc }}
                  </div>
                  <!-- 添加预览按钮 -->
                  <div class="preview-btn absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      @click.prevent.stop="previewSite(link)"
                      class="p-1 hover:text-primary" 
                      title="预览网站"
                    >
                      <i class="ri-eye-line text-sm"></i>
                    </button>
                  </div>
                </a>
                
                <!-- 查看更多按钮 -->
                <a 
                  v-if="category.links.length > 8"
                  @click="changeCat(category.category_id)" 
                  class="link-card bg-base-100 border border-base-200 card shadow-sm p-3 flex flex-col items-center justify-center hover:border-primary transition-all duration-200 cursor-pointer"
                >
                  <div class="mb-1 text-base-content/50">
                    <i class="ri-more-line text-xl"></i>
                  </div>
                  <div class="text-xs text-primary">查看全部</div>
                </a>
              </div>
            </div>
          </div>
          
          <!-- 搜索结果或单类别显示 -->
          <div v-else-if="activeTab === 'links' && (searchQuery || current_cat !== 'all')" class="px-4">
            <h3 v-if="current_cat !== 'all' && !searchQuery" class="text-lg font-bold text-base-content flex items-center mb-4">
              <span class="w-1 h-5 bg-primary rounded-full mr-2 inline-block"></span>
              {{ current_catName }}
              <span class="text-xs text-base-content/60 ml-2 font-normal">{{ displayedLinks.length }}个站点</span>
            </h3>
            
            <div v-if="searchQuery" class="bg-base-200/30 py-2 px-4 rounded-lg mb-4">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="text-sm">
                  <span class="font-medium">搜索:</span> "{{ searchQuery }}" 
                  <button @click="clearSearch" class="text-primary hover:text-primary-focus ml-1">
                    <i class="ri-close-circle-line"></i>
                  </button>
                </div>
                <div class="text-sm text-base-content/70">
                  找到 {{ displayedLinks.length }} 个结果
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <a 
                v-for="(link, linkIndex) in displayedLinks" 
                :key="linkIndex"
                :href="link.url" 
                target="_blank" 
                rel="noopener nofollow" 
                class="link-card bg-base-100 border border-base-200 card shadow-sm p-3 hover:border-primary transition-all duration-200 group"
                :data-aos="linkIndex % 2 === 0 ? 'fade-up' : 'fade-up'"
                :data-aos-delay="linkIndex * 50"
              >
                <div class="link-header flex items-center gap-2 mb-1.5">
                  <div class="avatar">
                    <div class="w-8 h-8 rounded overflow-hidden bg-base-200 border border-base-300">
                      <van-image 
                        lazy-load 
                        class="w-full h-full object-cover" 
                        :src="link.logo" 
                        :alt="link.name" 
                      />
                    </div>
                  </div>
                  <h4 class="font-medium text-base-content truncate text-sm group-hover:text-primary transition-colors duration-200">
                    {{ link.name }}
                  </h4>
                </div>
                <div class="text-xs text-base-content/70 overflow-hidden text-ellipsis" style="word-break: break-word; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical;">
                  {{ link.desc }}
                </div>
                <!-- 添加预览按钮 -->
                <div class="preview-btn absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    @click.prevent.stop="previewSite(link)"
                    class="p-1 hover:text-primary" 
                    title="预览网站"
                  >
                    <i class="ri-eye-line text-sm"></i>
                  </button>
                </div>
              </a>
            </div>
          </div>
          
          <!-- 空状态 -->
          <div v-if="!displayedLinks.length && !loading && searchQuery" class="py-16 text-center">
            <div class="inline-flex mx-auto bg-base-200 rounded-full p-4 mb-4">
              <i class="ri-link-m text-4xl text-base-content/30"></i>
            </div>
            <h3 class="text-xl font-medium text-base-content mb-2">暂无友链</h3>
            <p class="text-base-content/70 max-w-md mx-auto mb-6">
              {{ searchQuery ? '没有找到匹配的友链，请尝试其他关键词' : '当前分类还没有添加任何友情链接，不如来添加第一个？' }}
            </p>
            <div class="flex justify-center gap-3">
              <button 
                v-if="searchQuery || current_cat !== 'all'"
                @click="clearFilters" 
                class="btn btn-outline btn-sm gap-2"
              >
                <i class="ri-refresh-line"></i>
                重置筛选
              </button>
              <button 
                @click="router.push('/link-register')" 
                class="btn btn-primary btn-sm gap-2"
              >
                <i class="ri-add-line"></i>
                申请友链
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 申请友链区域 -->
      <div v-if="activeTab === 'links'" class="apply-link-section bg-base-200/50 py-8 mt-8">
        <div class="container mx-auto px-4">
          <div class="max-w-2xl mx-auto text-center">
            <h3 class="text-xl font-bold mb-2">申请友链</h3>
            <p class="text-base-content/70 mb-6 text-sm">
              与志同道合的伙伴建立连接，打开通往更广阔世界的大门。
            </p>
            <div class="flex justify-center">
              <button 
                @click="router.push('/link-register')"
                class="btn btn-primary rounded-full"
              >
                <i class="ri-add-line mr-1"></i>
                立即申请
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 底部页面导航 -->
      <div class="fixed bottom-8 right-8 z-50">
        <div class="flex flex-col gap-2">
          <button 
            v-if="scrollPosition > 300"
            @click="scrollToTop"
            class="btn btn-circle btn-sm bg-base-100 shadow-md hover:bg-base-200"
            title="回到顶部"
          >
            <i class="ri-arrow-up-line"></i>
          </button>
          <button 
            @click="toggleSortMenu"
            class="btn btn-circle btn-sm bg-base-100 shadow-md hover:bg-base-200"
            title="排序方式"
          >
            <i class="ri-order-play-line"></i>
          </button>
        </div>
      </div>
      
      <!-- 排序菜单 -->
      <div 
        v-if="sortMenuVisible"
        class="fixed bottom-8 right-20 z-50 bg-base-100 rounded-lg shadow-lg border border-base-200 p-2 animate-fadeIn"
      >
        <div class="text-xs font-medium mb-1 px-2">排序方式</div>
        <div class="sort-options flex flex-col gap-1">
          <button 
            @click="sortLinks('name')" 
            class="px-3 py-1.5 rounded-md text-start text-sm flex items-center gap-2"
            :class="sortBy === 'name' ? 'bg-primary/10 text-primary' : 'hover:bg-base-200'"
          >
            <i class="ri-sort-alphabet-asc-line"></i> 按名称
          </button>
          <button 
            @click="sortLinks('date')" 
            class="px-3 py-1.5 rounded-md text-start text-sm flex items-center gap-2"
            :class="sortBy === 'date' ? 'bg-primary/10 text-primary' : 'hover:bg-base-200'"
          >
            <i class="ri-time-line"></i> 最新更新
          </button>
          <button 
            @click="sortLinks('random')" 
            class="px-3 py-1.5 rounded-md text-start text-sm flex items-center gap-2"
            :class="sortBy === 'random' ? 'bg-primary/10 text-primary' : 'hover:bg-base-200'"
          >
            <i class="ri-shuffle-line"></i> 随机显示
          </button>
        </div>
      </div>
    </div>
    
    <!-- 网站预览弹窗 -->
    <div v-if="previewVisible" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" @click.self="closePreview">
      <div class="bg-base-100 rounded-xl shadow-xl w-full max-w-4xl overflow-hidden animate-zoom-in border border-base-300 relative">
        <!-- 模拟浏览器标题栏 -->
        <div class="p-3 flex justify-between items-center border-b border-base-200 bg-gradient-to-r from-base-200/50 to-base-100/50">
          <div class="flex items-center gap-3">
            <div class="flex space-x-1.5">
              <div class="w-3 h-3 rounded-full bg-error"></div>
              <div class="w-3 h-3 rounded-full bg-warning"></div>
              <div class="w-3 h-3 rounded-full bg-success"></div>
            </div>
            <div class="flex items-center bg-base-200/50 rounded-full px-3 py-1 text-sm max-w-md truncate">
              <div class="avatar mr-2">
                <div class="w-4 h-4 rounded-full overflow-hidden bg-base-300">
                  <van-image lazy-load class="w-full h-full object-cover" :src="previewSiteData.logo || previewSiteData.source.logo" />
                </div>
              </div>
              <span class="truncate font-medium">{{ previewSiteData.name || previewSiteData.source.name }}</span>
              <span class="mx-1 text-base-content/30">|</span>
              <span class="text-xs text-base-content/70 truncate">{{ previewSiteData.url || previewSiteData.source.url }}</span>
            </div>
          </div>
          <button class="btn btn-sm btn-circle btn-ghost" @click="closePreview">
            <i class="ri-close-line"></i>
          </button>
        </div>
        
        <div class="relative overflow-hidden" style="height: 60vh;">
          <!-- 更精美的加载指示器 -->
          <div class="absolute inset-0 flex flex-col items-center justify-center bg-base-200 z-10" v-if="previewLoading">
            <div class="loading loading-spinner loading-lg text-primary mb-2"></div>
            <p class="text-sm text-base-content/70 animate-pulse">加载网站预览中...</p>
          </div>
          
          <iframe 
            v-show="!previewLoading" 
            :src="activeTab === 'links' ? previewSiteData.url : previewSiteData.link" 
            class="w-full h-full border-none" 
            @load="previewLoading = false"
          ></iframe>
        </div>
        
        <div class="p-4 flex justify-between border-t border-base-200 bg-gradient-to-r from-base-100 to-base-200/30">
          <div>
            <p class="text-sm text-base-content/80">{{ activeTab === 'links' ? previewSiteData.desc : previewSiteData.title }}</p>
          </div>
          <a 
            :href="activeTab === 'links' ? previewSiteData.url : previewSiteData.link" 
            target="_blank" 
            rel="noopener nofollow" 
            class="btn btn-primary btn-sm"
          >
            访问网站 <i class="ri-external-link-line"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onServerPrefetch, nextTick, onBeforeUnmount, watch } from 'vue';
import { useStore } from '@/store';
import { useHead } from '@unhead/vue';
import { useRouter } from 'vue-router';
import PageNav from '../components/footer/PageNav.vue';

const store = useStore();
const router = useRouter();

// 数据状态
const page_links = ref([]);
const allLinks = ref([]); // 存储所有链接
const current_cat = ref('all'); // 默认显示全部
const links_sum = ref(0);
const linksList = ref([]);
const filteredLinks = ref([]);
const friendRss = ref([]);
const allRss = ref([]); // 存储所有RSS原始数据，用于搜索恢复
const displayedLinks = computed(() => filteredLinks.value);
const searchQuery = ref('');
const sortBy = ref('name'); // 默认排序方式
const loading = ref(false);
const locked = ref(false);
const scrollPosition = ref(0);
const sortMenuVisible = ref(false);
const api = ref('getFriendsArticles');
const paged = ref(1);
const pages = ref(1);
const param = ref({
  size: 15,
})
const jsonPageNav = ref(null);

// 添加页面标签控制
const activeTab = ref('rss'); // 默认显示RSS动态，不显示友链

// 切换标签
const switchTab = (tab) => {
  activeTab.value = tab;
  // 清除搜索和筛选
  if (searchQuery.value) {
    clearSearch();
  }
};

// 预览弹窗状态
const previewVisible = ref(false);
const previewSiteData = ref({});
const previewLoading = ref(false);

// 计算当前分类名称
const current_catName = computed(() => {
  if (current_cat.value === 'all') return '全部';
  return page_links.value.find(item => item.category_id === current_cat.value)?.category_name || '全部';
});

const getFriendRss = async () => {
  try {
    loading.value = true;
    const res = await store.fetchApiPostData(api.value,Object.assign(param.value,{
      paged: paged.value,
    }));
    change(res);
    loading.value = false;
  } catch (error) {
    loading.value = false;
    console.error('获取RSS数据失败', error);
  }
};

const change = (post) => {
  paged.value = post.paged;
  pages.value = post.pages;
  console.log(post);
  friendRss.value.push(...post.data);
  allRss.value.push(...post.data); // 同时保存到原始数据
}

// 获取页面数据
const getPageInfo = async () => {
  try {
    if (locked.value) return;
    locked.value = true;
    loading.value = true;
    
    let res = await store.fetchPageLinks();
    page_links.value = res.data;
    
    if (res.data && res.data.length > 0) {
      // 合并所有分类下的链接
      allLinks.value = res.data.reduce((acc, cat) => {
        if (cat.links && Array.isArray(cat.links)) {
          return [...acc, ...cat.links];
        }
        return acc;
      }, []);
      
      // 应用初始过滤和排序
      filterAndSortLinks();
    }
    
    links_sum.value = res.data.reduce((acc, cur) => acc + cur.links.length, 0);
    
    loading.value = false;
    locked.value = false;
  } catch (error) {
    console.error('获取友链数据失败', error);
    loading.value = false;
    locked.value = false;
  }
};

// 切换分类
const changeCat = (id) => {
  current_cat.value = id;
  filterAndSortLinks();
};

// 搜索过滤 - 根据当前标签选择相应的过滤方法
const filterLinks = () => {
  if (activeTab.value === 'links') {
    filterAndSortLinks();
  } else {
    filterRssContent();
  }
};

// 过滤RSS内容
const filterRssContent = () => {
  if (!searchQuery.value) {
    // 如果没有搜索词，恢复原始数据
    friendRss.value = [...allRss.value];
    return;
  }
  
  const query = searchQuery.value.toLowerCase();
  friendRss.value = allRss.value.filter(item => 
    (item.title && item.title.toLowerCase().includes(query)) || 
    (item.desc && item.desc.toLowerCase().includes(query)) || 
    (item.author && item.author.toLowerCase().includes(query)) ||
    (item.content && item.content.toLowerCase().includes(query))
  );
};

// 排序链接
const sortLinks = (type) => {
  sortBy.value = type;
  sortMenuVisible.value = false;
  if (activeTab.value === 'links') {
    filterAndSortLinks();
  }
};

// 切换排序菜单
const toggleSortMenu = () => {
  sortMenuVisible.value = !sortMenuVisible.value;
};

// 过滤和排序链接
const filterAndSortLinks = () => {
  // 先根据分类过滤
  let result = [];
  
  if (current_cat.value === 'all') {
    result = [...allLinks.value];
  } else {
    const category = page_links.value.find(item => item.category_id === current_cat.value);
    result = category ? [...(category.links || [])] : [];
  }
  
  // 再根据搜索词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(item => 
      (item.name && item.name.toLowerCase().includes(query)) || 
      (item.desc && item.desc.toLowerCase().includes(query)) ||
      (item.url && item.url.toLowerCase().includes(query))
    );
  }
  
  // 最后排序
  switch (sortBy.value) {
    case 'name':
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      break;
    case 'date':
      // 假设有更新日期字段，如果没有可以根据实际情况调整
      result.sort((a, b) => {
        const aDate = a.rssPosts && a.rssPosts.length ? new Date(a.rssPosts[0].date || 0) : new Date(0);
        const bDate = b.rssPosts && b.rssPosts.length ? new Date(b.rssPosts[0].date || 0) : new Date(0);
        return bDate - aDate; // 降序，最新的在前
      });
      break;
    case 'random':
      result = shuffleArray([...result]);
      break;
  }
  
  // 设置结果
  filteredLinks.value = result;
};

// 洗牌算法
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// 清除搜索
const clearSearch = () => {
  searchQuery.value = '';
  if (activeTab.value === 'links') {
    filterAndSortLinks();
  } else {
    friendRss.value = [...allRss.value];
  }
};

// 清除所有筛选
const clearFilters = () => {
  searchQuery.value = '';
  current_cat.value = 'all';
  sortBy.value = 'name';
  
  if (activeTab.value === 'links') {
    filterAndSortLinks();
  } else {
    friendRss.value = [...allRss.value];
  }
};

// 预览网站
const previewSite = (site) => {
  previewSiteData.value = site;
  previewLoading.value = true;
  previewVisible.value = true;
};

// 关闭预览
const closePreview = () => {
  previewVisible.value = false;
};

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 监听滚动位置
const handleScroll = () => {
  scrollPosition.value = window.scrollY;
};

// 点击其他区域关闭排序菜单
const handleClickOutside = (event) => {
  if (sortMenuVisible.value) {
    const sortButton = document.querySelector('[title="排序方式"]');
    const sortMenu = document.querySelector('.sort-options').parentElement;
    
    if (sortButton && sortMenu && !sortButton.contains(event.target) && !sortMenu.contains(event.target)) {
      sortMenuVisible.value = false;
    }
  }
};

// 监听搜索查询变化
watch(searchQuery, () => {
  filterLinks();
});

// 监听标签变化
watch(activeTab, () => {
  // 切换标签时重置搜索结果
  if (searchQuery.value) {
    clearSearch();
  }
});

// 页面元数据
useHead({
  title: 'RSS动态聚合',
  meta: [
    { name: 'description', content: '浏览朋友们的最新博客动态和友情链接' }
  ]
});

// 生命周期钩子
onMounted(async () => {
  store.center_title = 'RSS动态聚合';
  await getFriendRss();
  await getPageInfo();
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('click', handleClickOutside);
  
  // 保存初始RSS数据
  allRss.value = [...friendRss.value];
  
  // 尝试导入 AOS 动画库
  try {
    const AOS = await import('aos');
    if (AOS.default) {
      AOS.default.init({
        duration: 800,
        once: true
      });
    }
  } catch (error) {
    console.log('AOS animation library not available');
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('click', handleClickOutside);
});

onServerPrefetch(async () => {
  await getPageInfo();
  await getFriendRss();
});
</script>

<style scoped>
.animate-fadeIn {
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

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

.link-list-enter-active,
.link-list-leave-active {
  transition: all 0.3s ease;
}

.link-list-enter-from,
.link-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.link-list-move {
  transition: transform 0.5s ease;
}

@keyframes zoom-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-zoom-in {
  animation: zoom-in 0.3s ease-out forwards;
}

/* 美化滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: var(--b3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: var(--p);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--pf);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: repeat(1, 1fr) !important;
  }
}

.link-card {
  position: relative;
}

.preview-btn {
  z-index: 10;
}
</style>