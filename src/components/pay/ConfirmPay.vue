<template>
    <div class="flex flex-col bg-base-100 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <slot></slot>
        <div class=" p-3 sm:p-4 rounded-t-lg">
            <div class="flex items-center gap-2 text-lg sm:text-xl font-bold">
                <i class="ri-shopping-cart-fill"></i>
                <div>确认购买</div>
            </div>
        </div>
        <div class="p-4 sm:p-6">
            <div class="space-y-3 sm:space-y-4 mb-4">
                <div class="text-base sm:text-lg font-medium text-neutral break-all van-ellipsis">{{ data.title }}</div>
                <div class="flex flex-col  gap-2">
                    <div class="flex items-center gap-2">
                        <span class=" text-sm sm:text-sm">{{ data.tag }}</span>
                        <span class="text-sm sm:text-base">X{{ data.order_value || 1 }}</span>
                    </div>
                    <div class="flex items-center gap-1 text-base sm:text-lg">
                        <span class="text-neutral">总价：</span>
                        <span class="font-bold text-primary">
                            <span class="inline-flex items-center">
                                <i class="ri-coins-line mr-1" v-if="type === 'credit'"></i>
                                {{ type === 'money' ? '￥' : '' }}
                            </span>
                            {{ discountedPrice }}
                        </span>
                    </div>
                </div>
            </div>
            <PayType :pay_type="payType" :order_type="data.order_type" :type="type" @data="setData"
                @chose-pay-type="chosePayType" />
            <div class="mt-4 sm:mt-6">
                <button @click="pay" 
                    class="btn btn-primary btn-block text-primary-content text-sm sm:text-base rounded-full">
                    <span class="flex items-center justify-center gap-1">
                        立即支付
                        <i class="ri-coins-line" v-if="type === 'credit'"></i>
                        {{ type === 'money' ? '￥' : '' }}{{ discountedPrice }}
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import PayType from './PayType.vue';
const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    show: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['close-modal','loadinged'])
import { createVanModal } from '@/dist/createVanModal'
// 响应式数据
const payType = ref('credit')
const money = ref(0)
const credit = ref(0)

// 计算属性
const type = computed(() => props.data.type)
const discountedPrice = computed(() =>
    props.data.total_price || props.data.order_price
)

// 生命周期
onMounted(() => {
    emit('loadinged');
    if (!props.data.total_price) {
        props.data.total_price = props.data.order_price
    }
})

// 方法
const setData = (data) => {
    credit.value = data.credit
    money.value = data.money
}

const chosePayType = (val) => {
    payType.value = val
}

const pay = () => {
    let error = ''
    const price = discountedPrice.value

    if (!payType.value && type.value === 'money') {
        error = '请选择付款方式'
    }

    if (type.value === 'money' && payType.value === 'balance' && money.value < price) {
        error = '余额不足'
    }

    if (type.value === 'credit' && credit.value < price) {
        error = '积分不足'
    }

    if (error) {
        // 假设使用 Element Plus 的消息提示
        ElMessage.error(error)
        return
    }

    const orderData = {
        title: props.data.title,
        order_type: props.data.order_type,
        order_price: props.data.order_price,
        order_spec: props.data.spec ?? [],
        order_commodity: props.data.order_commodity ?? 0,
        pay_type: payType.value,
        post_id: props.data.post_id,
        chapter_id: props.data.chapter_id,
        order_key: props.data.order_key ?? '',
        order_value: props.data.order_value ?? 1,
        ...(props.data.total_price && { total_price: props.data.total_price })
    }

    import('@/components/pay/Pay.vue').then(module => {
        createVanModal(module.default, {
            size: 312,
            props:{
                data: orderData,
            }
        })
    });
    emit('close-modal')

}

// 组件卸载时重置状态
onBeforeUnmount(() => {
    payType.value = 'credit'
})
</script>