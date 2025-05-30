<template>
  <header class="header fixed top-0 left-0 right-0 text-base-content z-1000 h-[var(--top-menu-height)] pt-[env(safe-area-inset-top)]"
  :class="['', headerState.headerClass,headerState.scrollTop < 50 ?  (route.meta.headerColor ? route.meta.headerColor : 'text-base-content') : 'text-base-content']"
    :style="{
      background: headerState.scrollTop < 50 ? 'transparent' : 'var(--color-base-100)',
    }"
  >
    <div
      class="header-top  h-full w-full max-w-640" >
      <div class=" px-4 lg:p-0  h-full">
        <div class="header-top-wrap wrapper flex items-center justify-between h-full">
          <div class="left-entry relative gap-10 z-2">
            <div class="header-logo max-h-[calc(var(--top-menu-height)-10px)] flex-shrink-0 relative">
              <h1 v-if="config['img_logo'] !== ''" class="flex items-center">
                <a rel="home" title="首页" class="logo" @click.prevent="go('/')" href="/">
                  <van-image lazy-load itemprop="logo" v-if="config['img_logo']" :src="config['img_logo']" alt="logo" />
                </a>
              </h1>
              <h1 v-else class="flex items-center">
                <a rel="home" href="/" class="logo group relative" title="首页" @click.prevent="go('/')">
                  <p
                    class="site-title text-[23px] tracking-[3px] font-semibold leading-none p-[3px] transition-all duration-300 group-hover:opacity-0">
                    {{ config['text_logo'] }}</p>
                  <i
                    class="ri-home-2-fill absolute flex items-center justify-center w-full h-full top-0 text-lg opacity-0 rounded-[40px] text-white transition-all duration-300 group-hover:opacity-100 bg-primary "></i>
                </a>
              </h1>
            </div>
          </div>

          <div class="center-entry  w-full justify-center absolute  left-0 z-1 hidden md:flex">
            <div :class="{ 'menu-hidden': !showCenterMenu }" id="top-menu" class="transition-all duration-300  flex ">
              <div class="menus_item p-[0_.4rem] flex flex-col items-center m-auto relative group"
                v-for="(menu, index) in topMenus" :key="index">
                <a :href="menu.url" :title="menu.title" @click.prevent="go(menu.url)"
                  class="p-[.7rem] h-[35px] leading-[35px] rounded-[40px] font-medium flex items-center relative tracking-[.3rem] text-[.78em] transition-all duration-300 hover:bg-primary hover:text-white  z-2">
                  <span v-html="menu.title"></span>
                </a>
                <ul
                  class="menus_item_child z-3   p-[6px_3.5px] rounded-[100px] bg-base-200 shadow-[0_0_12px_4px_rgba(0,0,0,.05)] border border-[#e3e8f7] transition  duration-300 ease-in-out  backdrop-blur-[20px] top-8 absolute  mt-2 whitespace-nowrap opacity-0 translate-y-[-10px] scale-80  group-hover:border-primary group-hover:shadow-[0_8px_12px_-3px_#4259ef23] group-hover:opacity-100  group-hover:translate-y-3 group-hover:scale-100  text-base-content"
                  v-if="menu.children.length">
                  <li v-for="(subMenu, subIndex) in menu.children" :key="subIndex"
                    class="inline-flex list-none  m-[4px_6px]  transition-all duration-300 ">
                    <a class="site-page child tracking-normal flex items-center rounded-[100px] p-[.3rem_.8rem] w-full text-[var(--heo-fontcolor)] transition-all duration-300 hover:bg-primary hover:text-white "
                      :href="subMenu.url" :title="subMenu.title" @click.prevent="go(subMenu.url)"
                      v-html="subMenu.title"></a>
                  </li>
                </ul>
              </div>
            </div>
            <div :class="{ 'show': !showCenterMenu }" id="top-title"
              class="fixed justify-center text-center opacity-0 top-auto translate-y-[70px] pointer-events-none transition-all duration-300">
              <a class="dispaly_title" href="/" @click.prevent="go('/')" title="网站名称">{{ centerTitle }}</a>
            </div>
          </div>

          <div class="right-entry gap-1 z-2 flex items-center relative">
            <div class="menu-search relative" v-if="config['top_menu_search_show'] == '1'">
              <a @click="showSearch" id="mobile-search-button" class="search-icon">
                <i
                  class="ri-search-line text-xl cursor-pointer p-2 rounded-full transition-all duration-300 hover:bg-primary hover:text-white hover:-translate-y-[1px]"></i>
              </a>
            </div>
            <a href="/message" title="消息中心" @click.prevent="go('/message')"
              v-if="config['top_menu_message_show'] == '1' && isLogin" class="menu-message relative">
              <i
                class="ri-message-3-line text-xl cursor-pointer p-2 rounded-full transition-all duration-300 hover:bg-primary hover:text-white hover:-translate-y-[1px]"></i>
            </a>
            <div class="menu-check-in hidden lg:block  relative group"
              v-if="config['top_menu_check_in_show'] == '1' && isLogin">
              <div class="check-in-btn">{{ isCheckIn ? '已签到' : '签到' }} </div>
              <div
                class="check-in-menu-wrap  text-base-content min-w-[300px] rounded-lg shadow-[4px_4px_24px_0_rgba(96,101,108,.12)] overflow-hidden bg-base-100 invisible  absolute  z-99 opacity-0 -translate-y-2 transition  duration-300 ease-in-out -right-2.5 group-hover:visible group-hover:opacity-100 group-hover:translate-y-3 ">
                <CalenderCheckIn :is-check-in="isCheckIn" :consecutive-days="consecutiveDays"
                  @checkin-success="checkin" />
              </div>
            </div>
            <div class="menu-publish-box hidden lg:block relative group "
              v-if="config['top_menu_publish_show'] == '1' && isLogin">
              <div class="menu-publish-btn bg-primary">发布</div>
              <div
                class="publish-menu-wrap  text-base-content min-w-38 rounded-lg shadow-[4px_4px_24px_0_rgba(96,101,108,.12)] overflow-hidden bg-base-100 invisible  absolute  z-99 opacity-0 -translate-y-2 transition  duration-300 ease-in-out -right-2.5 group-hover:visible group-hover:opacity-100 group-hover:translate-y-3 ">
                <div class="publish-menu-container w-full shadow-[4px_4px_24px_0_rgba(96,101,108,.12)]">
                  <div class="publish-list p-3">
                    <a @click.prevent="go(value['link'])" v-for="(value, index) in config['top_menu_publish_links']"
                      :title="value['title']" :key="index" :href="value['link']"
                      class="publish-item  px-1.5 h-0 min-h-14 rounded-lg  text-sm whitespace-nowrap transition-[background-color_.3s] flex flex-row items-center hover:bg-primary-content"
                      rel="nofollow">
                      <div class="img-icon h-[37px] w-[37px] p-1 flex-shrink-0">
                        <van-image lazy-load :src="value['icon']" :alt="value['title']" />
                      </div>
                      <div class="link-title">
                        <p class="type-text">{{ value['title'] }}</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <LoginPanel  />
            <div v-show="scrollProgress > 0" class="progress-container" :class="{'active': scrollProgress > 0}">
              <div class="scroll-progress">
                <div class="rounded-full flex items-center justify-center bg-primary text-white shadow-lg h-6 w-6">
                  <span class="progress-number">{{ Number(scrollProgress.toFixed(0)) }}</span>
                </div>
              </div>
            </div>
            <i id="mobile-menu"
              class="ri-menu-line lg:hidden text-xl cursor-pointer p-2 rounded-full transition-all duration-300 hover:bg-primary hover:text-white hover:-translate-y-[1px]"
              @click="showMenu"></i>
            
            <!-- 主题选择器按钮 -->
            <div class="theme-selector">
              <button @click="showThemeSelector" class="theme-btn flex items-center justify-center p-2 rounded-full transition-all duration-300 hover:bg-primary hover:!text-white hover:-translate-y-[1px] btn-square btn btn-sm btn-ghost">
                <i :class="[currentThemeIcon, 'text-xl']"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>


<script setup>
import { ref, onMounted, computed, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoginPanel from '@/components/login/LoginPanel.vue'
import CalenderCheckIn from './CalenderCheckIn.vue'
import { useStore } from '@/store'
import { useMenus } from './composables/useMenus'
import { useCheckIn } from './composables/useCheckIn'
import { useNoticeModal } from './composables/useNoticeModal'
import { useLoginStatus } from './composables/useLoginStatus'
import { createVanModal } from '@/dist/createVanModal'
import { createMessage as message } from '@/dist/message'
import { useScrollFixed } from './composables/usrScrollFixed'
import { useScrollProgress } from '@/dist/scrollUtils';
import { useIsMobile } from '@/dist/mobile';

const store = useStore()
const router = useRouter()
const route = useRoute()
const { isMobile } = useIsMobile();
const showCenterMenu = ref(true)
const config = store.config;

// 获取当前主题图标
const currentThemeIcon = computed(() => {
  const theme = store.theme;
  if (['dark', 'black', 'dracula', 'halloween', 'night', 'dim', 'nord', 'abyss'].includes(theme)) {
    return 'ri-moon-line'; // 夜间主题
  } else if (['valentine', 'autumn', 'sunset', 'caramellatte'].includes(theme)) {
    return 'ri-heart-line'; // 温暖主题
  } else if (['cyberpunk', 'synthwave', 'retro'].includes(theme)) {
    return 'ri-flashlight-line'; // 科技主题
  } else {
    return 'ri-sun-line'; // 默认日间主题
  }
});

// 显示主题选择器
const showThemeSelector = () => {
  import('./ThemeSelector.vue').then(module => {
    createVanModal(module.default, {
      position: 'center',
      radius: isMobile.value ? false : true,
      size: isMobile.value ? '100%' : '80%',
      height: isMobile.value ? '100%' : 'auto',
    });
  });
};

const { centerTitle, topMenus, fetchMenus } = useMenus()
const { isLogin } = useLoginStatus()
const { isCheckIn, consecutiveDays, checkin } = useCheckIn()
const { getNewNoticeList } = useNoticeModal()
const { headerState } = useScrollFixed()
const { scrollProgress } = useScrollProgress();

const go = (path) => {
  if (path === '/message' && !localStorage.getItem('token')) {
    return message({ message: '请先登录', type: 'error' })
  }
  router.push(path)
}

const showSearch = () => {
  import('@/components/header/SearchDialog.vue').then(module => {
    createVanModal(module.default, {
      height: '100%',
      size: isMobile.value ? '100%' : '50%',
      radius: false,
      position: isMobile.value ? 'center' : 'right',
    })
  })
}

const showMenu = () => {
  import('@/components/header/SideMenu.vue').then(module => {
    createVanModal(module.default, {
      position: 'right',
      radius: false,
      size: '75%',
      height: '100%'
    })
  })
}

onMounted(() => {
  // scrollAction()
  fetchMenus()
  store.fetchUserInfo()
  getNewNoticeList()
})
</script>


<style lang="scss" scoped>
.header{
  transition: all .5s, inset 0s;
}
.hide-header {
  animation-name: hideHeader;
  animation-duration: 0.8s;
  animation-fill-mode: forwards;
}

.fixed-header {
  animation-name: header;
  animation-duration: 0.8s;
  animation-fill-mode: forwards;
}

@keyframes header {
  0% {
    transform: translateY(calc(-1 * var(--top-menu-height)));
  }

  100% {
    transform: translateY(0px);
  }
}

@keyframes hideHeader {
  0% {
    transform: translateY(0px);
  }

  100% {
    transform: translateY(calc(-1 * var(--top-menu-height)));
  }
}


.right-entry > * {
  position: relative;
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-container {
  width: 0;
  margin: 0;
  opacity: 0;
  transform: scale(0.7);
  transition: all 0.4s ease;
}

.progress-container.active {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  opacity: 1;
  transform: scale(1);
}

.scroll-progress {
  display: flex;
}

.progress-number {
  font-size: 0.75rem;
  font-weight: 600;
}
</style>
