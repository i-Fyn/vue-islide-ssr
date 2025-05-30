import { renderToString } from '@vue/server-renderer'
import { createApp } from './main'
import { createHead } from '@unhead/vue/server'
import { useStore } from './store'
import 'vant/lib/index.css';
import './assets/main.css'

// 创建日志记录器
const logger = {
  error: (message, error) => {
    console.error(`[SSR Error] ${message}:`, error);
  },
  info: (message) => {
    console.log(`[SSR Info] ${message}`);
  }
};

// 安全地获取 cookie 值
const getCookieValue = (cookie, name) => {
  try {
    const match = cookie.match(new RegExp(`${name}=([^;]+)`));
    return match ? match[1] : null;
  } catch (error) {
    logger.error('Cookie 解析错误', error);
    return null;
  }
};

// 安全地获取主题变量
const getThemeVars = async (axios) => {
  try {
    const res = await axios.get('/theme');
    return res.data || '';
  } catch (error) {
    logger.error('获取主题变量失败', error);
    return '';
  }
};

export async function render(_url, context = {}) {
  try {
    const { app, router, pinia } = createApp();
    const store = useStore(pinia);

    // 动态导入 axios
    const { default: axios } = await import('./dist/axios').catch(error => {
      logger.error('Axios 导入失败', error);
      throw new Error('Axios 导入失败');
    });

    // 处理认证
    if (context.req?.headers?.cookie) {
      const token = getCookieValue(context.req.headers.cookie, 'islide_token');
      if (token) {
        store.token = token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        logger.info('Token 已设置'+token);
      }
    }else{
      logger.info('没有cookie');
    }

    // 获取主题变量
    const themeVars = await getThemeVars(axios);

    // 创建 head 实例
    const head = createHead({
      hooks: {
        'ssr:render': (ctx) => {
          logger.info(`正在渲染 ${ctx.tags.length} 个标签`);
          
          // 添加主题样式
          ctx.tags.push({
            tag: 'style',
            props: {
              id: 'theme-style',
              mark: 'ssr'
            },
            innerHTML: themeVars,
          });
        }
      }
    });
    app.use(head);

    // 处理 User-Agent
    const userAgent = context.req?.headers?.['user-agent'];
    if (userAgent) {
      store.userAgent = userAgent;
    }

    // 路由处理
    try {
      router.push(_url);
      await router.isReady();
    } catch (error) {
      logger.error('路由处理失败', error);
      // 如果路由处理失败，使用默认路由
      router.push('/');
      await router.isReady();
    }

    // 渲染应用
    const ctx = {};
    const html = await renderToString(app, ctx).catch(error => {
      logger.error('应用渲染失败', error);
      throw new Error('应用渲染失败');
    });

    return { 
      html, 
      head, 
      pinia,
      error: null // 添加错误状态字段
    };
  } catch (error) {
    logger.error('SSR 渲染过程发生错误', error);
    
    // 返回错误状态，但不抛出异常
    return {
      html: '<div>服务器暂时无法处理请求，请稍后再试</div>',
      head: createHead(),
      pinia,
      error: {
        message: '服务器渲染失败',
        code: 'SSR_ERROR'
      }
    };
  }
}