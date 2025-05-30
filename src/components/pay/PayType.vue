<template>
    <div class="bg-base-100" v-if="allow && type == 'money'">
        <h3 class="text-base font-medium mb-3">请选择付款方式</h3>
        
        <div class="flex flex-wrap gap-2">
            <button v-if="allow.alipay" 
                @click="chosePayType('alipay')"
                :class="['btn btn-sm btn-outline gap-2 rounded-full', pay_type == 'alipay' ? 'btn-primary' : '']">
                <i class="ri-alipay-fill text-base"></i>
                支付宝
            </button>
            
            <button v-if="allow.wecatpay"
                @click="chosePayType('wecatpay')"  
                :class="['btn btn-sm btn-outline gap-2 rounded-full', pay_type == 'wecatpay' ? 'btn-primary' : '']">
                <i class="ri-wechat-pay-fill text-base"></i>
                微信
            </button>
            
            <button v-if="allow.balancepay"
                @click="chosePayType('balance')"
                :class="['btn btn-sm btn-outline gap-2 rounded-full', pay_type == 'balance' ? 'btn-primary' : '']">
                <i class="ri-wallet-3-fill text-base"></i>
                余额
            </button>
            
            <button v-if="allow.cardpay"
                @click="chosePayType('card')"
                :class="['btn btn-sm btn-outline gap-2 rounded-full', pay_type == 'card' ? 'btn-primary' : '']">
                <i class="ri-wallet-3-fill text-base"></i>
                卡密
            </button>
        </div>

        <div v-if="pay_type == 'balance'" class="flex justify-between items-center p-2 bg-base-200 rounded-lg mt-4">
            <span class="text-sm text-base-content/70">我的余额</span>
            <div class="text-base font-medium">
                <span class="text-sm mr-1">￥</span>{{ allow.money }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import axios from '@/dist/axios';
const emit = defineEmits(['data', 'chosePayType']);
const props = defineProps({
    type: {
        type: String,
        default: 'money'
    },
    order_type: {
        type: String,
        default: ''
    },
    pay_type: {
        type: String,
        default: ''
    },
});


const allow = ref({
    alipay: true,
    wecatpay: false,
    balancepay: false,
    cardpay: false,
});
const pay_type = ref(props.pay_type);

const allowPayType = async () => {
    let res = await axios({
        url: '/allowPayType',
        method: 'post',
        data: 'order_type=' + props.order_type
    })
    allow.value = res.data;
    emit('data', allow.value);
}

const chosePayType = (type) => {
    pay_type.value = type;
    emit('chosePayType', type);
}

watch(() => props.order_type, allowPayType);

onMounted(() => {
    allowPayType();
})





</script>