<template>
  <div class="flex flex-col gap-4">
    <!-- 订单状态筛选 -->
    <div class="card bg-base-100  overflow-hidden">
      <div class="card-body p-4">
        <div class="tabs-container">
          <div class="tabs-wrapper">
            <a v-for="tab in tabs" 
              @click="changeTabs(tab.value)"
              :class="['tab', {'active-tab': tab.value == param.state}]">
              <i :class="getTabIcon(tab.value)"></i>
              {{ tab.name }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 订单列表 -->
    <div v-if="data.length" class="flex flex-col gap-4 scroll-y">
      <div v-for="item in data" class="card bg-base-100  hover:shadow-lg transition-all duration-300">
        <!-- 订单头部 -->
        <div class="card-body p-4">
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10">
                <i class="ri-store-2-line text-primary"></i>
              </div>
              <span class="font-medium">{{ item._order_type }}</span>
            </div>
            <div :class="[
              'status-badge',
              {
                'status-unpaid': !item.order_state,
                'status-pending': item.order_state == 1,
                'status-shipping': item.order_state == 2, 
                'status-completed': item.order_state == 3
              }
            ]">{{ item._order_state }}</div>
          </div>

          <!-- 商品信息 -->
          <div class="order-product">
            <div class="product-thumb">
              <van-image lazy-load :src="item.product.thumb" class="thumb-image" />
            </div>
            <div class="product-info">
              <div class="product-name">{{ item.product.name }}</div>
              <div class="product-meta">数量: {{ item.product.count }}</div>
            </div>
            <div class="product-price">{{ (item.pay_type == 'credit' ? '积分 ' : '￥') + item.order_price }}</div>
          </div>

          <!-- 订单金额 -->
          <div class="order-total">
            实付: <span class="total-amount">{{ (item.pay_type == 'credit' ? '积分 ' : '￥') + item.order_total }}</span>
          </div>

          <!-- 订单操作 -->
          <div class="order-actions">
            <button class="action-button action-delete" @click="deleteOrder(item)">
              <i class="ri-delete-bin-line"></i>
              <span>删除</span>
            </button>
            <a v-if="(item.post_id == '0' && isWithin7Days(item.order_date)) || item.post_id != '0'"
              :href="item.product.whisper" 
              class="action-button action-support">
              <i class="ri-customer-service-line"></i>
              <span>售后</span>
            </a>
            <button v-if="item.order_state == '0'" class="action-button action-pay">
              <i class="ri-bank-card-line"></i>
              <span>支付</span>
            </button>
          </div>

          <!-- 订单详情 -->
          <div class="order-details">
            <div class="detail-item">
              <span class="detail-label">订单编号</span>
              <span class="detail-value font-mono">#{{ item.order_id }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">下单时间</span>
              <span class="detail-value">{{ item.order_date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!data.length && isDataEmpty" class="empty-state">
      <van-empty image-size="10rem" description="暂无订单" />
      <button class="btn btn-sm btn-outline mt-4" @click="fetchData">刷新</button>
    </div>

    <!-- 分页 -->
    <div class="card bg-base-100  p-4">
      <PageNav ref="jsonPageNav" :paged="paged" :pages="pages" navtype="json" type="page" :api="api"
        :param="param" @change="change">
      </PageNav>
    </div>
  </div>
</template>
<script setup>

import { ref, onMounted, onServerPrefetch, nextTick } from 'vue'
import PageNav from "@/components/footer/PageNav.vue"
import axios from '@/dist/axios'
import { createMessage as message } from '@/dist/message';
import { useStore } from '@/store'

const store = useStore();
const data = ref([]);
const api = ref('getUserOrders');
const param = ref({
    size: 6,
    state: 6
});
const tabs = ref([
  { name: '全部', value: 6 }, 
  { name: '已完成', value: 3 }, 
  { name: '待支付', value: 0 }
]);


const isDataEmpty = ref(false);
const loading = ref(true);
const locked = ref(false);
const jsonPageNav = ref(null);
const paged = ref(1);
const pages = ref(1);

// 获取标签页图标
const getTabIcon = (value) => {
  switch(parseInt(value)) {
    case 6: return 'ri-file-list-line';
    case 3: return 'ri-check-double-line';
    case 0: return 'ri-time-line';
    default: return 'ri-file-list-line';
  }
};

const change = (recievedData) => {
    data.value.push(...recievedData.data);
    isDataEmpty.value = (data.value.length === 0);
    loading.value = !loading.value;
}

const deleteOrder = (order) => {
    if (locked.value) return;
    if (window.confirm('确定要删除该订单吗？')) {
        locked.value = true;
        axios.post('/deleteOrder', order).then((res) => {
            locked.value = false;

            // 从数组中移除相应的元素
            const index = data.value.findIndex(item => item.order_id === order.order_id);
            if (index !== -1) {
                data.value.splice(index, 1);
            }

            message({ message: '删除订单成功！', type: 'success' });

        }).catch((err) => {
            locked.value = false;
            message({ message: err.response.data.message, type: 'warning' });
        });
    }
}

const isWithin7Days = (dateString) => {
    // 将给定的时间字符串转换为Date对象
    const targetDate = new Date(dateString);

    // 获取当前时间
    const currentDate = new Date();

    // 计算两个时间之间的毫秒差值
    const timeDiff = targetDate.getTime() - currentDate.getTime();

    // 将毫秒差值转换为天数
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // 判断天数差
    return daysDiff > -3;
}


const changeTabs = async (value) => {
    param.value.state = value;
    data.value = [];
    await fetchData();
}

onMounted(async () => {
    await fetchData();
});

const fetchData = async () => {
    try {
        locked.value = true;
        loading.value = true;
        let res = await store.fetchApiPostData(api.value, Object.assign(param.value, { paged: paged.value }));
        change(res);
    } catch (error) {
        console.error('获取订单数据失败:', error);
    } finally {
        locked.value = false;
    }
};

onServerPrefetch(async () => {
    await fetchData();
});

</script>

<style scoped>
/* 卡片样式 */
.card {
  border-radius: 0.75rem;
  overflow: hidden;
}

.card-body {
  padding: 1.25rem;
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

.tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-base-content, #374151);
  transition: all 0.3s ease;
  cursor: pointer;
}

.tab:hover {
  background-color: rgba(var(--color-primary-rgb, 59, 130, 246), 0.05);
}

.active-tab {
  background-color: rgba(var(--color-primary-rgb, 59, 130, 246), 0.1);
  color: var(--color-primary, #3B82F6);
  font-weight: 500;
}

/* 状态标签样式 */
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-unpaid {
  background-color: rgba(var(--color-error-rgb, 239, 68, 68), 0.1);
  color: var(--color-error, #EF4444);
}

.status-pending {
  background-color: rgba(var(--color-warning-rgb, 245, 158, 11), 0.1);
  color: var(--color-warning, #F59E0B);
}

.status-shipping {
  background-color: rgba(var(--color-info-rgb, 6, 182, 212), 0.1);
  color: var(--color-info, #06B6D4);
}

.status-completed {
  background-color: rgba(var(--color-success-rgb, 34, 197, 94), 0.1);
  color: var(--color-success, #22C55E);
}

/* 订单商品样式 */
.order-product {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: rgba(var(--color-base-200-rgb, 229, 231, 235), 0.3);
  border-radius: 0.5rem;
}

.product-thumb {
  width: 4rem;
  height: 4rem;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid rgba(var(--color-base-300-rgb, 209, 213, 219), 0.5);
}

.thumb-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 0.25rem;
}

.product-meta {
  font-size: 0.75rem;
}

.product-price {
  font-weight: 500;
  font-size: 0.875rem;
}

/* 订单金额样式 */
.order-total {
  text-align: right;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.total-amount {
  font-weight: 600;
  font-size: 1rem;
  color: var(--color-primary, #3B82F6);
  margin-left: 0.25rem;
}

/* 操作按钮样式 */
.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.action-delete {
  background-color: transparent;
}


.action-support {
  color: var(--color-success, #22C55E);
}

.action-support:hover {
  background-color: rgba(var(--color-success-rgb, 34, 197, 94), 0.15);
}

.action-pay {
  background-color: rgba(var(--color-warning-rgb, 245, 158, 11), 0.1);
  border: 1px solid rgba(var(--color-warning-rgb, 245, 158, 11), 0.2);
  color: var(--color-warning, #F59E0B);
}

.action-pay:hover {
  background-color: rgba(var(--color-warning-rgb, 245, 158, 11), 0.15);
}

/* 订单详情样式 */
.order-details {
  padding-top: 1rem;
  border-top: 1px solid var(--color-base-200);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
}



/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  background-color: var(--color-base-100, white);
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
</style>