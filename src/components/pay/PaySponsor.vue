<template>
    <div class="p-4 bg-base-100 rounded-lg" v-if="data">
        <slot></slot>
        
        <!-- 标题 -->
        <h3 class="text-lg font-medium mb-4">赞助本站～</h3>

        <!-- 赞助金额列表 -->
        <div class="mb-2">
            <div class="grid grid-cols-3 gap-3">
                <!-- 预设金额选项 -->
                <div v-for="(item, i) in data[type + '_data']" :key="i"
                    @click="index = i"
                    class="text-center content-center"
                    :class="['cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 hover:border-primary', 
                        index === i ? 'border-primary bg-primary/5' : 'border-base-200']">
                    
                    <div class="text-base font-medium mb-1">
                        {{ type === 'credit' ? item.credit : item.price }}
                        <span class="text-sm text-base-content/70">{{ type === 'credit' ? '积分' : '元' }}</span>
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
                        <input type="number" max="5" v-model="customPrice" @input="customPrice = customPrice.replace(/\D/g, '')"
                            class="input input-sm input-bordered w-full" />
                    </div>
                    <div v-else class="text-sm text-base-content/70">自定义金额</div>
                </div>
            </div>
        </div>

        <!-- 支付方式 -->
        <PayType :pay_type="pay_type" :order_type="order_type" @chosePayType="chosePayType" />

        <!-- 支付按钮 -->
        <div class="mt-4">
            <button @click="pay"
                class="btn btn-primary w-full">
                立即支付 {{ discountedPrice ? discountedPrice + '元' : '' }}
            </button>
        </div>
    </div>
</template>

<script setup name="paySponsor">
import { ref, computed, onMounted, nextTick } from 'vue'
import axios from '@/dist/axios'
import PayType from './PayType.vue'
import { createMessage as message } from '@/dist/message'
import { createVanModal } from '@/dist/createVanModal'
import {useLoginStatus}   from '@/components/header/composables/useLoginStatus.js'
const { isLogin,checkIsLogin } = useLoginStatus()

const props = defineProps({
    type: String,
    show: Boolean
})

const emit = defineEmits(['loadinged', 'close-modal'])

// 响应式数据
const data = ref(null)
const index = ref(0)
const pay_type = ref('')
const customPrice = ref('')


// 计算属性
const addCustomPrice = computed(() => customPrice.value)

const discountedPrice = computed(() => {
    if (index.value === 'custom') {
        return customPrice.value
    } else {
        const val = data.value?.balance_data || []
        return val[index.value]?.price || 0
    }
})
const order_type = ref('sponsor')

// 方法
const chosePayType = (val) => {
    pay_type.value = val
}

const pay = async () => {
    if (!isLogin.value) {
        return checkIsLogin()
    }
    let error = ''
    if (!pay_type.value) error = '请选择付款方式'
    if (!discountedPrice.value) error = '请输入金额'
    if (index.value === 'custom' && customPrice.value < data.value?.[props.type + '_custom_limit']) {
        error = `最低充值${data.value?.[props.type + '_custom_limit']}元`
    }
    if (props.type === 'credit' && pay_type.value === 'balance' &&
        parseInt(data.value?.money) < discountedPrice.value) {
        error = '余额不足'
    }

    if (error) {
        return message({ message: error, type: 'error' });
    }

    const orderData = {
        title: '赞助本站',
        order_type: order_type.value,
        order_price: parseInt(discountedPrice.value),
        pay_type: pay_type.value
    }

    const Pay = (await import('@/components/pay/Pay.vue')).default;
    createVanModal(Pay, {
        size: 312,
        props: {
            data: orderData,
        }
    })
    emit('close-modal')
}

const cardPay = () => {
    // 卡支付逻辑
}

// 生命周期
onMounted(async () => {
    if (!isLogin.value) {
        return checkIsLogin()
    }

    try {
        axios.post('/getRechargeInfo').then(res => {
            nextTick(() => {
                data.value = res.data
                emit('loadinged')
            })
        })

    } catch (error) {
        console.error('获取充值信息失败:', error)
    }
})
</script>