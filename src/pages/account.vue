<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <aside class="admin-sidebar" :class="{'collapsed': sidebarCollapsed, 'mobile-open': mobileSidebarOpen}">
      <!-- Logo区域 -->
      <div class="sidebar-header h-18">
        <div class="logo-area">
          <div class="logo-icon">
            <i class="ri-dashboard-3-line"></i>
          </div>
          <span v-show="showMenuText" class="logo-text">管理中心</span>
        </div>
        <button class="sidebar-toggle" @click="toggleSidebar">
          <i :class="sidebarCollapsed ? 'ri-menu-unfold-line' : 'ri-menu-fold-line'"></i>
        </button>
      </div>
      
      
      <!-- 菜单区域 -->
      <nav class="admin-menu">
        <div class="menu-section">
          <div class="menu-title" v-show="showMenuText">
            <span>常用功能</span>
          </div>
          <ul class="menu-list">
            <li>
              <a @click="page = 'center';toggleMobileSidebar()" :class="{'active': page === 'center'}">
                <div class="menu-icon">
                  <i class="ri-dashboard-line"></i>
                </div>
                <span v-show="showMenuText">控制台</span>
                <span class="menu-indicator" v-if="page === 'center'"></span>
              </a>
            </li>
            
            <li v-for="(value, index) in quicks" :key="'quick-'+index">
              <a @click="page = value.link;toggleMobileSidebar()" :class="{'active': page === value.link}">
                <div class="menu-icon">
                  <i :class="[value.icon]"></i>
                </div>
                <span v-show="showMenuText">{{ value.name }}</span>
                <span class="menu-indicator" v-if="page === value.link"></span>
              </a>
            </li>
          </ul>
        </div>
        
        <div class="menu-section">
          <div class="menu-title" v-show="showMenuText">
            <span>系统功能</span>
          </div>
          <ul class="menu-list">
            <li v-for="(value, index) in systemLink" :key="'link-'+index">
              <a :href="value.link" @click.prevent="page = value.link;toggleMobileSidebar()" :class="{'active': page === value.link}">
                <div class="menu-icon">
                  <i :class="[value.icon]"></i>
                </div>
                <span v-show="showMenuText">{{ value.title }}</span>
                <span class="menu-indicator" v-if="page === value.link"></span>
              </a>
            </li>
          </ul>
        </div>

        <div class="menu-section">
          <div class="menu-title" v-show="showMenuText">
            <span>发布功能</span>
          </div>
          <ul class="menu-list">
            <li v-for="(value, index) in publishLink" :key="'link-'+index">
              <a :href="value.link" @click.prevent="page = value.link;toggleMobileSidebar()" :class="{'active': page === value.link}">
                <div class="menu-icon">
                  <i :class="[value.icon]"></i>
                </div>
                <span v-show="showMenuText">{{ value.title }}</span>
                <span class="menu-indicator" v-if="page === value.link"></span>
              </a>
            </li>
          </ul>
        </div>
        
        <div class="menu-section" v-if="userData && userData.admin">
          <div class="menu-title" v-show="showMenuText">
            <span>管理功能</span>
          </div>
          <ul class="menu-list">
            <li v-for="(value, index) in adminLink" :key="'admin-'+index">
              <a @click="page = value.link;toggleMobileSidebar()" :class="{'active': value.link === page}">
                <div class="menu-icon">
                  <i :class="[value.icon]"></i>
                </div>
                <span v-show="showMenuText">{{ value.title }}</span>
                <span class="menu-indicator" v-if="value.link === page"></span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
      
      <!-- 侧边栏底部 -->
      <div class="sidebar-footer">
        <div class="sidebar-action" @click="go('/')" title="退出登录">
          <i class="ri-logout-box-r-line"></i>
          <span v-show="showMenuText">退出系统</span>
        </div>
      </div>
    </aside>
    
    <!-- 遮罩层 -->
    <div class="sidebar-overlay" v-if="mobileSidebarOpen" @click="toggleMobileSidebar"></div>
    
    <!-- 主内容区域 -->
    <div class="admin-main">
      <!-- 顶部栏 -->
      <header class="admin-header h-18">
        <div class="header-left">
          <button class="mobile-menu-btn" @click="toggleMobileSidebar">
            <i class="ri-menu-line"></i>
          </button>
          <div class="breadcrumb">
            <a href="/" @click.prevent="go('/')">首页</a> / 
            <a  href="/account" @click.prevent="go('/account')">管理中心</a> / 
            <span>{{ getPageName(page) }}</span>
          </div>
        </div>

        <div class="header-right">
          <div class="asset-info hidden lg:flex">
            <div class="asset-item">
              <i class="ri-money-cny-circle-line"></i> {{ money }}
            </div>
            <div class="asset-item">
              <i class="ri-coins-line"></i> {{ credit }}
            </div>
          </div>
          
          <div class="user-dropdown">
            <div class="user-dropdown-trigger">
              <avatarVue :data="userData" style="--avatar-size:30px" v-if="userData" />
            </div>
            <ul class="user-dropdown-menu">
              <li><a @click="page = 'center'"><i class="ri-user-line"></i> 个人资料</a></li>
              <li><a @click="page = 'settings'"><i class="ri-settings-line"></i> 账户设置</a></li>
              <li><a @click="page = 'secure'"><i class="ri-shield-keyhole-line"></i> 安全设置</a></li>
              <li class="divider"></li>
              <li><a @click="go('/')"><i class="ri-logout-box-r-line"></i> 退出登录</a></li>
            </ul>
          </div>
        </div>
      </header>
      
      <!-- 页面内容 -->
      <div class="admin-content p-4">

        <!-- 资产卡片 -->
        <div class="asset-cards" v-if="page === 'center'">
          <div class="asset-grid">
            <!-- 余额卡片 -->
            <div class="asset-panel">
              <div class="panel-header">
                <i class="ri-wallet-3-line"></i>
                <span>余额</span>
              </div>
              <div class="panel-body">
                <div class="amount">{{ money }}</div>
              </div>
              <div class="panel-footer">
                <button class="action-btn">充值</button>
              </div>
            </div>

            <!-- 积分卡片 -->
            <div class="asset-panel">
              <div class="panel-header">
                <i class="ri-coins-line"></i>
                <span>积分</span>
              </div>
              <div class="panel-body">
                <div class="amount">{{ credit }}</div>
              </div>
              <div class="panel-footer">
                <button class="action-btn">兑换</button>
              </div>
            </div>

            <!-- 推广返佣卡片 -->
            <div class="asset-panel" v-if="userData && userData.commission">
              <div class="panel-header">
                <i class="ri-hand-coin-line"></i>
                <span>推广返佣</span>
              </div>
              <div class="panel-body">
                <div class="amount">{{ userData.commission.money || 0 }}</div>
                <div class="sub-info text-base-content/70">
                  累计: {{ userData.commission.data.total || 0 }} | 已提现: {{ userData.commission.withdraw || 0 }}
                </div>
              </div>
              <div class="panel-footer">
                <button class="action-btn" @click="page = 'distribution'">查看</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 组件内容 -->
        <div class="component-container">
          <KeepAlive>
  <component :is="componentMap[page] || componentMap['center']" v-bind="getPropsForPage(page)" />
</KeepAlive>
        </div>
      </div>

      <!-- 页脚 -->
      <footer class="admin-footer z-2000 h-18 pb-[env(safe-area-inset-bottom)] hidden lg:block">
        <span class="flex items-center justify-center h-full">Copyright © {{ new Date().getFullYear() }} - 版权所有</span>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineAsyncComponent, onServerPrefetch, watch } from 'vue'
import { useStore } from '@/store'
import { useRouter, useRoute } from 'vue-router'
import avatarVue from '../components/user/avatarVue.vue';
import nameVue from '../components/user/nameVue.vue';
import { useIsMobile } from '@/dist/mobile';
import { isObject } from '@vueuse/core';

const props = defineProps({
    page: {
        type: String,
        default: 'center'
    }
})

const {isMobile} = useIsMobile();
const page = ref(props.page); 
const store = useStore();
const config = computed(() => store.config);
const userId = ref(null);
const userData = ref(null);
const links = ref(config.value['top_menu_user_links']);
const credit = ref(0);
const money = ref(0);
const vipInfo = ref(null);
const router = useRouter();
const route = useRoute();
const sidebarCollapsed = ref(false);
const mobileSidebarOpen = ref(false);
const showMenuText = ref(!sidebarCollapsed.value);

// 快捷菜单项
const quicks = [
    { 'name': '我的等级', 'link': 'growth', 'icon': 'ri-pulse-line' },
    { 'name': '投稿管理', 'link': 'post', 'icon': 'ri-draft-line' },
    { 'name': '我的订单', 'link': 'order', 'icon': 'ri-file-list-3-line' },
    { 'name': '任务中心', 'link': 'task', 'icon': 'ri-task-line' },
]

const publishLink = ref([
  { 'title': '发布文章', 'link': 'write', 'icon': 'ri-draft-line' },
  { 'title': '发布帖子', 'link': 'moments', 'icon': 'ri-draft-line' },
])

// 管理员链接
const adminLink = ref([
    { 'title': '认证管理', 'link': 'verify', 'icon': 'ri-shield-user-line' },
    { 'title': '卡密管理', 'link': 'card', 'icon': 'ri-bank-card-line' },
    { 'title': '举报管理', 'link': 'report', 'icon': 'ri-alarm-warning-line' },
    { 'title': '链接管理', 'link': 'link', 'icon': 'ri-linkedin-box-line' },
    { 'title': '消息管理', 'link': 'message', 'icon': 'ri-messenger-line' },
    { 'title': '订单管理', 'link': 'orders', 'icon': 'ri-file-list-2-line' },
    { 'title': '提现管理', 'link': 'withdraw', 'icon': 'ri-money-cny-circle-line' },
    { 'title': '后台管理', 'link': 'admin', 'icon': 'ri-settings-line' },
]);

const systemLink = ref([
  { 'title': '账号安全', 'link': 'secure', 'icon': 'ri-shield-keyhole-line' },
  { 'title': '账户设置', 'link': 'settings', 'icon': 'ri-settings-line' },
])

// 获取页面名称
const getPageName = (page) => {
    switch (page) {
        case 'center': return '个人中心';
        case 'task': return '任务中心';
        case 'growth': return '我的等级';
        case 'order': return '我的订单';
        case 'post': return '投稿管理';
        case 'verify': return '认证管理';
        case 'card': return '卡密管理';
        case 'complaint': return '举报管理';
        case 'link': return '链接管理';
        case 'message': return '消息管理';
        case 'orders': return '订单管理';
        case 'distribution': return '推广返佣';
        case 'withdraw': return '提现管理';
        case 'settings': return '账户设置';
        case 'secure': return '安全设置';
        case 'write': return '发布文章';
        case 'moments': return '发布帖子';
        default: return '个人中心';
    }
}

// 选择要加载的组件
const componentMap = {
  center: defineAsyncComponent(() => import('@/components/account/center.vue')),
  task: defineAsyncComponent(() => import('@/components/account/task.vue')),
  growth: defineAsyncComponent(() => import('@/components/account/growth.vue')),
  order: defineAsyncComponent(() => import('@/components/account/order.vue')),
  post: defineAsyncComponent(() => import('@/components/account/posts.vue')),
  settings: defineAsyncComponent(() => import('@/components/account/settings.vue')),
  secure: defineAsyncComponent(() => import('@/components/account/secure.vue')),
  verify: defineAsyncComponent(() => import('@/components/account/verify.vue')),
  card: defineAsyncComponent(() => import('@/components/account/card.vue')),
  report: defineAsyncComponent(() => import('@/components/account/complaint.vue')),
  link: defineAsyncComponent(() => import('@/components/account/link.vue')),
  message: defineAsyncComponent(() => import('@/components/account/message.vue')),
  orders: defineAsyncComponent(() => import('@/components/account/orders.vue')),
  distribution: defineAsyncComponent(() => import('@/components/account/distribution.vue')),
  withdraw: defineAsyncComponent(() => import('@/components/account/withdrawalAdmin.vue')),
  write: defineAsyncComponent(() => import('@/pages/write.vue')),
  moments: defineAsyncComponent(() => import('@/components/circle/CircleEditor.vue')),
};

// 获取组件参数
const getPropsForPage = () => {
    if (page.value === 'center') {
        return {
            money: money.value,
            credit: credit.value,
        }
    }
    // 默认：无参数
    return {}
}

// 页面跳转
const go = (link) => {
    router.push(link);
};

// 切换侧边栏折叠状态
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
  
  // 如果是折叠操作，立即隐藏文本
  if (sidebarCollapsed.value) {
    showMenuText.value = false;
  } else {
    // 如果是展开操作，等待过渡完成后再显示文本
    setTimeout(() => {
      showMenuText.value = true;
    }, 180); // 设置略小于CSS过渡的时间
  }
};

// 切换移动端侧边栏
const toggleMobileSidebar = () => {
  mobileSidebarOpen.value = !mobileSidebarOpen.value;
};

// 获取用户数据
const fetchUserData = async () => {
    try {
        let res = await store.fetchUserInfo();
        userId.value = res.id;
        userData.value = res;
        credit.value = res.credit || 0;
        money.value = Number(res.money) || 0;
        vipInfo.value = res.vip || null;
    } catch (error) {
        console.error('获取用户数据失败', error);
    }
}

// 组件挂载时获取用户数据
onMounted(async () => {
    store.center_title = '个人中心';
    await fetchUserData();
});

// 服务端预获取
onServerPrefetch(async () => {
    await fetchUserData();
});

// 监听页面变化
watch(page, (newVal) => {
    if(!isMobile.value){
      store.center_title = getPageName(newVal);
    } else {
      if(typeof window !== 'undefined'){
        window.scrollTo({top: 0, behavior: 'instant'});
      }
    }
})
</script>

<style scoped>
/* 管理后台布局 */
.admin-layout {
  display: flex;
  height: 100vh;
  width: 100%;
}

/* 侧边栏样式 - 现代化版本 */
.admin-sidebar {
  width: 240px;
  background: var(--color-base-100);
  display: flex;
  flex-direction: column;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 10;
  color: var(--color-base-content);
  box-shadow: 1px 0 10px rgba(0, 0, 0, 0.05);
  border-right: 1px solid rgba(0, 0, 0, 0.06);
}

.admin-sidebar.collapsed {
  width: 80px;
}

/* 菜单文本显示/隐藏的过渡效果 */
.menu-list li a span,
.logo-text,
.user-info,
.menu-title,
.sidebar-action span {
  white-space: nowrap;
  overflow: hidden;
  opacity: 1;
  transition: opacity 0.15s ease;
}

.sidebar-header {
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(24, 144, 255, 0.1);
  border-radius: 8px;
  font-size: 18px;
  color: var(--color-primary);
  box-shadow: 0 2px 6px rgba(24, 144, 255, 0.15);
}

.logo-text {
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: var(--color-primary);
}

.sidebar-toggle {
  background: none;
  border: none;
  color: rgba(0, 0, 0, 0.45);
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
  transition: color 0.2s;
}

.sidebar-toggle:hover {
  color: var(--color-primary);
}

.user-profile {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  margin-bottom: 10px;
}

.avatar-wrapper {
  position: relative;
}

.user-info {
  min-width: 0;
}

.username {
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--color-base-content);
}

.user-role {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

/* 菜单样式 */
.admin-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.15) transparent;
}

.admin-menu::-webkit-scrollbar {
  width: 4px;
}

.admin-menu::-webkit-scrollbar-track {
  background: transparent;
}

.admin-menu::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 4px;
}

.menu-section {
  margin-bottom: 24px;
  padding: 0 8px;
}

.menu-title {
  padding: 0 12px;
  margin-bottom: 8px;
  position: relative;
  display: flex;
  align-items: center;
}

.menu-title span {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  padding-left: 0;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-list li {
  margin-bottom: 2px;
}

.menu-list li a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  color: var(--color-base-content);
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 8px;
  position: relative;
  white-space: nowrap;
  height: 42px;
  overflow: hidden;
}

.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  transition: transform 0.2s;
  color: var(--color-base-content);
}

.menu-list li a i {
  font-size: 16px;
  transition: all 0.2s;
}

.menu-list li a:hover {
  color: var(--color-primary);
  background-color: rgba(24, 144, 255, 0.06);
}

.menu-list li a:hover .menu-icon {
  transform: translateY(-2px);
  color: var(--color-primary);
}

.menu-list li a.active {
  color: var(--color-primary);
  background: rgba(24, 144, 255, 0.08);
  font-weight: 500;
}

.menu-list li a.active .menu-icon {
  color: var(--color-primary);
}

.menu-indicator {
  position: absolute;
  top: 50%;
  right: 16px;
  width: 6px;
  height: 6px;
  background-color: var(--color-primary);
  border-radius: 50%;
  transform: translateY(-50%);
}

/* 侧边栏底部 */
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.sidebar-action {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  color: var(--color-base-content);
}

.sidebar-action:hover {
  background-color: rgba(24, 144, 255, 0.06);
  color: var(--color-primary);
}

/* 主内容区域 */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--color-base-200);
  overflow: hidden;
}

/* 顶部栏 */
.admin-header {
  background-color: var(--color-base-100);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  position: relative;
  z-index: 5;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mobile-menu-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  display: none;
}

.breadcrumb {
  font-size: 14px;
  color: var(--color-base-content);
}

.breadcrumb a {
  color: var(--color-base-content);
  text-decoration: none;
}

.breadcrumb a:hover {
  color: var(--color-primary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.asset-info {
  gap: 12px;
}

.asset-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}

.user-dropdown {
  position: relative;
}

.user-dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.user-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 160px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  padding: 4px 0;
  margin-top: 4px;
  display: none;
  list-style: none;
}

.user-dropdown:hover .user-dropdown-menu {
  display: block;
}

.user-dropdown-menu li a {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  color: var(--color-base-content);
  font-size: 14px;
  cursor: pointer;
}

.user-dropdown-menu li a:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.user-dropdown-menu li.divider {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.06);
  margin: 4px 0;
}

/* 页面内容 */
.admin-content {
  flex: 1;
  overflow: auto;
}

/* 仪表板统计卡片 */
.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.stat-card {
  background-color: #fff;
  border-radius: 4px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  background-color: rgba(24, 144, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: var(--color-primary);
}

.stat-data {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 500;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
}

/* 资产卡片 */
.asset-cards {
  margin-bottom: 16px;
}

.asset-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.asset-panel {
  background-color: var(--color-base-100);
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  overflow: hidden;
}

.panel-header {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-base-content);
}

.panel-header i {
  color: var(--color-primary);
}

.panel-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.amount {
  font-size: 24px;
  font-weight: 500;
  color: var(--color-primary);
}

.sub-info {
  font-size: 12px;
}

.panel-footer {
  padding: 12px 16px;
  display: flex;
  justify-content: flex-end;
}

.action-btn {
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 2px;
  padding: 4px 12px;
  font-size: 13px;
  cursor: pointer;
}

.action-btn:hover {
  background-color: #40a9ff;
}

/* 组件容器 */
.component-container {
  background-color: var(--color-base-100);
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  min-height: 100%
}

/* 页脚 */
.admin-footer {
  padding: 12px 16px;
  text-align: center;
  background-color: var(--color-base-100);
  color: var(--color-base-content);
  font-size: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

/* 响应式样式 */
@media (max-width: 1023px) {
  .admin-sidebar {
    position: fixed;
    left: -250px;
    top: 0;
    height: 100vh;
    transition: left 0.3s;
  }
  
  .admin-sidebar.mobile-open {
    left: 0;
  }
  
  .sidebar-toggle {
    display: block;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9;
  }
  
  .dashboard-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .asset-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .dashboard-stats {
    grid-template-columns: 1fr;
  }
}
</style>