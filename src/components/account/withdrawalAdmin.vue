<template>
  <div class="flex flex-col gap-4">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="flex items-center gap-4 p-4 rounded-xl shadow-sm transition-all bg-primary/10 hover:-translate-y-1 hover:">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl text-2xl text-primary">
          <i class="ri-money-dollar-circle-line"></i>
        </div>
        <div class="flex flex-col">
          <div class="text-2xl font-semibold leading-tight">{{ allWithdrawals }}</div>
          <div class="text-sm text-base-content/70">提现申请</div>
        </div>
      </div>
      
      <div class="flex items-center gap-4 p-4 rounded-xl shadow-sm transition-all bg-warning/10 hover:-translate-y-1 hover:">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl text-2xl text-warning">
          <i class="ri-time-line"></i>
        </div>
        <div class="flex flex-col">
          <div class="text-2xl font-semibold leading-tight">{{ unprocessed }}</div>
          <div class="text-sm text-base-content/70">待审核提现</div>
        </div>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="card bg-base-100 ">
      <div class="card-body p-0">
        <!-- 标签页 -->
        <div class="p-4 border-b border-base-200">
          <div class="scroll-x">
            <div class="tabs tabs-boxed bg-base-200/50 p-1">
              <a v-for="(tab, index) in tabs" 
                :key="tab.status"
                :class="['tab', tab.status == param.status ? 'tab-active' : '']"
                @click="changeTabs(tab.status, index)">
                {{ tab.name }}
              </a>
            </div>
          </div>
        </div>

        <!-- 搜索和操作栏 -->
        <div class="p-4 border-b border-base-200 flex  gap-4 justify-between items-center">
          <div class="join">
            <div class="join-item relative">
              <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 opacity-50 z-1"></i>
              <input type="text" v-model="search" 
                placeholder="搜索" 
                class="input input-bordered pl-10 w-full lg:w-80 input-sm"
                @input="filterTable" />
            </div>
          </div>
          
          <button class="btn btn-error btn-sm btn-outline gap-2" 
            @click="deleteSelected"
            :disabled="selectedIds.length === 0">
            <i class="ri-delete-bin-line"></i>
            <span>批量删除</span>
            <span v-if="selectedIds.length > 0" class="badge badge-sm badge-error text-white">{{ selectedIds.length }}</span>
          </button>
        </div>

        <!-- 表格 -->
        <div class="scroll-x" v-if="data.length">
          <table class="table table-zebra table-sm table-pin-rows">
            <thead>
              <tr>
                <th class="sticky left-0 z-10">
                  <input type="checkbox" class="checkbox checkbox-sm" 
                    v-model="selectAll" 
                    @change="toggleSelectAll" />
                </th>
                <th>ID</th>
                <th>提现状态</th>
                <th>提现用户</th>
                <th>提现类型</th>
                <th>申请金额</th>
                <th>手续费</th>
                <th>实付金额</th>
                <th>提现时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in data" :key="item.id" class="hover">
                <td class="sticky left-0 bg-inherit">
                  <input type="checkbox" class="checkbox checkbox-sm"
                    v-model="selectedIds" 
                    :value="item.id" />
                </td>
                <td>{{ item.id }}</td>
                <td>{{ item.name }}</td>
                <td>
                  <select class="select select-bordered select-sm w-max"
                    :class="{
                      'text-warning': item.status === '0',
                      'text-success': item.status === '1'
                    }"
                    v-model="item.status"
                    @mousedown="recordOldValue(item, 'status')"
                    @change="handleOrderFieldUpdate(item, 'status',`确定将提现申请状态修改为 [${orderStates[item.status]}]吗？`)">
                    <option v-for="option in options" 
                      :key="option.value"
                      :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </td>
                <td>
                  <div class="badge w-max" :class="{
                    'badge-primary': item.record_type === 'money',
                    'badge-secondary': item.record_type === 'commission'
                  }">
                    {{ orderTypes[item.record_type] }}
                  </div>
                </td>
                <td class="font-medium">{{ item.value }}</td>
                <td>{{ item.record_value }}</td>
                <td>{{ item.record_key }}</td>
                <td>{{ item.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 加载中 -->
        <div class="flex flex-col items-center justify-center py-16" v-else-if="loading && !isDataEmpty">
          <span class="loading loading-spinner loading-lg text-primary"></span>
          <span class="mt-4 text-base-content/60 text-sm">加载提现数据中...</span>
        </div>

        <!-- 空状态 -->
        <div class="flex flex-col items-center justify-center py-16" v-else-if="!data.length && isDataEmpty">
          <van-empty image-size="10rem" description="暂无提现数据" />
          <button class="btn btn-sm btn-outline mt-4" @click="fetchData">刷新数据</button>
        </div>

        <!-- 分页 -->
        <div class="p-4 border-t border-base-200">
          <PageNav ref="jsonPageNav" :paged="paged" :pages="pages" 
            navtype="json" type="page" :api="api"
            :param="param" @change="change" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>

import { ref, onMounted } from 'vue'
import PageNav from "@/components/footer/PageNav.vue"
import { useStore } from '@/store'
import { createMessage as message } from '@/dist/message';
import axios from '@/dist/axios';

const store = useStore();
const data = ref([]);
const api = ref('getWithdrawalList');
const param = ref({
    size: 10,
    status: '',
});
const allWithdrawals = ref(0);
const unprocessed = ref(0);


const tabs = ref([{ name: '全部', status: '' }, { name: '待审核', status: '0' }, { name: '已提现', status: '1' }])



const orderTypes = {
    'money': '余额提现',
    'commission': '佣金提现',
}



const options = [
    { label: '待审核', value: '0' },
    { label: '已提现', value: '1' },
]

const orderStates = {
    '0': '待审核',
    '1': '已提现',
}



const orderColors = {
    '0': 'orange',
    '1': 'green',
}

const originalData = ref([]); // 缓存原始数据
const isDataEmpty = ref(false);
const loading = ref(true);
const locked = ref(false);
const jsonPageNav = ref(null);
const paged = ref(1);
const pages = ref(1);
const search = ref('');
const selectedIds = ref([]);
const selectAll = ref(false);
const editingField = ref({});

// 切换全选
const toggleSelectAll = () => {
    if (selectAll.value) {
        selectedIds.value = data.value.map(item => item.id);
    } else {
        selectedIds.value = [];
    }
};

const getWithdrawalStats = () => {
    axios.get('/getWithdrawalStats').then(res => {
        allWithdrawals.value = res.data.total;
        unprocessed.value = res.data.unprocessed;
    })
}



// 删除操作
const deleteSelected = async () => {
    if (!selectedIds.value.length) return;

    if (!confirm(`确认删除选中 ${selectedIds.value.length} 项？`)) return;
    try {
        const res = await store.fetchApiPostData('deleteWithdrawalList', {
            ids: selectedIds.value
        });
        // 删除成功后更新视图
        data.value = data.value.filter(item => !selectedIds.value.includes(item.id));
        originalData.value = originalData.value.filter(item => !selectedIds.value.includes(item.id));
        selectedIds.value = [];
        selectAll.value = false;
        message({ message: '删除成功', type: 'success' })
    } catch (err) {
        console.error(err);
    }
};
// 搜索过滤
const filterTable = () => {
    const keyword = search.value.trim().toLowerCase();

    if (!keyword) {
        data.value = [...originalData.value];
    } else {
        data.value = originalData.value.filter(item =>
            item.user_display.toLowerCase().includes(keyword) ||
            item.post_title.toLowerCase().includes(keyword)
        );
    }
};


const change = (recievedData) => {
    originalData.value = [...recievedData.data];
    data.value = [...originalData.value]; // 初始显示所有
    pages.value = recievedData.pages;
    isDataEmpty.value = (data.value.length === 0);
    loading.value = !loading.value;
}


const changeTabs = async (value, index) => {
    param.value.status = value;
    data.value = [];
    await fetchData();
}

onMounted(async () => {
    await fetchData()
    getWithdrawalStats();
});

const fetchData = async () => {
    try {
        locked.value = true
        loading.value = true
        let res = await store.fetchApiPostData(api.value, Object.assign(param.value, { paged: paged.value }))
        change(res)
    } catch (error) {
    }
}



const recordOldValue = (item, field) => {
    editingField.value[item.id + '_' + field] = item[field];
};

const handleOrderFieldUpdate = async (item, field, confirmMessage) => {
    const key = item.id + '_' + field;
    const oldValue = editingField.value[key];

    if (item[field] === oldValue) return;

    const confirmed = confirm(confirmMessage);
    if (!confirmed) {
        item[field] = oldValue; // 用户取消，恢复旧值
        return;
    }

    try {
        await store.fetchApiPostData('updateWithdrawalField', {
            id: item.id,
            field,
            value: item[field]
        });
        message({
            message: `已更新`,
            type: 'success'
        });
        jsonPageNav.value.load(1); // 更新分页
    } catch (err) {
        item[field] = oldValue; // 请求失败也回退
        message({ message: '更新失败，请稍后再试', type: 'error' });
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