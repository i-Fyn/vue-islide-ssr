<template>
    <div class="chapter-content relative min-h-screen" :class="{ 'immersive-mode': isImmersive }" v-if="chapter">
        <!-- 顶部导航栏 -->
        <div class="top-nav fixed top-0 left-0 right-0 bg-base-100/80 backdrop-blur-sm  transition-all duration-300 h-18 flex items-center justify-between"
            :class="{ 'opacity-0 z-0': !isImmersive, 'z-1002': isImmersive }">
            <div class="container mx-auto px-4 py-2 flex items-center justify-between">
                <button class="btn btn-ghost btn-sm" @click="router.back()">
                    <i class="ri-arrow-left-s-line text-xl"></i>
                </button>
                <h1 class="text-lg font-medium truncate max-w-[60%]">{{ chapter?.title }}</h1>
                <button class="btn btn-ghost btn-sm" @click="toggleImmersive">
                    <i :class="isImmersive ? 'ri-fullscreen-exit-line' : 'ri-fullscreen-line'" class="text-xl"></i>
                </button>
            </div>
        </div>

        <!-- 阅读区域 -->
        <div class="container mx-auto px-4 pb-8">
            <!-- 章节内容 -->
            <div class="content-wrapper max-w-3xl mx-auto">
                <div class="book-content text-base leading-relaxed whitespace-pre-wrap opacity-0 animate-fadeIn"
                    :style="{ fontSize: `${fontSize}px` }" v-html="chapter?.content"></div>
            </div>
        </div>

        <!-- 底部控制栏 -->
        <div class="bottom-nav fixed bottom-0 left-0 right-0 bg-base-100 transition-all duration-300 min-h-20 z-1003 flex items-center p-4 text-base-content"
            :class="{ 'opacity-0': !showControls }" @click.stop>
            <div class="container wrapper">
                <div class="flex flex-col gap-4">
                    <!-- 导航按钮 -->
                    <div class="flex justify-between items-center gap-4">
                        <button v-if="prevChapter" @click="goToPrevChapter" class="btn btn-outline flex-1">
                            <i class="ri-arrow-left-s-line"></i>
                            <span class="text-sm">上一章</span>
                        </button>
                        <div v-else class="flex-1"></div>

                        <a :href="'/book/' + chapter?.book?.id" @click.prevent="router.push('/book/' + chapter?.book?.id)"
                            class="btn btn-outline">
                            <i class="ri-menu-line"></i>
                            <span class="text-sm">目录</span>
                        </a>

                        <button v-if="nextChapter" @click="goToNextChapter" class="btn btn-outline flex-1">
                            <span class="text-sm">下一章</span>
                            <i class="ri-arrow-right-s-line"></i>
                        </button>
                        <div v-else class="flex-1"></div>
                    </div>

                    <!-- 阅读设置 -->
                    <div class="flex justify-between items-center gap-4">
                        <button class="btn btn-ghost btn-sm" @click.stop="adjustFontSize('decrease')">
                            <i class="ri-font-size-2 text-xl"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm" @click.stop="adjustFontSize('increase')">
                            <i class="ri-font-size text-xl"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm" @click.stop="toggleTheme">
                            <i class="ri-contrast-2-line text-xl"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm" @click.stop="toggleImmersive">
                            <i :class="isImmersive ? 'ri-fullscreen-exit-line' : 'ri-fullscreen-line'"
                                class="text-xl"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 骨架屏 -->
    <div v-else class="chapter-content pt-18  p-4 fixed inset-0 bg-base-100 z-10000">
        <div class="container mx-auto px-4">
            <div class="content-wrapper max-w-3xl mx-auto">
                <!-- 标题骨架屏 -->
                <div class="mb-8">
                    <div class="skeleton h-8 w-3/4 mb-4"></div>
                    <div class="flex items-center gap-x-4">
                        <div class="skeleton h-4 w-24"></div>
                        <div class="skeleton h-4 w-16"></div>
                    </div>
                </div>

                <!-- 内容骨架屏 -->
                <div class="space-y-6">
                    <div class="skeleton h-6 w-full"></div>
                    <div class="skeleton h-6 w-full"></div>
                    <div class="skeleton h-6 w-5/6"></div>
                    <div class="skeleton h-6 w-full"></div>
                    <div class="skeleton h-6 w-4/6"></div>
                    <div class="skeleton h-6 w-full"></div>
                    <div class="skeleton h-6 w-3/4"></div>
                    <div class="skeleton h-6 w-full"></div>
                    <div class="skeleton h-6 w-5/6"></div>
                    <div class="skeleton h-6 w-full"></div>
                    <div class="skeleton h-6 w-4/6"></div>
                    <div class="skeleton h-6 w-full"></div>
                    <div class="skeleton h-6 w-3/4"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/dist/axios';
import { useStore } from '../store';


const store = useStore();
const route = useRoute();
const router = useRouter();
const { postId } = route.params;

const chapter = ref(null);
const prevChapter = ref(null);
const nextChapter = ref(null);
const isImmersive = ref(false);
const showControls = ref(true);
const fontSize = ref(16);
const isDarkMode = ref(false);

// 控制面板显示/隐藏
const handleTouch = (event) => {
    // 如果点击的是控制面板或其子元素，不处理
    if (event.target.closest('.bottom-nav')) {
        return;
    }
    showControls.value = !showControls.value;
};

// 切换沉浸模式
const toggleImmersive = () => {
    isImmersive.value = !isImmersive.value;
    showControls.value = true;
    const bottomNav = document.querySelector('.mobile-tabbar');
    const header = document.querySelector('.header');
    if (isImmersive.value) {
        document.documentElement.requestFullscreen?.();
        if (bottomNav) {
            bottomNav.classList.add('opacity-0');
        }
        if (header) {
            header.classList.add('opacity-0');
        }
    } else {
        document.exitFullscreen?.();
        if (bottomNav) {
            bottomNav.classList.remove('opacity-0');
        }
        if (header) {
            header.classList.remove('opacity-0');
        }
    }
    // 保存设置
    if (!import.meta.env.SSR) {
        localStorage.setItem('reader-immersive', isImmersive.value);
    }
};

// 调整字体大小
const adjustFontSize = (action) => {
    if (action === 'increase' && fontSize.value < 24) {
        fontSize.value += 2;
    } else if (action === 'decrease' && fontSize.value > 12) {
        fontSize.value -= 2;
    }
    document.documentElement.style.setProperty('--font-size', `${fontSize.value}px`);
    // 保存设置
    if (!import.meta.env.SSR) {
        localStorage.setItem('reader-font-size', fontSize.value);
    }
};

// 切换主题
const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
    store.theme = isDarkMode.value ? 'dark' : 'light';
    // 保存设置
    if (!import.meta.env.SSR) {
        localStorage.setItem('reader-dark-mode', isDarkMode.value);
    }
};

// 获取章节内容
const fetchChapterContent = async (passageId) => {
    try {
        const res = await axios.post(`/book/passage`, {
            passage_id: passageId,
        });
        chapter.value = res.data.passage;

        if (res.data.passage.navigation.prev) {
            prevChapter.value = res.data.passage.navigation.prev;
        }
        if (res.data.passage.navigation.next) {
            nextChapter.value = res.data.passage.navigation.next;
        }
        // 更新路由参数但不触发路由跳转
        router.replace({ params: { postId: passageId } });
    } catch (err) {
        console.error('获取章节内容失败:', err);
    }
};

// 记录阅读
const record_reading = (passageId) => {
    axios.post('/record_reading', {
        passage_id: passageId,
    });
};

// 导航到上一章
const goToPrevChapter = async () => {
    if (prevChapter.value) {
        chapter.value = null;
        await fetchChapterContent(prevChapter.value.id);
        record_reading(prevChapter.value.id);
    }
};

// 导航到下一章
const goToNextChapter = async () => {
    if (nextChapter.value) {
        chapter.value = null;
        await fetchChapterContent(nextChapter.value.id);
        record_reading(nextChapter.value.id);
    }
};

onMounted(() => {
    fetchChapterContent(postId);
    record_reading(postId);

    // 添加触摸事件监听
    document.addEventListener('click', handleTouch);

    // 在客户端环境下读取保存的设置
    if (!import.meta.env.SSR) {
        const savedFontSize = localStorage.getItem('reader-font-size');
        const savedDarkMode = localStorage.getItem('reader-dark-mode');
        const savedImmersive = localStorage.getItem('reader-immersive');

        if (savedFontSize) {
            fontSize.value = Number(savedFontSize);
            document.documentElement.style.setProperty('--font-size', `${fontSize.value}px`);
        }

        if (savedDarkMode === 'true') {
            isDarkMode.value = true;
            store.theme = 'dark';
        }

        if (savedImmersive === 'true') {
            isImmersive.value = true;
            document.documentElement.requestFullscreen?.();
            const bottomNav = document.querySelector('.mobile-tabbar');
            if (bottomNav) {
                bottomNav.classList.add('opacity-0');
            }
        }
    }
});

onUnmounted(() => {
    // 移除事件监听
    document.removeEventListener('click', handleTouch);

    //恢复header和bottombar的显示
    const bottomNav = document.querySelector('.mobile-tabbar');
    const header = document.querySelector('.header');
    if (bottomNav) {
        bottomNav.classList.remove('opacity-0');
    }
    if(header){
        header.classList.remove('opacity-0');
    }
});
</script>

<style scoped>
.book-content {
    line-height: 1.8;
    transition: font-size 0.3s ease;
    font-size: calc(var(--font-size, 16px) * 0.9);
}
</style>
