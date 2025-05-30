<template>
  <div class="flex flex-col gap-4">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="flex items-center gap-4 p-4 bg-base-100  rounded-xl hover:-translate-y-1 transition-transform bg-primary/10">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl text-2xl">
          <i class="ri-bank-card-line text-primary"></i>
        </div>
        <div class="flex flex-col">
          <div class="text-2xl font-semibold">{{ total }}</div>
          <div class="text-sm text-base-content/70">{{ selectedTabName == '全部' ? '卡密总数' : selectedTabName }}</div>
        </div>
      </div>
      
      <div class="flex items-center gap-4 p-4 bg-base-100  rounded-xl hover:-translate-y-1 transition-transform bg-success/10">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl text-2xl">
          <i class="ri-check-double-line text-success"></i>
        </div>
        <div class="flex flex-col">
          <div class="text-2xl font-semibold">{{ used }}</div>
          <div class="text-sm text-base-content/70">已使用卡密</div>
        </div>
      </div>
      
      <div class="flex items-center gap-4 p-4 bg-base-100  rounded-xl hover:-translate-y-1 transition-transform bg-info/10">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl text-2xl">
          <i class="ri-time-line text-info"></i>
        </div>
        <div class="flex flex-col">
          <div class="text-2xl font-semibold">{{ total - used }}</div>
          <div class="text-sm text-base-content/70">未使用卡密</div>
        </div>
      </div>
      
      <div class="flex items-center justify-center p-4 bg-base-100  rounded-xl hover:-translate-y-1 transition-transform">
        <button v-if="selectedTabName !== '全部'" 
          class="btn btn-primary gap-2"
          @click="handleClick()">
          <i class="ri-add-circle-line"></i>
          <span>生成{{ selectedTabName }}</span>
        </button>
      </div>
    </div>

    <!-- 卡密管理卡片 -->
    <div class="card bg-base-100">
      <div class="card-body p-0">
        <!-- 卡密类型标签页 -->
        <div class="tabs-container border-b border-base-200">
          <div class="tabs-wrapper p-4">
            <a v-for="tab in tabs" 
              :key="tab.type"
              class="tab flex items-center gap-2 px-4 py-2 rounded-lg text-sm cursor-pointer transition-all duration-300"
              :class="tab.type == param.type ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-base-200/50'"
              @click="changeTabs(tab.type)">
              <i :class="getTabIcon(tab.type)"></i>
              {{ tab.name }}
            </a>
          </div>
        </div>

        <!-- 搜索和操作栏 -->
        <div class="p-4 border-b border-base-200 flex flex-wrap gap-4 justify-between items-center">
          <div class="relative w-80">
            <i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50"></i>
            <input type="text" v-model="search" 
              placeholder="搜索卡密、用户..." 
              class="w-full py-2.5 pl-10 pr-4 border border-base-300 rounded-lg bg-base-100 text-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              @input="filterTable" />
          </div>
          
          <button 
            class="flex items-center gap-2 px-4 py-2 rounded-md bg-error/10 text-error border border-error/20 text-sm font-medium transition-all hover:bg-error/15 disabled:opacity-50 disabled:cursor-not-allowed relative"
            @click="deleteSelected"
            :disabled="selectedIds.length === 0">
            <i class="ri-delete-bin-line"></i>
            <span>批量删除</span>
            <span v-if="selectedIds.length > 0" class="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full bg-error text-white text-xs font-semibold ml-1">{{ selectedIds.length }}</span>
          </button>
        </div>

        <!-- 表格 -->
        <div class="table-container scroll-x" v-if="data.length">
          <table class="cards-table">
            <thead >
              <tr>
                <th>
                  <input type="checkbox" class="custom-checkbox" 
                    v-model="selectAll" 
                    @change="toggleSelectAll" />
                </th>
                <th>ID</th>
                <th>卡密兑换码</th>
                <th>卡密类型</th>
                <th>面值</th>
                <th>键</th>
                <th>值</th>
                <th>状态</th>
                <th>使用者</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in data" :key="item.id" class="table-row">
                <td>
                  <input type="checkbox" class="custom-checkbox"
                    v-model="selectedIds" 
                    :value="item.id" />
                </td>
                <td>{{ item.id }}</td>
                <td>
                  <div class="copy-container" @click="copy(item.card_code)">
                    <span class="card-code">{{ item.card_code }}</span>
                    <i class="ri-file-copy-line copy-icon"></i>
                  </div>
                </td>
                <td>
                  <span class="badge" :class="{
                    'bg-primary/10 text-primary': item.type == 'money',
                    'bg-warning/10 text-warning': item.type == 'credit',
                    'bg-info/10 text-info': item.type == 'invite',
                    'bg-secondary/10 text-secondary': item.type == 'vip',
                    'bg-base-content/10 text-base-content': !['money', 'credit', 'invite', 'vip'].includes(item.type)
                  }">
                    {{ item.type == 'money' ? '充值卡' : item.type == 'credit' ? '积分卡' : item.type == 'invite' ? '邀请卡' : item.type == 'vip' ? '会员卡' : '未知类型' }}
                  </span>
                </td>
                <td class="font-medium text-primary">{{ item.value }}</td>
                <td>{{ item.card_key }}</td>
                <td>{{ item.card_value }}</td>
                <td>
                  <span class="inline-flex px-2 py-1 rounded-full text-xs font-medium" :class="{
                    'bg-error/10 text-error': item.status == 1,
                    'bg-success/10 text-success': item.status != 1
                  }">
                    {{ item.status == 1 ? '已使用' : '未使用' }}
                  </span>
                </td>
                <td>{{ item.user_id == 0 ? '暂无' : item.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 加载中 -->
        <div class="flex flex-col items-center justify-center py-12 text-center" v-else-if="!data.length && loading && !isDataEmpty">
          <span class="loading loading-spinner loading-lg text-primary"></span>
          <span class="mt-4 text-sm text-base-content/60">加载卡密数据中...</span>
        </div>

        <!-- 空状态 -->
        <div class="flex flex-col items-center justify-center py-12 text-center" v-else-if="!data.length && isDataEmpty">
          <van-empty image-size="10rem" description="暂无卡密数据" />
          <button class="btn btn-sm btn-outline mt-4" @click="fetchData">刷新数据</button>
        </div>

        <!-- 分页 -->
        <div class="card-footer">
          <PageNav ref="jsonPageNav" 
            :paged="paged" 
            :pages="pages" 
            navtype="json" 
            type="page" 
            :api="api"
            :param="param" 
            @change="change" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>

import { ref, onMounted, onServerPrefetch, computed, nextTick } from 'vue'
import PageNav from "@/components/footer/PageNav.vue"
import { useStore } from '@/store'
import { createMessage as message } from '@/dist/message';
import { createVanModal } from '@/dist/createVanModal'

import { useClipboard } from '@vueuse/core'
import axios from '@/dist/axios';

const { copy } = useClipboard()
const store = useStore();
const data = ref([]);
const api = ref('getCardList');
const param = ref({
    size: 10,
    type: 'all'
});
const tabs = ref([
  { name: '全部', type: 'all' }, 
  { name: '充值卡', type: 'money' }, 
  { name: '积分卡', type: 'credit' }, 
  { name: '邀请卡', type: 'invite' }, 
  { name: '会员卡', type: 'vip' }
]);

const selectedTabName = computed(() => {
    return tabs.value.find(tab => tab.type === param.value.type).name;
});

// 获取标签页图标
const getTabIcon = (type) => {
  switch(type) {
    case 'all': return 'ri-dashboard-line';
    case 'money': return 'ri-bank-card-line';
    case 'credit': return 'ri-copper-coin-line';
    case 'invite': return 'ri-user-add-line';
    case 'vip': return 'ri-vip-crown-line';
    default: return 'ri-bank-card-line';
  }
};



const originalData = ref([]); // 缓存原始数据
const isDataEmpty = ref(false);
const loading = ref(true);
const locked = ref(false);
const jsonPageNav = ref(null);
const paged = ref(1);
const pages = ref(1);
const total = ref(0);
const used = ref(0);
const search = ref('');
const selectedIds = ref([]);
const selectAll = ref(false);

// 切换全选
const toggleSelectAll = () => {
    if (selectAll.value) {
        selectedIds.value = data.value.map(item => item.id);
    } else {
        selectedIds.value = [];
    }
};

// 复制卡密成功提示
const handleCopy = (text) => {
  copy(text);
  message({ message: '卡密已复制到剪贴板', type: 'success' });
};

// 删除操作
const deleteSelected = async () => {
    if (!selectedIds.value.length) return;

    if (window.confirm(`确定要删除选中的 ${selectedIds.value.length} 个卡密吗？`)) {
        try {
            locked.value = true;
            const res = await store.fetchApiPostData('deleteCardList', { ids: selectedIds.value });
            
            // 删除成功后更新视图
            data.value = data.value.filter(item => !selectedIds.value.includes(item.id));
            originalData.value = originalData.value.filter(item => !selectedIds.value.includes(item.id));
            selectedIds.value = [];
            selectAll.value = false;
            
            message({ message: '删除卡密成功', type: 'success' });
            // 更新统计数据
            getCardStats();
        } catch (err) {
            message({ message: err.response?.data?.message || '删除失败', type: 'error' });
        } finally {
            locked.value = false;
        }
    }
};

// 搜索过滤
const filterTable = () => {
    const keyword = search.value.trim().toLowerCase();

    if (!keyword) {
        data.value = [...originalData.value];
    } else {
        data.value = originalData.value.filter(item =>
            (item.card_code && item.card_code.toLowerCase().includes(keyword)) ||
            (item.card_key && item.card_key.toLowerCase().includes(keyword)) ||
            (item.name && item.name.toLowerCase().includes(keyword)) ||
            String(item.user_id).includes(keyword)
        );
    }
};

const change = (recievedData) => {
    data.value = recievedData.data;
    originalData.value = [...recievedData.data];  // 保存原始数据
    pages.value = recievedData.pages || 1;
    isDataEmpty.value = !data.value.length;
    loading.value = false;
};

const changeTabs = async (value) => {
    if (locked.value) return;
    locked.value = true;
    param.value.type = value;
    data.value = [];
    originalData.value = [];
    selectedIds.value = [];
    selectAll.value = false;
    isDataEmpty.value = false;
    await fetchData();
};

// 处理生成卡密按钮点击
const handleClick = () => {
  import('@/components/account/card/GenerateCard.vue').then(m => {
    createVanModal(m.default, {
      size: 356,
      props: {
        type: param.value.type
      },
      onSuccess: () => {
        fetchData();
        getCardStats();
      }
    });
  });
};

onMounted(async () => {
    await fetchData();
    getCardStats();
});

const fetchData = async () => {
    try {
        loading.value = true;
        locked.value = true;
        let res = await store.fetchApiPostData(api.value, {
            ...param.value,
            paged: paged.value
        });
        change(res);
    } catch (error) {
        console.error('获取卡密数据失败:', error);
        isDataEmpty.value = true;
    } finally {
        loading.value = false;
        locked.value = false;
    }
};

const getCardStats = () => {
    axios.get('/getCardStats').then(res => {
        total.value = res.data.total;
        used.value = res.data.status[1] || 0;
    }).catch(error => {
        console.error('获取卡密统计数据失败:', error);
    });
};

onServerPrefetch(async () => {
    await fetchData();
});

</script>

<style scoped>

.cards-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.cards-table th, 
.cards-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  white-space: nowrap;
}

.cards-table th {
  background-color: rgba(var(--color-base-200), 0.3);
  font-weight: 500;
  color: rgba(var(--color-base-content), 0.8);
  position: sticky;
  top: 0;
  z-index: 10;
}

.cards-table tbody tr:hover {
  background-color: rgba(var(--color-base-200), 0.2);
}

/* 标签页样式 */
.tabs-container {
  overflow-x: auto;
  scrollbar-width: none;
}

.tabs-container::-webkit-scrollbar {
  display: none;
}

.tabs-wrapper {
  display: flex;
  min-width: max-content;
}

/* 卡密兑换码样式 */
.copy-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.copy-container:hover {
  background-color: rgba(var(--color-base-200), 0.5);
}

.card-code {
  font-family: monospace;
  font-size: 0.875rem;
}

.copy-icon {
  color: rgba(var(--color-base-content), 0.5);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.copy-container:hover .copy-icon {
  opacity: 1;
}


</style>
