# vue-islide-ssr

基于Vue 3的服务端渲染(SSR)内容管理系统前端应用，提供现代化、高性能的内容展示体验。

## 项目介绍

vue-islide-ssr是一个完整的内容管理前端解决方案，采用服务端渲染技术，具有卓越的首屏加载速度和SEO友好性。项目支持多种内容类型展示，包括文章、视频、书籍、商品等，并具备用户系统和社交功能。

## 预览

https://theme.laziness.cn/

## 后端

https://github.com/i-Fyn/vue-admin-wordpress

## 特性

- **服务端渲染(SSR)**: 提升首屏加载速度和搜索引擎优化
- **多内容类型支持**: 文章、视频、书籍、电商商品等多样化内容展示
- **响应式设计**: 自适应PC和移动端设备
- **模块化首页**: 可自定义的首页模块组件
- **用户系统**: 支持用户注册、登录、个人中心
- **社交功能**: 评论、消息系统、用户关注等
- **性能优化**: 图片懒加载、代码分割、缓存策略
- **安全防护**: 包含Helmet安全头、速率限制、XSS防护等

## 技术栈

- **前端框架**: Vue 3
- **状态管理**: Pinia
- **路由**: Vue Router
- **SSR实现**: @vue/server-renderer
- **HTTP客户端**: Axios
- **UI组件库**: Vant、Element Plus
- **CSS框架**: TailwindCSS、DaisyUI
- **动画效果**: GSAP、Animate.css
- **工具库**: 
  - VueUse
  - Better-scroll
  - Vanilla-lazyload
  - Fancybox
  - Markdown-it
- **构建工具**: Vite

## 快速开始

### 环境要求

- Node.js 16.x 或更高版本
- npm 或 yarn

### 安装

```bash
# 克隆项目
git clone [项目仓库地址] vue-islide-ssr
cd vue-islide-ssr

# 安装依赖
npm install
```

### 开发环境

```bash
# 启动开发服务器
npm run dev
```

### 生产环境

```bash
# 构建客户端和服务端bundle
npm run build

# 启动生产服务器
npm run serve
```

## 项目结构

```
vue-islide-ssr/
├── dist/             # 构建输出目录
├── public/           # 静态资源
├── server.js         # SSR服务器入口
├── websocket.js      # WebSocket实现
├── src/
│   ├── assets/       # 样式和资源文件
│   ├── components/   # 组件库
│   ├── dist/         # 工具类和辅助函数
│   ├── pages/        # 页面组件
│   ├── router/       # 路由配置
│   ├── store/        # Pinia状态管理
│   ├── utils/        # 通用工具函数
│   ├── App.vue       # 根组件
│   ├── entry-client.js # 客户端入口
│   ├── entry-server.js # 服务端入口
│   └── main.js       # 应用入口
└── vite.config.js    # Vite 配置
```

## 环境变量配置

项目使用环境变量进行配置，请创建以下文件：

- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置
- `.env.test` - 测试环境配置

必须包含的环境变量：

```
VITE_STORAGE_SECRET=your_secret_key
VITE_BASE_URL=api_base_url
```

## 页面路由

- `/` - 首页
- `/post/:postId` - 文章详情页
- `/video/:postId` - 视频详情页
- `/book/:postId` - 书籍详情页
- `/shop/:postId` - 商品详情页
- `/user/:userId` - 用户主页
- `/search` - 搜索结果页
- `/vip` - VIP中心
- `/message` - 消息中心
- ...更多路由详见路由配置文件

## 贡献指南

欢迎提交问题报告和合并请求。对于重大更改，请先打开一个issue讨论您想要更改的内容。

## 支持项目

如果您觉得这个项目对您有帮助，可以通过以下方式支持我们的开发：

![捐赠二维码](https://islide.laziness.cn/wp-content/uploads/2025/05/IMG_5009.jpg)

## 许可证

[MIT](LICENSE)
