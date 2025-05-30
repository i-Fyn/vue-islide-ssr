<template>
  <div class="flex flex-col gap-4">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="flex items-center gap-4 p-4 rounded-xl shadow-sm transition-all bg-primary/10 hover:-translate-y-1 hover:">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl text-2xl text-primary">
          <i class="ri-shopping-bag-line"></i>
        </div>
        <div class="flex flex-col">
          <div class="text-2xl font-semibold leading-tight">{{ allOrders }}</div>
          <div class="text-sm text-base-content/70">订单总数</div>
        </div>
      </div>
      
      <div class="flex items-center gap-4 p-4 rounded-xl shadow-sm transition-all bg-success/10 hover:-translate-y-1 hover:">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl text-2xl text-success">
          <i class="ri-calendar-check-line"></i>
        </div>
        <div class="flex flex-col">
          <div class="text-2xl font-semibold leading-tight">{{ todayOrders }}</div>
          <div class="text-sm text-base-content/70">今日订单</div>
        </div>
      </div>
      
      <div class="flex items-center gap-4 p-4 rounded-xl shadow-sm transition-all bg-warning/10 hover:-translate-y-1 hover:">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl text-2xl text-warning">
          <i class="ri-time-line"></i>
        </div>
        <div class="flex flex-col">
          <div class="text-2xl font-semibold leading-tight">{{ getPendingOrders() }}</div>
          <div class="text-sm text-base-content/70">待处理订单</div>
        </div>
      </div>
      
      <div class="flex items-center gap-4 p-4 rounded-xl shadow-sm transition-all bg-info/10 hover:-translate-y-1 hover:">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl text-2xl text-info">
          <i class="ri-line-chart-line"></i>
        </div>
        <div class="flex flex-col">
          <div class="text-2xl font-semibold leading-tight">{{ getCompletedOrders() }}</div>
          <div class="text-sm text-base-content/70">已完成订单</div>
        </div>
      </div>
    </div>

    <!-- 订单管理卡片 -->
    <div class="card bg-base-100 ">
      <div class="card-body p-0">
        <!-- 订单类型标签页 -->
        <div class="p-4 border-b border-base-200">
          <div class="scroll-x">
            <div class="tabs tabs-boxed bg-base-200/50 p-1">
              <a v-for="(tab, index) in tabs" 
                :key="tab.type"
                :class="['tab', tab.type == param.order_type ? 'tab-active' : '']"
                @click="changeTabs(tab.type, index)">
                {{ tab.name }}
              </a>
            </div>
          </div>
        </div>

        <!-- 订单状态标签页 -->
        <div class="px-5 pb-3 pt-2 border-b border-base-200">
          <div class="scroll-x">
            <div class="tabs">
              <a v-for="(tab, index) in tabs2" 
                :key="tab.type"
                :class="['tab', 'tab-sm', tab.type == param.order_state ? 'tab-active' : '']"
                @click="changeTabs2(tab.type, index)">
                <span class="badge badge-xs mr-1" :class="`bg-${getStatusClass(tab.type)}`"></span>
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
                placeholder="搜索订单号、用户或商品..." 
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
                <th>订单号</th>
                <th>购买用户</th>
                <th>商品</th>
                <th>订单类型</th>
                <th>商品类型</th>
                <th>订单状态</th>
                <th>订单时间</th>
                <th>订单数量</th>
                <th>运单号</th>
                <th>产品单价</th>
                <th>订单总价</th>
                <th>货币类型</th>
                <th>支付渠道</th>
                <th>收货地址</th>
                <th>IP地址</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in data" :key="item.id" class="hover">
                <td class="sticky left-0 bg-inherit">
                  <input type="checkbox" class="checkbox checkbox-sm"
                    v-model="selectedIds" 
                    :value="item.id" />
                </td>
                <td>{{ item.id }}</td>
                <td class="font-mono font-medium">{{ item.order_id }}</td>
                <td>{{ item.user_display }}</td>
                <td class="max-w-[15rem] truncate">{{ item.post_title }}</td>
                <td>
                  <div class="badge badge-outline w-max">{{ orderTypes[item.order_type] }}</div>
                </td>
                <td>
                  <div class="badge badge-outline w-max" :class="item.order_commodity === '1' ? 'badge-accent' : 'badge-ghost'">
                    {{ orderCommoditys[item.order_commodity] }}
                  </div>
                </td>
                <td>
                  <select class="select select-bordered select-xs w-max"
                    v-model="item.order_state" 
                    @mousedown="recordOldValue(item, 'order_state')"
                    @change="handleOrderFieldUpdate(item, 'order_state',`确定将订单 #${item.order_id} 状态修改为 [${orderStates[item.order_state]}]吗？`)"
                    :class="`bg-${getStatusClass(item.order_state)}/10 text-${getStatusClass(item.order_state)}`">
                    <option v-for="option in statusOptions" 
                      :key="option.value"
                      :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </td>
                <td>{{ item.order_date }}</td>
                <td>{{ item.order_count }}</td>
                <td>
                  <input type="text" class="input input-bordered input-xs w-max"
                    v-model="item.tracking_number"
                    placeholder="输入运单号"
                    @focus="recordOldValue(item, 'tracking_number')"
                    @blur="handleOrderFieldUpdate(item, 'tracking_number',`确定将订单 #${item.order_id} 运单号修改为 [${item.tracking_number}] 吗？`)" />
                </td>
                <td>{{ item.order_price }}</td>
                <td class="font-medium text-primary">{{ item.order_total }}</td>
                <td>
                  <div class="badge w-max" :class="item.money_type === '0' ? 'badge-primary' : 'badge-secondary'">
                    {{ moneyTypes[item.money_type] }}
                  </div>
                </td>
                <td>
                  <div class="badge w-max" :class="{
                    'bg-blue-100 text-blue-700': item.pay_type === 'alipay' || item.pay_type === 'yipay',
                    'bg-green-100 text-green-700': item.pay_type === 'wecatpay',
                    'badge-primary': item.pay_type === 'balance',
                    'badge-secondary': item.pay_type === 'credit',
                    'badge-ghost': !['alipay', 'yipay', 'wecatpay', 'balance', 'credit'].includes(item.pay_type)
                  }">
                    {{ payTypes[item.pay_type] }}
                  </div>
                </td>
                <td>
                  <input type="text" class="input input-bordered input-xs w-max"
                    v-model="item.order_address"
                    placeholder="输入收货地址"
                    @focus="recordOldValue(item, 'order_address')"
                    @blur="handleOrderFieldUpdate(item, 'order_address',`确定将订单 #${item.order_id} 收货地址修改为 [${item.order_address}] 吗？`)" />
                </td>
                <td >{{ item.ip_address }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 加载中 -->
        <div class="flex flex-col items-center justify-center py-16" v-else-if="!data.length && loading && !isDataEmpty">
          <span class="loading loading-spinner loading-lg text-primary"></span>
          <span class="mt-4 text-base-content/60 text-sm">加载订单数据中...</span>
        </div>

        <!-- 空状态 -->
        <div class="flex flex-col items-center justify-center py-16" v-else-if="!data.length && isDataEmpty">
          <van-empty image-size="10rem" description="暂无订单数据" />
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

import { ref, onMounted, nextTick, computed } from 'vue'
import PageNav from "@/components/footer/PageNav.vue"
import { useStore } from '@/store'
import { createMessage as message } from '@/dist/message';
import axios from '@/dist/axios';

const store = useStore();
const data = ref([]);
const api = ref('getOrderList');
const param = ref({
    size: 10,
    order_type: '',
    order_state: '',
});
const allOrders = ref(0);
const todayOrders = ref(0);


const tabs = ref([
  { name: '全部', type: '' }, 
  { name: '购物', type: 'shop' }, 
  { name: '文章内购', type: 'post_neigou' }, 
  { name: '资源下载', type: 'xiazai' }, 
  { name: '余额充值', type: 'money_chongzhi' }, 
  { name: 'VIP购买', type: 'vip_goumai' }, 
  { name: '积分购买', type: 'credit_chongzhi' }, 
  { name: '视频购买', type: 'video' }, 
  { name: '支付入圈', type: 'join_circle' }, 
  { name: '认证', type: 'verify' }, 
  { name: '赞助', type: 'sponsor' }
]);

const tabs2 = ref([
  { name: '全部', type: '' }, 
  { name: '待支付', type: '0' }, 
  { name: '已支付', type: '1' }, 
  { name: '已发货', type: '2' }, 
  { name: '已完成', type: '3' }, 
  { name: '已退款', type: '4' }, 
  { name: '已删除', type: '5' }
]);

const payTypes = {
    'xunhu': '迅虎支付',
    'xunhu_hupijiao': '迅虎虎皮椒支付',
    'balance': '余额支付',
    'credit': '积分支付',
    'card': '卡密支付',
    'yipay': '易支付OR码支付',
    'alipay': '支付宝官方',
    'wecatpay': '微信官方',
}

const statusOptions = [
    { label: '待支付', value: '0' },
    { label: '已支付', value: '1' },
    { label: '已发货', value: '2' },
    { label: '已完成', value: '3' },
    { label: '已退款', value: '4' },
    { label: '已删除', value: '5' }
]

const orderTypes = {
    'shop': '购物',
    'post_neigou': '文章内购',
    'xiazai': '资源下载',
    'money_chongzhi': '余额充值',
    'vip_goumai': 'VIP购买',
    'credit_chongzhi': '积分购买',
    'video': '视频购买',
    'join_circle': '支付入圈',
    'verify': '认证',
    'sponsor': '赞助',
}


const orderCommoditys = {
    '0': '虚拟商品',
    '1': '实物商品',
}


const orderStates = {
    '0': '待支付',
    '1': '已付款未发货',
    '2': '已发货',
    '3': '已完成',
    '4': '已退款',
    '5': '已删除'
}

const moneyTypes = {
    '0': '金额',
    '1': '积分',
}

const orderColors = {
    '0': 'red',        // 待支付状态颜色为红色
    '1': 'orange',     // 已付款未发货状态颜色为橙色
    '2': 'blue',       // 已发货状态颜色为蓝色
    '3': 'green',      // 已完成状态颜色为绿色
    '4': 'purple',     // 已退款状态颜色为紫色
    '5': 'gray'        // 已删除状态颜色为灰色
}

// 获取订单状态对应的样式类
const getStatusClass = (state) => {
  switch(state) {
    case '0': return 'unpaid';
    case '1': return 'paid';
    case '2': return 'shipping';
    case '3': return 'completed';
    case '4': return 'refunded';
    case '5': return 'deleted';
    default: return '';
  }
};

// 获取待处理订单数量
const getPendingOrders = () => {
  return data.value.filter(order => order.order_state === '1').length;
};

// 获取已完成订单数量
const getCompletedOrders = () => {
  return data.value.filter(order => order.order_state === '3').length;
};

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

// 记录编辑前的值
const recordOldValue = (item, field) => {
    editingField.value = {
        id: item.id,
        field,
        oldValue: item[field]
    };
};

// 过滤表格
const filterTable = () => {
    if (!search.value.trim()) {
        data.value = [...originalData.value];
        return;
    }

    const searchLower = search.value.toLowerCase();
    data.value = originalData.value.filter(item => {
        return (
            (item.order_id && item.order_id.toLowerCase().includes(searchLower)) ||
            (item.user_display && item.user_display.toLowerCase().includes(searchLower)) ||
            (item.post_title && item.post_title.toLowerCase().includes(searchLower))
        );
    });
};

// 批量删除
const deleteSelected = async () => {
    if (!selectedIds.value.length) return;
    
    if (window.confirm(`确定要删除选中的 ${selectedIds.value.length} 个订单吗？`)) {
        try {
            locked.value = true;
            const res = await axios.post('/deleteOrders', { ids: selectedIds.value });
            message({ message: '批量删除订单成功！', type: 'success' });
            
            // 从数据中移除已删除的订单
            data.value = data.value.filter(item => !selectedIds.value.includes(item.id));
            originalData.value = originalData.value.filter(item => !selectedIds.value.includes(item.id));
            selectedIds.value = [];
            selectAll.value = false;
        } catch (err) {
            message({ message: err.response?.data?.message || '批量删除失败', type: 'error' });
        } finally {
            locked.value = false;
        }
    }
};

// 处理订单字段更新
const handleOrderFieldUpdate = async (item, field, confirmMsg) => {
    // 如果值没有变化，不执行更新
    if (editingField.value.oldValue === item[field]) return;
    
    if (window.confirm(confirmMsg)) {
        try {
            locked.value = true;
            const params = { id: item.id };
            params[field] = item[field];
            
            const res = await axios.post('/updateOrderField', params);
            message({ message: '订单更新成功！', type: 'success' });
            
            // 更新原始数据中对应的值
            const originalIndex = originalData.value.findIndex(orig => orig.id === item.id);
            if (originalIndex !== -1) {
                originalData.value[originalIndex][field] = item[field];
            }
        } catch (err) {
            // 恢复原始值
            item[field] = editingField.value.oldValue;
            message({ message: err.response?.data?.message || '更新失败', type: 'error' });
        } finally {
            locked.value = false;
        }
    } else {
        // 用户取消，恢复原始值
        item[field] = editingField.value.oldValue;
    }
};

// 切换订单类型标签
const changeTabs = async (type, index) => {
    if (locked.value) return;
    locked.value = true;
    param.value.order_type = type;
    data.value = [];
    originalData.value = [];
    selectedIds.value = [];
    selectAll.value = false;
    isDataEmpty.value = false;
    await fetchData();
};

// 切换订单状态标签
const changeTabs2 = async (type, index) => {
    if (locked.value) return;
    locked.value = true;
    param.value.order_state = type;
    data.value = [];
    originalData.value = [];
    selectedIds.value = [];
    selectAll.value = false;
    isDataEmpty.value = false;
    await fetchData();
};

// 获取数据
const change = (recievedData) => {
    data.value = recievedData.data;
    originalData.value = [...recievedData.data];  // 保存原始数据
    allOrders.value = recievedData.total || 0;
    todayOrders.value = recievedData.today || 0;
    pages.value = recievedData.pages || 1;
    isDataEmpty.value = !data.value.length;
    loading.value = false;
    locked.value = false;
};

const fetchData = async () => {
    try {
        loading.value = true;
        locked.value = true;
        const res = await store.fetchApiPostData(api.value, {
            ...param.value,
            paged: paged.value
        });
        change(res);
    } catch (error) {
        console.error('获取订单数据失败:', error);
        isDataEmpty.value = true;
        loading.value = false;
        locked.value = false;
    }
};

onMounted(async () => {
    await fetchData();
});

</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  scrollbar-width: none;
}

/* 状态样式 */
.status-unpaid {
  color: var(--color-error);
  background-color: var(--color-error);
}

.status-paid {
  color: var(--color-warning);
  background-color: var(--color-warning);
}

.status-shipping {
  color: var(--color-info);
  background-color: var(--color-info);
}

.status-completed {
  color: var(--color-success);
  background-color: var(--color-success);
}

.status-refunded {
  color: var(--color-secondary);
  background-color: var(--color-secondary);
}

.status-deleted {
  color: var(--color-base-300);
  background-color: var(--color-base-300);
}
</style>
