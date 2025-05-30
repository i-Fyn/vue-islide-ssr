<template>
    <div class="flex flex-col gap-4">
       
        <!-- 记录列表区域 -->
        <div class="card bg-base-100">
            <div class="card-body p-0">
                <!-- 标签页导航 -->
                <div class="p-4 border-b border-base-200">
                    <div class="tabs tabs-boxed bg-base-200/50 p-1 inline-flex w-auto rounded-lg">
                        <a v-for="(item, index) in tabs" 
                           :key="index" 
                           @click="changeTab(index)"
                           :class="['tab', index == indexActive ? 'tab-active' : '']">
                            {{ item.name }}
                        </a>
                    </div>
                </div>

                <!-- 记录内容 -->
                <div class="px-5 pb-5">
                    <div v-if="data.length" class="divide-y divide-base-200">
                        <div v-for="(item, index) in data" 
                             :key="index"
                             class="py-4 first:pt-0 hover:bg-base-200/20 px-2 rounded-lg transition-colors duration-200">
                            <div class="flex justify-between items-start">
                                <div class="flex items-center gap-2">
                                    <div class="w-10 h-10 rounded-full flex items-center justify-center" 
                                         :class="[
                                            item.record_type === 'credit' ? 'bg-warning/10' : 
                                            item.value < 0 ? 'bg-error/10' : 'bg-success/10'
                                         ]">
                                        <i :class="[
                                            item.record_type === 'credit' ? 'ri-copper-coin-line text-warning' : 
                                            item.value < 0 ? 'ri-arrow-up-line text-error' : 'ri-arrow-down-line text-success'
                                        ]"></i>
                                    </div>
                                    <div>
                                        <div class="text-sm font-medium">{{ item.type_text }}</div>
                                        <div class="text-xs text-base-content/60">{{ item.content }}</div>
                                    </div>
                                </div>
                                <div class="flex flex-col items-end">
                                    <div :class="[
                                        'text-base font-medium',
                                        item.record_type === 'credit' ? 'text-warning' : 
                                        item.value < 0 ? 'text-error' : 'text-success'
                                    ]">
                                        <b>{{ item.value > 0 ? '+' + item.value : item.value }}</b>
                                        {{ item.record_type == 'credit' ? '积分' : '元' }}
                                    </div>
                                    <div class="text-xs text-base-content/60">{{ item.date }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 加载状态 -->
                    <div v-else-if="!data.length && loading && !isDataEmpty" 
                         class="flex flex-col items-center justify-center py-16">
                        <span class="loading loading-spinner loading-lg text-primary"></span>
                        <span class="mt-4 text-base-content/60 text-sm">加载数据中...</span>
                    </div>

                    <!-- 空状态 -->
                    <div v-else-if="!data.length && isDataEmpty" 
                         class="flex flex-col items-center justify-center py-16">
                        <van-empty image-size="10rem" description="暂无内容" />
                        <button @click="fetchData" class="btn btn-sm btn-outline mt-4">刷新</button>
                    </div>
                </div>

                <!-- 分页 -->
                <div class="p-4 border-t border-base-200">
                    <PageNav ref="jsonPageNav" 
                            :paged="paged" 
                            :pages="pages" 
                            navtype="json" 
                            type="auto" 
                            :api="api"
                            :param="param" 
                            @change="change"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onServerPrefetch, nextTick } from 'vue'
import PageNav from '@/components/footer/PageNav.vue'
import { useStore } from '@/store'
import { createVanModal } from '@/dist/createVanModal'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useStore()
const props = defineProps({
    money: {
        type: [Number, String],
    },
    credit: {
        type: [Number, String],
    }
})

const config = ref(store.config)
const withdrawal = config.value.money_withdrawal;
const jsonPageNav = ref(null); // 分页组件的 ref
const data = ref([]);
const api = ref('getUserRecords');
const param = ref({
    size: 6,
    type: 'money'
});
const tabs = [{ name: '余额记录', value: 'money' }, { name: '积分记录', value: 'credit' }]
const isDataEmpty = ref(false);
const loading = ref(true);
const locked = ref(false);
const paged = ref(1);
const pages = ref(1);
const indexActive = ref(0);

const change = (recievedData) => {
    locked.value = false;
    data.value.push(...recievedData.data);
    pages.value = recievedData.pages;
    isDataEmpty.value = (data.value.length === 0);
    loading.value = false;
}


const changeTab = async (index) => {
    if (locked.value) return;
    locked.value = true;
    indexActive.value = index;
    param.value.type = tabs[index].value;
    data.value = [];
    isDataEmpty.value = false;
    await fetchData()
}


const fetchData = async () => {
    try {
        locked.value = true
        loading.value = true
        let res = await store.fetchApiPostData(api.value, Object.assign(param.value, { paged: paged.value }))
        change(res)
    } catch (error) {
    }
}
const toWithdraw = () => {
import('@/components/pay/Withdrawal.vue').then(m => {
    createVanModal(m.default,{
        size:356,
        props:{
            type:'money',
            money: props.money,
            ratio: withdrawal.ratio,
            limit: withdrawal.limit
        }
    })
})
}

const recharge = (type) => {
  import('@/components/pay/Recharge.vue').then(m => {
    createVanModal(m.default,{
        size:356,
        props:{
            type,
        }
    })
  })
};

onMounted(async () => {
    await fetchData()
});

onServerPrefetch(async () => {
    await fetchData()
});


</script>

