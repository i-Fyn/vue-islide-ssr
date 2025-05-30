<template>
  <div class="flex flex-col gap-4">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="flex items-center gap-4 p-4 rounded-xl shadow-sm transition-all bg-primary/10 hover:-translate-y-1 hover:">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl text-2xl text-primary">
          <i class="ri-links-line"></i>
        </div>
        <div class="flex flex-col">
          <div class="text-2xl font-semibold leading-tight">{{ allLinks }}</div>
          <div class="text-sm text-base-content/70">全部链接</div>
        </div>
      </div>
      
      <div class="flex items-center gap-4 p-4 rounded-xl shadow-sm transition-all bg-warning/10 hover:-translate-y-1 hover:">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl text-2xl text-warning">
          <i class="ri-time-line"></i>
        </div>
        <div class="flex flex-col">
          <div class="text-2xl font-semibold leading-tight">{{ getPendingCount() }}</div>
          <div class="text-sm text-base-content/70">待审核链接</div>
        </div>
      </div>
      
      <div class="flex items-center gap-4 p-4 rounded-xl shadow-sm transition-all bg-success/10 hover:-translate-y-1 hover:">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl text-2xl text-success">
          <i class="ri-check-line"></i>
        </div>
        <div class="flex flex-col">
          <div class="text-2xl font-semibold leading-tight">{{ getApprovedCount() }}</div>
          <div class="text-sm text-base-content/70">已通过链接</div>
        </div>
      </div>
      
      <div class="flex items-center gap-4 p-4 rounded-xl shadow-sm transition-all bg-error/10 hover:-translate-y-1 hover:">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl text-2xl text-error">
          <i class="ri-close-line"></i>
        </div>
        <div class="flex flex-col">
          <div class="text-2xl font-semibold leading-tight">{{ getRejectedCount() }}</div>
          <div class="text-sm text-base-content/70">已拒绝链接</div>
        </div>
      </div>
    </div>

    <!-- 链接管理卡片 -->
    <div class="card bg-base-100 ">
      <div class="card-body p-0">
        <!-- 标签页 -->
        <div class="p-4 border-b border-base-200">
          <div class="scroll-x">
            <div class="tabs tabs-boxed bg-base-200/50 p-1">
              <a class="tab" 
                :class="{'tab-active': param.id == 0}" 
                @click="changeTabs(0, 0)">
                <i class="ri-global-line mr-1"></i>
                全部
              </a>
              <a v-for="(tab, index) in config['link_category']" 
                :key="tab.term_id"
                :class="['tab', tab.term_id == param.id ? 'tab-active' : '']"
                @click="changeTabs(tab.term_id, index)">
                <i :class="[getCategoryIcon(tab.name), 'mr-1']"></i>
                {{ tab.name }}
              </a>
            </div>
          </div>
        </div>

        <!-- 搜索栏 -->
        <div class="p-4 border-b border-base-200 flex  gap-4 justify-between items-center">
          <div class="join ">
            <div class="join-item relative">
              <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 opacity-50 z-1"></i>
              <input type="text" v-model="search" 
                placeholder="搜索站点名/邮箱" 
                class="input input-bordered pl-10 w-full lg:w-80 input-sm"
                @input="filterLinks" />
            </div>
          </div>
          
          
        </div>

        <div class="flex gap-2 scroll-x">
            <button class="btn btn-sm" 
                    :class="visibilityFilter === 'all' ? 'btn-active' : 'btn-ghost'"
                    @click="filterByVisibility('all')">
              所有状态
            </button>
            <button class="btn btn-sm btn-success btn-outline" 
                    :class="visibilityFilter === 'Y' ? 'btn-active' : ''"
                    @click="filterByVisibility('Y')">
              <i class="ri-check-line mr-1"></i>
              已通过
            </button>
            <button class="btn btn-sm btn-warning btn-outline" 
                    :class="visibilityFilter === 'U' ? 'btn-active' : ''"
                    @click="filterByVisibility('U')">
              <i class="ri-time-line mr-1"></i>
              待审核
            </button>
            <button class="btn btn-sm btn-error btn-outline" 
                    :class="visibilityFilter === 'N' ? 'btn-active' : ''"
                    @click="filterByVisibility('N')">
              <i class="ri-close-line mr-1"></i>
              已拒绝
            </button>
          </div>

        <!-- 表格 -->
        <div class="scroll-x" v-if="filteredLinks.length">
          <table class="table table-zebra table-sm table-pin-rows">
            <thead>
              <tr>
                <th class="sticky left-0 z-10">ID</th>
                <th>名称</th>
                <th>状态</th>
                <th>网址</th>
                <th>Logo</th>
                <th>描述</th>
                <th>RSS</th>
                <th>Email</th>
                <th>类型</th>
                <th>审核留言</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredLinks" :key="item.id" class="hover">
                <td class="sticky left-0 bg-inherit">{{ item.link_id }}</td>
                <td class="min-w-40 font-medium">{{ item.link_name }}</td>
                <td>
                  <select class="select select-bordered select-xs w-max"
                    @mousedown="recordOldValue(item, 'link_visible')"
                    v-model="item.link_visible"
                    :class="{
                      'bg-success/10 text-success': item.link_visible === 'Y',
                      'bg-warning/10 text-warning': item.link_visible === 'U',
                      'bg-error/10 text-error': item.link_visible === 'N'
                    }"
                    @change="handleFieldUpdate(item, 'link_visible', `确定将链接状态修改为 [${statesName[item.link_visible]}]吗？`)">
                    <option v-for="option in visibleOptions" 
                      :key="option.value"
                      :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </td>
                <td>
                  <div class="flex items-center gap-2">
                    <input type="url" class="input input-bordered input-xs w-max"
                      v-model="item.link_url"
                      placeholder="请输入网址"
                      @focus="recordOldValue(item, 'link_url')"
                      @blur="handleFieldUpdate(item, 'link_url', `确定将链接网址修改为 [${item.link_url}] 吗？`)" />
                    <a v-if="item.link_url" :href="item.link_url" target="_blank" class="btn btn-ghost btn-xs btn-square">
                      <i class="ri-external-link-line"></i>
                    </a>
                  </div>
                </td>
                <td>
                  <div class="flex items-center gap-2">
                    <input type="url" class="input input-bordered input-xs w-auto"
                      v-model="item.link_image"
                      placeholder="请输入Logo URL"
                      @focus="recordOldValue(item, 'link_image')"
                      @blur="handleFieldUpdate(item, 'link_image', `确定将链接Logo修改为 [${item.link_image}] 吗？`)" />
                    <a v-if="item.link_image" :href="item.link_image" target="_blank" class="btn btn-ghost btn-xs btn-square">
                      <i class="ri-image-line"></i>
                    </a>
                  </div>
                </td>
                <td>
                  <input type="text" class="input input-bordered input-xs w-full min-w-[180px]"
                    v-model="item.link_description"
                    placeholder="请输入描述"
                    @focus="recordOldValue(item, 'link_description')"
                    @blur="handleFieldUpdate(item, 'link_description', `确定将链接描述修改为 [${item.link_description}] 吗？`)" />
                </td>
                <td>
                  <div class="flex items-center gap-2">
                    <input type="url" class="input input-bordered input-xs w-max"
                      v-model="item.link_rss"
                      placeholder="请输入RSS"
                      @focus="recordOldValue(item, 'link_rss')"
                      @blur="handleFieldUpdate(item, 'link_rss', `确定将链接RSS修改为 [${item.link_rss}] 吗？`)" />
                    <a v-if="item.link_rss" :href="item.link_rss" target="_blank" class="btn btn-ghost btn-xs btn-square">
                      <i class="ri-rss-line"></i>
                    </a>
                  </div>
                </td>
                <td>
                  <div class="flex items-center gap-2">
                    <input type="email" class="input input-bordered input-xs w-max"
                      v-model="item.email"
                      placeholder="请输入Email"
                      @focus="recordOldValue(item, 'email')"
                      @blur="handleFieldUpdate(item, 'email', `确定将Email修改为 [${item.email}] 吗？`)" />
                    <a v-if="item.email" :href="`mailto:${item.email}`" class="btn btn-ghost btn-xs btn-square">
                      <i class="ri-mail-send-line"></i>
                    </a>
                  </div>
                </td>
                <td>
                  <select class="select select-bordered select-xs w-max"
                    v-model="item.tid"
                    @change="handleFieldUpdate(item, 'tid', `确定将链接类型修改为 [${getCategoryName(item.tid)}] 吗？`)">
                    <option v-for="category in config['link_category']"
                      :key="category.term_id"
                      :value="category.term_id">
                      {{ category.name }}
                    </option>
                  </select>
                </td>
                <td>
                  <input type="text" class="input input-bordered input-xs w-full min-w-[180px]"
                    v-model="item.link_notes"
                    placeholder="请输入审核留言"
                    @focus="recordOldValue(item, 'link_notes')"
                    @blur="handleFieldUpdate(item, 'link_notes', `确定将审核留言修改为 [${item.link_notes}] 吗？`)" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 加载中 -->
        <div class="flex flex-col items-center justify-center py-16" v-else-if="loading && !isDataEmpty">
          <span class="loading loading-spinner loading-lg text-primary"></span>
          <span class="mt-4 text-base-content/60 text-sm">加载链接数据中...</span>
        </div>

        <!-- 空状态 -->
        <div class="flex flex-col items-center justify-center py-16" v-else-if="!filteredLinks.length && isDataEmpty">
          <van-empty image-size="10rem" description="暂无链接数据" />
          <button class="btn btn-sm btn-outline mt-4" @click="refresh">刷新数据</button>
        </div>

        <!-- 分页 -->
        <div class="p-4 border-t border-base-200">
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
import { ref, onMounted, nextTick, computed } from 'vue'
import PageNav from '@/components/footer/PageNav.vue'
import { useStore } from '@/store'
import axios from '@/dist/axios'
import { createMessage as message } from '../../dist/message'

const store = useStore()
const api = ref('getLinkList')
const termId = ref(1)
const param = ref({ id: 0, size: 10 })
const paged = ref(1)
const pages = ref(1)
const loading = ref(true)
const isDataEmpty = ref(false)
const search = ref('')
const config = ref(store.config)
const jsonPageNav = ref(null)
const links = ref([])
const filteredLinks = ref([])
const allLinks = ref(0)
const unreviewedLinks = ref(0)
const editingField = ref({});
const visibilityFilter = ref('all'); // 'all', 'Y', 'U', 'N'

// 获取分类图标
const getCategoryIcon = (name) => {
  switch(name.toLowerCase()) {
    case '友情链接': return 'ri-links-line';
    case '商业链接': return 'ri-store-line';
    case '个人链接': return 'ri-user-line';
    case '内部链接': return 'ri-link-m';
    default: return 'ri-link-line';
  }
};

// 获取状态样式类
const getStatusClass = (status) => {
  switch(status) {
    case 'Y': return 'success';
    case 'U': return 'warning';
    case 'N': return 'error';
    default: return 'neutral';
  }
};

// 获取分类名称
const getCategoryName = (termId) => {
  const category = config.value['link_category'].find(cat => cat.term_id == termId);
  return category ? category.name : '未知类型';
};

// 获取待审核链接数量
const getPendingCount = () => {
  return links.value.filter(link => link.link_visible === 'U').length;
};

// 获取已通过链接数量
const getApprovedCount = () => {
  return links.value.filter(link => link.link_visible === 'Y').length;
};

// 获取已拒绝链接数量
const getRejectedCount = () => {
  return links.value.filter(link => link.link_visible === 'N').length;
};

const visibleOptions = [
    { label: '通过', value: 'Y' },
    { label: '未处理', value: 'U' },
    { label: '拒绝', value: 'N' }
]

const statesName = {
    Y: '通过',
    U: '未处理',
    N: '拒绝'
}

// 根据状态筛选链接
const filterByVisibility = (status) => {
  visibilityFilter.value = status;
  applyFilters();
};

// 应用所有筛选条件
const applyFilters = () => {
  const keyword = search.value.trim().toLowerCase();
  
  filteredLinks.value = links.value.filter(link => {
    // 关键字匹配
    const nameMatch = link.link_name.toLowerCase().includes(keyword);
    const emailMatch = link.email && link.email.toLowerCase().includes(keyword);
    const keywordMatch = nameMatch || emailMatch;
    
    // 状态匹配
    const statusMatch = visibilityFilter.value === 'all' || link.link_visible === visibilityFilter.value;
    
    return keywordMatch && statusMatch;
  });
};

// 响应关键字搜索
const filterLinks = () => {
  applyFilters();
};

const change = (res) => {
    links.value = res.data;
    applyFilters();
    pages.value = res.pages || 1;
    isDataEmpty.value = links.value.length === 0;
    loading.value = false;
}

const fetchData = async () => {
    try {
        loading.value = true;
        filteredLinks.value = [];
        const res = await store.fetchApiPostData(api.value, {
          ...param.value,
          paged: paged.value
        });
        change(res);
    } catch (error) {
        console.error('获取链接数据失败:', error);
        loading.value = false;
        isDataEmpty.value = true;
    }
}

const changeTabs = (id, index) => {
    param.value.id = id;
    search.value = '';
    visibilityFilter.value = 'all';
    fetchData();
}

const getLinkStats = () => {
    axios.get('/getLinkStats').then(res => {
        allLinks.value = res.data.total || 0;
        unreviewedLinks.value = res.data.link_visible ? (res.data.link_visible.N || 0) : 0;
    }).catch(error => {
        console.error('获取链接统计失败:', error);
    });
}

// 刷新数据
const refresh = () => {
  fetchData();
  getLinkStats();
};

const recordOldValue = (item, field) => {
    editingField.value[item.link_id + '_' + field] = item[field];
};

const handleFieldUpdate = async (item, field, confirmMessage) => {
    const key = item.link_id + '_' + field;
    const oldValue = editingField.value[key];

    if (item[field] === oldValue) return;

    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) {
        item[field] = oldValue; // 用户取消，恢复旧值
        return;
    }

    try {
        await store.fetchApiPostData('UpdateLink', {
            id: item.link_id,
            field,
            value: item[field]
        });
        
        message({
            message: '更新成功',
            type: 'success'
        });
        
        // 如果修改了状态，更新统计数据
        if (field === 'link_visible') {
            getLinkStats();
        }
    } catch (err) {
        console.error('更新链接数据失败:', err);
        item[field] = oldValue; // 更新失败，恢复旧值
        message({
            message: '更新失败',
            type: 'error'
        });
    }
};

onMounted(() => {
    fetchData();
    getLinkStats();
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  scrollbar-width: none;
}
</style>