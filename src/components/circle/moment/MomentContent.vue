<template>
    <!-- image -->
    <div class="moment-content-wrap flex flex-col lg:flex-row gap-1 lg:gap-4 relative bg-base-200 lg:bg-base-100">
        <div class="moment-image-container mb-5 lg:mb-0  lg:h-138  h-95 lg:w-1/2 group relative"
            v-if="item.attachment.image.length">
            <!-- 图片轮播区域 -->
            <div ref="carouselRef" class="carousel w-full lg:h-138 h-95 lg:border lg:border-base-300 lg:rounded-(--radius-box) ">
                <div v-for="(image, index) in item.attachment.image" :key="index" 
                    class="carousel-item relative inline-block w-full shrink-0 snap-center content-center bg-base-200 ">
                    <img :src="image.thumb" class="w-full h-full object-contain" style="object-fit:contain" data-fancybox="gallery" />
                </div>
            </div>

            <!-- 左右按钮 -->
            <div class="absolute opacity-0 left-0 right-0 top-1/2 z-10 flex justify-between px-4 -translate-y-1/2 pointer-events-none group-hover:opacity-80"
                :hidden="item.attachment.image.length < 2">
                <button class="btn btn-circle pointer-events-auto" @click="scrollTo('prev')"
                    :disabled="currentIndex === 0">
                    ❮
                </button>
                <button class="btn btn-circle pointer-events-auto" @click="scrollTo('next')"
                    :disabled="currentIndex === item.attachment.image.length - 1">
                    ❯
                </button>
            </div>

            <!-- 页码显示 -->
            <div class="absolute opacity-0 top-2 right-3 z-10 bg-base-300 bg-opacity-50 text-white text-sm px-2 py-1 rounded-xl group-hover:opacity-80 backdrop-blur-md"
                :hidden="item.attachment.image.length < 2">
                {{ currentIndex + 1 }} / {{ item.attachment.image.length }}
            </div>

            <!-- 底部中间 dot 指示器 -->
            <div
                class="absolute -bottom-5 lg:bottom-2 left-1/2 z-10 -translate-x-1/2 flex space-x-1 px-2 py-2 lg:bg-base-200 opacity-70 rounded-4xl">
                <span v-for="(image, index) in item.attachment.image" :key="'dot-' + index"
                    class="w-1.5 h-1.5 rounded-full transition-all" :hidden="item.attachment.image.length < 2"
                    :class="currentIndex === index ? 'bg-primary scale-110' : 'bg-base-300'"></span>
            </div>
        </div>
        <div class="moment-video-container p-4 lg:p-0" v-else-if="item['attachment']['video'].length">
            <MomentVideo :item="item" />
        </div>
        <div class="moment-header-placeholder h-17 w-1/2 absolute top-0 right-0 z-999 bg-base-100 opacity-0 px-5 overflow-hidden"
            ref="headerPlaceholder" :class="{ 'is-sticky': isSticky }" v-show="isSticky">
            <MomentHeader :postDetail="item" />
        </div>
        <div class="moment-article-wrapper rounded-t-box bg-base-100 p-4 lg:p-0 lg:h-138 lg:w-1/2 overflow-hidden">
            <div class="moment-article-container overflow-hidden">
                <div class="article-title mb-4">
                    <h1 class="text-lg lg:text-xl font-semibold">{{ item.title }}</h1>
                </div>
                <MomentHeader :postDetail="item" class="mb-4" />
                <div class="article-content text-base leading-relaxed text-base-content/90">
                    <p v-html="item['content']['content']"></p>
                </div>
                <ArticleHide v-if="item['content']['content_hide']" :roles="item['content']['content_hide']" class="mt-4" />
                <div class="moment-topic-container mt-6" v-if="item['topics'].length">
                    <div class="flex flex-wrap gap-2">
                        <a v-for="topic in item['topics']" 
                           :key="topic.id"
                           :href="'/topic/' + topic.id"
                           @click.prevent="router.push('/topic/' + topic.id)"
                           class="text-primary hover:text-primary-focus transition-colors text-sm">
                            #{{ topic.name }}#
                        </a>
                    </div>
                </div>
            </div>
            <MomentVote :item="item.vote" v-if="item.vote" class="mt-6" />
        </div>
    </div>
</template>


<script setup>
import ArticleHide from '@/components/single/container/article/ArticleHide.vue'
import { showImagePreview } from 'vant'
import { useIsMobile } from '../../../dist/mobile';
import MomentHeader from '@/components/single/container/header/MomentHeader.vue';
import BetterScroll from 'better-scroll'
import { ref, onMounted, onBeforeUnmount } from 'vue';
import MomentVideo from './MomentVideo.vue';
import { useRouter } from 'vue-router';
import MomentVote from './MomentVote.vue';

const router = useRouter();
const isSticky = ref(false)
const carouselRef = ref(null);
const currentIndex = ref(0);
const headerPlaceholder = ref(null);
let bs = null;
const isScrolling = ref(false);

const previewImages = (startIndex) => {
    const images = props.item['attachment']['image'].map(img => img.url || img.src || img.thumb)
    showImagePreview({
        images,
        startPosition: startIndex,
        closeable: true,
        showIndex: true,
        teleport: 'body'
    })
}
const { isMobile } = useIsMobile();

const props = defineProps({
    item: {
        type: Object,
    }
})

const handleBScroll = () => {
    bs = new BetterScroll('.moment-article-wrapper', {
        scrollY: true,
        click: true,
        mouseWheel: {
            speed: 20,
            invert: false,
            easeTime: 300,
            observeDOM: true
        },
        probeType: 3
    })
    bs.refresh()
    bs.on('scroll', (pos) => {
        if (pos.y < -1) {
            isSticky.value = true
        } else {
            isSticky.value = false
        }
    })
}

onMounted(() => {
    if(props.item.type !=='card') return
    carouselRef.value.addEventListener('scroll', debouncedHandleScroll, { passive: true });
    if (isMobile.value) return;
    handleBScroll();

})

onBeforeUnmount(() => {
    if(props.item.type !=='card') return
    bs && bs.destroy();
    bs = null;
    carouselRef.value && carouselRef.value.removeEventListener('scroll', debouncedHandleScroll);
})

const debounce = (fn, delay = 100) => {
    let timer;
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => fn(...args), delay)
    }
}

// 滚动到目标项
const scrollTo = (direction) => {
    if (!carouselRef.value || isScrolling.value) return;
    isScrolling.value = true;

    const total = props.item.attachment.image.length;
    if (direction === 'prev') {
        currentIndex.value = Math.max(0, currentIndex.value - 1);
    } else if (direction === 'next') {
        currentIndex.value = Math.min(total - 1, currentIndex.value + 1);
    }

    const el = carouselRef.value.children[currentIndex.value];
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

    // 滚动结束后重置标志
    setTimeout(() => {
        isScrolling.value = false;
    }, 500); // 等待滚动动画完成
};

const handleScroll = () => {
    if (!carouselRef.value || isScrolling.value) return;
    const scrollLeft = carouselRef.value.scrollLeft;
    const width = carouselRef.value.offsetWidth;
    const index = Math.round(scrollLeft / width);
    currentIndex.value = index;
};

// ✅ 正确使用 debounce
const debouncedHandleScroll = debounce(handleScroll, 0);


</script>

<style scoped>
.moment-header-placeholder.is-sticky {
    opacity: 1;
}
</style>
