<template>
  <div class="theme-selector flex flex-col h-full">
    <div class="theme-modal-header p-4 border-b border-base-200 flex justify-between items-center sticky top-0 bg-base-100 z-1">
      <h3 class="text-lg font-medium flex items-center gap-2">
        <i class="ri-palette-line"></i> 选择主题
      </h3>
    </div>
    
    <!-- 内容区 -->
    <div class="theme-modal-content p-4 px-6 flex-1 overflow-y-auto">
      <!-- 搜索框 -->
      <div class="mb-4 sticky top-0 z-10 bg-base-100 pb-2">
        <div class="relative">
          <i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40"></i>
          <input 
            type="text" 
            class="input input-bordered w-full pl-9 pr-10 input-sm" 
            placeholder="搜索主题..." 
            v-model="themeSearch"
            ref="searchInput"
          />
          <button 
            v-if="themeSearch" 
            class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/70" 
            @click="themeSearch = ''"
          >
            <i class="ri-close-circle-line text-lg"></i>
          </button>
        </div>
      </div>
      
      <!-- 主题分组和列表 -->
      <div class="theme-groups space-y-4">
        <div v-for="(themes, groupName) in getThemeGroup" :key="groupName" class="theme-group">
          <h4 class="text-sm mb-2 text-base-content/70 font-medium pl-1">{{ groupName }}</h4>
          <div class="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            <div v-for="theme in themes" :key="theme" 
                :class="['theme-item cursor-pointer rounded-lg p-2 transition-all duration-200 hover:scale-105', currentTheme === theme ? 'ring-2 ring-primary' : '']"
                @click="setTheme(theme)">
              <div class="theme-preview h-10 w-full rounded-md mb-1 shadow-md" :data-theme="theme">
                <div class="flex h-full w-full">
                  <div class="h-full w-1/2 bg-primary"></div>
                  <div class="h-full flex-1 flex flex-col">
                    <div class="h-1/2 w-full bg-secondary"></div>
                    <div class="h-1/2 w-full bg-accent"></div>
                  </div>
                </div>
              </div>
              <div class="theme-name text-xs text-center truncate mt-1">{{ theme }}</div>
            </div>
          </div>
        </div>
        
        <!-- 无搜索结果提示 -->
        <div v-if="themeSearch && Object.keys(getThemeGroup).length === 0" class="py-8 text-center">
          <div class="text-4xl mb-4 opacity-70"><i class="ri-file-search-line"></i></div>
          <p class="text-base-content/70">未找到匹配的主题</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useStore } from '@/store';


const emit = defineEmits(['close-modal']);
const store = useStore();
const searchInput = ref(null);
const themeSearch = ref('');
const currentTheme = computed(() => store.theme);

// 主题分组
const themeGroups = {
  "常用": ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate"],
  "色彩": ["valentine", "autumn", "sunset", "lofi", "garden", "forest", "aqua", "pastel", "fantasy"],
  "暗色": ["dracula", "black", "halloween", "night", "dim", "nord", "abyss"],
  "科技": ["synthwave", "retro", "cyberpunk", "cmyk", "wireframe"],
  "其他": ["luxury", "acid", "lemonade", "coffee", "winter", "business", "caramellatte", "silk"]
};

// 过滤主题
const filteredThemeGroups = computed(() => {
  if (!themeSearch.value) return themeGroups;
  
  const result = {};
  for (const [group, themes] of Object.entries(themeGroups)) {
    const filteredThemes = themes.filter(theme => 
      theme.toLowerCase().includes(themeSearch.value.toLowerCase())
    );
    if (filteredThemes.length > 0) {
      result[group] = filteredThemes;
    }
  }
  return result;
});

// 获取主题分组
const getThemeGroup = computed(() => {
  if (themeSearch.value) return filteredThemeGroups.value;
  
  const result = {};
  for (const [group, themes] of Object.entries(themeGroups)) {
    result[group] = themes;
  }
  return result;
});

// 设置主题并带动画
const setTheme = (theme) => {
  store.theme = theme;
  document.documentElement.setAttribute('data-theme-switching', 'true');
  setTimeout(() => {
    document.documentElement.removeAttribute('data-theme-switching');
    // 关闭模态框
    emit('close-modal');
  }, 300);
};

</script>

<style scoped>
/* 主题选择器样式 */
.theme-selector {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.theme-modal-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* 改善iOS滚动 */
}

.theme-item {
  overflow: hidden;
  transition: all 0.2s ease;
}

.theme-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.theme-preview {
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

/* 当前选中主题的样式 */
.theme-item.ring-2 {
  background-color: var(--color-base-200);
  position: relative;
}

.theme-item.ring-2::after {
  content: '✓';
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--color-primary);
  color: white;
  font-size: 10px;
  padding: 1px 4px;
  border-bottom-left-radius: 6px;
}

/* 确保模态框内容区域滚动良好 */
@media (max-width: 768px) {
  .theme-modal-content {
    max-height: calc(100vh - 56px);
  }
}
</style> 