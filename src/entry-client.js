import { createApp } from './main.js';
import { createHead } from '@unhead/vue/client';
import NPlayer from "@nplayer/vue";
import { decrypt } from '@/dist/crypto.js';
import LazyLoad from 'vanilla-lazyload'
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import VConsole from 'vconsole';

const vConsole = new VConsole();

// 导入GSAP及其插件
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// 注册GSAP插件 - 仅在客户端
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// 将GSAP添加到全局对象，以便在组件中访问
window.$gsap = gsap;
window.$ScrollTrigger = ScrollTrigger;
window.$ScrollToPlugin = ScrollToPlugin;

const { app, pinia, router } = createApp();
const head = createHead();
const lazyLoader = new LazyLoad({
  elements_selector: '.lazyload',
  attempt: 3,
})
app.use(head);
app.use(NPlayer);
app.config.globalProperties.$lazyLoader = lazyLoader;
// 将gsap添加到全局属性中，使组件可以通过this.$gsap访问
app.config.globalProperties.$gsap = gsap;


app.config.errorHandler = (err, instance, info) => {
  if (err.message.includes('Failed to load resource')) {
    const url = new URL(err.filename);
    const retry = () => {
      const newUrl = `${url.href}?retry=${Date.now()}`
      if (url.pathname.endsWith('.js')) {
        return import(/* @vite-ignore */ newUrl)
      } else {
        return new Promise(resolve => {
          const el = document.createElement(url.pathname.endsWith('css') ? 'link' : 'script')
          el.onload = resolve
          el.src = newUrl
          document.head.appendChild(el)
        })
      }
    }
    
    retry().catch(() => {
      window.location.reload(true)
    })
  }
}




Fancybox.bind('[data-fancybox="gallery"]', {
  Hash: false,
});


if (window.__INITIAL_STATE__) {
  try {
    pinia.state.value = decrypt(window.__INITIAL_STATE__);
  } catch (e) {
    console.error(e);
  }
}

router.isReady().then(() => {
  app.mount('#app')
})
