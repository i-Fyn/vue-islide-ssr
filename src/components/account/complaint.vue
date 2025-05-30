<template>
  <div class="flex flex-col gap-4">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="flex items-center gap-4 p-4   rounded-xl hover:-translate-y-1 transition-transform bg-primary/10">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl text-2xl">
          <i class="ri-flag-line text-primary"></i>
        </div>
        <div class="flex flex-col">
          <div class="text-2xl font-semibold">{{ rpcount }}</div>
          <div class="text-sm text-base-content/70">投诉总数</div>
        </div>
      </div>
      
      <div class="flex items-center gap-4 p-4   rounded-xl hover:-translate-y-1 transition-transform bg-warning/10">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl text-2xl">
          <i class="ri-time-line text-warning"></i>
        </div>
        <div class="flex flex-col">
          <div class="text-2xl font-semibold">{{ nrpcount }}</div>
          <div class="text-sm text-base-content/70">待处理投诉</div>
        </div>
      </div>
      
      <div class="flex items-center gap-4 p-4   rounded-xl hover:-translate-y-1 transition-transform bg-success/10">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl text-2xl">
          <i class="ri-check-line text-success"></i>
        </div>
        <div class="flex flex-col">
          <div class="text-2xl font-semibold">{{ getStatusCount('1') }}</div>
          <div class="text-sm text-base-content/70">已处理成功</div>
        </div>
      </div>
      
      <div class="flex items-center gap-4 p-4 bg-base-100  rounded-xl hover:-translate-y-1 transition-transform bg-error/10">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl text-2xl">
          <i class="ri-close-line text-error"></i>
        </div>
        <div class="flex flex-col">
          <div class="text-2xl font-semibold">{{ getStatusCount('2') }}</div>
          <div class="text-sm text-base-content/70">已驳回投诉</div>
        </div>
      </div>
    </div>

    <!-- 投诉管理卡片 -->
    <div class="card bg-base-100 ">
      <div class="card-body p-0">
        <!-- 状态标签页 -->
        <div class="p-4 border-b border-base-200">
          <div class="scroll-x">
            <div class="tabs tabs-boxed bg-base-200/50 p-1">
              <a v-for="tab in tabs" 
                :key="tab.status"
                :class="['tab', tab.status == param.status ? 'tab-active' : '']"
                @click="changeTabs(tab.status)">
                <i :class="getTabIcon(tab.status)" class="mr-2"></i>
                {{ tab.name }}
              </a>
            </div>
          </div>
        </div>

        <!-- 搜索框 -->
        <div class="p-4 border-b border-base-200 flex flex-wrap gap-4 justify-between items-center">
          <div class="join">
            <div class="join-item relative">
              <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 z-1"></i>
              <input type="text" v-model="search" 
                placeholder="搜索投诉用户" 
                class="input input-bordered pl-10 w-80 input-sm"
                @input="filterTable" />
            </div>
          </div>
          
          <div class="flex gap-2">
            <span class="badge badge-sm cursor-pointer"
                  :class="{'badge-primary': filterType === 'all', 'badge-ghost hover:bg-base-200': filterType !== 'all'}"
                  @click="filterByType('all')">全部</span>
            <span class="badge badge-sm cursor-pointer"
                  :class="{'badge-primary': filterType === 'post', 'badge-ghost hover:bg-base-200': filterType !== 'post'}"
                  @click="filterByType('post')">文章</span>
            <span class="badge badge-sm cursor-pointer"
                  :class="{'badge-primary': filterType === 'comment', 'badge-ghost hover:bg-base-200': filterType !== 'comment'}"
                  @click="filterByType('comment')">评论</span>
            <span class="badge badge-sm cursor-pointer"
                  :class="{'badge-primary': filterType === 'user', 'badge-ghost hover:bg-base-200': filterType !== 'user'}"
                  @click="filterByType('user')">用户</span>
          </div>
        </div>

        <!-- 表格 -->
        <div class="scroll-x" v-if="filteredData.length">
          <table class="table table-zebra table-sm table-pin-rows">
            <thead>
              <tr>
                <th>ID</th>
                <th>投诉状态</th>
                <th>投诉用户</th>
                <th>投诉原因</th>
                <th>投诉描述</th>
                <th>投诉对象</th>
                <th>对象类型</th>
                <th>审核意见</th>
                <th>投诉时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in filteredData" :key="item.id">
                <td>{{ item.id }}</td>
                <td>
                  <div class="relative">
                    <select class="select select-bordered select-sm w-full"
                      v-model="item.status"
                      @mousedown="recordOldValue(item, 'status')"
                      @change="handleFieldUpdate(item, 'status', `确定将投诉状态修改为 [${statesName[item.status]}] 吗？`)"
                      :class="{
                        'select-warning': item.status == '0',
                        'select-success': item.status == '1',
                        'select-error': item.status == '2'
                      }">
                      <option v-for="option in statusOptions" 
                        :key="option.value" 
                        :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </div>
                </td>
                <td>
                  <div class="flex items-center gap-2 cursor-pointer text-primary hover:underline" 
                       @click="router.push({ name: 'user', params: { user_id: item.user_id } })">
                    <i class="ri-user-line"></i>
                    <span>{{ item.name }}</span>
                  </div>
                </td>
                <td>{{ item.type }}</td>
                <td>
                  <div class="max-w-xs truncate" :title="item.content">
                    {{ truncateText(item.content, 30) }}
                  </div>
                </td>
                <td>{{ item.reported_id }}</td>
                <td>
                  <div class="badge" 
                        :class="{
                          'badge-info': item.reported_type === 'post',
                          'badge-accent': item.reported_type === 'comment',
                          'badge-primary': item.reported_type === 'user',
                          'badge-neutral': !['post', 'comment', 'user'].includes(item.reported_type)
                        }">
                    {{ getReportedTypeName(item.reported_type) }}
                  </div>
                </td>
                <td>
                  <input type="text" 
                    class="input input-bordered input-sm w-full"
                    v-model="item.mark"
                    placeholder="请输入审核意见"
                    @focus="recordOldValue(item, 'mark')"
                    @blur="handleFieldUpdate(item, 'mark',`确定将审核意见修改为 [${item.mark}] 吗？`)" />
                </td>
                <td>{{ item.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 加载中 -->
        <div class="flex flex-col items-center justify-center py-16" v-else-if="loading && !isDataEmpty">
          <span class="loading loading-spinner loading-lg text-primary"></span>
          <span class="mt-4 text-sm text-base-content/60">加载投诉数据中...</span>
        </div>

        <!-- 空状态 -->
        <div class="flex flex-col items-center justify-center py-16" v-else-if="!filteredData.length && isDataEmpty">
          <van-empty image-size="10rem" description="暂无投诉数据" />
          <button class="btn btn-sm btn-outline mt-4" @click="fetchData">刷新数据</button>
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
import axios from '@/dist/axios'
import { useStore } from '@/store'
import { router } from '../../main'
import { createMessage as message } from '../../dist/message'

const tableData = ref([])
const filteredData = ref([])
const loading = ref(false)
const isDataEmpty = ref(false)
const paged = ref(1)
const pages = ref(1)
const locked = ref(false)
const search = ref('')
const filterType = ref('all')
const jsonPageNav = ref(null)
const store = useStore()
const api = ref('getReportList')
const rpcount = ref(0)
const nrpcount = ref(0)
const editingField = ref({});

const param = ref({
    page_size: 10,
    status: 'all',
})

const tabs = ref([
  { name: '全部', status: 'all' }, 
  { name: '未处理', status: '0' }, 
  { name: '举报成功', status: '1' }, 
  { name: '举报失败', status: '2' }
])

const statusOptions = [
    { label: '未处理', value: '0' },
    { label: '举报成功', value: '1' },
    { label: '举报失败', value: '2' },
]

const statesName = {
    '0': '未处理',
    '1': '举报成功',
    '2': '举报失败',
}

// 获取标签页图标
const getTabIcon = (status) => {
  switch(status) {
    case 'all': return 'ri-list-check';
    case '0': return 'ri-time-line';
    case '1': return 'ri-check-line';
    case '2': return 'ri-close-line';
    default: return 'ri-list-check';
  }
};

// 截断文本
const truncateText = (text, length) => {
  if (!text) return '';
  return text.length > length ? text.slice(0, length) + '...' : text;
};

// 获取特定状态的投诉数量
const getStatusCount = (status) => {
  return tableData.value.filter(item => item.status === status).length;
};

const change = (recievedData) => {
    tableData.value = recievedData.data;
    filteredData.value = tableData.value;
    pages.value = recievedData.pages;
    isDataEmpty.value = recievedData.data.length === 0;
    loading.value = false;
}

const getReportedTypeName = (type) => {
    switch (type) {
        case 'post':
            return '文章帖子'
        case 'comment':
            return '评论'
        case 'user':
            return '用户'
        case 'other':
            return '其他'
        default:
            return '未知'
    }
}

const filterTable = () => {
    const keyword = search.value.trim().toLowerCase();
    let filtered = tableData.value.filter(item => {
        return item.name.toLowerCase().includes(keyword);
    });
    
    // 根据类型进一步筛选
    if (filterType.value !== 'all') {
        filtered = filtered.filter(item => item.reported_type === filterType.value);
    }
    
    filteredData.value = filtered;
}

// 按类型筛选
const filterByType = (type) => {
    filterType.value = type;
    filterTable();
}

const changeTabs = (status) => {
    if (locked.value) return;
    param.value.status = status;
    filterType.value = 'all';
    fetchData();
}

const getReportStats = () => {
    axios.get('/getReportStats').then(res => {
        rpcount.value = res.data.total || 0;
        nrpcount.value = res.data.status[0] || 0;
    }).catch(error => {
        console.error('获取投诉统计数据失败:', error);
    });
}

onMounted(async () => {
    await fetchData();
    getReportStats();
})

const fetchData = async () => {
    try {
        locked.value = true;
        loading.value = true;
        let res = await store.fetchApiPostData(api.value, {
            ...param.value,
            paged: paged.value
        });
        change(res);
    } catch (error) {
        console.error('获取投诉数据失败:', error);
        isDataEmpty.value = true;
    } finally {
        loading.value = false;
        locked.value = false;
    }
}

const recordOldValue = (item, field) => {
    editingField.value[item.id + '_' + field] = item[field];
};

const handleFieldUpdate = async (item, field, confirmMessage) => {
    const key = item.id + '_' + field;
    const oldValue = editingField.value[key];

    if (item[field] === oldValue) return;

    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) {
        item[field] = oldValue; // 用户取消，恢复旧值
        return;
    }

    try {
        await store.fetchApiPostData('UpdateReport', {
            id: item.id,
            field,
            value: item[field]
        });
        message({
            message: '更新成功',
            type: 'success'
        });
        // 刷新数据
        await fetchData();
        getReportStats();
    } catch (err) {
        console.error('更新投诉数据失败:', err);
        message({
            message: '更新失败',
            type: 'error'
        });
        item[field] = oldValue; // 更新失败，恢复旧值
    }
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  scrollbar-width: none;
}
</style>