<template>
    <div class=" archive-row bg-base-100 card" v-cloak>
        <div :class="config.islide_tax_group_tag['post_type']" id="post-list ">

            <!-- page header -->
            <div class="text-center py-5 mb-4 overflow-hidden">
                <h3 class="text-2xl font-extrabold tracking-widest text-gray-800 dark:text-gray-200 mb-4">
                    标签云
                </h3>
                <p class="text-lg text-base-content/60 dark:text-gray-400">
                    共 {{ allTags.length }} 个标签
                </p>
            </div>

            <!-- tags cloud -->
            <div class="flex flex-wrap justify-center gap-3 px-4 mb-2 overflow-hidden" ref="tagsCloud">
                <router-link to="/tag" 
                    class="flex items-center gap-2 px-3 py-2 text-base rounded transition-all duration-300 border-2 border-transparent relative cursor-pointer hover:-translate-y-0.5 hover:"
                    :class="selectedTag === 0 || !selectedTag ? 'text-white' : 'text-gray-800 dark:text-gray-200'" 
                    :style="{
                        '--tw-text-opacity': '1',
                        '--tag-color': 'hsl(215, 70%, 60%)',
                        '--animation-delay': '0s',
                        background: selectedTag === 0 || !selectedTag ? 'var(--tag-color)' : 'transparent',
                        boxShadow: selectedTag === 0 || !selectedTag ? '0 4px 12px hsla(215, 70%, 60%, 0.2)' : 'none'
                    }">
                    <i class="ri-price-tag-3-line text-sm transition-transform duration-300"
                        :style="{ color: selectedTag === 0 || !selectedTag ? 'white' : 'var(--tag-color)' }"></i>
                    <span class="relative z-10">全部</span>
                </router-link>
                
                <router-link :to="`/tag/${tag.id}`" v-for="tag in allTags" :key="`tag-${tag.name}`"
                    class="flex items-center gap-2 px-3 py-2 text-base rounded transition-all duration-300 border-2 border-transparent relative cursor-pointer hover:-translate-y-0.5 hover:"
                    :class="selectedTag === tag.id ? 'text-white' : 'text-gray-800 dark:text-gray-200'" :style="{
                        '--tw-text-opacity': '1',
                        '--tag-color': `hsl(${(tag.name.length * 40) % 360}, 70%, 60%)`,
                        '--animation-delay': `${Math.random() * 0.5}s`,
                        background: selectedTag === tag.id ? `var(--tag-color)` : 'transparent',
                        boxShadow: selectedTag === tag.id ? `0 4px 12px hsla(${(tag.name.length * 40) % 360}, 70%, 60%, 0.2)` : 'none'
                    }">
                    <i class="ri-price-tag-3-fill text-sm transition-transform duration-300"
                        :style="{ color: selectedTag === tag.id ? 'white' : 'var(--tag-color)' }"></i>
                    <span class="relative z-10">{{ tag.name }}</span>
                    <span class="text-sm px-3 py-0.5 rounded-full"
                        :class="selectedTag === tag.id ? 'text-white bg-base-100/25' : 'text-base-content/60'"
                        :style="{ background: selectedTag !== tag.id ? `hsla(${(tag.name.length * 40) % 360}, 70%, 80%, 0.2)` : undefined }">
                        {{ tag.count }}
                    </span>
                </router-link>
            </div>

            <!-- tag header -->
            <div class="mb-4 px-4 relative overflow-hidden">
                <div class="absolute left-0 top-0 h-full w-1.5 bg-primary rounded-sm"></div>
                <h2 class="text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100">
                    <van-icon name="label-o" />
                    <template v-if="selectedTag === 0 || !selectedTag">全部标签</template>
                    <template v-else>{{allTags.find(tag => tag.id === selectedTag)?.name || '未知标签'}}</template>
                    <span
                        class="ml-auto text-sm flex items-center gap-1 text-base-content/60 bg-base-100/60 dark:bg-black/30 backdrop-blur-md px-3 py-1 rounded-md transition-transform hover:-translate-y-0.5">
                        <span class="font-semibold text-base">{{ postList.length }}</span>
                        篇文章
                    </span>
                </h2>
            </div>

            <!-- 渲染 postList 内容-->
            <postArticle :postList="postList" :module="config.islide_tax_group_tag"></postArticle>
            <div class="empty " v-if="isDataEmpty">
                <van-empty image-size="10rem" description="暂无记录" />
            </div>

        </div>
        <div class="pagenavn json-nav">
            <PageNav ref="jsonPageNav" :paged="paged" :pages="pages" navtype="json"
                :type="config.islide_tax_group_tag['tax_pagination_type']" :api="api" :param="param" @change="change"
                @loading='loading = true'>
            </PageNav>
        </div>
    </div>
</template>

<script setup>
import PageNav from '@/components/footer/PageNav.vue';
import { ref, onMounted, computed, defineAsyncComponent, onServerPrefetch } from 'vue';
import { useStore } from '@/store/index';
import { useRoute } from 'vue-router';
import { useSeoMeta } from '@unhead/vue';
import { useHead } from '@unhead/vue';
import postArticle from '../home/post/postArticle.vue';

const store = useStore();
const route = useRoute();

const config = computed(() => {
    return store.config;
});

const allTags = ref(config.value.tax.tags);
const selectedTag = ref(Number(route.params.tag_id));

// 分页数据
const api = ref('posts');
const param = ref({
    post_order: config.value.islide_tax_group_tag.post_order,
    size: config.value.islide_tax_group_tag.post_count,
});

// 仅当tag_id不为0时添加到param中
if (Number(route.params.tag_id) !== 0) {
    param.value.tag_id = Number(route.params.tag_id);
}

const jsonPageNav = ref(null);
const paged = ref(1);
const pages = ref(1);
const postList = ref([]);
const loading = ref(true);
const isDataEmpty = ref(false);

const seo = computed(() => {
    const tagId = Number(route.params.tag_id);
    if (tagId === 0 || !tagId) {
        return {
            name: '全部标签',
            seo: {
                title: '全部标签文章',
                description: '浏览全站所有标签文章',
                image: ''
            }
        };
    }
    return config.value.tax.tags.find(tag => tag.id === tagId) || {
        name: '未知标签',
        seo: {
            title: '未知标签',
            description: '未知标签',
            image: ''
        }
    };
})

const change = (recievedData) => {
    if (config.value.islide_tax_group_tag.tax_pagination_type === 'page') {
        postList.value = recievedData.data;
    } else {
        postList.value = postList.value.concat(recievedData.data);
    }
    isDataEmpty.value = postList.value.length === 0;
    pages.value = recievedData.pages;
    loading.value = false;
}

const init = async () => {
    loading.value = true;
    
    // 排序标签
    if (selectedTag.value === 0 || !selectedTag.value) {
        // 如果是全部标签，按照数量排序
        allTags.value.sort((a, b) => b.count - a.count);
    } else {
        // 否则将选中的标签放在前面
        allTags.value.sort((a, b) => {
            if (a.id === selectedTag.value) {
                return -1;
            } else if (b.id === selectedTag.value) {
                return 1;
            } else {
                return b.count - a.count;
            }
        });
    }
    
    // 设置页面标题
    store.center_title = seo.value.seo.title;
    
    await store.getList(param.value).then(posts => {
        loading.value = false;
        postList.value = posts.data;
        pages.value = posts.pages;
        paged.value = posts.paged;
        isDataEmpty.value = posts.data.length === 0;
    })
}

onServerPrefetch(async () => {
    await init();
})

onMounted(async () => {
    await init();
});

useSeoMeta({
    title: computed(() => seo.value.seo.title),
    description: computed(() => seo.value.seo.description),
    ogDescription: computed(() => seo.value.seo.description),
    ogTitle: computed(() => seo.value.seo.title),
    ogImage: computed(() => seo.value.seo.image),
    ogUrl: computed(() => import.meta.env.VITE_BASE_URL + route.fullPath),
})


</script>
