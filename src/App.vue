<template>
  <div class="bg-base-200"  v-if="data">
    <Header v-if="!route.meta.hideHeader" />
    <van-nav-bar  v-if="isMobile && $route.meta.nomalHeader" :title="$route.meta.title" class="lg:hide" left-arrow
      @click-left="handleBack" fixed
      style="--van-nav-bar-height: var(--top-menu-height);--van-tabbar-background: var(-color-base-100);"
      z-index="1001" />
    <articleHeader v-if="isMobile && $route.meta.articleHeader" :title="$route.meta.title" class="lg:hide" />
    <div id="content" class="site-content w-full min-h-screen relative bg-base-200">
      <router-view v-slot="{ Component, route }">
        <keep-alive>
          <component :is="Component" v-if="route.meta.keepAlive" :key="route.fullPath" />
        </keep-alive>
        <component :is="Component" v-if="!route.meta.keepAlive" :key="route.fullPath" />
      </router-view>
    </div>
    <Footer v-if="!route.meta.hideFooter && $route.name === 'Home'" />
    <mobileTabbar v-if="isMobile && !$route.meta.articleHeader && !$route.meta.hideMobileTabbar" />
    
    <!-- 滚动进度条 -->
    <!-- <ScrollProgress v-if="!route.meta.hideScrollProgress" position="top" :height="3" /> -->
    
    <!-- 回到顶部按钮 -->
    <!-- <ScrollToTop v-if="!route.meta.hideScrollToTop" /> -->
  </div>
  <div class="bg-base-200" v-else>
  </div>
</template>


<script setup>
import { onMounted, ref, onServerPrefetch, computed, watch, onErrorCaptured } from 'vue';
import { useStore } from '@/store';
import { useRoute, useRouter } from 'vue-router';
import Footer from '@/components/footer/Footer.vue';
import Header from '@/components/header/Header.vue';
import { useSeoMeta, useHead } from '@unhead/vue';
import { islideSetCookie } from '@/dist/theme';
import { useIsMobile } from './dist/mobile';
import articleHeader from './components/header/articleHeader.vue';
import mobileTabbar from './components/footer/mobileTabbar.vue';
import { updateThemeColor, getRootColor } from '@/dist/theme'
import { showToast } from 'vant';


const route = useRoute();
const router = useRouter();
const store = useStore();
const data = ref(null);
const config = ref({});
const { isMobile } = useIsMobile();
const error = ref(null);


// 错误处理
onErrorCaptured((err, instance, info) => {
  console.error('组件错误:', err, info);
  error.value = err;
  showToast('页面加载出错，请刷新重试');
  return false; // 阻止错误继续传播
});

// 获取配置信息
const getConfig = async () => {
  try {
    const res = await store.fetchConfig();
    if (!res) {
      throw new Error('配置获取失败');
    }
    config.value = res;
    return true;
  } catch (error) {
    console.error('配置获取失败:', error);
    showToast('配置加载失败，请刷新重试');
    return false;
  }
};

// SEO 配置
useSeoMeta({
  author: computed(() => config.value?.blog_name || ''),
  keywords: computed(() => config.value?.home_keywords || ''),
  "apple-mobile-web-app-title": computed(() => config.value?.blog_name || ''),
  copyright: computed(() => config.value?.blog_name || ''),
  ogLocale: 'zh_CN',
  robots: 'index, follow',
  geoRegion: 'CN',
  ogSiteName: computed(() => config.value?.blog_name || ''),
});

// 头部配置
useHead({
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover, user-scalable=no'
    }, {
      name: 'apple-mobile-web-app-capable',
      content: 'yes'
    }, {
      name: 'theme-color',
      content: computed(() => getRootColor('--color-base-100') || '#ffffff')
    }
  ]
})

// 返回处理
const handleBack = () => {
  try {
    if (window.history.length > 1) {
      router.go(-1);
    } else {
      router.push('/');
    }
  } catch (error) {
    console.error('返回操作失败:', error);
    router.push('/');
  }
};

onMounted(async () => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  if (!baseURL || baseURL === '/' || (baseURL && baseURL.includes('example.com'))) {
    return;
  }
  try {
    await store.fetchUserInfo();
    data.value = await getConfig();
  } catch (error) {
  }

  if (route.query.ref) {
    store.ref = route.query.ref;
    islideSetCookie('ref', route.query.ref, 0);
  }
  document.documentElement.setAttribute('data-theme', store.theme)
  
  // 全局页面滚动动画初始化
  initScrollAnimations();
});

// 初始化滚动动画
const initScrollAnimations = () => {
  if (typeof window === 'undefined') return;
  
  // 使用全局gsap而不是导入
  const gsap = window.$gsap || window.gsap;
  if (!gsap) return;
  
  // 为重要元素添加动画
  const animateItems = document.querySelectorAll('.home-item');
  animateItems.forEach((item, index) => {
    gsap.set(item, { opacity: 0, y: 30 });
    
    gsap.to(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 90%",
        once: true
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: index * 0.1
    });
  });
};

const changeThemeColor = () => {
  const bgColor = getRootColor('--color-base-100')
  console.log(bgColor)
  updateThemeColor(bgColor)
}

watch(() => store.theme, (newVal, oldVal) => {
  console.log(newVal, oldVal)
  if (newVal) {
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.setAttribute('data-theme', newVal)
    changeThemeColor()
  }
})

onServerPrefetch(async () => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  if (!baseURL || baseURL === '/' || (baseURL && baseURL.includes('example.com'))) {
    return;
  }
  try {
    await store.fetchUserInfo();
    data.value = await getConfig();
  } catch (error) {
  }
});

</script>

<style>
/* 页面转场动画的CSS补充 */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

</style>