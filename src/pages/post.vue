<template>
  <div v-if="loaded && postDetail" class="single-page">
    <!-- 文章头部 -->
    <header
      class=" -mt-22 post-header post-bg relative w-full flex justify-center bg-center bg-cover bg-no-repeat overflow-hidden h-[34rem] bg-base-200  z-0 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[var(--islide-main)] before:opacity-100 pb-4">
      <div
        class="post-cover-wrapper fixed lg:relative w-full lg:w-7/10 h-120  lg:h-full m-0  lg:m-[0_-20%_0_auto] overflow-hidden  blur-none z-0 after:absolute after:inset-0 after:h-7/10  after:shadow-[0px_33px_80px_96px_var(--islide-main)_inset] lg:after:shadow-[110px_-130px_300px_60px_var(--islide-main)_inset] lg:blur-xl lg:opacity-50  ">
        <van-image lazy-load :src="postDetail['thumb']['default']"
          class="post-cover w-full h-7/10  lg:h-full object-cover min-w-[50vw] min-h-60   lg:min-h-[20rem]  lg:opacity-80 opacity-100"
          :alt="postDetail.title" />
      </div>
      <div
        class="post-info wrapper absolute bottom-0 lg:top-0 w-full mb-0 lg:m-[20px_auto_40px] z-10 text-white flex flex-col items-center lg:items-start h-fit lg:h-full justify-normal  lg:justify-center lg:gap-4 text-left lg:text-center  after:absolute after:inset-0 after:h-[200%] after:z-0  ">
        <div class="post-first-info w-ful justify-center lg:justify-start flex whitespace-nowrap select-auto my-0 z-1 ">
          <div class="meta-firstline flex items-center h-8 mx-2 py-2 mb-1.5 w-full">
            <!-- Categories -->
            <template v-if="postDetail.cats">
              <a v-for="(category, index) in postDetail.cats.slice(0, 2)" :key="index"
                class="post-meta-original bg-[rgba(255,255,255,0.15)] m-0 p-0 px-2 text-sm font-bold rounded-3xl h-8 leading-8 w-full flex"
                @click.prevent="go('/category/' + category.term_id)" :href="'/category/' + category.term_id"
                :title="category.name" target="_self">
                {{ category.name }}
              </a>
            </template>
            <!-- Tags -->
            <div class="tag-share ml-4 hidden lg:block text-sm">
              <template v-if="postDetail.tags">
                <div class=" flex flex-row">
                  <a v-for="(tag, index) in postDetail.tags.slice(0, 5)" :key="tag.slug || index"
                    class=" mr-2 px-2 py-0 pl-1 rounded-lg flex items-center flex-row text-medium "
                    @click.prevent="go('/tag/' + tag.term_id)" :href="'/tag/' + tag.term_id">
                    <i class="ri-hashtag"></i>{{ tag.name }}
                  </a>
                </div>
              </template>
            </div>
          </div>
        </div>
        <h1 @click.prevent="scrollTo('.single-article')"
          class="post-title z-1 font-bold text text-2xl leading-[1.2] text-center lg:text-left lg:text-5xl m-0 mt-4 mb-4 -webkit-line-clamp-2 overflow-hidden">
          {{ postDetail.title }}
        </h1>
        <div class="post-meta mt-1.5 flex select-none mb-8 z-1 text-[80%] p-4">
          <div class="meta-secondline text-center flex flex-wrap mb-10 justify-center items-center gap-3">
            <span class="post-meta-wordcount flex items-center gap-1">
              <i class="ri-file-3-fill mr-1"></i>
              <span class="post-meta-label">字数：</span>
              <span class="word-count">{{ contentWords || 0 }}</span>
              <span class="post-meta-separator mx-2"></span>
              <i class="ri-time-line mr-1"></i>
              <span class="post-meta-label">阅读：</span>
              <span>{{ contentReadTime || 0 }} 分</span>
            </span>
            <span class="post-meta-date  flex items-center gap-1">
              <i class="ri-calendar-2-fill  mr-1"></i>
              <time :datetime="postDetail.ctime" :title="postDetail._date">
                {{ postDetail.date }}
              </time>
            </span>
            <span v-if="postDetail.ip" class="post-meta-position  flex items-center gap-1">
              <i class="ri-map-pin-fill  mr-1"></i>{{ postDetail.ip }}
            </span>
            <span class="post-meta-pv  flex items-center gap-1" title="热度" data-flag-title="热度">
              <i class="ri-eye-line  mr-1"></i>
              <span class="post-meta-label">热度：</span>
              <span class="busuanzi-page-pv">{{ postDetail.meta.views }}</span>
            </span>
            <span @click.prevent="scrollTo('#comments')" class="post-meta-commentcount  flex items-center gap-1"
              title="评论数">
              <i class="ri-message-3-line  mr-1"></i>
              <span class="post-meta-label">评论：</span>
              <a href="#comments">
                <span class="twikoo-count">{{ postDetail.meta.comment }}</span>
              </a>
            </span>
            <span class="post-meta-download  flex items-center gap-1" title="下载资源" v-if="postDetail.download == '1'">
              <i class="ri-download-cloud-fill  mr-1"></i>
              <span class="post-meta-label"></span>
              <a href="#download-box" @click.prevent="scrollTo('.post_download.mg-b')">
                <span class="twikoo-count">下载资源</span>
              </a>
            </span>
          </div>
        </div>
      </div>
      <Waves />
    </header>
    <!-- 文章内容 -->
    <singlePost :postDetail="postDetail" />
  </div>
  <div v-if="skeleton" class=" z-10000 fixed inset-0 bg-base-100">
    <post-header-skeleton />
    <article-skeleton />
  </div>
</template>

<script setup>
import { onMounted, watch, onServerPrefetch, computed } from 'vue'
import { useStore } from '@/store'
import { usePostPage } from './composables/usePostPage'
import { usePostSeo } from './composables/usePostSeo'
import PostHeaderSkeleton from '../components/single/container/header/PostHeaderSkeleton.vue'
import ArticleSkeleton from '../components/single/container/article/ArticleSkeleton.vue'
import singlePost from '@/components/single/singlePost.vue'
import Waves from '@/components/other/waves.vue'
const props = defineProps({
  postId: String,
})

const propsCopy = {
  ...props,
  postType: 'post',
}

const store = useStore()
const config = computed(() => store.config)

const { postDetail, loaded, getPostDetail, scrollTo, go, skeleton } = usePostPage(propsCopy)
usePostSeo(postDetail, config, props.postId)


const contentWords = computed(() => {
  // 去除 HTML 标签
  const cleanContent = postDetail.value.content.content.replace(/<[^>]*>/g, '');

  // 处理中文字符和英文单词
  const chineseWords = cleanContent.match(/[\u4e00-\u9fa5]/g) || []; // 匹配中文字符
  const englishWords = cleanContent.match(/\b\w+\b/g) || []; // 匹配英文单词

  // 总字数 = 中文字数 + 英文单词数
  return chineseWords.length + englishWords.length;
});

const contentReadTime = computed(() => {
  // 假设阅读速度为：
  // - 中文：每分钟 300 字
  // - 英文：每分钟 200 字
  const chineseWords = postDetail.value.content.content.match(/[\u4e00-\u9fa5]/g) || [];
  const englishWords = postDetail.value.content.content.match(/\b\w+\b/g) || [];

  const chineseTime = chineseWords.length / 300; // 中文阅读时间
  const englishTime = englishWords.length / 200; // 英文阅读时间

  // 总阅读时间（向上取整）
  return Math.ceil(chineseTime + englishTime);
});

onMounted(async () => {
  await getPostDetail()
})

onServerPrefetch(() => getPostDetail())

watch(() => props.postId, async () => {
  loaded.value = false
  await getPostDetail()
})
</script>
