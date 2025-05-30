<template>
    <div class="single-page" v-if="Object.keys(book).length">
        <div class="flex flex-col gap-y-10 wrapper">
            <div class="post-single-content single-content w-full p-4 bg-base-100 card">
                <div class="relative flex flex-col gap-4 md:gap-8">
                    <div class="flex flex-col gap-4 md:gap-8 relative">
                        <!-- 移动端布局 -->
                        <div class="flex gap-4 lg:gap-8">
                            <div class="w-1/3 lg:w-48 shrink-0">
                                <div class="relative aspect-[var(--aspect)] rounded-lg overflow-hidden shadow-lg"
                                    style="--aspect:0.71428571428571"> 
                                    <img :src="book?.book.cover" loading="lazy" class="lozad x object-cover w-full h-full">
                                    <div class="novel-imgcover absolute top-0 left-0 right-0 w-full h-full"></div>
                                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                        <span class="text-white text-sm font-medium">{{ book?.book.status }}</span> 
                                    </div>
                                </div>
                            </div>
                            <div class="flex-1 relative">
                                <span class="badge badge-info absolute right-1">
                                    {{ book?.book.source }}
                                </span>
                                <h1 class="title post-title text-lg lg:text-3xl font-medium truncate text-ellipsis whitespace-nowrap mb-2">
                                    {{ book?.book.title }}
                                </h1>
                                <div class="flex flex-col gap-y-2 lg:gap-y-4">
                                    <div class="flex items-center gap-x-2">
                                        <span class="text-sm text-neutral-400">最新章节:</span>
                                        <span class="text-sm">第{{ book?.passages?.length }}章</span>
                                    </div>
                                    <div class="flex items-center gap-x-2">
                                        <span class="text-sm text-neutral-400">浏览:</span>
                                        <span class="text-sm">{{ book?.book.meta?.views || 0 }}</span>
                                    </div>
                                    <div class="flex items-center gap-x-2">
                                        <span class="text-sm text-neutral-400">字数:</span>
                                        <span class="text-sm">{{ book?.book.meta?.word_count || 0 }}字</span>
                                    </div>
                                    <div class="flex items-center gap-x-2" v-if="book?.book.categories">
                                        <span class="text-sm text-neutral-400">类别:</span>
                                        <span v-for="(category, index) in book?.book.categories" class="text-sm">{{ category.name }}</span>
                                    </div>
                                    <div class="flex items-center gap-x-2">
                                        <span class="text-sm text-neutral-400">作者:</span>
                                        <span class="text-sm">{{ book?.book.author.name || '' }}</span>
                                    </div>
                                    <div class="flex items-center gap-x-2">
                                        <span class="text-sm text-neutral-400">更新时间:</span>
                                        <span class="text-sm">{{ book?.passages?.[book?.passages.length - 1]?.date || '' }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 按钮和进度条部分 -->
                        <div class="flex flex-col gap-3">
                            <div class="flex gap-2 lg:absolute lg:right-0 lg:bottom-20" >
                                <a :href="book?.passages?.[0]?.url" 
                                     @click.prevent="router.push({name: 'passage', params: {postId:book?.passages?.[0].id}})"
                                    class="btn btn-primary rounded-full flex-1 h-9 min-h-0 text-sm">
                                    开始阅读
                                </a>
                            </div>
                            <div class="bg-base-200 p-2 rounded-lg">
                                <div class="flex justify-between text-sm mb-1">
                                    <span>阅读进度</span>
                                    <span>{{ book?.book.current_passage || 0 }}/{{ book?.book.passages_count }}</span>
                                </div>
                                <progress class="progress progress-accent w-full" :value="Number(book?.book.current_passage)" :max="Number(book?.book.passages_count)"></progress>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col">
                        <div class="beebee-content text-sm md:text-base">{{ book?.book.description || '暂时没有内容介绍' }}</div>
                    </div>

                    <div class="min-h-[300px]">
                        <div class="flex justify-between items-center text-sm w-full pt-4 pb-4">
                            <h2 class="text-base md:text-xl font-bold">全部章节（共{{ book?.book.passages_count }}章）</h2>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
                            <div v-for="(chapter, index) in book?.passages" :key="index">
                                <div class="opacity-0 animate-fadeIn">
                                    <a :href="chapter.url" 
                                         @click.prevent="router.push({name: 'passage', params: {postId:chapter.id}})"
                                        class="flex flex-col p-3 rounded-lg low-muted-btn bg-base-200">
                                        <div class="text-sm text-neutral-500 dark:text-neutral-400 flex gap-2">
                                            <span>第{{ index + 1 }}章</span>
                                            <span>·</span>
                                            <span>{{ chapter.date }}</span>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <h3 class="font-medium text-sm md:text-base truncate">{{ chapter.title }}</h3>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 骨架屏 -->
    <div v-else class="single-page fixed inset-0  bg-base-100 z-10000">
        <div class="flex flex-col gap-y-10 wrapper">
            <div class="pt-18 lg:pt-0 post-single-content single-content w-full p-4 bg-base-100 card">
                <div class="relative flex flex-col gap-4 md:gap-8">
                    <div class="flex flex-col gap-4 md:gap-8 relative">
                        <!-- 移动端布局骨架屏 -->
                        <div class="flex gap-4 lg:gap-8">
                            <!-- 封面骨架屏 -->
                            <div class="w-1/3 lg:w-48 shrink-0">
                                <div class="relative aspect-[var(--aspect)] rounded-lg overflow-hidden shadow-lg"
                                    style="--aspect:0.71428571428571">
                                    <div class="skeleton w-full h-full"></div>
                                </div>
                            </div>
                            <!-- 信息骨架屏 -->
                            <div class="flex-1">
                                <div class="skeleton h-8 w-3/4 mb-4"></div>
                                <div class="flex flex-col gap-y-2 lg:gap-y-4">
                                    <div class="flex items-center gap-x-2">
                                        <div class="skeleton h-4 w-16"></div>
                                        <div class="skeleton h-4 w-12"></div>
                                    </div>
                                    <div class="flex items-center gap-x-2">
                                        <div class="skeleton h-4 w-16"></div>
                                        <div class="skeleton h-4 w-12"></div>
                                    </div>
                                    <div class="flex items-center gap-x-2">
                                        <div class="skeleton h-4 w-16"></div>
                                        <div class="skeleton h-4 w-12"></div>
                                    </div>
                                    <div class="flex items-center gap-x-2">
                                        <div class="skeleton h-4 w-16"></div>
                                        <div class="skeleton h-4 w-12"></div>
                                    </div>
                                    <div class="flex items-center gap-x-2">
                                        <div class="skeleton h-4 w-16"></div>
                                        <div class="skeleton h-4 w-12"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 按钮和进度条骨架屏 -->
                        <div class="flex flex-col gap-3">
                            <div class="flex gap-2 lg:absolute lg:right-0 lg:bottom-20">
                                <div class="skeleton h-9 w-full rounded-full"></div>
                            </div>
                            <div class="bg-base-200 p-2 rounded-lg">
                                <div class="flex justify-between text-sm mb-1">
                                    <div class="skeleton h-4 w-16"></div>
                                    <div class="skeleton h-4 w-12"></div>
                                </div>
                                <div class="skeleton h-2 w-full rounded"></div>
                            </div>
                        </div>
                    </div>

                    <!-- 描述骨架屏 -->
                    <div class="flex flex-col">
                        <div class="space-y-2">
                            <div class="skeleton h-4 w-full"></div>
                            <div class="skeleton h-4 w-full"></div>
                            <div class="skeleton h-4 w-5/6"></div>
                        </div>
                    </div>

                    <!-- 章节列表骨架屏 -->
                    <div class="min-h-[300px]">
                        <div class="flex justify-between items-center text-sm w-full pt-4 pb-4">
                            <div class="skeleton h-6 w-48"></div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
                            <div v-for="i in 6" :key="i">
                                <div class="flex flex-col p-3 rounded-lg bg-base-200">
                                    <div class="flex gap-2 mb-2">
                                        <div class="skeleton h-4 w-12"></div>
                                        <div class="skeleton h-4 w-4"></div>
                                        <div class="skeleton h-4 w-16"></div>
                                    </div>
                                    <div class="skeleton h-5 w-3/4"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from '@/dist/axios';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { postId } = route.params;

const book = ref({});


const read_history = ()=>{
    axios.post('/read_history',{
        book_id: postId,
    }).then(res=>{
        console.log(res.data)
    })
}

onMounted(async () => {
    try {
        const res = await axios.post('/getPassageList', {
            post_id: postId
        });
        book.value = res.data;
    } catch(err) {
        console.error('获取书籍信息失败:', err);
    }
    read_history();
});

</script>
