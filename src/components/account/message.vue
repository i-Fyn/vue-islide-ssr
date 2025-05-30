<template>
  <div class="flex flex-col gap-4">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="flex items-center gap-4 p-4 rounded-xl shadow-sm transition-all bg-primary/10 hover:-translate-y-1 hover:">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl text-2xl text-primary">
          <i class="ri-message-3-line"></i>
        </div>
        <div class="flex flex-col">
          <div class="text-2xl font-semibold leading-tight">{{ msgCount }}</div>
          <div class="text-sm text-base-content/70">信息数量</div>
        </div>
      </div>
      
      <div class="flex items-center gap-4 p-4 rounded-xl shadow-sm transition-all bg-success/10 hover:-translate-y-1 hover:">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl text-2xl text-success">
          <i class="ri-notification-4-line"></i>
        </div>
        <div class="flex flex-col">
          <div class="text-2xl font-semibold leading-tight">推送</div>
          <div class="flex items-center gap-2 mt-1">
            <button class="btn btn-success btn-sm" @click="handleClick">
              <i class="ri-send-plane-fill mr-1"></i>推送消息
            </button>
          </div>
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
                :key="tab.type"
                :class="['tab', tab.type == param.type ? 'tab-active' : '']"
                @click="changeTabs(tab.type, index)">
                {{ tab.name }}
              </a>
            </div>
          </div>
        </div>

        <!-- 搜索和操作栏 -->
        <div class="p-4 border-b border-base-200 flex  gap-4 justify-between items-center">
          <div class="join">
            <div class="join-item relative  ">
              <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 opacity-50 z-1"></i>
              <input type="text" v-model="search" 
                placeholder="搜索发送者、接收者或标题..." 
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
                <th>发送者</th>
                <th>接受者</th>
                <th>消息标题</th>
                <th>消息内容</th>
                <th>消息类型</th>
                <th>其他内容</th>
                <th>时间</th>
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
                <td>{{ item.sender_name }}</td>
                <td>{{ item.receiver_name }}</td>
                <td class="font-medium">{{ item.title }}</td>
                <td class="max-w-xs truncate">{{ item.content }}</td>
                <td>
                  <div class="badge" :class="{
                    'badge-primary': item.type === 'system',
                    'badge-secondary': item.type === 'chat',
                    'badge-accent': item.type === 'vip',
                    'badge-info': item.type === 'wallet',
                    'badge-success': item.type === 'follow',
                    'badge-warning': item.type === 'like',
                    'badge-ghost': !['system', 'chat', 'vip', 'wallet', 'follow', 'like'].includes(item.type)
                  }">
                    {{ item.type }}
                  </div>
                </td>
                <td>{{ item.mark }}</td>
                <td>{{ item.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 加载中 -->
        <div class="flex flex-col items-center justify-center py-16" v-else-if="loading && !isDataEmpty">
          <span class="loading loading-spinner loading-lg text-primary"></span>
          <span class="mt-4 text-base-content/60 text-sm">加载消息数据中...</span>
        </div>

        <!-- 空状态 -->
        <div class="flex flex-col items-center justify-center py-16" v-else-if="!data.length && isDataEmpty">
          <van-empty image-size="10rem" description="暂无消息数据" />
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

import { ref, onMounted, onServerPrefetch,nextTick} from 'vue'
import PageNav from "@/components/footer/PageNav.vue"
import { useStore } from '@/store'
import { createMessage as message } from '@/dist/message';
import { createVanModal } from '@/dist/createVanModal'

const store = useStore();
const data = ref([]);
const api = ref('getMsgList');
const param = ref({
    size: 10,
    type: ''
});
const tabs = ref([{ name: '全部', type: '' }, { name: '私聊', type: 'chat' }, { name: '会员通知', type: 'vip' }, { name: '钱包通知', type: 'wallet' }, { name: '服务通知', type: 'serve' }, { name: '系统通知', type: 'system' }, { name: '新粉丝', type: 'follow' }, { name: '收到的赞', type: 'like' }, { name: '互动消息', type: 'comment' }, { name: '圈子消息', type: 'circle' }, { name: '推广返佣', type: 'distribution' }])



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
const msgCount = ref(0)

// 切换全选
const toggleSelectAll = () => {
    if (selectAll.value) {
        selectedIds.value = data.value.map(item => item.id);
    } else {
        selectedIds.value = [];
    }
};

//复制卡密


// 删除操作
const deleteSelected = async () => {
    if (!selectedIds.value.length) return;

    if (!confirm(`确认删除选中 ${selectedIds.value.length} 项？`)) return;
    try {
        const res = await store.fetchApiPostData('deleteMsgList', {
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
            item.sender_name.toLowerCase().includes(keyword) ||
            item.receiver_name.toLowerCase().includes(keyword) ||
            item.title.toLowerCase().includes(keyword)
        );
    }
};


const change = (recievedData) => {
    originalData.value = [...recievedData.data];
    data.value = [...originalData.value]; // 初始显示所有
    isDataEmpty.value = (data.value.length === 0);
    loading.value = !loading.value;
    pages.value = recievedData.pages;
    if(param.value.type==''){
        msgCount.value=recievedData.count
    }
}


const changeTabs = async (value, index) => {
    param.value.type = value;
    data.value = [];
    await fetchData();
}

onMounted(async () => {
    await fetchData()
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

onServerPrefetch(async () => {
    await fetchData()
})



const handleClick = () => {
    import('@/components/account/message/PushMsg.vue').then(module => {
        const modal = createVanModal(module.default, {
            size: 300
        })
    })
}

</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  scrollbar-width: none;
}
</style>