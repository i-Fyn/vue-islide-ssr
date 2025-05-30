<template>
    <div class="flex flex-col gap-4">
        <!-- 收益数据卡片 -->
        <div class="card bg-base-100 ">
            <div class="card-body p-4">
                <h2 class="card-title flex items-center gap-2 mb-4">
                    <i class="ri-line-chart-line text-primary"></i>
                    佣金收益数据
                </h2>
                
                <!-- 主要收益统计卡片 -->
                <div class="bg-base-200/50 rounded-xl p-4 mb-5">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="flex flex-col">
                            <div class="text-sm text-base-content/70 mb-2">总收益</div>
                            <div class="text-base font-bold">
                                <span class="text-lg text-primary">￥</span>
                                {{ commission['data']['total'] }}
                            </div>
                            <div class="text-sm text-base-content/70 mt-3">
                                已提现
                                <span class="font-medium text-base-content">￥{{ commission['withdrawn'] }}</span>
                            </div>
                        </div>
                        
                        <div class="flex flex-col">
                            <div class="text-sm text-base-content/70 mb-2">可提现</div>
                            <div class="text-base font-bold">
                                <span class="text-lg text-primary">￥</span>
                                {{ commission['money'] }}
                            </div>
                            <div class="text-sm text-success mt-3" v-if="commission['money'] > 0">
                                可立即提现
                            </div>
                        </div>
                        
                        <div class="flex items-center justify-end">
                            <button @click="toWithdraw"
                                v-if="config['money_withdrawal_open'] == '1' && commission && commission['money'] > 0"
                                class="btn btn-primary btn-md px-6 gap-2">
                                <i class="ri-bank-card-line"></i>
                                立即提现
                            </button>
                            <div v-else class="text-sm text-base-content/70 px-4 py-2 bg-base-200 rounded-lg">
                                {{ commission['money'] <= 0 ? '暂无可提现金额' : '提现功能已关闭' }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 分级收益统计 -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="flex items-center gap-4 p-4 rounded-xl shadow-sm bg-primary/5 hover:bg-primary/10 transition-colors relative">
                        <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl"></div>
                        <div class="flex-1">
                            <div class="text-sm text-base-content/70">一级收益</div>
                            <div class="text-xl font-semibold">￥{{ commission['data']['lv1'] }}</div>
                        </div>
                        <div class="text-2xl text-primary/70">
                            <i class="ri-user-star-line"></i>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-4 p-4 rounded-xl shadow-sm bg-success/5 hover:bg-success/10 transition-colors relative">
                        <div class="absolute left-0 top-0 bottom-0 w-1 bg-success rounded-l-xl"></div>
                        <div class="flex-1">
                            <div class="text-sm text-base-content/70">二级收益</div>
                            <div class="text-xl font-semibold">￥{{ commission['data']['lv2'] }}</div>
                        </div>
                        <div class="text-2xl text-success/70">
                            <i class="ri-team-line"></i>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-4 p-4 rounded-xl shadow-sm bg-info/5 hover:bg-info/10 transition-colors relative">
                        <div class="absolute left-0 top-0 bottom-0 w-1 bg-info rounded-l-xl"></div>
                        <div class="flex-1">
                            <div class="text-sm text-base-content/70">三级收益</div>
                            <div class="text-xl font-semibold">￥{{ commission['data']['lv3'] }}</div>
                        </div>
                        <div class="text-2xl text-info/70">
                            <i class="ri-group-line"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 内容卡片 -->
        <div class="card bg-base-100 ">
            <div class="card-body p-0">
                <!-- 标签页导航 -->
                <div class="border-b border-base-200">
                    <div class="p-4">
                        <div class="tabs tabs-boxed bg-base-200/50 p-1 scroll-x scrollbar-none">
                            <a v-for="(tab, ind) in tabs" 
                               :key="ind" 
                               @click="changeTab(ind)"
                               :class="['tab', ind == index ? 'tab-active' : '']">
                                <i :class="[getTabIcon(ind), 'mr-1']"></i>
                                {{ tab }}
                            </a>
                        </div>
                    </div>
                </div>

                <!-- 标签页内容 -->
                <div class="p-4">
                    <!-- 推广详情 -->
                    <div v-if="index == 0" class="space-y-6">
                        <!-- 推广链接 -->
                        <div class="card bg-base-100 shadow-sm">
                            <div class="card-body p-4">
                                <h3 class="card-title flex gap-2 text-base">
                                    <i class="ri-links-line text-primary"></i>
                                    推广链接
                                </h3>
                                <div class="mt-3 flex flex-wrap items-center gap-3">
                                    <div class="flex-1 bg-base-200/70 px-4 py-2.5 rounded-lg text-sm scroll-x">
                                        {{ refs }}
                                    </div>
                                    <button class="btn btn-primary btn-sm gap-2" @click="copyRefs">
                                        <i class="ri-file-copy-line"></i>
                                        复制链接
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- 佣金比例 -->
                        <div class="card bg-base-100 shadow-sm">
                            <div class="card-body p-4">
                                <h3 class="card-title flex gap-2 text-base">
                                    <i class="ri-percentage-line text-primary"></i>
                                    佣金比例
                                </h3>
                                <div class="scroll-x mt-3">
                                    <table class="table table-zebra table-sm">
                                        <thead>
                                            <tr>
                                                <th>分销等级</th>
                                                <th>一级关联</th>
                                                <th>二级关联</th>
                                                <th>三级关联</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(value, key) in config['distribution']" :key="key"
                                                :class="{ 'bg-primary/5': key == distribution_lv }">
                                                <td>{{ getLevelName(key) }}</td>
                                                <td>{{ value['lv1_ratio'] }}%</td>
                                                <td>{{ value['lv2_ratio'] }}%</td>
                                                <td>{{ value['lv3_ratio'] }}%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <!-- 返佣产品 -->
                        <div class="card bg-base-100 shadow-sm">
                            <div class="card-body p-4">
                                <h3 class="card-title flex gap-2 text-base">
                                    <i class="ri-product-hunt-line text-primary"></i>
                                    返佣产品
                                </h3>
                                <div class="scroll-x mt-3">
                                    <table class="table table-zebra table-sm">
                                        <thead>
                                            <tr>
                                                <th>返佣产品</th>
                                                <th v-for="(val, key) in config['distribution']" :key="key"
                                                    :class="{ 'bg-primary/10 text-primary': key == distribution_lv }">
                                                    {{ getLevelName(key) }}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(typeName, typeKey) in orderTypes" :key="typeKey">
                                                <td>{{ typeName }}</td>
                                                <td v-for="(item, roleKey) in config['distribution']" :key="roleKey">
                                                    <i :class="[
                                                        item.types.includes(typeKey) ? 'ri-checkbox-circle-fill text-success' : 'ri-close-circle-fill text-error',
                                                        'text-lg'
                                                    ]"></i>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="flex gap-2 mt-4 text-sm text-base-content/80">
                                    <div class="font-medium">订单佣金：</div>
                                    <div>(*级)关联用户订单付款金额 × (*级)佣金比例</div>
                                </div>
                            </div>
                        </div>

                        <!-- 推广指南 -->
                        <div class="card bg-base-100 shadow-sm">
                            <div class="card-body p-4">
                                <div class="bg-gradient-to-r from-primary/80 to-primary mb-4 text-white px-6 py-3 rounded-lg inline-flex items-center">
                                    <i class="ri-guide-line mr-2 text-lg"></i>
                                    新手推广指南
                                </div>
                                <div class="text-sm leading-7 space-y-2">
                                    <p class="flex gap-2">
                                        <span class="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-content font-semibold text-xs">一</span>
                                        <span>获取推广链接：复制其推广链接或推广海报（登录后生成的分享链接都为你的推广链接），放在论坛/博客/QQ/微信/群聊等页面上吸引客户点击。</span>
                                    </p>
                                    <p class="flex gap-2">
                                        <span class="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-content font-semibold text-xs">二</span>
                                        <span>建立客户关联：全新客户通过点击您的推广链接进行注册/登录，即与您建立关联，关联期为永久。</span>
                                    </p>
                                    <p class="flex gap-2">
                                        <span class="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-content font-semibold text-xs">三</span>
                                        <span>推广有效订单：客户购买指定返佣产品即生成有效订单与推广佣金。</span>
                                    </p>
                                    <p class="flex gap-2">
                                        <span class="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-content font-semibold text-xs">四</span>
                                        <span>获得推广佣金：当佣金积累到50元之后，即可申请提现，申请提现后需后台人工处理，一般2-8小时，请耐心等待。</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 佣金明细 -->
                    <div v-else-if="index == 1">
                        <div v-if="orderList.length" class="divide-y divide-base-200">
                            <div v-for="(item, idx) in orderList" 
                                 :key="idx" 
                                 class="py-4 first:pt-0 hover:bg-base-200/20 px-2 rounded-lg transition-colors duration-200">
                                <div class="flex justify-between items-start">
                                    <div class="flex items-center gap-2">
                                        <div class="w-8 h-8 rounded-full flex items-center justify-center" 
                                             :class="item.value < 0 ? 'bg-error/10' : 'bg-success/10'">
                                            <i :class="item.value < 0 ? 'ri-arrow-down-line text-error' : 'ri-arrow-up-line text-success'"></i>
                                        </div>
                                        <div>
                                            <div class="text-sm font-medium">{{ item.type_text }}</div>
                                            <div class="text-xs text-base-content/60">{{ item.content }}</div>
                                        </div>
                                    </div>
                                    <div class="flex flex-col items-end">
                                        <div :class="[
                                            'text-base font-medium',
                                            item.value < 0 ? 'text-error' : 'text-success'
                                        ]">
                                            {{ item.value > 0 ? '+' + item.value : item.value }} 元
                                        </div>
                                        <div class="text-xs text-base-content/60">{{ item.date }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="loading && !isDataEmpty" class="flex flex-col items-center justify-center py-16">
                            <span class="loading loading-spinner loading-lg text-primary"></span>
                            <span class="mt-4 text-base-content/60 text-sm">加载佣金数据中...</span>
                        </div>
                        <div v-else-if="isDataEmpty" class="flex flex-col items-center justify-center py-16">
                            <van-empty image-size="10rem" description="暂无佣金明细" />
                        </div>
                    </div>

                    <!-- 关联用户 -->
                    <div v-else-if="index == 2">
                        <div v-if="userList.length" class="divide-y divide-base-200">
                            <div v-for="(item, idx) in userList" 
                                 :key="idx" 
                                 class="py-4 first:pt-0 hover:bg-base-200/20 px-2 rounded-lg transition-colors duration-200">
                                <div class="flex items-center gap-3">
                                    <avatarVue :data="item" />
                                    <div>
                                        <nameVue :data="item" />
                                        <div class="text-xs text-base-content/60 mt-1">{{ item.partner_lv }}</div>
                                    </div>
                                    <div class="ml-auto">
                                        <span class="badge badge-sm" :class="{
                                            'badge-primary': item.partner_lv.includes('一级'),
                                            'badge-success': item.partner_lv.includes('二级'),
                                            'badge-info': item.partner_lv.includes('三级'),
                                            'badge-secondary': !item.partner_lv.includes('一级') && !item.partner_lv.includes('二级') && !item.partner_lv.includes('三级')
                                        }">
                                            {{ item.partner_lv }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="loading && !isDataEmpty" class="flex flex-col items-center justify-center py-16">
                            <span class="loading loading-spinner loading-lg text-primary"></span>
                            <span class="mt-4 text-base-content/60 text-sm">加载关联用户中...</span>
                        </div>
                        <div v-else-if="isDataEmpty" class="flex flex-col items-center justify-center py-16">
                            <van-empty image-size="10rem" description="暂无关联用户" />
                        </div>
                    </div>

                    <!-- 分页 -->
                    <div v-if="index != 0 && data.length" class="mt-6 pt-4 border-t border-base-200">
                        <PageNav ref="jsonPageNav" 
                                :paged="paged" 
                                :pages="pages" 
                                navtype="json" 
                                type="auto" 
                                :api="api"
                                :param="param" 
                                @change="change" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useStore } from '../../store';
import { get_user_roles } from '../../dist/theme';
import { useClipboard } from '@vueuse/core';
import PageNav from '@/components/footer/PageNav.vue'
import { createVanModal } from '@/dist/createVanModal'
import nameVue from '../user/nameVue.vue';
import avatarVue from '../user/avatarVue.vue';
import { createMessage as message } from '@/dist/message';

const isDataEmpty = ref(false)
const loading = ref(false)
const paged = ref(1)
const pages = ref(1)
const locked = ref(false)
const data = ref([])
const userList = ref([])
const orderList = ref([])
const param = ref({})
const api = ref('')
const index = ref(0)
const apis = ref(['', 'getUserRebateOrders', 'getUserPartner'])
const tabs = ref(['推广详情', '佣金明细', '关联用户'])
const jsonPageNav = ref(null)
const { copy } = useClipboard()
const store = useStore()
const commission = ref(store.userInfo.commission)
const config = store.config;
const withdrawal = config.money_withdrawal;
const refs = ref(location.origin + '?ref=' + store.userInfo.id)
const roles = get_user_roles(store);
const distribution_lv = store.userInfo.vip.lv || 'lv';

// 获取标签页图标
const getTabIcon = (idx) => {
  switch(idx) {
    case 0: return 'ri-links-line';
    case 1: return 'ri-money-cny-circle-line';
    case 2: return 'ri-user-shared-line';
    default: return 'ri-file-list-line';
  }
};

// 获取用户等级样式类
const getUserLevelClass = (level) => {
  if (level.includes('一级')) return 'badge-primary';
  if (level.includes('二级')) return 'badge-success';
  if (level.includes('三级')) return 'badge-info';
  return 'badge-secondary';
};

// 复制推广链接
const copyRefs = () => {
  copy(refs.value);
  message({
    message: '推广链接已复制到剪贴板',
    type: 'success'
  });
};

const getLevelName = (lv) => {
    return roles.find(item => item.level === lv)?.name || '普通用户'
}

const change = (recievedData) => {
    if (index.value == 2) {
        userList.value = recievedData.data;
    } else {
        orderList.value = recievedData.data;
    }
    data.value = recievedData.data;

    isDataEmpty.value = (data.value.length === 0);
    loading.value = false;
}

const orderTypes = {
    'shop': '购物',
    'post_neigou': '文章内购',
    'xiazai': '资源下载',
    'money_chongzhi': '余额充值',
    'vip': '会员购买'
}

const changeTab = (ind) => {
    if (locked.value) return;
    index.value = ind;
    
    if (ind != 0) {
        api.value = apis.value[ind];
        fetchData();
    }
}

const toWithdraw = () => {
    import('@/components/pay/Withdrawal.vue').then(m => {
        createVanModal(m.default, {
            size: 356,
            props: {
                money: commission.value.money
            },
            onSuccess: async () => {
                await store.getUserInfo();
                commission.value = store.userInfo.commission;
            }
        })
    })
}

const fetchData = async () => {
    try {
        locked.value = true;
        loading.value = true;
        data.value = [];
        
        if (index.value != 0) {
            let res = await store.fetchApiPostData(apis.value[index.value], {...param.value, paged: paged.value});
            change(res);
        }
    } catch (error) {
        console.error('获取数据失败:', error);
        isDataEmpty.value = true;
    } finally {
        loading.value = false;
        locked.value = false;
    }
}

onMounted(() => {
    if (index.value != 0) {
        api.value = apis.value[index.value];
        fetchData();
    }
})
</script>