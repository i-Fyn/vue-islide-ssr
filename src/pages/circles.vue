<template>
    <div class="single-page" v-if="circle">
        <div class="wrapper flex gap-4">

            <CircleSideBar @cangeTabs="changeTab" type="circle" />

            <div class="content-area">
                <main class="site-main">
                    <div
                        class="circle-info-wrap min-h-37.5 relative flex items-end mb-4 overflow-hidden card bg-base-100 ">
                        <div class="circle-cover w-full bg-center bg-cover bg-no-repeat absolute z-0 pt-25 top-0"
                            :style="'background-image: url(' + circle.cover + ');'">
                            <div class="bg-cover absolute w-full h-full left-0 bottom-0 circle-bg"></div>
                        </div>
                        <div class="circle-info pt-5 flex-1 flex flex-col w-full mt-24 p-4 gap-4">
                            <div class="circle-info-top flex items-center justify-between gap-3">
                                <div class="circle-image rounded-full overflow-hidden" style="--avatar-size: 70px;">
                                    <van-image lazy-load :src="circle['icon']" :alt="circle['name']"
                                        class="circle-image-face w-h" />
                                </div>
                                <div class="circle-title flex-1 flex flex-col">
                                    <h1 class="circle-name text-base leading-7 inline-block cursor-pointer" @click="seeInfo">{{
                                        circle['name'] }}<i class="ri-arrow-right-s-line"></i></h1>
                                    <div class="circle-desc circle-data text-sm leading-6 flex gap-1.5"><span>圈友 {{
                                        circle['user_count'] }}</span> ·
                                        <span>帖子 {{ circle['post_count'] }}</span>
                                    </div>
                                </div>
                                <div class="follow" v-if="!circle['in_circle']">
                                    <button class="btn min-w-24 btn-sm btn-soft btn-primary rounded-4xl !text-sm" @click="joinCircle">加入</button>
                                </div>

                                <div class="followed" v-else>
                                    <button class="btn min-w-24 btn-sm btn-soft btn-secondary rounded-4xl">已加入</button>
                                </div>
                            </div>
                            <div class="circle-info-bottom">
                                <div class="circle-info-tag flex gap-4 items-center flex-wrap text-sm">
                                    <div class="badge badge-accent text-accent-content badge-sm"
                                        v-for="(v, k) in circle['circle_badge']" :key="k" :class="v">
                                        <i :class="v['icon']"></i>
                                        <span>{{ v['name'] }} </span>
                                    </div>
                                    <a class="tag-item user flex gap-1 items-center">
                                        <avatarVue :data="circle['admin']" :size="25" />
                                        <nameVue :data="circle['admin']" />
                                        <span> 创建</span>
                                    </a>
                                </div>
                                <p v-if="circle['desc']"
                                    class="circle-desc min-h-9 text-sm py-2 px-3 mt-3 relative bg-base-200 rounded-md text-base-content/60">
                                    {{ circle['desc'] }}</p>
                                <div class="scroll-swiper-wrapper whitespace-nowrap w-full pt-5"
                                    v-if="circle['recommend'] && circle['recommend'].length">
                                    <ul class="swiper-content">
                                        <li class="swiper-slide" v-for="(v, k) in circle['recommend']" :key="k">
                                            <a>
                                                <div class="thumb">
                                                    <van-image lazy-load :src="v['icon']" class="w-h" />
                                                </div>
                                                <span class="text-ellipsis">{{ v['name'] }}</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <CircleEdt />

                    <div
                        v-if="circle['in_circle'] || (circle['privacy'] == 'public' || circle['privacy'] == 'protected')">
                        <CircleMoment :stickys="stickys" :tax="circle_id" :tabSelector="tabSelector" :key="circle_id" />

                    </div>
                    <div v-else class="empty ">
                        <van-empty image-size="10rem" description="隐私圈子, 请先加入!" />
                    </div>
                </main>
            </div>
            <Secondary :enabled="config.circle_layout.sidebar_select.enabled">
                <widgetCircle />
            </Secondary>
        </div>
    </div>
</template>

<script setup>
// Vue 核心导入
import { ref, onMounted, watch, computed, onServerPrefetch } from 'vue';

// 组件导入
import CircleMoment from '@/components/circle/CircleMoment.vue';
import CircleSideBar from '@/components/circle/CircleSideBar.vue';
import CircleEdt from '@/components/circle/CircleEdt.vue';
import Secondary from '@/components/secondary/SecondarySingle.vue';
import widgetCircle from '@/components/widget/widgetCircle.vue';
import nameVue from '@/components/user/nameVue.vue';
import avatarVue from '@/components/user/avatarVue.vue';
import { useIsMobile } from '@/dist/mobile';

// 工具和状态管理导入
import { useStore } from '@/store';
import { createVanModal } from '@/dist/createVanModal';

// Props 定义
const props = defineProps({
    circle_id: {
        type: [Number, String],
        default: 0
    }
});

// Store 和配置
const store = useStore();
const config = computed(() => store.config);
const {isMobile} = useIsMobile();
// 响应式状态
const circle = ref(null);
const tabSelector = ref({});
const stickys = ref([]);

// 方法定义
const getCircleData = async () => {
    try {
        const res = await store.fetchCircleData(props.circle_id);
        circle.value = res;
        stickys.value = res.stickys;
    } catch (error) {
        console.error('获取圈子数据失败:', error);
    }
};

const changeTab = (index, selector) => {
    tabSelector.value = { index, select: selector };
};

const seeInfo = () => {
    import('@/components/circle/CircleManage.vue').then(module => {
        createVanModal(module.default, {
            radius: false,
            position: 'right',
            size: isMobile.value ? '100%' : 784,
            height: '100%',
            props: {
                type: 'edit',
                id: props.circle_id,
            },
        });
    });
};

const joinCircle = () => {
    import('@/components/circle/func/JoinCircle.vue').then(module => {
        createVanModal(module.default, {
            size: 350,
            props: {
                circle: circle.value,
            },
        });
    });
};

// 生命周期钩子
onMounted(async () => {
    await getCircleData();
});

onServerPrefetch(async () => {
    await getCircleData();
});

// 监听器
watch(() => props.circle_id, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        circle.value = null;
        getCircleData();
    }
});

// 组件选项
defineOptions({
    name: 'circles'
});

</script>
