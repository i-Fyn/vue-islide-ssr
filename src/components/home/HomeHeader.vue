<script setup>
import { ref, onMounted, onBeforeUnmount, computed, onServerPrefetch, watch } from "vue";

import { debounce } from "@/dist/theme";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import { useIsMobile } from "../../dist/mobile";

const store = useStore();
const { isMobile } = useIsMobile();
const props = defineProps({
  module: {
    type: Object,
    default: () => ({})
  }
});

const router = useRouter();
const showScrollBottom = ref(true);
const module = ref(true);
const moduleText = ref(props.module.xingdu_normal_title);
const themeText = ref(props.module.xingdu_theme_title);
const welcomeText = ref(props.module.xingdu_welcome_title);
const friendModule = ref(false);

// 博主帖子数据
const postData = ref([]);
const myPosts = ref([]);
const friendRss = ref([]);

// 加载状态
const loading = ref(true);

const moduleTextLength = computed(() => moduleText.value.length);
const themeTextLength = computed(() => themeText.value.length);

// 服务端预渲染数据
onServerPrefetch(async () => {
  try {
    await getPosts();
    await getFriendRss();
  } catch (error) {
    console.error('Failed to prefetch posts:', error);
  }
});

const scrollToBottom = () => {
  // 仅在客户端执行
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const homeElement = document.querySelector("#home");
  if (homeElement) {
    window.scrollTo({
      top: homeElement.offsetHeight - 90,
      behavior: "smooth",
    });
  }
};

const scrollListener = debounce(() => {
  // 仅在客户端执行
  if (typeof document === 'undefined') return;

  const scrollPosition = document.documentElement.scrollTop;

  // 显示/隐藏滚动按钮
  if (scrollPosition > 50) {
    showScrollBottom.value = false;
  } else {
    showScrollBottom.value = true;
  }

  // 当滚动到一定距离时自动滚动到底部
  const headerHeight = document.querySelector("#home")?.offsetHeight || 0;
  const autoScrollThreshold = headerHeight * 0.1; // 当滚动到页面高度10%时触发

  if (scrollPosition > autoScrollThreshold && scrollPosition < headerHeight / 2) {
    // 只有在一定范围内触发，避免反复触发
    scrollToBottom();
  }
}, 50);

const getPosts = async () => {
  try {
    loading.value = true;
    const res = await store.fetchApiPostData("posts/simple", {
      size: 6,
    });
    if (res.count > 0) {
      myPosts.value = res.data;
      postData.value = res.data;
    }
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  } finally {
    loading.value = false;
  }
};

const getFriendRss = async () => {
  try {
    const res = await store.fetchFriendRss({
      size: 6,
    });
    if (res.count > 0) {
      friendRss.value = res.data;
    }
  } catch (error) {
    console.error('Failed to fetch friend rss:', error);
  }
};

const initScrollEvent = () => {
  // 仅在客户端执行
  if (typeof window === 'undefined' || isMobile.value) return;
  window.addEventListener("scroll", scrollListener);
};

const initAnimations = () => {
  // 仅在客户端执行
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // 对外层容器应用GSAP动画，但保持太阳居中
  gsap.to(".gsap-container.gsap-image", {
    scrollTrigger: {
      trigger: "#home",
      scrub: true,
      start: "top top",
      end: "bottom",
      ease: "power1.inOut",
    },
    scale: 1.1,
  });

  // 太阳容器的特别处理，保持居中
  gsap.to(".gsap-container.gsap-sun", {
    scrollTrigger: {
      trigger: "#home",
      scrub: true,
      start: "top top",
      end: "bottom",
      ease: "power1.inOut",
    },
    scale: 1.1,
  });
};

const expandSun = () => {
  gsap.to(".gsap-container.gsap-sun", {
    scale: 1.3,
    duration: 1,
    ease: "power1.inOut",
    onComplete: () => {
      gsap.to(".gsap-container.gsap-sun", {
        scale: 1,
        duration: 1,
        ease: "power1.inOut"
      });
    }
  });
}

const handlePostClick = (link) => {
  if (link.includes('http')) {
    window.open(link, '_blank');
    return;
  }
  router.push(link)
}

onMounted(() => {
  getPosts();
  getFriendRss();
  initScrollEvent();
  initAnimations();
});

onBeforeUnmount(() => {
  // 仅在客户端执行
  if (typeof window === 'undefined' || isMobile.value) return;
  window.removeEventListener("scroll", scrollListener);
});


</script>

<template>
  <div id="home"
    class="home-header w-full  relative bg-center bg-cover bg-no-repeat">
    <!-- 图片容器 -->
    <div class="image-wrapper w-full   for-first relative overflow-hidden">
      <!-- 图片区域 - 使用嵌套结构 -->
      <div
        class="gsap-container gsap-image absolute inset-0   w-full  z-0 origin-center will-change-transform pointer-events-auto ">
        <transition tag="div"
          class="for-image flex w-full h-full flex-col items-center justify-center text-center z-10 pointer-events-none"
          enter-active-class="transition-all duration-700 ease-out"
          leave-active-class="transition-all duration-500 ease-in" enter-from-class="opacity-0 scale-110"
          enter-to-class="opacity-100 scale-100" leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-90">
          <van-image v-show="module === false" key="image-bg"
            class="bg-element w-full h-full object-cover  pointer-events-none will-change-transform origin-center "
            fit="cover"
            src="https://api.minio.yyds.pink/moony/files/2025/05/THYUU%20%E6%98%9F%E5%BA%A6%20%E9%99%90%E5%AE%9A%E4%B8%BB%E9%A2%98%E5%B0%81%E9%9D%A2%202505%20%E5%A4%8F%E5%AD%A3.webp">
          </van-image>
        </transition>
      </div>

      <!-- 太阳区域 - 使用嵌套结构 -->
      <div
        class="gsap-container gsap-sun  w-full origin-center will-change-transform pointer-events-auto for-suns">
            <div v-show="module === true" class="sun-area transform-3d pointer-events-none text-accent">
              <div
                class="animate__animated animate__fadeInUp sun bg-[hsl(0deg_0%_98%)] w-[1em] h-[1em] rounded-full transform-3d absolute"
                style="box-shadow: 0 0 1em, .2em -.25em .5em .2em inset;"></div>
              <div class="flow w-[1em] h-[1em] rounded-full transform-3d absolute"><i
                  class="w-[1em] h-[1em] rounded-full transform-3d absolute"></i><i
                  class="w-[1em] h-[1em] rounded-full transform-3d absolute"></i><i
                  class="w-[1em] h-[1em] rounded-full transform-3d absolute"></i></div>
            </div>
      </div>

    
      <div class="for-come">
          <div class="greets text-xs   wrapper pointer-events-none text-accent-content lg:text-accent"  v-show="module === true ">
            <span >你好，</span>{{ welcomeText }}
          </div>
          <div class="thanks" @click="expandSun">
            <h2 v-show="module === false" :style="{ '--count': themeTextLength }"
          class="animate__animated animate__fadeInUp">{{ themeText }}</h2>
        <h2 v-show="module === true" :style="{ '--count': moduleTextLength }"
          class="animate__animated animate__fadeInUp">{{ moduleText }}</h2>
          </div>
      </div>

      <div class="for-news wrapper grid gap-2  !-mt-32 !p-4 "
        style="--avatar-size: 2.75em;">
        <div
          class="toggle-home  lg:order-1 order-0 flex justify-center   text-xs gap-2 select-none relative z-1">
          <label for="toggle-new"
            class="border border-accent/50 toggle-new flex gap-4 leading-2.5 items-center px-2 rounded-full backdrop-blur-md"
            role="button" title="查看">
            <span class="px-2 py-2 rounded-full transition-colors duration-200 cursor-pointer !text-accent"
              :class="{ 'bg-accent/10': postData === myPosts }"
              @click="postData = myPosts">博主新动态</span>
            <span class="px-2 py-2 rounded-full transition-colors duration-200 cursor-pointer !text-accent"
              :class="{ 'bg-accent/10': postData === friendRss }"
              @click="postData = friendRss">查看朋友们</span>
          </label>
          <button @click="module = !module" class="border  border-accent/50 rounded-full season-btn p-2 hover-lift !text-accent">{{
            module ?
              '开启限定' : '回到标准' }}</button>

        </div>


        <!-- 帖子列表 -->
        <ul class="me no-scrollbar grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 w-full transition duration-300"
          style="--avatar-size: 2.75em;">
          <!-- 骨架屏 - 当无数据或加载中时显示 -->
          <template v-if="loading">
            <li v-for="i in 6" :key="'skeleton-' + i"
              class="flex items-start flex-row flex-nowrap gap-3 card !p-3 bg-base-200 transition-all duration-300 overflow-hidden animate-pulse">
              <div class="skeleton h-[var(--avatar-size)] w-[var(--avatar-size)] rounded-lg"></div>
              <div class="flex-1 flex flex-col gap-2">
                <div class="skeleton h-4 w-3/4 rounded"></div>
                <div class="flex flex-row gap-2">
                  <div class="skeleton h-3 w-16 rounded"></div>
                  <div class="skeleton h-3 w-2/3 rounded"></div>
                </div>
              </div>
              <div class="skeleton h-7.5 w-7.5 rounded-full"></div>
            </li>
          </template>

          <!-- 实际内容 -->
          <li v-for="(post, index) in postData" :key="post.id"
            class="flex items-start flex-row flex-nowrap gap-3 card !p-3 transition-all duration-300 overflow-hidden ">
            <van-image lazy-load v-if="post.thumb" :width="44" :height="44" :src="decodeURIComponent(post.thumb)"
              class="attachment-thumbnail size-thumbnail relative flex-none w-[var(--avatar-size)] card overflow-hidden aspect-square transition-all duration-300"
              alt="" data-fancybox="images" :data-caption="post.title">
            </van-image>
            <div v-else
              class="no-thumbnail relative flex-none w-[var(--avatar-size)] card overflow-hidden aspect-square transition-all duration-300">
            </div>

            <article class="flex-1 flex flex-col gap-1 overflow-hidden">
              <h6 class="text-sm relative group">
                <a class="van-ellipsis truncate" @click.prevent="handlePostClick(post.link)"
                  :href="post.link" :title="post.title">{{ post.title
                  }}</a>
              </h6>
              <div class="inline-flex flex-row gap-2 flex-nowrap break-keep text-xs">
                <time class="font-small shrink-0">{{ post.date }}</time>
                <p class="font-small van-ellipsis block">{{ post.desc }}</p>
              </div>
            </article>
            <a @click.prevent="handlePostClick(post.link)" :href="post.link"
              class="read-more ri-eye-line inline-flex items-center justify-center flex-none text-xs text-accent/50 w-7.5 h-7.5 rounded-full outline outline-accent/50 hover-rotate"
              role="button" target="_blank"></a>
          </li>

        </ul>

      </div>
      <nav class=" part-btn text-xs  wrapper lg:!justify-end lg:-translate-y-4 text-accent  !px-4 z-2 relative pointer-events-none">
        <a role="button" class="ri-donut-chart-line outline  outline-accent/50 z-22 shadow-xs lg:shadow-none pointer-events-auto" href="/circle"
              @click.prevent="router.push('/circle')"><span>圈子闲聊</span></a>
            <a role="button" class="ri-archive-line outline  outline-accent/50 z-22 shadow-xs lg:shadow-none pointer-events-auto" href="/category"
              @click.prevent="router.push('/category')"><span>文章归档</span></a>
            <a role="button" class="ri-user-line outline outline-accent/50 z-22 shadow-xs lg:shadow-none pointer-events-auto" href="/links"
              @click.prevent="router.push('/links')"><span>朋友动态</span></a>
          </nav>
        </div>
  </div>
</template>
