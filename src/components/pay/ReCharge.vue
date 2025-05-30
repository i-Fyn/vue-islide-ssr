<template>
    <div class="p-4 bg-base-100 rounded-lg" v-if="data">
        <slot></slot>
        
        <!-- 标题 -->
        <h3 class="text-lg font-medium mb-4">{{ title }}</h3>

        <!-- 充值金额列表 -->
        <div v-if="pay_type !== 'card'" class="mb-2">
            <div class="grid grid-cols-3 gap-3">
                <!-- 预设金额选项 -->
                <div v-for="(item, i) in data[type + '_data']" :key="i"
                    @click="index = i"
                    class="text-center content-center"
                    :class="['cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 hover:border-primary', 
                        index === i ? 'border-primary bg-primary/5' : 'border-base-200']">
                    
                    <div v-if="item.discount < 100" 
                        class="inline-block px-2 py-0.5 bg-error/10 text-error text-sm rounded mb-2">
                        {{ item.discount / 10 }}折
                    </div>
                    
                    <div class="text-base font-medium mb-1">
                        {{ type === 'credit' ? item.credit : item.price }}
                        <span class="text-sm text-base-content/70">{{ type === 'credit' ? '积分' : '元' }}</span>
                    </div>
                    
                    <div class="text-sm">
                        <span class="text-primary">￥{{ Math.ceil(item.price * (item.discount / 100)) }}</span>
                        <span v-if="item.discount < 100" class="text-base-content/50 line-through ml-1">￥{{ item.price }}</span>
                    </div>
                </div>

                <!-- 自定义金额 -->
                <div @click="index = 'custom'"
                    :class="['cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 hover:border-primary',
                        index === 'custom' ? 'border-primary bg-primary/5' : 'border-base-200']">
                    <div class="text-base font-medium mb-1">
                        {{ addCustomPrice ? addCustomPrice : '--' }}
                        <span class="text-sm text-base-content/70">{{ type === 'credit' ? '积分' : '元' }}</span>
                    </div>
                    
                    <div v-if="index === 'custom'" class="flex items-center mt-2">
                        <span class="mr-1">￥</span>
                        <input type="number" max="5" v-model="customPrice" @input="validateInput"
                            class="input input-sm input-bordered w-full" />
                    </div>
                    <div v-else class="text-sm text-base-content/70">自定义金额</div>
                </div>
            </div>
        </div>

        <!-- 卡密充值 -->
        <div v-else class="mb-6">
            <div class="p-4 bg-base-200 rounded-lg">
                <p class="mb-2 font-medium">请输入激活码：</p>
                <input type="text" placeholder="xxxx-xxxx-xxxx-xxxx-xxxx" v-model="code"
                    class="input input-bordered w-full mb-4" />
                
                <div class="space-y-2 text-sm text-base-content/70">
                    <a href="#" class="link link-primary">如何获取卡密？快速点击这里查看</a>
                    <p>点击"立即激活"将直接为当前用户使用</p>
                    <p>激活码可以用于开通会员，充值余额，充值积分等服务，具体兑换服务参考相关说明或以激活后的提示为准。</p>
                </div>
            </div>
        </div>

        <!-- 支付方式 -->
        <PayType :pay_type="pay_type" :order_type="order_type" @chosePayType="chosePayType" />

        <!-- 支付按钮 -->
        <div class="mt-4">
            <button v-if="pay_type !== 'card'" @click="pay"
                class="btn btn-primary w-full">
                立即支付 {{ discountedPrice ? discountedPrice + '元' : '' }}
            </button>
            <button v-else @click="cardPay"
                class="btn btn-primary w-full">
                立即激活
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from '@/dist/axios';
import { createMessage } from '@/dist/message';
import PayType from './PayType.vue';
import Pay from './Pay.vue';
import { createVanModal } from '@/dist/createVanModal'
const emit = defineEmits(['close-modal', 'loadinged']);
const props = defineProps(['type', 'show']);
import {useLoginStatus}   from '@/components/header/composables/useLoginStatus.js'
const { isLogin,checkIsLogin } = useLoginStatus()

const data = ref(null);
const index = ref(0);
const pay_type = ref('');
const customPrice = ref('');
const code = ref('');
const locked = ref(false);

// 获取充值信息
const fetchRechargeInfo = async () => {
    if(!isLogin.value){
        return checkIsLogin()
    }
    try {
        const response = await axios.post('/getRechargeInfo');
        data.value = response.data;
        emit('loadinged');
    } catch (error) {
    }
};

// 自定义金额
const addCustomPrice = computed(() => {
    if (props.type === 'balance') {
        return customPrice.value;
    } else {
        return parseInt(customPrice.value * data.value.ratio);
    }
});

// 折扣价格
const discountedPrice = computed(() => {
    if (index.value === 'custom') {
        return customPrice.value;
    } else {
        const val = data.value[props.type + '_data'];
        return Math.ceil(val[index.value].price * (val[index.value].discount / 100));
    }
});

// 标题
const title = computed(() => (props.type === 'credit' ? '积分充值' : '余额充值'));

// 订单类型
const order_type = computed(() => (props.type === 'credit' ? 'credit_chongzhi' : 'money_chongzhi'));

// 选择支付方式
const chosePayType = (val) => {
    pay_type.value = val;
};

// 支付
const pay = () => {
    let error = '';
    if (!pay_type.value) error = '请选择付款方式';

    if (pay_type.value !== 'card') {
        if (!discountedPrice.value) error = '请输入金额';
        if (index.value === 'custom' && customPrice.value < data.value[props.type + '_custom_limit']) {
            error = '最低充值' + data.value[props.type + '_custom_limit'] + '元';
        }
        if (props.type === 'credit' && pay_type.value === 'balance' && parseInt(data.value.money) < discountedPrice.value) {
            error = '余额不足';
        }
    }

    if (error) return createMessage({ message: error, type: 'error' });

    const orderData = {
        title: props.type === 'credit' ? '积分充值' : '余额充值',
        order_type: order_type.value,
        order_price: parseInt(discountedPrice.value),
        pay_type: pay_type.value,
    };

    if (index.value !== 'custom') {
        orderData.order_key = index.value;
        orderData.order_value = props.type === 'credit' ? data.value[props.type + '_data'][index.value].credit : data.value[props.type + '_data'][index.value].price;
    }

    createVanModal(Pay, {
        size: 312, props:{
            data: orderData,
        }
    });
    emit('close-modal');
};

// 卡密支付
const cardPay = async () => {
    if (!code.value.trim()) return createMessage({ message: '请输入激活码', type: 'error' });
    if (!/^[0-9a-zA-Z]{4}(-[0-9a-zA-Z]{4}){4}$/.test(code.value.trim())) {
        return createMessage({ message: '请输入正确格式：xxxx-xxxx-xxxx-xxxx-xxxx', type: 'error' });
    }
    if (locked.value) return;

    locked.value = true;
    try {
        const response = await axios.post('/cardPay', { code: code.value });
        createMessage({ message: response.data.msg, type: 'success' });
        setTimeout(() => {
            const url = new URL(window.location.href);
            url.searchParams.delete('islidepaystatus');
            window.location.href = url.href;
        }, 3000);
    } catch (error) {
        createMessage({ message: error.response.data.message, type: 'error' });
    } finally {
        locked.value = false;
    }
};

// 输入验证
const validateInput = (event) => {
    event.target.value = event.target.value.replace(/[^\d]/g, '');
};

// 组件挂载时获取数据
onMounted(() => {
    fetchRechargeInfo();
});

// 监听 show 属性变化
watch(
    () => props.show,
    (newVal) => {
        if (!newVal) {
            index.value = 0;
            pay_type.value = '';
            customPrice.value = '';
            code.value = '';
            locked.value = false;
        }
    }
);


</script>
