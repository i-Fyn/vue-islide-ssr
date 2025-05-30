<template>
    <div :class="[module.post_type, 'post-list overflow-hidden']" ref="postListRef" >
        <div class="modules-top mb-4" v-if="module.module_meta?.includes('desc') || module.module_meta?.includes('title') || module.module_meta?.includes('nav')">
            <h2 class="module-title text-xl mb-2" 
                v-if="module.module_meta?.includes('title')" 
                >{{ module.title }}</h2>
                <div v-if="module.module_meta?.includes('desc') && module.desc" 
                 class="module-desc animate__animated text-sm text-base-content/60" >
                {{ module.desc }}
            </div>
            <div v-if="module.module_meta?.includes('nav')"
                class="module-top-wrapper flex items-center sticky top-[72px] z-10 animate__animated animate__fadeIn">
                <div class="category-bar w-full justify-between flex items-center whitespace-nowrap py-1.5 overflow-hidden"
                    v-if="module.nav_cat?.length > 0">
                    <div class="category-bar-items cursor-pointer text-base-content/60 overflow-x-scroll flex items-center scrollbar-none h-7 whitespace-nowrap gap-1"
                        id="category-bar-items">
                        <div class="category-bar-item" @click="getList(0, 'all')"
                            :class="{ 'text-primary-content bg-primary rounded-xl': currentCategoryId === 0 }">
                            <span class="font-bold flex items-center h-7 py-0.5 px-2">全部</span>
                        </div>
                        <div class="category-bar-item" v-for="(cat, index) in module.nav_cat" :key="index"
                            @click="getList(cat)"
                            :class="{ 'text-primary-content bg-primary rounded-xl': currentCategoryId === cat }">
                            <span class="font-bold flex items-center h-7 py-0.5 px-2">{{ getCatName(cat) }}</span>
                        </div>
                    </div>
                    <div class="category-bar-more-group flex items-center gap-1">
                        <div class="category-bar-next ml-2 h-7 w-7 flex items-center justify-center cursor-pointer hover-pulse"
                            id="category-bar-next" @click="scrollCategoryBarToRight">
                            <i class="ri-arrow-right-s-line text-xl"></i>
                        </div>
                        <div class="category-bar-change flex gap-1 font-bold content-center justify-center px-2 items-center hover-grow"
                            v-if="module.module_meta?.includes('change')" @click="getList(currentCategoryId, 'change')">
                            <i class="ri-refresh-line text-xl"></i>
                            <span class="cursor-pointer">换一换</span>
                        </div>
                        <a v-if="module.module_meta?.includes('more')" class="category-bar-more font-bold px-2 hover-underline-animation"
                            title="查看更多" target="_blank" :href="module.module_btn_url">{{ module.module_btn_text }}</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="hidden-line relative" >
            <PostSkeletons 
                v-if="loading && postList.length === 0"
                :type="module.post_type"
                :count="module.post_count"
                :columns="module.post_row_count"
                :thumbRatio="module.post_thumb_ratio" />
            <postArticle v-else :postList="postList" :module="module" :animation-enabled="true" >
                <template #pagination>
                    <div class="pagenavn json-nav" v-if="module.module_meta?.includes('load')" >
                        <PageNav ref="jsonPageNav" :paged="paged" :pages="pages" navtype="json" type="auto" :api="api"
                            :param="param" @change="change" />
                    </div>
                </template>
            </postArticle>
        </div>

        <div v-if="isDataEmpty && !loading" class="empty animate__animated animate__fadeIn">
            <van-empty image-size="10rem" description="暂无内容" />
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, computed, onServerPrefetch, onActivated, onUnmounted, defineAsyncComponent } from 'vue';
import { useStore } from "@/store";
import PageNav from '@/components/footer/PageNav.vue';
import postArticle from './post/postArticle.vue';
import gsap from 'gsap';
import { gsapAnimations } from '@/utils/animations';
const PostSkeletons = defineAsyncComponent(() => import('./skeletons/PostSkeletons.vue'));

defineOptions({
    name: 'HomePosts',
});

const postListRef = ref(null);
const props = defineProps({
    module: {
        type: Object,
        default: () => ({})
    },
});

const store = useStore();
const config = computed(() => store.config);
const firstLoad = ref(false);

// 响应式数据
const postList = ref([]);
const currentCategoryId = ref(0);
const paged = ref(1);
const pages = ref(1);
const locked = ref(false);
const api = ref('posts');
const sorts = ref(props.module.post_order);
const isDataEmpty = ref(false);
const loading = ref(true);
const jsonPageNav = ref(null);

// 计算属性
const getCats = computed(() => {
    switch (props.module._post_type) {
        case 'post':
            return props.module.post_cat;
        case 'video':
            return props.module.video_cat;
        case 'book':
            return props.module.book_cat;
    }
});

const param = ref({
    size: props.module.post_count,
    cat_id: currentCategoryId.value === 0 ? getCats.value : currentCategoryId.value,
    type: props.module._post_type,
    sort: sorts.value,
    key: props.module.key,
});


const change = (posts) => {
    // 深拷贝数据，断开引用
    const data = JSON.parse(JSON.stringify(posts.data));

    if (posts.paged === 1) {
        postList.value = data; // 使用拷贝后的数据
    } else {
        postList.value.push(...data);
    }
    

    locked.value = false;
    pages.value = posts.pages;
    isDataEmpty.value = data.length === 0; // 使用拷贝后的 data
    loading.value = false;
    
};

const getCatName = (catId) => {
    const catList = config.value.tax.cats;
    return catList.find(cat => cat.id == catId)?.name || '未分类';
}

const getList = (catId, type = '') => {
    if (locked.value) return;
    if (catId === currentCategoryId.value && type !== 'change') return;

    locked.value = true;
    loading.value = true;
    isDataEmpty.value = false;
    paged.value = 1;
    param.value.paged = 1;
    pages.value = 1;

    // 添加重新加载的过渡效果
    if (typeof document !== 'undefined') {
        const container = document.querySelector('.hidden-line');
        if (container) {
            gsap.fromTo(container, 
                { opacity: 0.5 }, 
                { opacity: 1, duration: 0.5, ease: 'power2.out' }
            );
        }
    }

    currentCategoryId.value = catId;
    param.value.cat_id = catId === 0 ? getCats.value : catId;
    sorts.value = type === 'change' ? 'random' : props.module.post_order;
    param.value.sort = sorts.value;

    jsonPageNav.value.load(1)
};

const scrollCategoryBarToRight = () => {
    const items = document.getElementById("category-bar-items");
    const nextButton = document.getElementById("category-bar-next");

    if (items && nextButton) {
        const itemsWidth = items.clientWidth;

        if (items.scrollLeft + items.clientWidth + 1 >= items.scrollWidth) {
            items.scroll({ left: 0, behavior: "smooth" });
            setTimeout(() => {
                nextButton.innerHTML = '<i class="ri-arrow-right-s-line"></i>';
            }, 500);
        } else {
            items.scrollBy({ left: itemsWidth, behavior: "smooth" });
            setTimeout(() => {
                if (items.scrollLeft + items.clientWidth + 1 >= items.scrollWidth) {
                    nextButton.innerHTML = '<i class="ri-arrow-right-s-line" style="transform: rotate(180deg);"></i>';
                }
            }, 500);
        }
    }
};

// 生命周期
const fetchData = async () => {
    try {
        loading.value = true;
        const res = await store.getList(param.value);
        if (res?.pages) change(res);
    } catch (e) {
        isDataEmpty.value = true;
    } finally {
        loading.value = false;
    }
}

onServerPrefetch(fetchData);

onMounted(async () => {
    if (!firstLoad.value && postList.value.length === 0) {
        firstLoad.value = true;
        fetchData();
    }
    
    // 添加模块标题动画
    const titleElement = document.querySelector('.module-title');
    if (titleElement) {
        gsapAnimations.slideFromTop(titleElement, 20, 0.8);
    }
    
    // 添加分类栏动画
    const categoryBar = document.querySelector('.category-bar');
    if (categoryBar) {
        gsapAnimations.fadeIn(categoryBar, 0.8, 0.3);
    }
});

onActivated(() => {
    if (!firstLoad.value && postList.value.length === 0) {
        firstLoad.value = true;
        fetchData();
    }
});

onUnmounted(() => {
    // 清理任何可能的动画时间线
    if (typeof window !== 'undefined') {
        const items = document.querySelectorAll('.post-item');
        items.forEach(item => {
            gsap.killTweensOf(item);
        });
    }
});
</script>

<style scoped>
/* 添加悬停效果样式 */
.hover-grow {
    transition: transform 0.3s ease;
}

.hover-grow:hover {
    transform: scale(1.05);
}

.hover-pulse:hover {
    animation: pulse 1s infinite;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

/* 下划线动画效果 */
.hover-underline-animation {
    position: relative;
    display: inline-block;
}

.hover-underline-animation::after {
    content: '';
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: currentColor;
    transform-origin: bottom right;
    transition: transform 0.3s ease-out;
}

.hover-underline-animation:hover::after {
    transform: scaleX(1);
    transform-origin: bottom left;
}

/* 分类导航增强 */
.category-bar-item {
    transition: all 0.3s ease;
    position: relative;
}

.category-bar-item.active,
.category-bar-item:hover {
    transform: translateY(-2px);
}

/* 模块标题动画支持 */
.module-title {
    position: relative;
}

.module-title::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 40px;
    height: 3px;
    background-color: currentColor;
    opacity: 0.7;
}

/* 确保动画平滑 */
.post-item {
    backface-visibility: hidden;
    transform: translateZ(0);
    will-change: transform, opacity;
}

</style>
