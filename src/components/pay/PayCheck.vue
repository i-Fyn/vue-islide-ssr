<template>
    <div class="p-4 bg-base-100">
        <slot></slot>
        <div class="flex flex-col items-center justify-center py-8" v-if="success === true">
            <div class="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                <i class="ri-check-line text-3xl text-success"></i>
            </div>
            <p class="text-lg font-medium text-base-content">支付成功</p>
        </div>
        <div class="flex flex-col items-center justify-center py-8" v-else-if="success === 'fail'">
            <div class="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-4">
                <i class="ri-close-line text-3xl text-error"></i>
            </div>
            <p class="text-lg font-medium text-base-content">支付失败</p>
        </div>
        <div class="flex flex-col items-center justify-center py-8" v-else>
            <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-spin">
                <i class="ri-refresh-line text-3xl text-primary"></i>
            </div>
            <p class="text-lg font-medium text-base-content">支付检查中....{{ countdown }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axiox from '@/dist/axios';

const emit = defineEmits(['loadinged']);
const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    order_id: {
        type: String,
        default: '',
    },
});
const timer = ref(null); // 定时器
const countdown = ref('4分59秒'); // 倒计时
const success = ref(false); // 是否支付完毕
const checkTime = ref(''); // 检查时间


// 倒计时函数
const startTime = (end) => {
    timer.value = setInterval(() => {
        if (end < 1) {
            clearInterval(timer.value);
            success.value = 'fail';
            return;
        }
        end--;
        const minute = Math.floor((end / 60) % 60);
        const second = Math.floor(end % 60);
        countdown.value = `${minute > 0 ? minute + '分' : ''}${second}秒`;
    }, 1000);
};

// 支付检查函数
const payCheck = async () => {
    if (success.value === 'fail' || checkTime.value === null || success.value === true) {
        checkTime.value = null;
        return;
    }
    try {
        const response = await axiox.post('/payCheck', 'order_id=' + props.order_id);
        if (response.data.status === 'success') {
            clearInterval(timer.value);
            success.value = true;
            checkTime.value = null;

            setTimeout(() => {
                const url = new URL(window.location.href);
                url.searchParams.delete('islidepaystatus');
                window.location.href = url.href;
            }, 3000);
        } else {
            checkTime.value = setTimeout(() => {
                payCheck();
            }, 1000);
        }
    } catch (error) {
    }
};



// 组件挂载时执行
onMounted(() => {
    if (!success.value) {
        payCheck();
        startTime(300);
    }
    emit('loadinged');
});

// 监听 show 属性的变化
watch(
    () => props.show,
    (newVal) => {
        if (newVal) {
            clearInterval(timer.value);
            success.value = false;
            checkTime.value = null;
        }
    }
);
</script>