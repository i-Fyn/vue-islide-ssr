import { createSSRApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createRouter } from '@/router'

import 'animate.css';
// 导入动画工具类 - 仅导入创建指令的函数
import { createAnimationDirectives } from '@/utils/animations';

import { Field, CellGroup, Icon, NavBar, Popup, ShareSheet, ActionSheet, Popover, Swipe, SwipeItem, Grid, GridItem, Image as VanImage, List, Lazyload as VanLazyload,SubmitBar,AddressEdit,AddressList,Tabbar, TabbarItem,Empty } from 'vant';
// 2. 引入组件样式
import 'vant/lib/index.css';
import './assets/main.css'
// 导入自定义动画样式
import './assets/animations.css'

// 导入自定义指令
import directives from './dist/directives'

const clickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    setTimeout(() => document.addEventListener('click', el.clickOutsideEvent), 0);
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent);
  }
};

export let pinia = null;
export let router = null;


export function createApp() {
  const app = createSSRApp(App)
  pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  router = createRouter()
  app.use(router)
  app.use(pinia)
  app.directive('click-outside', clickOutside)
  app.use(ActionSheet)
  app.use(ShareSheet)
  app.use(Popup)
  app.use(NavBar)
  app.use(Field)
  app.use(CellGroup)
  app.use(Icon)
  app.use(Popover)
  app.use(Swipe)
  app.use(SwipeItem)
  app.use(Grid)
  app.use(GridItem)
  app.use(VanImage)
  app.use(List)
  app.use(SubmitBar)
  app.use(AddressEdit)
  app.use(AddressList)
  app.use(Tabbar)
  app.use(TabbarItem)
  app.use(Empty)
  app.use(VanLazyload, {
    attempt: 3,
    observer: true,
    observerOptions: {
      rootMargin: '0px',
      threshold: 0
    },
    lazyComponent: true,
    adapter: {
      loaded({ el }) {
        // **确保图片真正加载完成**
        el.onload = () => {
          el.classList.add("loaded");
          // 触发淡入动画
          el.classList.add("animate__animated", "animate__fadeIn");
        };

        // **防止 onload 不触发，确保 fallback**
        if (el.complete) {
          el.classList.add("loaded");
          // 触发淡入动画
          el.classList.add("animate__animated", "animate__fadeIn");
        }
      }
    }
  })

  // 注册全局自定义指令
  Object.keys(directives).forEach(key => {
    app.directive(key, directives[key]);
  });
  
  // 注册动画指令 - 在客户端会进行完整初始化
  if (typeof window !== 'undefined') {
    const animationDirectives = createAnimationDirectives();
    Object.keys(animationDirectives).forEach(key => {
      app.directive(key, animationDirectives[key]);
    });
  }

  return { app, pinia, router }
}
