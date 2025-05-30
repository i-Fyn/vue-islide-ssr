<template>
    <div class="single-page">
        <div class="wrapper">
            <div class="relative min-h-screen flex flex-col bg-base-100 card">
                <div
                    class="absolute inset-0 w-full h-full bg-[url('/assets/image/bg-header-base.svg')] bg-center bg-no-repeat bg-contain">
                </div>
                <div class="p-4 w-full flex justify-center items-center my-15 relative">
                    <div class="flex-1 flex flex-col items-center justify-center gap-8">
                        <h1 class="text-primary text-3xl font-bold">{{ config.islide_vip_page['title'] }}</h1>
                        <div class="desc text-center">{{ config.islide_vip_page['desc'] }}</div>
                    </div>
                </div>
                <div class="relative bg-[url('/assets/image/bg-header.png')] bg-center bg-no-repeat bg-auto min-h-[500px]"
                    ref="vipPage">
                    <div class="content-area p-4">
                        <main id="main" class="site-main">
                            <div class="w-full">
                                <div
                                    class="flex  flex-wrap gap-12 min-h-95 justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                    <div v-for="(item, index) in data"
                                        class="card w-[288px] bg-base-100 shadow-sm relative flex-shrink-0">
                                        <div v-if="item.vip.discount < 100"
                                            class="absolute top-[-32px] left-0 w-full h-[52px] bg-[url('/assets/image/countdown-bg.png')] bg-no-repeat bg-[50%] bg-cover">
                                            <div class="flex pt-1 pl-[28.5%]">
                                                <span
                                                    class="mr-[10.5%] w-6 h-6 tracking-[1px] font-['Impact'] font-normal text-sm text-white flex justify-center items-center">{{
                                                    time.hour }}</span>
                                                <span
                                                    class="mr-[10.5%] w-6 h-6 tracking-[1px] font-['Impact'] font-normal text-sm text-white flex justify-center items-center">{{
                                                    time.minute }}</span>
                                                <span
                                                    class="mr-[10.5%] w-6 h-6 tracking-[1px] font-['Impact'] font-normal text-sm text-white flex justify-center items-center">{{
                                                    time.second }}</span>
                                                <span
                                                    class="mr-[10.5%] w-6 h-6 tracking-[1px] font-['Impact'] font-normal text-sm text-white flex justify-center items-center ms">{{
                                                    time.millisecond }}</span>
                                            </div>
                                            <div
                                                class="content-[''] w-full block h-5 bg-base-100 rounded-t-[12px] absolute bottom-0">
                                            </div>
                                        </div>
                                        <div class="card-body">
                                            <div v-if="item.vip.discount < 100"
                                                class="badge badge-warning absolute right-2 top-2">限时 {{
                                                item.vip.discount / 10 }}折</div>
                                            <h2 class="text-base font-bold" v-text="item.name"></h2>
                                            <div class="text-base-content/60" v-text="item.desc"></div>
                                            <div class="text-primary mt-4">
                                                <span class="font-semibold text-base">￥</span>
                                                <span class="text-[28px] font-semibold">{{ Math.ceil(item.vip.price *
                                                    (item.vip.discount / 100)) }}.00</span>
                                                <span>元</span>
                                                <div class="inline-block text-base-content/60">/{{ item.vip.name }}起
                                                </div>
                                            </div>
                                            <div
                                                class="mt-1 leading-4 line-through text-base-content/50 min-h-4">
                                                <span v-if="item.vip.discount < 100">￥{{ item.vip.price }}.00 /{{
                                                    item.vip.name }}起</span>
                                            </div>
                                            <ul class="mt-6 flex flex-col gap-2 text-sm">
                                                <li v-if="item.free_read === '1'" class="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        class="size-4 me-2 inline-block text-success" fill="none"
                                                        viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>查看所有隐藏内容 <b class="text-primary font-normal align-bottom">{{
                                                        item.free_read_count >= 9999 ? '不限' : item.free_read_count
                                                            }}</b> 次/日</span>
                                                </li>
                                                <li v-if="item.free_download === '1'" class="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        class="size-4 me-2 inline-block text-success" fill="none"
                                                        viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>下载所有资源 <b class="text-primary font-normal align-bottom">{{
                                                        item.free_download_count >= 9999 ? '不限' :
                                                            item.free_download_count }}</b> 次/日</span>
                                                </li>
                                                <li v-if="item.free_video === '1'" class="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        class="size-4 me-2 inline-block text-success" fill="none"
                                                        viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>观看所有视频 <b class="text-primary font-normal align-bottom">{{
                                                        item.free_video_count >= 9999 ? '不限' : item.free_video_count
                                                            }}</b> 次/日</span>
                                                </li>
                                                <li v-if="item.signin_bonus.credit" class="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        class="size-4 me-2 inline-block text-success" fill="none"
                                                        viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>签到额外奖励 <b class="text-primary font-normal align-bottom">{{
                                                            item.signin_bonus.credit }}</b> 积分/日</span>
                                                </li>
                                                <li v-if="item.signin_bonus.exp" class="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        class="size-4 me-2 inline-block text-success" fill="none"
                                                        viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>签到额外奖励 <b class="text-primary font-normal align-bottom">{{
                                                            item.signin_bonus.exp }}</b> 经验/日</span>
                                                </li>
                                                <li v-if="item.signin_bonus.exp" class="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        class="size-4 me-2 inline-block text-success" fill="none"
                                                        viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>免广告</span>
                                                </li>
                                            </ul>
                                            <div class="mt-6">
                                                <button class="btn btn-primary btn-block btn-sm rounded-full btn-outline" @click="handlePayVip(index)">
                                                    <span
                                                        v-if="user.vip.lv && user.vip.lv.slice(3) == index">立即续费</span>
                                                    <span v-else>立即开通</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <div class="mb-4 p-4">
                    <div class="pt-[60px] pb-[60px] relative">
                        <h2 class="text-lg mb-6 text-center">常见问题</h2>
                        <div class="collapse-wrap my-auto">
                            <div v-for="item in faqs"
                                class="collapse collapse-arrow bg-base-100 shadow-sm mt-2 collapse-sm" >
                                <input type="radio" name="my-accordion-2" checked="checked" />
                                <div class="collapse-title font-semibold ">{{ item.key }}</div>
                                <div class="collapse-content text-sm text-base-content/60 ">{{ item.value }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, onServerPrefetch, nextTick, onUnmounted, onErrorCaptured } from 'vue';
import { payVip } from '@/dist/pay';
import { useStore } from '../store';
import { createMessage as message } from '@/dist/message';

// 错误处理
onErrorCaptured((err, instance, info) => {
    console.error('VIP页面错误:', err, info);
    message({ message: '页面加载出错，请刷新重试', type: 'error' });
    return false;
});

const store = useStore();
const config = computed(() => store.config || {});
const faqs = computed(() => config.value?.islide_vip_page?.faqs || []);

// 状态管理
const data = ref([]);
const user = ref({});
const time = ref({
    hour: "00",
    minute: "00",
    second: "00",
    millisecond: "000"
});
const countdownInterval = ref(null);
const vipPage = ref(null);

// 工具函数
const prefixZero = (number) => {
    try {
        return number > 9 ? number.toString() : "0" + number;
    } catch (error) {
        console.error('数字格式化错误:', error);
        return "00";
    }
};

// 计算最低折扣
const calculateMinDiscount = (data) => {
    try {
        if (!Array.isArray(data)) return [];

        return data.map(item => {
            if (!item?.vip_group?.length) return item;

            let minPrice = Infinity;
            let minPriceElement = null;

            item.vip_group.forEach(element => {
                if (!element?.price || !element?.discount) return;

                const discountedPrice = (element.price * element.discount) / 100;
                if (discountedPrice < minPrice) {
                    minPrice = discountedPrice;
                    minPriceElement = element;
                }
            });

            return {
                ...item,
                vip: minPriceElement || item.vip_group[0]
            };
        });
    } catch (error) {
        console.error('计算折扣失败:', error);
        return data;
    }
};

// 获取VIP信息
const getVipInfo = async () => {
    try {
        const res = await store.fetchVipInfo();
        if (!res?.data) {
            throw new Error('获取VIP信息失败');
        }
        data.value = calculateMinDiscount(res.data);
        user.value = res.user_data || {};
    } catch (error) {
        console.error('获取VIP信息失败:', error);
        message({ message: '获取VIP信息失败，请刷新重试', type: 'error' });
    }
};

// 倒计时处理
const countTime = () => {
    try {
        // 清除可能存在的旧定时器
        if (countdownInterval.value) {
            clearInterval(countdownInterval.value);
        }

        const endTime = new Date(new Date().setHours(23, 59, 59, 999)).getTime();
        const currentTime = new Date().getTime();

        // 如果已经过期，直接返回
        if (currentTime > endTime) {
            time.value = {
                hour: "00",
                minute: "00",
                second: "00",
                millisecond: "000"
            };
            return;
        }

        // 更新倒计时
        const updateCountdown = () => {
            try {
                const currentTime = new Date().getTime();
                const remainingTime = endTime - currentTime;

                if (remainingTime <= 0) {
                    clearInterval(countdownInterval.value);
                    time.value = {
                        hour: "00",
                        minute: "00",
                        second: "00",
                        millisecond: "000"
                    };
                    return;
                }

                time.value = {
                    hour: prefixZero(Math.floor(remainingTime / (1000 * 60 * 60))),
                    minute: prefixZero(Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60))),
                    second: prefixZero(Math.floor((remainingTime % (1000 * 60)) / 1000)),
                    millisecond: prefixZero(Math.floor((remainingTime % 1000) / 1))
                };
            } catch (error) {
                console.error('更新倒计时失败:', error);
                clearInterval(countdownInterval.value);
            }
        };

        // 立即执行一次
        updateCountdown();
        // 设置定时器
        countdownInterval.value = setInterval(updateCountdown, 10);
    } catch (error) {
        console.error('倒计时初始化失败:', error);
    }
};

// 支付处理
const handlePayVip = async (index) => {
    try {
        if (!data.value?.[index]) {
            throw new Error('无效的VIP选项');
        }
        await payVip(index);
    } catch (error) {
        console.error('支付处理失败:', error);
        message({ message: '支付处理失败，请重试', type: 'error' });
    }
};

// 生命周期钩子
onMounted(async () => {
    try {
        await getVipInfo();
        countTime();
    } catch (error) {
        console.error('页面初始化失败:', error);
        message({ message: '页面加载失败，请刷新重试', type: 'error' });
    }
});

onServerPrefetch(async () => {
    try {
        await getVipInfo();
        countTime();
    } catch (error) {
        console.error('服务端预取失败:', error);
    }
});

// 清理定时器
onUnmounted(() => {
    if (countdownInterval.value) {
        clearInterval(countdownInterval.value);
    }
});
</script>
