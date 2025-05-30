<template>
    <div class="home-icon-slide relative overflow-hidden">
        <div v-if="module.title" class="modules-top">
            <h2 class="module-title">{{ module['title'] }}</h2>
        </div>
        <div class="recent-top-post-group w-full select-none rounded-xl overflow-auto mb-4">
            <div class="recent-post-top flex flex-col lg:flex-row flex-wrap w-full gap-2">
                <div
                    class="recent-post-top-left lg:w-[calc(50%-0.5rem)] w-full h-85 lg:h-[calc(328px+0.5rem)] flex flex-col justify-between flex-auto lg:flex-1 overflow-hidden">
                    <div
                        class="recent-post-top-left-content w-full h-full relative flex flex-col will-change-transform bg-base-100  overflow-hidden transition-all duration-300 card card-border border-base-300">
                        <div
                            class="tags-group-all opacity-[0.06] filter-[8px] lg:opacity-100 lg:filter-[none]  flex rotate-0 will-change-transform transform-style-3d backface-hidden">
                            <div class="tags-group-wrapper ml-auto animate-[rowup_120s_linear_infinite]">
                                <!-- 开始循环轮播图-->
                                <div class="tags-group-icon-pair flex ml-4 select-none" v-for="(item, index) in icList"
                                    :key="index">
                                    <div class="tags-group-icon w-[120px] h-[120px] relative rounded-[30px] flex items-center justify-center text-white text-[66px] font-bold card card-border border-base-300 transition-transform duration-300 will-change-transform ml-4"
                                        v-if="item.split('|')[0]"
                                        :style="{ background: getDynamicBackground(index, 0) }">
                                        <img title="StableDiffusion" class="w-[60%]" :src="item.split('|')[0].trim()" />
                                    </div>
                                    <div class="tags-group-icon w-[120px] h-[120px] relative rounded-[30px] flex items-center justify-center text-white text-[66px] font-bold card card-border border-base-300 transition-transform duration-300 will-change-transform mt-4 ml-19 -translate-x-[60px]"
                                        v-if="item.split('|')[1]"
                                        :style="{ background: getDynamicBackground(index, 1) }">
                                        <img class="w-[60%]"  :src="item.split('|')[1].trim()" />
                                    </div>
                                </div>
                                <!-- 结束循环轮播图-->
                            </div>
                        </div>
                        <div class="banners-content">
                            <div class="banners-title text-base-content top-[2.6rem] left-8 absolute flex flex-col">
                                <!--大标题第一行-->
                                <div v-if="module_left_title.length > 0"
                                    class="banners-title-big text-[36px] leading-none font-bold mb-2 line-clamp-1">{{
                                    module_left_title[0] }}</div>
                                <!--大标题第二行-->
                                <div v-if="module_left_title.length > 1"
                                    class="banners-title-big text-[36px] leading-none font-bold mb-2 line-clamp-1">{{
                                    module_left_title[1] }}</div>
                                <!--小标题-->
                                <div v-if="module_right_title.length > 2" class="banners-title-small">{{
                                    module_right_title[2] }}</div>
                            </div>
                            <div
                                class="banners-link flex flex-col items-start absolute bottom-9 left-10 flex-wrap gap-3">
                                <a class="banners-link-btn blb-hot flex flex-row items-center text-white w-[94px] relative py-2 px-[18px] pl-[14px] rounded-[60px] transition-transform duration-300 bg-gradient-to-r from-[#f65] to-[#ffbf37]"
                                    @click="go(module.slide_icon_hot)" data-pjax-state="">
                                    <i class="islideblogIcon ri-fire-fill"></i>
                                    <div class="banners-link-title ml-auto pointer-events-none">社区</div>
                                </a>
                                <a class="banners-link-btn blb-top flex flex-row items-center text-white w-[94px] relative py-2 px-[18px] pl-[14px] rounded-[60px] transition-transform duration-300 bg-gradient-to-r from-[#358bff] to-[#15c6ff]"
                                    @click="go(module.slide_icon_must)">
                                    <i class="islideblogIcon ri-star-smile-fill"></i>
                                    <div class="banners-link-title ml-auto pointer-events-none">朋友</div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 骨架屏占位 -->
                <div v-if="isLoading && postList.length === 0 && isMobile && isMobile !== 'ssr'"
                    class="top-group skeleton flex flex-row flex-wrap justify-between content-between w-full relative flex-1 overflow-hidden">
                    <div
                        class="recent-post-group skeleton flex flex-row flex-nonewrap justify-between content-between gap-2">
                        <!-- 开始循环文章骨架屏-->
                        <div class="recent-post-item skeleton flex w-50 flex-col items-start h-41 max-41 relative bg-base-100  overflow-hidden transition-transform duration-300 card card-border border-base-300"
                            v-for="index in 5" :key="index">
                            <div class="post-cover skeleton left-radius w-full">
                                <div class="post-bg skeleton"></div>
                            </div>
                            <div
                                class="recent-post-info skeleton p-[0.3rem_0.5rem] w-full flex flex-col items-start bg-base-100">
                                <div class="article-title skeleton w-4/5 h-[25px] bg-[#e0e0e0] rounded mb-2"></div>
                            </div>
                        </div>
                        <!-- 结束循环文章骨架屏-->
                    </div>
                </div>
                <!-- 正常内容 -->
                <div
                    class="top-group flex flex-row flex-wrap justify-between content-between w-full relative flex-1 scrollbar-none overflow-auto [&::-webkit-scrollbar]:hidden">
                    <div v-if="!isLoading && postList.length > 0 && isMobile"
                        class="recent-post-group flex flex-row flex-nonewrap justify-between content-between gap-2">
                        <!-- 开始循环文章-->
                        <div class="recent-post-item flex w-50 flex-col items-start h-41 max-41 relative bg-base-100  overflow-hidden transition-transform duration-300 card card-border border-base-300"
                            v-for="(v, index) in postList.slice(0, 5)" :key="index">
                            <div class="post-cover left-radius w-full">
                                <a @click="saveArticle(v)" class="h-[100px] flex overflow-hidden">
                                    <span
                                        class="recent-post-top-text absolute top-0 -left-10 flex text-base-100 text-[0.6rem] cursor-pointer font-bold bg-red-500 py-0.5 px-2 rounded-tl-xl transition-all duration-300">{{
                                        module.slide_hometop_tag }}</span>
                                    <img :src="v['thumb']['default']"
                                        class="post-thumb w-h object-cover bg-[var(--bg-body-color)] rounded-t-xl transition-transform duration-300"
                                        :alt="v['title']" />
                                </a>
                            </div>
                            <div class="recent-post-info transition-all duration-300 p-[0.3rem_0.5rem]">
                                <a class="article-title line-clamp-2 leading-normal pt-2 font-bold text-sm overflow-hidden transition-colors duration-300 hover:text-primary"
                                    @click="saveArticle(v)">
                                    {{ v['title'] }}
                                </a>
                            </div>
                        </div>
                        <!-- 结束循环文章-->
                    </div>
                    <div
                        class="today-card absolute w-full h-full  top-0 right-0 ml-4 flex cursor-pointer pointer-events-auto bg-base-100  overflow-hidden transition-all duration-300 card card-border border-base-300 hidden lg:block ">
                        <div class="today-card-info absolute bottom-6 left-8 z-20 text-base-100 max-w-[60%] transition-all duration-300"
                            v-if="module_right_title.length">
                            <div class="today-card-title text-[32px] font-bold leading-10 text-white">{{
                                module_right_title[0] }}<br>{{ module_right_title[1] }}</div>
                            <div class="today-card-tips text-white">{{ module_right_title[2] }}</div>
                        </div>
                        <div
                            class="today-card-cover absolute min-w-full min-h-full top-0 left-0 bg-cover - transition-all duration-300">
                            <van-image lazy-load class="top-right-bg" :width="600" :height="400" :src="module.slide_icon_today" alt="顶部右侧背景图" />
                        </div>
                        <div class="banner-button-group absolute right-8 bottom-8 flex transition-all duration-300">
                            <a class="banner-button text-white flex items-center  cursor-pointer backdrop-blur-xl backdrop-saturate-180 h-10 w-29 justify-center bg-base-100/15 rounded-[20px] transition-all duration-300 "
                                :href="module.slide_icon_more">
                                <i class="islideblogIcon ri-add-circle-fill mr-2 text-[22px]"></i>
                                <span class="banner-button-text">更多文章</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, onServerPrefetch } from 'vue'
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import { useIsMobile } from '@/dist/mobile'
const { isMobile } = useIsMobile()

defineOptions({
    name: 'HomeIconSlide',
});

const props = defineProps({
    module: {
        type: Object,
        default: () => {
            return {}
        }
    }
});
const module_left_title = ref([]);
const module_right_title = ref([]);
const icList = ref(props.module.slide_icon_list.split('\r\n'));
const postList = ref([]);
const isLoading = ref(false);
const store = useStore();
const router = useRouter();
const emit = defineEmits(['component-loaded']);
const getDynamicBackground = (index, pairIndex) => {
    const colorPairs = [
        ["#d0dbcf", "#ffc0cb"],
        ["#add8e6", "#90ee90"],
        ["#ffcc00", "#ffa500"],
        ["#e6e6fa", "#ff69b4"],
    ];
    // 循环使用颜色对
    const pair = colorPairs[index % colorPairs.length];
    return pair[pairIndex];
}

const param = ref({
    size: props.module.post_count,
    cat_id: props.module.post_cat,
    type: props.module._post_type,
    sort: props.module.post_order,
});



const saveArticle = (article) => {
    store.article[article.id] = article;
    router.push(`/${article.type}/${article.id}`); // 手动导航
};

const go = (path) => {
    router.push(path);
}


const getPostList = async () => {
    try {
        isLoading.value = true;
        let res = await store.getList(param.value);
        postList.value = res.data;
        isLoading.value = false;
    } catch (error) {
        isLoading.value = false;
    }
}



onMounted(async () => {
    module_left_title.value = props.module.slide_icon_left_title.split('|');
    module_right_title.value = props.module.slide_icon_right_title.split('|');
    await getPostList();
});

onServerPrefetch(async () => {
    module_left_title.value = props.module.slide_icon_left_title.split('|');
    module_right_title.value = props.module.slide_icon_right_title.split('|');
    await getPostList();
});


</script>

<style scoped>
@keyframes rowup {
    0% {
        transform: translateY(0);
    }

    100% {
        transform: translateY(-50%);
    }
}
</style>
