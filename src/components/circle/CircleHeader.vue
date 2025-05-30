<script setup>
import { ref, onMounted, onBeforeUnmount, computed, reactive } from "vue";
import { useStore } from '@/store';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const store = useStore();
const config = computed(() => store.config);

const title = ref(config.value.circle_name || "社区交流");
const description = ref(config.value.circle_description || "来这里分享你的想法和创意");
const showParticles = ref(true);
const activeTab = ref(0);
const tabs = ref([
  { name: "最新动态", icon: "ri-time-line" },
  { name: "热门讨论", icon: "ri-fire-line" },
  { name: "精选内容", icon: "ri-star-line" },
  { name: "我的关注", icon: "ri-user-heart-line" }
]);

// 热门话题标签
const hotTags = ref([
  { name: "摄影", count: 128 },
  { name: "旅行", count: 78 },
  { name: "美食", count: 56 },
  { name: "技术", count: 42 },
  { name: "阅读", count: 37 },
  { name: "电影", count: 23 }
]);

// 用户状态和交互
const userStatus = reactive({
  isLoggedIn: true,
  hasNewMessages: true,
  messageCount: 3,
  notifications: 5
});

// 悬浮卡片的状态
const hoveredCard = ref(null);

// 虚拟活跃用户数据
const activeUsers = ref([
  { avatar: "https://api.minio.yyds.pink/moony/files/2025/04/avatar1.webp", name: "云游者", status: "online" },
  { avatar: "https://api.minio.yyds.pink/moony/files/2025/04/avatar2.webp", name: "星辰", status: "online" },
  { avatar: "https://api.minio.yyds.pink/moony/files/2025/04/avatar3.webp", name: "晨曦", status: "away" },
  { avatar: "https://api.minio.yyds.pink/moony/files/2025/04/avatar4.webp", name: "流光", status: "online" },
  { avatar: "https://api.minio.yyds.pink/moony/files/2025/04/avatar5.webp", name: "幻影", status: "busy" }
]);

const userCount = ref(Math.floor(Math.random() * 50) + 20);
const topicCount = ref(Math.floor(Math.random() * 100) + 50);
const postCount = ref(Math.floor(Math.random() * 500) + 200);

// 为创意元素创建随机数据
const bubbles = ref(Array.from({ length: 12 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 40 + 10,
  speed: Math.random() * 2 + 1,
  delay: Math.random() * 5,
  opacity: Math.random() * 0.5 + 0.1
})));

// 星星背景元素
const stars = ref(Array.from({ length: 30 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  opacity: Math.random() * 0.7 + 0.3,
  blinkDelay: Math.random() * 5
})));

// 展示的动态内容
const featuredContent = ref([
  {
    id: 1,
    title: "探索秋日摄影的光影魅力",
    author: "云游者",
    image: "https://api.minio.yyds.pink/moony/files/2025/05/photo1.webp",
    likes: 42
  },
  {
    id: 2,
    title: "城市建筑的几何美学",
    author: "星辰",
    image: "https://api.minio.yyds.pink/moony/files/2025/05/photo2.webp",
    likes: 38
  },
  {
    id: 3,
    title: "旅行中的意外收获",
    author: "流光",
    image: "https://api.minio.yyds.pink/moony/files/2025/05/photo3.webp",
    likes: 27
  }
]);

const setHoveredCard = (id) => {
  hoveredCard.value = id;
};

const clearHoveredCard = () => {
  hoveredCard.value = null;
};

// 鼠标位置追踪用于光效
const mousePosition = reactive({ x: 0, y: 0 });
const updateMousePosition = (event) => {
  mousePosition.x = event.clientX;
  mousePosition.y = event.clientY;
};

gsap.registerPlugin(ScrollTrigger);

const handleScroll = () => {
  const scrollPosition = window.scrollY;
  if (scrollPosition > 100) {
    showParticles.value = false;
  } else {
    showParticles.value = true;
  }
};

const setActiveTab = (index) => {
  activeTab.value = index;
  emit('changeTab', index, tabs.value[index].name);
};

const emit = defineEmits(['changeTab']);

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('mousemove', updateMousePosition);
  
  // 头部标题动画
  gsap.from(".circle-title", {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });
  
  // 气泡动画
  gsap.to(".bubble", {
    y: -20,
    stagger: 0.1,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });
  
  // 统计数字动画
  gsap.to(".stat-number", {
    textContent: (i, target) => {
      const value = parseInt(target.getAttribute('data-value'));
      return value;
    },
    duration: 2,
    ease: "power2.out",
    snap: { textContent: 1 },
    stagger: 0.2
  });
  
  // 标签云动画
  gsap.fromTo(".tag-item", 
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, stagger: 0.1, duration: 0.5, ease: "back.out(1.7)" }
  );
  
  // 用户头像进入动画
  gsap.fromTo(".user-avatar", 
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, delay: 0.5 }
  );
  
  // 特色内容卡片动画
  gsap.fromTo(".featured-card", 
    { x: 100, opacity: 0 },
    { x: 0, opacity: 1, stagger: 0.2, duration: 0.8, ease: "power2.out" }
  );
  
  // 星星闪烁动画
  gsap.to(".star", {
    opacity: 0.2,
    stagger: 0.1,
    repeat: -1,
    yoyo: true,
    duration: 1.5,
    ease: "sine.inOut"
  });
  
  // 滚动触发效果
  gsap.to(".circle-header-inner", {
    scrollTrigger: {
      trigger: ".circle-header",
      start: "top top",
      end: "bottom top",
      scrub: true
    },
    y: 100,
    opacity: 0.7,
    scale: 0.95
  });
  
  // 热度指示器动画
  gsap.to(".heat-indicator", {
    scaleY: 1,
    stagger: 0.1,
    duration: 1,
    ease: "elastic.out(1, 0.3)",
    delay: 1
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('mousemove', updateMousePosition);
});
</script>

<template>
  <div class="circle-header w-full relative overflow-hidden" 
       :style="{ 
         background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, var(--color-primary-focus) 0%, var(--color-base-300) 70%, var(--color-base-100) 100%)` 
       }">
    <!-- 星空背景 -->
    <div class="stars-background absolute inset-0 pointer-events-none">
      <div v-for="(star, index) in stars" :key="`star-${index}`" 
           class="star absolute rounded-full bg-white"
           :style="{
             left: star.x + '%',
             top: star.y + '%',
             width: star.size + 'px',
             height: star.size + 'px',
             opacity: star.opacity,
             animationDelay: star.blinkDelay + 's'
           }">
      </div>
    </div>
    
    <!-- 动态气泡背景 -->
    <div class="circle-particles absolute inset-0 pointer-events-none" v-show="showParticles">
      <div v-for="(bubble, index) in bubbles" :key="`bubble-${index}`" 
           class="bubble absolute rounded-full backdrop-blur-sm"
           :style="{
             left: bubble.x + '%',
             top: bubble.y + '%',
             width: bubble.size + 'px',
             height: bubble.size + 'px',
             animationDelay: bubble.delay + 's',
             animationDuration: bubble.speed + 's',
             opacity: bubble.opacity,
             background: `linear-gradient(135deg, var(--color-primary-focus) 0%, var(--color-secondary) 100%)`
           }">
      </div>
    </div>
    
    <!-- 头部内容 -->
    <div class="circle-header-inner container mx-auto relative z-10 pt-16 pb-4 px-4 ">
      <div class="flex flex-col md:flex-row items-center justify-between gap-8 p-4 bg-base-100">
        <!-- 左侧标题和描述 -->
        <div class="circle-title-container text-center md:text-left">
          <h1 class="circle-title text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">{{ title }}</h1>
          <p class="circle-description text-base md:text-lg text-base-content/80 max-w-lg">{{ description }}</p>
          
          <!-- 活跃用户展示 -->
          <div class="active-users-container mt-4">
            <div class="flex items-center gap-1">
              <div v-for="(user, index) in activeUsers" :key="`user-${index}`" 
                   class="user-avatar relative" :class="{ '-ml-2': index > 0 }">
                <img :src="user.avatar" 
                     class="w-8 h-8 rounded-full border-2 border-base-100 object-cover"
                     :title="user.name">
                <span class="status-indicator absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full"
                      :class="{
                        'bg-success': user.status === 'online',
                        'bg-warning': user.status === 'away',
                        'bg-error': user.status === 'busy'
                      }"></span>
              </div>
              <span class="text-xs text-base-content/70 ml-2">+{{ userCount - activeUsers.length }} 人活跃中</span>
            </div>
          </div>
          
          <!-- 统计数据 -->
          <div class="circle-stats flex gap-6 mt-6">
            <div class="stat-item text-center group cursor-pointer">
              <div class="stat-number text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary" 
                   :data-value="userCount">0</div>
              <div class="stat-label text-xs group-hover:text-primary transition-colors">在线用户</div>
              <div class="heat-indicator h-6 w-1 bg-primary/30 rounded-full mt-1 origin-bottom scale-y-0" 
                   :style="{ height: '1.5rem', backgroundColor: 'var(--color-primary)' }"></div>
            </div>
            <div class="stat-item text-center group cursor-pointer">
              <div class="stat-number text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary" 
                   :data-value="topicCount">0</div>
              <div class="stat-label text-xs group-hover:text-primary transition-colors">话题数</div>
              <div class="heat-indicator h-10 w-1 bg-primary/30 rounded-full mt-1 origin-bottom scale-y-0" 
                   :style="{ height: '2rem', backgroundColor: 'var(--color-primary)' }"></div>
            </div>
            <div class="stat-item text-center group cursor-pointer">
              <div class="stat-number text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary" 
                   :data-value="postCount">0</div>
              <div class="stat-label text-xs group-hover:text-primary transition-colors">内容数</div>
              <div class="heat-indicator h-8 w-1 bg-primary/30 rounded-full mt-1 origin-bottom scale-y-0" 
                   :style="{ height: '2.5rem', backgroundColor: 'var(--color-primary)' }"></div>
            </div>
          </div>
        </div>
        
        <!-- 右侧交互区域 -->
        <div class="circle-interactive">
          <!-- 用户状态区域 -->
          <div class="user-status-container mb-4 flex items-center justify-end gap-3" v-if="userStatus.isLoggedIn">
            <div class="relative" v-if="userStatus.hasNewMessages">
              <button class="btn btn-circle btn-sm btn-ghost">
                <i class="ri-message-3-line text-lg"></i>
              </button>
              <span class="absolute -top-1 -right-1 w-4 h-4 bg-error text-error-content text-xs rounded-full flex items-center justify-center">
                {{ userStatus.messageCount }}
              </span>
            </div>
            <div class="relative">
              <button class="btn btn-circle btn-sm btn-ghost">
                <i class="ri-notification-3-line text-lg"></i>
              </button>
              <span class="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-content text-xs rounded-full flex items-center justify-center">
                {{ userStatus.notifications }}
              </span>
            </div>
          </div>
          
          <div class="circle-cta flex flex-col gap-3">
            <button class="btn btn-primary px-6 gap-2 animate-pulse-subtle">
              <i class="ri-add-line"></i>
              发布内容
            </button>
            <button class="btn btn-outline btn-secondary px-6 gap-2">
              <i class="ri-search-line"></i>
              探索发现
            </button>
          </div>
          
          <!-- 标签云 -->
          <div class="tag-cloud mt-4 flex flex-wrap gap-2 justify-end">
            <div v-for="(tag, index) in hotTags" :key="`tag-${index}`" 
                 class="tag-item badge badge-outline badge-lg hover:badge-primary transition-colors cursor-pointer">
              # {{ tag.name }}
              <span class="ml-1 text-xs">{{ tag.count }}</span>
            </div>
          </div>
        </div>
      </div>
      

      
    </div>
    
  </div>
</template>

<style lang="scss" scoped>
.circle-header {
  min-height: 380px;
  position: relative;
  transition: background 0.5s ease;
}

.bubble {
  animation: float 3s ease-in-out infinite;
  filter: blur(1px);
  transform: translateY(0);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.star {
  animation: blink 3s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.2; }
}

@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
}

.circle-wave {
  color: var(--color-base-100);
  transform-origin: bottom;
  animation: wave 10s ease-in-out infinite alternate;
}

@keyframes wave {
  0% {
    transform: scaleX(1.05) scaleY(1);
  }
  50% {
    transform: scaleX(0.95) scaleY(1.2);
  }
  100% {
    transform: scaleX(1.05) scaleY(1);
  }
}

.stat-item {
  position: relative;
  
  &:not(:last-child)::after {
    content: "";
    position: absolute;
    right: -12px;
    top: 50%;
    transform: translateY(-50%);
    height: 70%;
    width: 1px;
    background-color: var(--color-base-300);
    opacity: 0.5;
  }
}

.tabs {
  &::-webkit-scrollbar {
    height: 2px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--color-base-200);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--color-primary);
    border-radius: 4px;
  }
}

.featured-cards {
  &::-webkit-scrollbar {
    height: 3px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--color-base-200);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--color-primary);
    border-radius: 4px;
  }
}

.tag-item {
  transform-origin: center;
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s infinite;
}

@keyframes pulse-subtle {
  0%, 100% { box-shadow: 0 0 0 0 var(--color-primary-focus); }
  50% { box-shadow: 0 0 10px 2px var(--color-primary-focus); }
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>