<template>
  <div class="search-entry bg-base-100 h-full">
    <div class="search-dialog w-full max-w-3xl mx-auto rounded-box">
      <!-- 搜索标题 -->
      <div class="search-dialog-header  px-4 py-3 flex items-center justify-between">
        <h3 class="text-lg font-medium text-base-content flex items-center">
          <i class="ri-search-2-line mr-2"></i>搜索
        </h3>
      </div>
      
      <!-- 搜索输入区域 -->
      <div class="search-input-area p-4 bg-base-100">
        <form class="relative flex items-center" @submit.prevent="search">
          <div class="relative flex-1 flex items-center justify-between gap-4">
            <input 
              type="text" 
              class="input input-bordered w-full pl-4 pr-10 focus:outline-primary rounded-full"
              v-model="searchText" 
              placeholder="随便搜搜吧？" 
              autocomplete="off"
              accesskey="s"
              maxlength="100"
              @input="handleInput"
              @compositionstart="compositionStart"
              @compositionend="compositionEnd"
              @focus="showSearchPanel = true"
              @blur="showSearchPanel = false"
            />
          <button type="submit" class="btn btn-primary ml-2 rounded-full btn-soft btn-square">
            <i class="ri-search-line"></i>
            <span class="hidden sm:inline-block ml-1">搜索</span>
          </button>
          </div>
        </form>
        
        <!-- 搜索面板：历史记录和建议 -->
        <div 
          v-show="(showSearchPanel && !searchText && searchHistory.length > 0) || (showSearchPanel && searchText && searchSuggestions.length > 0)"
          class="search-panel mt-2 mx-4 bg-base-100 rounded-box border border-base-300 shadow-md"
          @mousedown.prevent
        >
          <!-- 历史记录 -->
          <div class="history p-3" v-if="searchHistory.length > 0 && !searchSuggestions.length">
            <div class="flex justify-between items-center mb-2">
              <h4 class="text-sm font-medium text-base-content/80">
                <i class="ri-history-line mr-1"></i>搜索历史
              </h4>
              <button class="btn btn-xs btn-ghost text-error" @click="clearSearchHistory">
                <i class="ri-delete-bin-line mr-1"></i>清空
              </button>
            </div>
            
            <div class="histories-wrap">
              <div class="flex flex-wrap gap-2">
                <div 
                  v-for="(history, index) in searchHistory" 
                  :key="index"
                  class="badge badge-outline hover:bg-base-200 cursor-pointer flex items-center gap-1 px-3 py-3"
                  @click="performSearch(history)"
                >
                  <span>{{ history }}</span>
                  <i class="ri-close-line hover:text-error" @click.stop="removeSearchHistory(index)"></i>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 搜索建议 -->
          <div class="suggestions" v-if="searchText && searchSuggestions.length > 0">
            <div v-if="loading" class="flex justify-center items-center py-4">
              <span class="loading loading-spinner loading-md text-primary"></span>
            </div>
            
            <div v-else class="divide-y divide-base-200">
              <a 
                v-for="(suggest, index) in searchSuggestions"
                :key="index"
                :href="getSuggestionsLink(suggest)"
                @click.prevent="go(getSuggestionsLink(suggest))"
                class="suggest-item flex items-center justify-between px-4 py-3 hover:bg-base-200 transition-colors duration-200"
              >
                <div class="suggest-text flex-1 mr-2" v-html="highlight(suggest.title, searchText)"></div>
                <div :class="['badge', getTypeClass(suggest.type)]">{{ suggest.type_name }}</div>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 热门标签 -->
      <div class="popular-tags bg-base-200 p-4 mt-4 rounded-box">
        <h4 class="text-sm font-medium text-base-content/80 mb-3">
          <i class="ri-price-tag-3-line mr-1"></i>热门标签
        </h4>
        <div class="flex flex-wrap gap-2">
          <a 
            v-for="(tag, index) in config.tax?.tags?.slice(0, 8) || []" 
            :key="index"
            @click="go('/tag/' + tag.term_id)" 
            class="badge badge-primary badge-outline hover:bg-primary hover:text-primary-content cursor-pointer transition-colors duration-200"
          >
            {{ tag.name }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import axios from "@/dist/axios";
import { useRouter } from "vue-router";
import { useStore } from "@/store";

const emit = defineEmits(['loadinged', 'close-modal']);

const store = useStore();
const router = useRouter();
const searchText = ref("");
const searchHistory = ref(JSON.parse(localStorage.getItem("searchHistory")) || []);
const searchSuggestions = ref([]);
const showSearchPanel = ref(false);
const composing = ref(false);
const typingTimer = ref(null);
const loading = ref(false);

onMounted(() => {
  emit('loadinged');
});

// 获取配置
const config = computed(() => {
  return store.config;
});

// 页面跳转
const go = (path) => {
  router.push(path);
  emit('close-modal');
};

// 搜索功能
const search = () => {
  const trimmedSearchText = searchText.value.trim();
  if (!trimmedSearchText) return;

  const index = searchHistory.value.indexOf(trimmedSearchText);
  if (index !== -1) {
    searchHistory.value.splice(index, 1);
  }
  searchHistory.value.unshift(trimmedSearchText);
  
  // 限制历史记录数量为10条
  if (searchHistory.value.length > 10) {
    searchHistory.value = searchHistory.value.slice(0, 10);
  }
  
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory.value));

  // 跳转到搜索页面
  emit('close-modal');
  router.push({name: 'search', query: {s: trimmedSearchText}});
};

// 执行搜索
const performSearch = (history) => {
  searchText.value = history;
  search();
};

// 清空搜索历史
const clearSearchHistory = () => {
  searchHistory.value = [];
  localStorage.removeItem("searchHistory");
};

// 移除单条搜索历史
const removeSearchHistory = (index) => {
  searchHistory.value.splice(index, 1);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory.value));
};

// 获取搜索建议
const getSuggestions = async () => {
  const trimmedSearchText = searchText.value.trim();
  if (!trimmedSearchText) {
    searchSuggestions.value = [];
    return;
  }

  loading.value = true;
  try {
    const response = await axios.post("/getSearchSuggest", `search=${trimmedSearchText}`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    searchSuggestions.value = response.data;
  } catch (error) {
    console.error("获取搜索建议失败:", error);
    searchSuggestions.value = [];
  } finally {
    loading.value = false;
  }
};

// 输入处理
const handleInput = () => {
  if (!composing.value) {
    clearTimeout(typingTimer.value);
    typingTimer.value = setTimeout(() => {
      getSuggestions();
    }, 500);
  }
};

// 获取建议链接
const getSuggestionsLink = (item) => {
  switch (item.type) {
    case "post":
      return `/${item.type}/${item.id}`;
    case 'circle':
      return `/moment/${item.id}`;
    case "post_tag":
      return `/tag/${item.id}`;
    case "category":
      return `/category/${item.id}`;
    case "circle_cat":
      return `/circle/${item.id}`;
    case 'topic':
      return `/topic/${item.id}`;
    case "user":
      return `/user/${item.id}`;
    default:
      return "";
  }
};

// 输入法事件处理
const compositionStart = () => {
  composing.value = true;
};

const compositionEnd = () => {
  composing.value = false;
  getSuggestions();
};

// 高亮显示搜索文本
const highlight = (text, query) => {
  if (!query) return text;
  
  try {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="text-primary font-medium">$1</span>');
  } catch (e) {
    return text;
  }
};

// 获取标签类型样式
const getTypeClass = (type) => {
  const typeMap = {
    'post': 'badge-primary',
    'circle': 'badge-secondary',
    'post_tag': 'badge-accent',
    'category': 'badge-info',
    'circle_cat': 'badge-success',
    'topic': 'badge-warning',
    'user': 'badge-error'
  };
  
  return typeMap[type] || 'badge-neutral';
};

// 监听搜索文本变化
watch(searchText, (newVal) => {
  if (!newVal) {
    searchSuggestions.value = [];
  }
});
</script>

<style scoped>
.search-dialog {
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.search-input-area {
  position: relative;
}

.search-panel {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 30;
}

/* 滚动条美化 */
.search-panel::-webkit-scrollbar {
  width: 6px;
}

.search-panel::-webkit-scrollbar-track {
  background: transparent;
}

.search-panel::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.1);
  border-radius: 3px;
}

/* 搜索建议动画 */
.suggest-item {
  transition: all 0.2s ease;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .search-dialog {
    width: 95%;
    max-width: 100%;
  }
}
</style>