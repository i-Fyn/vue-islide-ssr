<template>
    <div class="loading-skeleton grid gap-4 animate__animated animate__fadeIn" :class="gridClass">
        <div v-for="i in Number(count)" :key="i" class="skeleton-wrapper">
            <component 
                :is="currentSkeletonComponent" 
                :thumbRatio="getThumbRatio()" />
        </div>
    </div>
</template>

<script setup>
import { computed, shallowRef, defineAsyncComponent, watch } from 'vue';
import { useIsMobile } from '@/dist/mobile';

const { isMobile } = useIsMobile();

// 使用异步组件定义
const Post1Skeleton = defineAsyncComponent(() => import('./Post1Skeleton.vue'));
const Post2Skeleton = defineAsyncComponent(() => import('./Post2Skeleton.vue'));
const Post3Skeleton = defineAsyncComponent(() => import('./Post3Skeleton.vue'));
const Post4Skeleton = defineAsyncComponent(() => import('./Post4Skeleton.vue'));
const Post5Skeleton = defineAsyncComponent(() => import('./Post5Skeleton.vue'));
const Post6Skeleton = defineAsyncComponent(() => import('./Post6Skeleton.vue'));

const props = defineProps({
    type: {
        type: String,
        default: 'post-1'
    },
    count: {
        type: [Number, String],
        default: 6
    },
    columns: {
        type: [Number, String],
        default: 3
    },
    thumbRatio: {
        type: String,
        default: '1/0.618'
    }
});

// 使用shallowRef存储当前骨架屏组件
const currentSkeletonComponent = shallowRef(Post1Skeleton);

// 根据类型设置对应的骨架屏组件
const setSkeletonComponent = () => {
    switch (props.type) {
        case 'post-1':
            currentSkeletonComponent.value = Post1Skeleton;
            break;
        case 'post-2':
            currentSkeletonComponent.value = Post2Skeleton;
            break;
        case 'post-3':
            currentSkeletonComponent.value = Post3Skeleton;
            break;
        case 'post-4':
            currentSkeletonComponent.value = Post4Skeleton;
            break;
        case 'post-5':
            currentSkeletonComponent.value = Post5Skeleton;
            break;
        case 'post-6':
            currentSkeletonComponent.value = Post6Skeleton;
            break;
        default:
            currentSkeletonComponent.value = Post1Skeleton;
    }
};

// 初始设置
setSkeletonComponent();

// 监听props.type的变化
watch(() => props.type, () => {
    setSkeletonComponent();
});

// 计算缩略图比例
const getThumbRatio = () => {
    const ratio = props.thumbRatio || '1/0.618';
    const [w, h] = ratio.split('/').map(Number);
    const safeRatio = h && w ? (h / w) * 100 : 61.8;
    return `${safeRatio}%`;
};

// 根据屏幕尺寸和文章类型计算网格列数
const gridClass = computed(() => {
    const mobileColumns = getMobileColumnCount();
    return isMobile.value 
        ? `grid-cols-${mobileColumns}` 
        : `grid-cols-${props.columns}`;
});

// 根据文章类型返回移动端的列数
const getMobileColumnCount = () => {
    switch (props.type) {
        case 'post-1':
            return 1;
        case 'post-2':
            return 1;
        case 'post-3':
            return 2;
        case 'post-4':
            return 1;
        case 'post-5':
            return 2;
        case 'post-6':
            return 1;
        default:
            return 1;
    }
};
</script>

<style scoped>
.loading-skeleton {
    width: 100%;
    margin: 0 auto;
}

.skeleton-wrapper {
    height: 100%;
}

@media (max-width: 768px) {
    .loading-skeleton {
        gap: 16px;
    }
}
</style> 