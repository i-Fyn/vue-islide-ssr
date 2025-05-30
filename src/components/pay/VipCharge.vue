<template>
    <div class="max-w-2xl mx-auto bg-base-100 p-4" v-if="data.length">
        <slot></slot>

        <!-- 头部用户信息 -->
        <div
            class="flex justify-between items-center mb-4 bg-gradient-to-r from-primary/10 to-transparent p-3 rounded-2xl">
            <div class="flex items-center gap-3">
                <div class="avatar">
                    <div class="w-12 h-12 rounded-full ring ring-primary ring-offset-2">
                        <van-image lazy-load :src="user_data.avatar" />
                    </div>
                </div>
                <div>
                    <h3
                        class="text-base font-bold bg-gradient-to-r from-primary to-primary-focus bg-clip-text text-transparent">
                        {{ user_data.name }}
                    </h3>
                    <p class="text-sm text-base-content/70 mt-1 flex items-center gap-1">
                        <i class="ri-vip-crown-2-fill text-warning"></i>
                        {{ user_data.vip != false ? user_data.vip.name + '：' + (user_data.vip.date === 0 ? '永久' :
                            user_data.vip.date + ' 到期') : '会员：已过期' }}
                    </p>
                </div>
            </div>

            <button class="btn btn-primary btn-xs gap-1 hover:scale-105 transition-transform duration-300"
                @click="chosePayType('cardpay')" v-if="pay_type != 'cardpay'">
                <i class="ri-coupon-3-line"></i>
                激活码
            </button>
            <button class="btn btn-primary btn-xs gap-1 hover:scale-105 transition-transform duration-300"
                @click="chosePayType()" v-else>
                <i class="ri-arrow-left-line"></i>
                返回
            </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- 会员权益 -->
            <div class="bg-base-200 rounded-2xl p-6 backdrop-blur-sm hidden lg:block" v-show="pay_type != 'cardpay'">
                <h4 class="text-xl font-bold mb-5 flex items-center gap-3">
                    <span class="bg-primary/20 w-8 h-8 rounded-lg flex items-center justify-center">
                        <i class="ri-gift-2-line text-primary text-lg"></i>
                    </span>
                    {{ data[index].name }}专属权益
                </h4>
                <ul class="space-y-3 mb-5">
                    <li class="flex items-center gap-3 group">
                        <span
                            class="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <i class="ri-check-line text-success text-sm"></i>
                        </span>
                        <span class="text-sm">全站资源折扣购买</span>
                    </li>
                    <li class="flex items-center gap-3 group" v-if="data[index].free_read === '1'">
                        <span
                            class="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <i class="ri-check-line text-success text-sm"></i>
                        </span>
                        <span class="text-sm">隐藏内容免费查看</span>
                    </li>
                    <li class="flex items-center gap-3 group" v-if="data[index].free_download === '1'">
                        <span
                            class="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <i class="ri-check-line text-success text-sm"></i>
                        </span>
                        <span class="text-sm">全站资源免费下载</span>
                    </li>
                    <li class="flex items-center gap-3 group" v-if="data[index].free_video === '1'">
                        <span
                            class="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <i class="ri-check-line text-success text-sm"></i>
                        </span>
                        <span class="text-sm">付费视频免费观看</span>
                    </li>
                    <li class="flex items-center gap-3 group"
                        v-if="data[index].signin_bonus.credit || data[index].signin_bonus.exp">
                        <span
                            class="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <i class="ri-check-line text-success text-sm"></i>
                        </span>
                        <span class="text-sm">签到额外奖励</span>
                    </li>
                </ul>
                <a href="/vip"
                    class="text-sm text-primary hover:text-primary/80 flex items-center gap-2 group transition-all duration-300">
                    <span>更多会员权益</span>
                    <i class="ri-arrow-right-s-line transition-transform group-hover:translate-x-1"></i>
                </a>
            </div>

            <div class="flex flex-col">
                <!-- 会员类型切换 -->
                <div class="tabs tabs-boxed mb-4 justify-between bg-base-200/50 p-1 scroll-x flex flex-nowrap"
                    v-if="pay_type != 'cardpay'">
                    <a v-for="(item, i) in data" :key="i"
                        :class="['tab tab-sm gap-1 transition-all duration-300 flex-shrink-0', index == i ? 'tab-active bg-primary text-white' : '']"
                        @click="changeTabs(i)"><i
                            :class="['ri-vip-crown-2-fill', index == i ? 'text-warning' : '']"></i>{{ item.name }}</a>
                </div>

                <!-- 购买选项 -->
                <div class="flex flex-col" v-show="data[index].vip_group.length && pay_type != 'cardpay'">
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-2xl p-4" ref="scroll">
                        <div v-for="(item, i) in data[index].vip_group" :key="i" :class="['card bg-base-200/80 backdrop-blur-sm cursor-pointer hover:shadow-lg transition-all duration-300',
                            time_index == i ? 'ring-1 ring-primary/50 ring-offset-1' : '']" @click="time_index = i">
                            <div class="card-body p-2 relative overflow-hidden text-center">
                                <div class="badge badge-xs badge-primary absolute right-0 top-2 rotate-45"
                                    v-if="item.discount < 100">
                                    {{ item.discount / 10 }}折
                                </div>
                                <div class="text-sm font-medium">
                                    {{ item.name || (item.time > 0 ? item.time + '天' : '永久') }}
                                </div>
                                <div class="text-lg font-bold text-primary mt-0.5">
                                    ￥{{ item.price * (item.discount / 100).toFixed(2) }}
                                </div>
                                <div class="text-[10px] line-through text-base-content/50" v-if="item.discount < 100">
                                    ￥{{ item.price }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <PayType :pay_type="pay_type" :order_type="'vip_goumai'" @chosePayType="chosePayType" />

                    <button
                        class="btn btn-primary btn-sm w-full mt-4 text-sm gap-1 hover:scale-105 transition-transform duration-300"
                        @click="pay">
                        <i class="ri-shopping-cart-2-line"></i>
                        立即支付 {{ discountedPrice ? discountedPrice + '元' : '' }}
                    </button>
                </div>

                <!-- 激活码 -->
                <div class="card bg-base-200 p-4 backdrop-blur-sm" v-if="pay_type == 'cardpay'">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text text-sm font-medium">请输入激活码：</span>
                        </label>
                        <input type="text" v-model="code" placeholder="xxxx-xxxx-xxxx-xxxx-xxxx"
                            class="input input-bordered input-sm w-full focus:input-primary transition-all duration-300" />
                    </div>

                    <button
                        class="btn btn-primary btn-sm w-full mt-4 text-sm gap-1 hover:scale-105 transition-transform duration-300"
                        @click="cardPay">
                        <i class="ri-key-2-line"></i>
                        立即激活
                    </button>

                    <div class="mt-4 space-y-2 text-sm text-base-content/70">
                        <a href="#" class="link link-primary flex items-center gap-1 group">
                            <i class="ri-question-line"></i>
                            如何获取卡密？快速点击这里查看
                            <i class="ri-arrow-right-s-line transition-transform group-hover:translate-x-1"></i>
                        </a>
                        <p class="flex items-center gap-1">
                            <i class="ri-information-line text-info"></i>
                            点击"立即激活"将直接为当前用户使用
                        </p>
                        <p class="flex items-center gap-1">
                            <i class="ri-information-line text-info"></i>
                            激活码可以用于开通会员，充值余额，充值积分等服务，具体兑换服务参考相关说明或以激活后的提示为准。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, defineComponent, toRef } from 'vue'
import axios from '@/dist/axios'
import { createMessage as message } from '@/dist/message'
import { createVanModal } from '@/dist/createVanModal'

import PayType from './PayType.vue'
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    index: {
        type: Number,
        default: 0
    },
})
const data = ref([]);
const user_data = ref(null);
const money = ref(0);
const index = ref(props.index);
const pay_type = ref('');
const price = ref(0);
const time_index = ref(0);
const time = ref('');
const code = ref('');
const locked = ref(false);
const emit = defineEmits(['loadinged', 'close-modal'])
const scroll = ref(null);
defineComponent({
    components: {
        PayType
    }
})
const discountedPrice = computed(() => {
    console.log(data.value[index.value].vip_group[time_index.value])
    let val = data.value[index.value].vip_group[time_index.value];
    return Number((val.price * (val.discount / 100)).toFixed(2))
})

function changeTabs(ind) {
    index.value = ind;
    time_index.value = 0;
}
function chosePayType(val) {
    pay_type.value = val;
}
async function pay() {
    let error = '';
    if (!pay_type.value) {
        error = '请选择付款方式';
    } else if (pay_type.value == 'balance' && money.value < discountedPrice.value) {
        error = '余额不足';
    }

    if (error) {
        return message({ message: error, type: 'error' });
    }


    // 确保 data 已经正确加载
    if (!data.value[index.value] || !data.value[index.value].vip_group || !data.value[index.value].vip_group[time_index.value]) {
        return message({ message: '数据加载中或不完整', type: 'error' });
    }

    let time = data.value[index.value].vip_group[time_index.value].time;
    let name = data.value[index.value].vip_group[time_index.value].name;

    const orderData = {
        'title': '开通' + (name || (time > 0 ? time + '天' : '永久')) + data.value[index.value].name,
        'order_type': 'vip_goumai',
        'order_key': 'vip' + index.value,
        'order_value': time,
        'order_price': discountedPrice.value,
        'pay_type': pay_type.value
    };


    const Pay = (await import('./Pay.vue')).default;

    createVanModal(Pay, {
        size: 312,
        props: {
            data: orderData,
        }
    })
}

function cardPay() {
    if (!code.value.trim()) return message({ message: '请输入激活码', type: 'error' });

    if (!(/^[0-9a-zA-Z]{4}(-[0-9a-zA-Z]{4}){4}$/.test(code.value.trim()))) return message({ message: '请输入正确格式：xxxx-xxxx-xxxx-xxxx-xxxx', type: 'error' });

    if (locked.value == true) return
    locked.value = true

    axios.post('/cardPay', { code: code.value }).then(res => {
        locked.value = false
        message({ message: res.data.msg, type: 'success' });
        //刷新当前页面
        setTimeout(() => {
            var url = new URL(window.location.href);
            url.searchParams.delete('islidepaystatus');
            window.location.href = url.href
        }, 3000)
    }).catch(err => {
        locked.value = false
        message({ message: err.response.data.message, type: 'error' });
    })

}

function destroy() {
    time_index.value = 0;
    pay_type.value = '';
}

onMounted(() => {
    console.log(props.index)
    axios.post('/getVipInfo').then(res => {
        data.value = res.data.data;
        money.value = res.data.money;
        user_data.value = res.data.user_data;
        time_index.value = 0;
    })

})


</script>