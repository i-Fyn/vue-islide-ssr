<template>
    <div class="circle-content-wrap bg-base-100 lg:card lg:px-4 px-2"
      :class="{'min-h-screen':loading}"
    >
        <div class="circle-tabs-nav sticky z-2 top-[var(--top-menu-height)]  lg:top-0" :class="{ 'mobile-show': sidebar == '1' }">
            <div class="circle-tabs-nav-inner whitespace-nowrap flex flex-row justify-between py-3  bg-base-100  cursor-pointer" >
                <div id="tabs" class="tabs  tabs-border h-auto flex-nowrap flex flex-row overflow-x-scroll relative scrollbar-none">
                    <li v-for="(value, index) in tabs" :class="{ 'tab-active': index == tabIndex }"
                            class="inline-flex tab"
                            @click="changeTab(index, value['tab_type'])">
                            <span class="text-base">{{ value['name'] }}</span>
                        </li>
                </div>
                <div class="orderby-wrap items-center flex">
                    <div class="orderby">
                        <span>默认排序</span>
                        <i class="ri-arrow-down-s-line"></i>
                    </div> 
                    <ul class="orderby-list box">
                        <li class="orderby-item" :class="[{ active: orderby == index }]"
                            v-for="(item, index) in orderbyList" v-text="item" :key="index"
                            @click="changeOrderby(index)"></li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- 主加载状态 - 优雅的加载动画 -->
        <div v-if="loading && !momentLists.length && tabType != 'circle'" class="w-full py-8 flex flex-col items-center justify-center">
            <div class="flex flex-col items-center gap-4">
                <div class="loading loading-infinity loading-lg text-primary"></div>
                <p class="text-sm text-base-content/60 animate-pulse">正在加载内容...</p>
            </div>
        </div>

        <!-- 圈子加载状态 -->
        <div v-if="loading && !circles.length && tabType == 'circle'" class="w-full py-8 flex flex-col items-center justify-center">
            <div class="flex flex-col items-center gap-4">
                <div class="loading loading-dots loading-lg text-secondary"></div>
                <p class="text-sm text-base-content/60 animate-pulse">正在加载圈子信息...</p>
            </div>
        </div>

        <div class="circle-sticky-posts" v-show="tabIndex == default_index && !circles.length">
            <div class="tax-sticky-posts mb-4 " v-if="stickyPost.length">
                <ul class="sticky-posts-list">
                    <li class="item mb-4 flex items-center font-medium" v-for="item in stickyPost" :class="'item-' + item.id">
                        <span class="tax-sticky text-primary p-[4px_8px_4px_6px] mr-3 text-sm flex items-center font-bold leading-5">
                            <div class="badge badge-primary">置顶</div></span>
                        <a class="text-ellipsis" :href="'/moment/' + item.id"
                            @click.prevent="router.push('/moment/' + item.id)">{{ item.title }}</a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="circles-warpper box" v-show="tabType == 'circle'" v-cloak>
            <div class="circle-list-wrap" v-if="circleTabs.length">
                <div class="circle-cat-tabs mb-5">
                    <div class="tabs-container overflow-hidden text-sm">
                        <ul class="tabs-nav flex items-center gap-3 py-2 px-1 scroll-x scrollbar-none">
                            <li class="tab-item px-4 py-2 whitespace-nowrap rounded-full transition-all duration-300 cursor-pointer"
                                :class="[{ 'text-primary font-medium': circleTabIndex == 'all' }]" 
                                @click="circleCatChange('all')">全部</li>
                            <li class="tab-item px-4 whitespace-nowrap py-2 rounded-full transition-all duration-300  cursor-pointer"
                                :class="[{ 'text-primary font-medium': circleTabIndex == index }]" 
                                v-text="item.name"
                                v-for="(item, index) in circleTabs" :key="index" 
                                @click="circleCatChange(index)"></li>
                        </ul>
                    </div>
                </div>
                
                <!-- 圈子骨架屏加载效果 -->
                <div class="circle-groups min-h-[60vh]" v-if="loading && !filteredCircleList.length">
                    <div class="create-circle-entry mb-8">
                        <div class="group-title mb-5 text-lg font-medium flex items-center">
                            <span class="w-1 h-5 bg-primary rounded-full mr-2"></span>
                            <span>加载中</span>
                        </div>
                        <div class="circle-list grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div v-for="i in 4" :key="i" class="circle-item transition-all duration-300 overflow-hidden">
                                <div class="circle-item-inner bg-base-200/50 rounded-xl p-4 animate-pulse">
                                    <div class="circle-info flex gap-4 overflow-hidden">
                                        <div class="circle-image rounded-full overflow-hidden flex-shrink-0 bg-base-300 w-[70px] h-[70px]"></div>
                                        <div class="circle-detail flex flex-col gap-3 flex-grow w-full">
                                            <div class="h-6 bg-base-300 rounded-md w-1/2"></div>
                                            <div class="h-4 bg-base-300 rounded-md w-full"></div>
                                            <div class="flex flex-wrap gap-3">
                                                <div class="h-4 bg-base-300 rounded-md w-16"></div>
                                                <div class="h-4 bg-base-300 rounded-md w-16"></div>
                                                <div class="h-4 bg-base-300 rounded-md w-16"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="circle-groups min-h-[60vh]" v-else-if="filteredCircleList.length">
                    <div class="create-circle-entry mb-8" >
                        <div class="group-title mb-5 text-lg font-medium flex items-center">
                            <span class="w-1 h-5 bg-primary rounded-full mr-2"></span>
                            <span>创建圈子</span>
                        </div>
                        <div class="circle-list grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="circle-item transition-all duration-300 overflow-hidden">
                                <div @click="openCreateCircleModal" 
                                    class="circle-item-inner bg-base-200/50 hover:bg-base-200 rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-all duration-300">
                                    <div class="circle-info flex gap-4 overflow-hidden">
                                        <div class="circle-image rounded-full overflow-hidden flex-shrink-0 bg-base-100 flex items-center justify-center w-[70px] h-[70px]">
                                            <i class="h-full w-full ri-add-circle-line text-3xl text-base-content/40 flex items-center justify-center"></i>
                                        </div>
                                        <div class="circle-detail flex flex-col gap-1.5 flex-grow">
                                            <div class="circle-title flex items-center gap-2">
                                                <h2 class="circle-name text-ellipsis font-bold text-base-content/70">创建新圈子</h2>
                                            </div>
                                            <div class="circle-desc text-ellipsis text-sm flex flex-wrap gap-2 text-base-content/60">
                                                点击这里创建一个新的圈子，与志同道合的朋友一起交流分享
                                            </div>
                                            <div class="circle-count text-sm flex flex-wrap gap-3 text-base-content/60 mt-1">
                                                <span class="flex items-center"><i class="ri-community-line mr-1"></i> 开始创建</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="circle-group-item mb-8" v-for="(circle, i) in filteredCircleList" :key="i">
                        <div class="group-title mb-5 text-lg font-medium flex items-center" v-if="circleTabIndex == 'all'" @click="circleCatChange('all')">
                            <span class="w-1 h-5 bg-primary rounded-full mr-2"></span>
                            <span v-text="circle.cat_name"></span>
                        </div>
                        <div class="circle-list grid grid-cols-1 md:grid-cols-2 gap-4" v-if="circleList.length">
                            <div class="circle-item transition-all duration-300  overflow-hidden" 
                                v-for="(item, index) in circle.list" :key="index">
                                <div @click="router.push({ name: 'circles', params: { circle_id: item.id } })"
                                    class="circle-item-inner no-hover bg-base-200/50 rounded-xl p-4 cursor-pointer hover:bg-base-200/80 hover:shadow-md transition-all duration-300">
                                    <div class="circle-info flex gap-4 overflow-hidden">
                                        <div class="circle-image rounded-full overflow-hidden flex-shrink-0" style="--avatar-size: 70px;">
                                            <van-image lazy-load :src="item.icon"
                                                class="circle-image-face rounded-full shadow-sm border-2 border-base-100" :alt="item['name']" />
                                        </div>
                                        <div class="circle-detail flex flex-col gap-1.5 flex-grow">
                                            <div class="circle-title flex items-center gap-2">
                                                <h2 class="circle-name text-ellipsis font-bold" v-text="item.name"></h2>
                                                <div class="circle-info-tag inline-flex items-start gap-1 flex-row text-sm flex-wrap">
                                                    <div :class="['tag-item badge badge-sm badge-outline', i]"
                                                        v-for="(badge, i) in item.circle_badge">
                                                        <i :class="badge.icon"></i>
                                                        <span v-text="badge.name"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="circle-desc text-ellipsis text-sm flex flex-wrap gap-2 text-base-content/70" v-text="item.desc"></div>
                                            <div class="circle-count text-sm flex flex-wrap gap-3 text-base-content/60 mt-1">
                                                <span class="flex items-center"><i class="ri-user-3-line mr-1"></i> <span v-text="item.user_count"></span></span>
                                                <span class="flex items-center"><i class="ri-file-list-line mr-1"></i> <span v-text="item.post_count"></span></span>
                                                <span class="flex items-center text-accent" v-if="item.today_post_count > 0">
                                                    <i class="ri-calendar-check-line mr-1"></i> <span v-text="item.today_post_count + ' 今日'"></span>
                                                </span>
                                                <span class="flex items-center"><i class="ri-chat-1-line mr-1"></i> <span v-text="item.comment_count"></span></span>
                                                <span class="flex items-center text-accent" v-if="item.today_comment_count > 0">
                                                    <i class="ri-chat-check-line mr-1"></i> <span v-text="item.today_comment_count + ' 今日'"></span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="empty flex flex-col items-center justify-center">
                        <van-empty image-size="10rem" description="暂无圈子" />
                </div>
            </div>
        </div>

        <div class="circle-moment-list-wrap relative overflow-hidden" v-show="tabType != 'circle'" v-cloak>
            <!-- 内容骨架屏加载效果 -->
            <div class="circle-moment-skeleton" v-if="loading && !momentLists.length && !isDataEmpty">
                <div v-for="i in 3" :key="i" class="flex flex-col gap-4 mb-8 p-4 border-b border-base-200">
                    <div class="flex items-center gap-3">
                        <div class="skeleton rounded-full w-10 h-10 bg-base-300"></div>
                        <div class="flex flex-col gap-2">
                            <div class="skeleton h-4 w-32 bg-base-300 rounded-md"></div>
                            <div class="skeleton h-3 w-24 bg-base-300 rounded-md"></div>
                        </div>
                    </div>
                    <div class="skeleton h-4 w-full bg-base-300 rounded-md"></div>
                    <div class="skeleton h-4 w-4/5 bg-base-300 rounded-md"></div>
                    <div class="flex justify-between">
                        <div class="skeleton h-8 w-20 bg-base-300 rounded-md"></div>
                        <div class="skeleton h-8 w-20 bg-base-300 rounded-md"></div>
                    </div>
                </div>
            </div>
            
            <div class="circle-moment-list"
                v-if="tabType != 'circle'">
                <CircleArticle ref="circleArticleRef" :selectTabs="selectTabs" :momentLists="momentLists" >
                    <template #pagination>
                        <PageNav ref="jsonPageNav" :paged="paged" :pages="pages" navtype="json" type="auto" :api="api"
                            :param="param" @change="listChange"></PageNav>
                    </template>
                </CircleArticle>
            </div>

            <div class="empty flex flex-col items-center justify-center" v-if="tabType != 'circle' && isDataEmpty && !loading">
                <van-empty image-size="10rem" description="暂无内容" />
                <button class="btn btn-primary btn-outline btn-sm mt-4 !text-sm" @click="refreshCurrentList">
                    <i class="ri-refresh-line mr-1"></i> 重新加载
                </button>
            </div>

            <!-- 底部加载指示器 -->
            <div v-if="loading && momentLists.length" class="flex justify-center items-center py-4">
                <div class="loading loading-ring loading-md text-primary"></div>
                <span class="ml-2 text-sm text-base-content/60">加载更多内容...</span>
            </div>
        </div>

    </div>

</template>



<script setup>
import { ref, computed, onMounted, watch, onServerPrefetch,onActivated,nextTick, onUnmounted } from 'vue'
import PageNav from '@/components/footer/PageNav.vue';
import CircleArticle from '@/components/circle/CircleArticle.vue';
import axios from '@/dist/axios';
import LazyLoad from 'vanilla-lazyload'
import { useRouter, useRoute } from 'vue-router';
import { useStore } from '@/store';
import { createVanModal } from '@/dist/createVanModal'
import CircleManage from './CircleManage.vue'
import { useIsMobile } from '@/dist/mobile'

let lazyLoader = null

const {isMobile} = useIsMobile()

defineOptions({
    name: 'CircleMoment',
})

const props = defineProps({
    tax: {
        type: [Number, String],
        default: 0
    },
    tabSelector: {
        type: Object,
        default: () => ({})
    },
    stickys: {
        type: Array,
        default: () => []
    }
})
const selectTabs = ref({})
const store = useStore();
const config = computed(() => store.config)
const router = useRouter();
const route = useRoute();
const default_index = ref(0);
const hasLoadedOnce = ref(false);
const oldList = ref({});
const circleArticleRef = ref(null);

const orderbyList = ref({
    '': '默认排序',
    'date': '发布时间',
    'comment_date': '回复时间',
    'modified': '修改时间',
    'random': '随机排序',
    'comments': '评论数最多',
    'views': '浏览数最多',
    'like': '点赞数最多',
})
const momentLists = ref([]);
const tabs = ref([]);
const orderby = ref('');
const tabType = ref('');
const circleTabs = ref([]);
const loading = ref(false);
const circleList = ref([]);
const circles = ref([]);
const paged = ref(1);
const pages = ref(1);
const circleTabIndex = ref('all');
const tabIndex = ref(0)
const jsonPageNav = ref(null);
const param = ref({ "size": 10, "circle_id": 0, "index": 0, "orderby": "date" });
const api = ref('getMomentList');
const isDataEmpty = ref(false)
const sidebar = ref(true)
const locked = ref(false)
const stickyPost = ref(props.stickys)

// 清除特定标签页的缓存
const clearTabCache = (index) => {
    if (index !== undefined) {
        delete oldList.value[index];
    } else {
        oldList.value = {};
    }
}

const currentOrderby = computed(() => {
    return orderbyList.value[orderby.value]
})

const filteredCircleList = computed(() => {
    return circleList.value.filter(circle => circle.list.length > 0);
});

const changeTab = (index, type) => {
    if (locked.value) return;
    loading.value = true;
    locked.value = true;
    pages.value = 1;
    param.value.paged = 1;
    window.scrollTo({ top: 0 });
    isDataEmpty.value = false;
    
    // 先设置selectTabs，确保瀑布流组件能及时获取到最新值
    selectTabs.value = JSON.parse(JSON.stringify(tabs.value[index]));
    selectTabs.value.index = index;
    console.log('changeTab selectTabs:', selectTabs.value);
    if (type == 'circle') {
        tabIndex.value = index;
        tabType.value = type;
        getCircles();
    } else {
        momentLists.value = [];
        // 如果旧列表存在，则使用旧列表
        if (oldList.value[index]) {
            tabIndex.value = index;
            tabType.value = type;
            param.value.index = index;
            listChange(oldList.value[index]);
            return;
        }
        tabIndex.value = index;
        tabType.value = type;
        param.value.index = index;
        nextTick(() => {
            jsonPageNav.value.load(1)
        })
    }
}

const changeOrderby = (type) => {
    param.value.orderby = orderby.value = type;
    clearTabCache(param.value.index);
    changeTab(param.value.index, tabType.value)
}

const circleCatChange = (index) => {
    circleTabIndex.value = index;

    if (circleTabIndex.value == 'all') {
        // 创建一个新的数组副本
        circleList.value = circles.value.slice();
        // 删除新数组的第一个元素
        circleList.value.splice(0, 1);
        return
    }

    if (circles.value[circleTabIndex.value].list.length) {
        circleList.value = [circles.value[circleTabIndex.value]];
    } else {
        circleList.value = []
    }
}


const getCircles = () => {
    loading.value = true;
    axios.post('/getAllCircles').then(res => {
        circles.value = res.data.list;
        circleTabs.value = res.data.cats;
        circleList.value = res.data.list.slice()
        circleList.value.splice(0, 1);
        loading.value = false;
        locked.value = false;
        isDataEmpty.value = false;
    }).catch(err => {
        loading.value = false;
        locked.value = false;
        isDataEmpty.value = false;
    }).finally(() => {
        momentLists.value = [];
    })
}


const listChange = (data) => {
    if (data.paged == 1 || data.pages == 0) {
        momentLists.value = data.data;
    } else {
        momentLists.value.push(...data.data)
    }

    if (tabIndex.value == default_index.value) {
        momentLists.value = momentLists.value.filter(item => item.sticky === !true)
    }
    data.data = momentLists.value;
    oldList.value[tabIndex.value] = data;

    pages.value = data.pages;
    locked.value = false;
    loading.value = false;
    isDataEmpty.value = momentLists.value.length == 0;
}

const getMomentList = async () => {
    try {
        locked.value = true;
        loading.value = true;
        // 刷新时清除当前标签缓存
        clearTabCache(tabIndex.value);
        let res = await axios.post('/getMomentList', Object.assign(param.value, { "paged": paged.value }));
        listChange(res.data);
    } catch (error) {
        loading.value = false;
        locked.value = false;
        isDataEmpty.value = false;
    }
}

// 提供一个刷新当前列表的方法
const refreshCurrentList = () => {
    if (tabType.value === 'circle') {
        getCircles();
    } else {
        getMomentList();
    }
}

const initData = async () => {
    if (props.tax !== 0) {
        param.value.circle_id = props.tax;
    }

    if (route.name == 'circleHome') {
        tabs.value = config.value.circle_home_tabbar;
        default_index.value = config.value.circle_home_tabbar_index;
        sidebar.value = config.value.circle_home_left_sidebar;
    } else if (route.name == 'circles') {
        tabs.value = config.value.circle_tabbar;
        default_index.value = config.value.circle_tabbar_index;
        sidebar.value = config.value.circle_left_sidebar;
    } else if (route.name == 'topics') {
        tabs.value = config.value.topic_tabbar;
        default_index.value = config.value.topic_tabbar_index;
        sidebar.value = config.value.topic_left_sidebar;
    }

    // 立即设置selectTabs
    tabIndex.value = default_index.value;
    param.value.index = default_index.value;
    selectTabs.value = JSON.parse(JSON.stringify(tabs.value[default_index.value]));
    console.log('初始化selectTabs:', selectTabs.value?.waterFall);
}

onServerPrefetch(async () => {
    await initData();
    await getMomentList();
})

onActivated(async () => {
    if(momentLists.value.length == 0) {
        await getMomentList();
    }
})

onMounted(async () => {
    lazyLoader = new LazyLoad({
        elements_selector: '.lazyload',
    })
    await initData();
    await getMomentList();
})

onUnmounted(() => {
    window.removeEventListener('resize', () => {});
});

watch(
    () => props.tabSelector,
    (newVal) => {
        if (newVal) {
            changeTab(newVal.index, newVal.select.tab_type)
        }
    },
    {
        deep: true,
        flush: 'post'
    }
)

// 添加打开创建圈子模态框的方法
const openCreateCircleModal = () => {
    createVanModal(CircleManage, {
        radius: false,
        position: isMobile.value ? 'center' : 'right',
        size: isMobile.value ? '100%' : 700,
        height:'100%',
        props: {
            type: 'create'
        }
    })
}

// 手动刷新时清除当前标签缓存
watch(
    () => route.query,
    () => {
        clearTabCache(tabIndex.value);
    }
)



// 暴露刷新方法供父组件调用
defineExpose({
    refreshCurrentList,
    clearTabCache
})




</script>