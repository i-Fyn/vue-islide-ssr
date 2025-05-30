// src/router/index
import { createRouter as _createRrouter, createMemoryHistory, createWebHistory } from 'vue-router'
import { useStore } from '@/store'
import requestManager from "@/dist/requestManager";
import { useLoginStatus } from '../components/header/composables/useLoginStatus';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/home.vue'),
    meta: {
      keepAlive: true,
      scrollPos: true,
    },
  },
  {
    path: '/post/:postId',
    name: 'article',
    props: true,
    component: () => import('@/pages/post.vue'),
    meta: {
      keepAlive: false,
      articleHeader: true,
      title: '文章详情',
      headerColor: 'text-white'
    }
  },
  {
    path: '/video/:postId',
    name: 'video',
    props: true,
    component: () => import('@/pages/videos.vue'),
    meta: {
      keepAlive: false,
      title: '视频详情',
      nomalHeader: true,
      headerColor: 'text-white'
    }
  },
  {
    path: '/episode/:postId',
    name: 'episode',
    props: true,
    component: () => import('@/pages/episode.vue'),
    meta: {
      keepAlive: false,
      articleHeader: true,
      title: '剧集播放'
    }
  },
  {
    path: '/book/:postId',
    name: 'book',
    props: true,
    component: () => import('@/pages/book.vue'),
    meta: {
      keepAlive: false,
      articleHeader: true,
      title: '书籍详情'
    }
  },
  {
    path: '/book/passage/:postId',
    name: 'passage',
    props: true,
    component: () => import('@/pages/chapter.vue'),
    meta: {
      keepAlive: false,
      hideFooter: true,
      hideHeader: true,
    }
  },
  {
    path: '/shop/:postId',
    name: 'shop',
    props: true,
    component: () => import('@/pages/shop.vue'),
    meta: {
      keepAlive: false,
      title: '商品详情',
      nomalHeader: true,
    }
  },
  {
    path: '/tag',
    name: 'tag',
    props: true,
    component: () => import('@/pages/tag.vue'),
    meta: {
      keepAlive: false,
      title: '标签文章',
      nomalHeader: true,
    },
    children: [
      {
        path: ':tag_id',
        name: 'tags',
        component: () => import('@/pages/tag.vue'),
      }
    ]
  },
  {
    path: '/category',
    name: 'category',
    component: () => import('@/pages/category.vue'),
    meta: {
      keepAlive: false,
      title: '分类文章',
      nomalHeader: true,
    },
    children: [
      {
        path: ':cat_id',
        name: 'categories',
        component: () => import('@/pages/category.vue'),
      }
    ]
  },
  {
    path: '/vip',
    name: 'vip',
    component: () => import('@/pages/vip.vue'),
    meta: {
      keepAlive: false,
      nomalHeader: true,
      hideFooter: true,
      title: 'VIP中心',
    }
  }, {
    path: '/verify',
    name: 'verify',
    component: () => import('@/pages/verify.vue'),
    meta: {
      keepAlive: false,
      nomalHeader: true,
      hideFooter: true,
      title: '认证中心',
    }
  }, {
    path: '/links',
    name: 'links',
    component: () => import('@/pages/links.vue'),
    meta: {
      keepAlive: false,
      title: '友情链接',
      nomalHeader: true,
    },
  }, {
    path: '/link-register',
    name: 'link-register',
    component: () => import('@/pages/link-register.vue'),
    meta: {
      keepAlive: false,
      title: '申请友链',
      nomalHeader: true,
      hideFooter: true,
    }
  }, {
    path: '/message',
    name: 'message',
    component: () => import('@/pages/message.vue'),
    meta: {
      keepAlive: true,
      login: true,
      title: '消息中心',
      nomalHeader: true,
      hideFooter: true,
    }
  }, {
    path: '/user/:user_id',
    name: 'user',
    props: true,
    component: () => import('@/pages/user.vue'),
    children: [
      {
        path: ':page',
        name: 'user_page',
        component: () => import('@/pages/user.vue'),
        props: true,

      }
    ],
    meta: {
      keepAlive: true,
      nomalHeader: true,
      title: '用户中心',
      headerColor: 'text-white'
    }
  }, {
    path: '/search',
    name: 'search',
    component: () => import('@/pages/search.vue'),
    meta: {
      keepAlive: false,
      title: '搜索结果',
      nomalHeader: true,
      hideFooter: true,
    }
  },
  {
    path: '/forgot',
    name: 'forgot',
    component: () => import('@/pages/forgot.vue'),
    meta: {
      keepAlive: false,
      title: '忘记密码',
      nomalHeader: true,
    }
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('@/pages/account.vue'),
    meta: {
      keepAlive: false,
      login: true,
      hideFooter: true,
      hideHeader: true,
      hideMobileTabbar: true,
    },
    children: [
      {
        path: ':page',
        name: 'account_page',
        component: () => import('@/pages/account.vue'),
        props: true,
        meta: {
          login: true,
          hideFooter: true,
          hideHeader: true,
        }
      }
    ]
  },
  {
    path: '/write',
    name: 'write',
    component: () => import('@/pages/write.vue'),
    meta: {
      keepAlive: false,
      login: true,
      transition: 'fade-special',
      title: '编辑文章',
      nomalHeader: true,
      hideFooter: true,
      hideMobileTabbar: true,
    }
  }, {
    path: '/circle',
    name: 'circleHome',
    component: () => import('@/pages/circle.vue'),
    meta: {
      keepAlive: true,
      nomalHeader: true,
      title: '圈子首页',
    }
  },
  {
    path: '/circle/:circle_id',
    name: 'circles',
    props: true,
    component: () => import('@/pages/circles.vue'),
    meta: {
      keepAlive: true,
      title: '圈子',
      leftRouter: '/circle',
      nomalHeader: true,
    }
  }, {
    path: '/moments',
    name: 'moments',
    component: () => import('@/components/circle/CircleEditor.vue'),
    meta: {
      keepAlive: false,
      login: true,
      source: [
        { 'type': 'css', 'src': 'assets/circle-editor.css' },
      ],
      transition: 'fade-special',
      title: '编辑动态',
      nomalHeader: true,
      hideFooter: true,
      hideMobileTabbar: true,
    }
  }, {
    path: '/moment/:postId',
    name: 'moment',
    props: true,
    component: () => import('@/components/circle/moment/Moment.vue'),
    meta: {
      keepAlive: false,
      articleHeader: true,
      title: '帖子详情'
    }
  }, {
    path: '/topic/:topic_id',
    name: 'topics',
    props: true,
    component: () => import('@/pages/topic.vue'),
    meta: {
      keepAlive: true,
      nomalHeader: true,
      title: '话题'
    }
  }, {
    path: '/download',
    name: 'download',
    component: () => import('@/pages/download.vue'),
    meta: {
      keepAlive: false,
      login: true,
      title: '下载中心',
      nomalHeader: true,
    }
  }, {
    path: '/address/edit',
    name: 'address-edit',
    component: () => import('@/pages/addressEdit.vue'),
    meta: {
      keepAlive: false,
      login: true,
      title: '地址编辑',
      nomalHeader: true,
    }
  }, {
    path: '/address/list',
    name: 'address-list',
    component: () => import('@/pages/addressList.vue'),
    meta: {
      keepAlive: false,
      login: true,
      title: '地址列表',
      nomalHeader: true,
    }
  }, {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/404.vue'),
    meta: {
      keepAlive: false,
      title: '404',
      nomalHeader: true,
    }
  }, {
    path: '/test',
    name: 'test',
    component: () => import('@/pages/page.vue'),
    meta: {
      keepAlive: false,
      title: '测试页面',
      nomalHeader: true,
    }
  }
]


export function createRouter() {
  const router = _createRrouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (typeof window === 'undefined') return { top: 0, left: 0 }; // SSR检查
      
      return new Promise((resolve) => {
        // 使用requestAnimationFrame而不是setTimeout，提高性能和平滑度
        requestAnimationFrame(() => {
          // 滚动优化策略
          if (savedPosition) {
            // 如果有保存的位置(例如浏览器后退)，使用该位置
            window.scrollTo({
              left: savedPosition.left || 0,
              top: savedPosition.top || 0,
              behavior: 'instant' // 改为smooth提供更好的用户体验
            });
            resolve(false); // 阻止router的默认滚动行为
          } else if (to.hash) {
            // 锚点滚动处理
            const element = document.querySelector(to.hash);
            if (element) {
              // 计算顶部偏移，考虑固定的header
              const headerOffset = document.querySelector('.site-header')?.offsetHeight || 0;
              const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
              const offsetPosition = elementPosition - headerOffset - 20; // 额外20px空间
              
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
              resolve(false);
            } else {
              // 如果找不到元素，回退到页面顶部
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
              resolve(false);
            }
          } else if (from.path !== to.path) {
            // 只在路径改变时滚动到顶部，避免查询参数变化导致的不必要滚动
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'instant'
            });
            resolve(false);
          } else {
            // 保持当前位置
            resolve(false);
          }
        });
      });
    }
  })

  // 全局前置守卫
  router.beforeEach(async (to, from, next) => {
    try {
      // 取消所有未完成的请求
      requestManager.cancelAllRequests()
      

      // 检查登录状态
      const store = useStore();
      if (to.meta.login && store.token === '' && typeof window !== 'undefined') {
        const { checkIsLogin } = useLoginStatus();
        checkIsLogin();
        return next(false);
      }



      next();
    } catch (error) {
      console.error('Router navigation error:', error);
      next({ name: 'NotFound' });
    }
  })

  // 全局后置守卫
  router.afterEach((to, from) => {
    if (typeof window === 'undefined') return;

    try {

      // 更新页面标题
      if (to.meta.title) {
        document.title = to.meta.title;
      }

      // 更新 body 类名
      const oldClassName = document.body.className
        .split(' ')
        .find((cls) => cls.startsWith('route-'));

      if (oldClassName) {
        document.body.classList.remove(oldClassName);
      }

      if (to.name) {
        document.body.classList.add(`route-${to.name}`);
      }


    } catch (error) {
      console.error('Router afterEach error:', error);
    }
  })

  // 全局错误处理
  router.onError((error) => {
    console.error('Router error:', error);
    router.push({ name: 'NotFound' });
  })

  return router
}
