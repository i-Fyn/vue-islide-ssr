<template>
    <div class="qrcode-pay-container " v-if="qrcode">
        <slot></slot>
        <div :class="['qrcode-pay', data.pay_type === 'alipay' ? 'alipay' : 'wecatpay']">
            <div class="pay-logo ">
                <van-image lazy-load class="wecatpay-logo" src="https://td.cdn-go.cn/enterprise_payment/v0.0.9/logo.png" />
                <van-image lazy-load class="alipay-logo"
                    src="https://gw.alipayobjects.com/mdn/member_frontWeb/afts/img/A*oRlnSYAsgYQAAAAAAAAAAABkARQnAQ" />
            </div>
            <div class="pay-title">{{ data.title }}</div>
            <div class="pay-price">￥{{ data.total_price }}</div>
            <div class="pay-qrcode">
                <van-image lazy-load :src="'https://seven.7b2.com/wp-content/themes/seven/inc/qrcode/index.php?c=' + qrcode" />
            </div>
            <div class="pay-countdown">剩余支付时间 {{ countdown }}</div>
        </div>
        <div class="qrcode-pay-bottom">
            请使用{{ data.pay_type === 'alipay' ? '支付宝' : '微信' }}APP扫一扫<br />扫描二维码支付
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import axios from '@/dist/axios';
import { createMessage as message } from '@/dist/message';
import { createVanModal } from '@/dist/createVanModal'

const props = defineProps(['data', 'show']);
const emit = defineEmits(['close-modal', 'loadinged']);

const qrcode = ref('');
const timer = ref(null); // 定时器
const countdown = ref('4分59秒'); // 倒计时
const success = ref(false); // 是否支付完毕
const checkTime = ref(null);
const order_id = ref('');


onMounted(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('islidepaystatus', 'check');
    props.data.redirect_url = url.href;

    if (!props.data.total_price) {
        props.data.total_price = props.data.order_price;
    }

    buildOrder();
});



const buildOrder = () => {
    axios.post('/buildOrder', removeEmptyProperties(props.data)).then(response => {
        const res = response.data;
        order_id.value = res.order_id;
        if (props.data.pay_type === 'balance' && props.data.pay_type === res.pay_type) {
            emit('close-modal', true);
            balancePay(res.order_id);
        } else if (props.data.pay_type === 'credit' && props.data.pay_type === res.pay_type) {
            emit('close-modal', true);
            creditPay(res.order_id);
        } else {
            if (res.qrcode) {
                qrcode.value = res.qrcode;
                payCheck();
                startTime(300);
            } else {
                if (res.url) {
                    window.location.href = res.url;
                }
                emit('close-modal', true);
            }
        }
    }).catch(err => {
        message({ message: err.response.data.message, type: 'error' });
        emit('close-modal', true);
    });
};

const balancePay = async (order_id) => {
    const PayCheck = (await import('./PayCheck.vue')).default;
    axios.post('/balancePay', { order_id }).then(res => {
        createVanModal(PayCheck, { props: { order_id, },size: 312, })
    }).catch(err => {
        message({ message: err.response.data.message, type: 'error' })
    });
};


const creditPay = async (order_id) => {
    const PayCheck = (await import('./PayCheck.vue')).default;
    axios.post('/creditPay', { order_id }).then(res => {
        createVanModal(PayCheck, { props: { order_id, },size: 312, })
    }).catch(err => {
        message({ message: err.response.data.message, type: 'error' })
    });
};


const startTime = (end) => {
    timer.value = setInterval(() => {
        if (end < 1) {
            clearInterval(timer.value);
            success.value = 'fail';
            return false;
        }

        end--;
        const minute = Math.floor((end / 60) % 60);
        const second = Math.floor(end % 60);
        countdown.value = `${minute > 0 ? minute + '分' : ''}${second}秒`;
    }, 1000);
};

const payCheck = async () => {
    if (success.value === 'fail' || checkTime.value === null || success.value === true) {
        checkTime.value = null;
        return;
    }

    try {
        const response = await axios.post('/payCheck', { order_id: order_id.value });
        const res = response.data;

        if (res.status === 'success') {
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

const removeEmptyProperties = (obj) => {
    const cleaned = { ...obj };
    Object.keys(cleaned).forEach((key) => {
        if (cleaned[key] === null || cleaned[key] === undefined || cleaned[key] === '') {
            delete cleaned[key];
        }
    });
    return cleaned;
};

watch(
    () => props.show,
    (newVal) => {
        if (!newVal) {
            clearInterval(timer.value);
            success.value = false;
            checkTime.value = null;
        }
    }
);
</script>
