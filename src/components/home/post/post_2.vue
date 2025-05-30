<template>
    <article class="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group rounded-xl border border-base-200 animate-fadeIn mb-3" :class="'item-' + item['type']" :id="'item-' + item['id']">
        <div class="flex p-4 h-full">
            <!-- 缩略图区域 -->
            <div class="w-1/4 lg:w-1/5 flex-shrink-0">
                <div class="relative h-0 overflow-hidden rounded-lg" :style="thumbStyle">
                    <a @click.prevent="saveArticle(item)" class="absolute inset-0" :href="'/'+item['type']+'/'+item['id']"
                        :title="item['title']" target="_self">
                        <van-image lazy-load :src="item['thumb']['default']" 
                            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            :alt="item['title']" />
                        <!-- 图片渐变叠加层 -->
                        <div class="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </a>
                </div>
            </div>
            
            <!-- 内容区域 -->
            <div class="flex flex-col flex-1 pl-4 w-0">
                <!-- 分类和标签 -->
                <div class="flex flex-wrap gap-1.5 mb-2" v-if="module.post_meta && module.post_meta.includes('cats')">
                    <span class="badge badge-xs badge-warning gap-1" v-if="item['comments'] > 5">
                        <i class="ri-fire-fill text-xs"></i>多人互动
                    </span>
                    <span class="badge badge-xs badge-info gap-1" v-if="item['download'] == '1'">
                        <i class="ri-download-cloud-fill text-xs"></i>资源
                    </span>
                    <span class="badge badge-xs badge-error gap-1" v-if="item.content && item.content.content_hide && item.content.content_hide.content">
                        <i class="ri-lock-2-line text-xs"></i>限制
                    </span>
                    <a v-for="(cat, index) in item['cats'].slice(0, 1)"
                        @click.prevent="go('/category/' + cat['term_id'])"
                        :key="index" 
                        class="badge badge-xs badge-ghost hover:badge-primary transition-colors duration-200" 
                        :href="'/category/' + cat['term_id']" :title="cat['name']"
                        target="_self">
                        {{ cat['name'] }}
                    </a>
                </div>
                
                <!-- 文章标题 -->
                <h2 class="font-medium mb-1.5 line-clamp-1 leading-normal group-hover:text-primary transition-colors duration-200">
                    <a @click.prevent="saveArticle(item)" :href="'/'+item['type']+'/'+item['id']" :title="item['title']" target="_self">
                        {{ item['title'] }}
                    </a>
                </h2>
                
                <!-- 文章摘要 -->
                <p v-if="module.post_meta && module.post_meta.includes('desc')" 
                    class="text-sm text-base-content/70 line-clamp-1 leading-normal mb-auto">
                    {{ item['excerpt'] }}
                </p>

                <!-- 底部元数据 -->
                <div class="flex justify-between items-center pt-2 mt-2 text-sm text-base-content/60 border-t border-base-200/70">
                    <div class="flex-grow w-0">
                        <!-- 更多分类标签 -->
                        <span class="flex flex-wrap gap-1.5" v-if="module.post_meta && module.post_meta.includes('cats') && item['cats'].length > 1">                                
                            <a v-for="(cat, index) in item['cats'].slice(1, 2)"
                                @click.prevent="go('/category/' + cat['term_id'])"
                                :key="index" 
                                class="text-base-content/60 hover:text-primary truncate max-w-[80px] transition-colors duration-200" 
                                :href="'/category/' + cat['term_id']" :title="cat['name']"
                                target="_self">
                                {{ cat['name'] }}
                            </a>
                        </span>
                    </div>
                    <div class="flex items-center gap-3 flex-wrap">
                        <!-- 发布日期 -->
                        <span v-if="module.post_meta && module.post_meta.includes('cat')" 
                            class="flex items-center gap-1 whitespace-nowrap">
                            <i class="ri-time-line"></i>{{ item['date'] }}
                        </span>
                        <!-- 阅读数 -->
                        <span v-if="module.post_meta && module.post_meta.includes('views')" 
                            class="flex items-center gap-1 whitespace-nowrap hover:text-info transition-colors">
                            <i class="ri-eye-line"></i>{{ handleNumber(item['meta']['views']) }}
                        </span>
                        <!-- 点赞数 -->
                        <span v-if="module.post_meta && module.post_meta.includes('like')" 
                            class="flex items-center gap-1 whitespace-nowrap hover:text-primary transition-colors">
                            <i class="ri-thumb-up-line"></i>{{ handleNumber(item['meta']['like']['count']) }}
                        </span>
                        <!-- 评论数 -->
                        <span v-if="module.post_meta && module.post_meta.includes('comment')" 
                            class="flex items-center gap-1 whitespace-nowrap hover:text-secondary transition-colors">
                            <i class="ri-message-3-line"></i>{{ handleNumber(item['meta']['comment']) }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </article>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { computed } from 'vue';
import { handleNumber } from '@/dist/theme';

const store = useStore();
const router = useRouter();
const props = defineProps({
    item: {
        type: Object,
        required: true
    },
    module: {
        type: Object,
        required: true
    }
});

const saveArticle = (article) => {
    store.article[article.id] = article;
    router.push(`/${article.type}/${article.id}`); 
};

const go = (path) => {
    router.push(path);
};

const marginTop = computed(() => {
    //格式：1/0.5
    var ratio = props.module.post_thumb_ratio;
    var arr = ratio.split('/');
    return (arr[1] / arr[0]).toFixed(6);
});

const thumbStyle = computed(() => {
    var thumb = props.item.thumb['full'];
    var waterfall_top = thumb[2] ? (thumb[2] / thumb[1]).toFixed(6) : 1;
    var ratio = props.module.waterfall_show == '1' ? waterfall_top : marginTop.value;
    var ratio = ratio > 2 ? 2 : ratio;
    return {
        'height': '100%',
        'padding-top': ratio * 100 + '%',
    };
});
</script>

<style scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fadeIn {
    animation: fadeIn 0.5s ease forwards;
}
</style>