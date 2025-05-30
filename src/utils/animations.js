// animations.js - 动画工具类
import 'animate.css';

// 创建一个能在服务端和客户端环境都能工作的GSAP环境
let gsap;
let ScrollTrigger;
let ScrollToPlugin;

// 检查是否在浏览器环境
const isBrowser = typeof window !== 'undefined';

// 在浏览器环境下初始化GSAP
if (isBrowser) {
  // 使用异步函数立即执行导入GSAP
  (async () => {
    try {
      // 动态导入GSAP (仅在客户端执行)
      const gsapModule = await import('gsap');
      gsap = gsapModule.default;
      
      // 导入插件
      const STModule = await import('gsap/ScrollTrigger');
      ScrollTrigger = STModule.ScrollTrigger;
      
      const SPModule = await import('gsap/ScrollToPlugin');
      ScrollToPlugin = SPModule.ScrollToPlugin;
      
      // 注册GSAP插件
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
      
      // 将GSAP添加到window对象，使其在全局可用
      window.$gsap = gsap;
      window.$ScrollTrigger = ScrollTrigger;
    } catch (e) {
      console.error('GSAP加载失败:', e);
      
      // 提供模拟实现，防止错误
      gsap = {
        to: () => ({}),
        from: () => ({}),
        fromTo: () => ({}),
        set: () => ({}),
        timeline: () => ({ to: () => ({}) }),
      };
      
      ScrollTrigger = {
        create: () => ({}),
        refresh: () => {},
      };
    }
  })();
} else {
  // 服务端环境下的模拟实现
  gsap = {
    to: () => ({}),
    from: () => ({}),
    fromTo: () => ({}),
    set: () => ({}),
    timeline: () => ({ to: () => ({}) }),
    registerPlugin: () => {},
  };
  
  ScrollTrigger = {
    create: () => ({}),
    refresh: () => {},
  };
}

/**
 * GSAP动画工具类
 */
export const gsapAnimations = {
  // 淡入效果
  fadeIn: (element, duration = 1, delay = 0, ease = 'power2.out') => {
    if (!isBrowser || !window.$gsap) return {};
    const gsapInstance = window.$gsap || gsap;
    return gsapInstance.fromTo(element, 
      { opacity: 0 }, 
      { opacity: 1, duration, delay, ease }
    );
  },
  
  // 从下方滑入
  slideFromBottom: (element, distance = 50, duration = 1, delay = 0) => {
    if (!isBrowser || !window.$gsap) return {};
    const gsapInstance = window.$gsap || gsap;
    return gsapInstance.fromTo(element, 
      { y: distance, opacity: 0 }, 
      { y: 0, opacity: 1, duration, delay, ease: 'power2.out' }
    );
  },
  
  // 从上方滑入
  slideFromTop: (element, distance = 50, duration = 1, delay = 0) => {
    if (!isBrowser || !window.$gsap) return {};
    const gsapInstance = window.$gsap || gsap;
    return gsapInstance.fromTo(element, 
      { y: -distance, opacity: 0 }, 
      { y: 0, opacity: 1, duration, delay, ease: 'power2.out' }
    );
  },
  
  // 从左侧滑入
  slideFromLeft: (element, distance = 50, duration = 1, delay = 0) => {
    if (!isBrowser || !window.$gsap) return {};
    const gsapInstance = window.$gsap || gsap;
    return gsapInstance.fromTo(element, 
      { x: -distance, opacity: 0 }, 
      { x: 0, opacity: 1, duration, delay, ease: 'power2.out' }
    );
  },
  
  // 从右侧滑入
  slideFromRight: (element, distance = 50, duration = 1, delay = 0) => {
    if (!isBrowser || !window.$gsap) return {};
    const gsapInstance = window.$gsap || gsap;
    return gsapInstance.fromTo(element, 
      { x: distance, opacity: 0 }, 
      { x: 0, opacity: 1, duration, delay, ease: 'power2.out' }
    );
  },
  
  // 缩放进入
  scaleIn: (element, duration = 1, delay = 0) => {
    if (!isBrowser || !window.$gsap) return {};
    const gsapInstance = window.$gsap || gsap;
    return gsapInstance.fromTo(element, 
      { scale: 0.5, opacity: 0 }, 
      { scale: 1, opacity: 1, duration, delay, ease: 'back.out(1.7)' }
    );
  },
  
  // 创建滚动触发动画
  createScrollTrigger: (element, animation, options = {}) => {
    if (!isBrowser || !window.$ScrollTrigger) return {};
    const STInstance = window.$ScrollTrigger || ScrollTrigger;
    return STInstance.create({
      trigger: element,
      start: options.start || 'top 80%',
      end: options.end || 'bottom 20%',
      animation: animation,
      toggleActions: options.toggleActions || 'play none none none',
      once: options.once !== undefined ? options.once : false,
      markers: options.markers !== undefined ? options.markers : false
    });
  },
  
  // 交错动画（用于列表项等）
  staggerAnimation: (elements, animation, staggerTime = 0.1) => {
    if (!isBrowser || !window.$gsap) return {};
    const gsapInstance = window.$gsap || gsap;
    return gsapInstance.to(elements, {
      ...animation,
      stagger: staggerTime
    });
  },
  
  // 平滑滚动到指定元素
  scrollTo: (target, duration = 1) => {
    if (!isBrowser || !window.$gsap) return {};
    const gsapInstance = window.$gsap || gsap;
    gsapInstance.to(window, {
      duration,
      scrollTo: { y: target, offsetY: 50 },
      ease: 'power3.inOut'
    });
  }
};

/**
 * Animate.css 动画工具类
 */
export const animateCss = {
  // 添加动画
  animate: (element, animationName, prefix = 'animate__', callback = null) => {
    if (!isBrowser) return;
    
    const node = document.querySelector(element);
    if (!node) return;
    
    const animationClass = `${prefix}${animationName}`;
    node.classList.add(`${prefix}animated`, animationClass);
    
    // 监听动画结束
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationClass);
      node.removeEventListener('animationend', handleAnimationEnd);
      
      if (callback) callback();
    }
    
    node.addEventListener('animationend', handleAnimationEnd);
  },
  
  // 创建可观察动画（当元素进入视口时触发）
  createObserver: (selector, animationName, options = {}) => {
    if (!isBrowser) return { unobserve: () => {} };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const prefix = 'animate__';
          entry.target.classList.add(`${prefix}animated`, `${prefix}${animationName}`);
          
          if (options.once) {
            observer.unobserve(entry.target);
          }
        } else if (!options.once) {
          const prefix = 'animate__';
          entry.target.classList.remove(`${prefix}animated`, `${prefix}${animationName}`);
        }
      });
    }, {
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '0px'
    });
    
    try {
      document.querySelectorAll(selector).forEach(el => {
        observer.observe(el);
      });
    } catch (e) {
      console.warn('无法观察元素:', e);
    }
    
    return observer;
  }
};

// 结合GSAP和Animate.css的自定义动画
export const customAnimations = {
  // 进入动画 - 结合GSAP和Animate.css
  entranceEffect: (element, delay = 0) => {
    if (!isBrowser) return;
    
    const el = document.querySelector(element);
    if (!el) return;
    
    el.classList.add('animate__animated', 'animate__fadeIn');
    el.style.animationDelay = `${delay}s`;
    
    el.addEventListener('animationend', () => {
      gsap.to(el, {
        y: 0,
        duration: 0.3,
        ease: 'power1.out'
      });
    });
  },
  
  // 悬停效果
  addHoverEffect: (element, scale = 1.05) => {
    if (!isBrowser) return;
    
    const el = document.querySelector(element);
    if (!el) return;
    
    el.addEventListener('mouseenter', () => {
      gsap.to(el, { scale, duration: 0.3, ease: 'power1.out' });
    });
    
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { scale: 1, duration: 0.3, ease: 'power1.out' });
    });
  }
};

// 在Vue中使用的动画指令
export const createAnimationDirectives = () => {
  if (!isBrowser) {
    // 服务端返回空指令
    return {
      animate: { mounted: () => {}, unmounted: () => {} },
      gsap: { mounted: () => {} },
      gsapScroll: { mounted: () => {} }
    };
  }
  
  return {
    // v-animate 指令，使用 animate.css
    animate: {
      mounted: (el, binding) => {
        const animationName = binding.value;
        const animationDelay = binding.arg || 0;
        
        el.classList.add('animate__animated', `animate__${animationName}`);
        el.style.setProperty('--animate-delay', `${animationDelay}s`);
      },
      unmounted: (el) => {
        el.className = el.className
          .split(' ')
          .filter(cls => !cls.startsWith('animate__'))
          .join(' ');
      }
    },
    
    // v-gsap 指令，使用GSAP
    gsap: {
      mounted: (el, binding) => {
        const effect = binding.value;
        const delay = binding.arg || 0;
        
        // 确保GSAP已加载
        const gsapInstance = window.$gsap || gsap;
        if (!gsapInstance) return;
        
        switch (effect) {
          case 'fadeIn':
            gsapAnimations.fadeIn(el, 1, delay);
            break;
          case 'fromLeft':
            gsapAnimations.slideFromLeft(el, 50, 1, delay);
            break;
          case 'fromRight':
            gsapAnimations.slideFromRight(el, 50, 1, delay);
            break;
          case 'fromTop':
            gsapAnimations.slideFromTop(el, 50, 1, delay);
            break;
          case 'fromBottom':
            gsapAnimations.slideFromBottom(el, 50, 1, delay);
            break;
          case 'scale':
            gsapAnimations.scaleIn(el, 1, delay);
            break;
        }
      }
    },
    
    // v-gsap-scroll 指令，基于滚动的GSAP动画
    gsapScroll: {
      mounted: (el, binding) => {
        const effect = binding.value;
        const once = binding.modifiers?.once || false;
        
        // 确保GSAP已加载
        const gsapInstance = window.$gsap || gsap;
        if (!gsapInstance) return;
        
        let animation;
        switch (effect) {
          case 'fadeIn':
            animation = gsapInstance.fromTo(el, 
              { opacity: 0 }, 
              { opacity: 1, duration: 1, ease: 'power2.out', paused: true }
            );
            break;
          case 'fromLeft':
            animation = gsapInstance.fromTo(el, 
              { x: -50, opacity: 0 }, 
              { x: 0, opacity: 1, duration: 1, ease: 'power2.out', paused: true }
            );
            break;
          case 'fromRight':
            animation = gsapInstance.fromTo(el, 
              { x: 50, opacity: 0 }, 
              { x: 0, opacity: 1, duration: 1, ease: 'power2.out', paused: true }
            );
            break;
          case 'fromTop':
            animation = gsapInstance.fromTo(el, 
              { y: -50, opacity: 0 }, 
              { y: 0, opacity: 1, duration: 1, ease: 'power2.out', paused: true }
            );
            break;
          case 'fromBottom':
            animation = gsapInstance.fromTo(el, 
              { y: 50, opacity: 0 }, 
              { y: 0, opacity: 1, duration: 1, ease: 'power2.out', paused: true }
            );
            break;
          case 'scale':
            animation = gsapInstance.fromTo(el, 
              { scale: 0.8, opacity: 0 }, 
              { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.7)', paused: true }
            );
            break;
        }
        
        if (animation) {
          gsapAnimations.createScrollTrigger(el, animation, { once });
        }
      }
    }
  };
};

export default {
  gsapAnimations,
  animateCss,
  customAnimations,
  createAnimationDirectives
}; 