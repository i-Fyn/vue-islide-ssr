import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

/**
 * 滚动动画组合式API，用于创建和管理滚动相关的动画效果
 * @param {Object} options - 配置选项
 * @returns {Object} - 返回API方法和状态
 */
export function useScrollAnimation(options = {}) {
  // 注册GSAP插件
  gsap.registerPlugin(ScrollTrigger)
  
  // 默认配置
  const defaultOptions = {
    root: null,                 // 观察的根元素
    rootMargin: '0px',          // 根元素的边距
    threshold: 0.1,             // 元素可见比例的阈值
    once: true,                 // 是否只触发一次
    defaultAnimation: 'fadeInUp', // 默认动画
    defaultDuration: 0.8,       // 默认动画持续时间(秒)
    defaultEase: 'power2.out',  // 默认缓动函数
    staggerAmount: 0.1,         // 交错时间(秒)
    debug: false                // 是否开启调试模式
  }
  
  // 合并配置
  const config = {
    ...defaultOptions,
    ...options
  }
  
  // 创建状态
  const animationElements = ref([])         // 所有被添加动画的元素
  const observers = ref([])                  // 所有的IntersectionObserver实例
  const animationsInProgress = ref(new Set()) // 当前正在进行的动画
  
  // 动画预设
  const animations = {
    fadeIn: (el, duration = config.defaultDuration, delay = 0) => {
      return gsap.fromTo(el, 
        { autoAlpha: 0 }, 
        { 
          autoAlpha: 1, 
          duration,
          delay,
          ease: config.defaultEase,
          clearProps: 'all'
        }
      )
    },
    
    fadeInUp: (el, duration = config.defaultDuration, delay = 0) => {
      return gsap.fromTo(el, 
        { autoAlpha: 0, y: 50 }, 
        { 
          autoAlpha: 1, 
          y: 0, 
          duration,
          delay,
          ease: config.defaultEase,
          clearProps: 'all'
        }
      )
    },
    
    fadeInDown: (el, duration = config.defaultDuration, delay = 0) => {
      return gsap.fromTo(el, 
        { autoAlpha: 0, y: -50 }, 
        { 
          autoAlpha: 1, 
          y: 0, 
          duration,
          delay,
          ease: config.defaultEase,
          clearProps: 'all'
        }
      )
    },
    
    fadeInLeft: (el, duration = config.defaultDuration, delay = 0) => {
      return gsap.fromTo(el, 
        { autoAlpha: 0, x: -50 }, 
        { 
          autoAlpha: 1, 
          x: 0, 
          duration,
          delay,
          ease: config.defaultEase,
          clearProps: 'all'
        }
      )
    },
    
    fadeInRight: (el, duration = config.defaultDuration, delay = 0) => {
      return gsap.fromTo(el, 
        { autoAlpha: 0, x: 50 }, 
        { 
          autoAlpha: 1, 
          x: 0, 
          duration,
          delay,
          ease: config.defaultEase,
          clearProps: 'all'
        }
      )
    },
    
    zoomIn: (el, duration = config.defaultDuration, delay = 0) => {
      return gsap.fromTo(el, 
        { autoAlpha: 0, scale: 0.5 }, 
        { 
          autoAlpha: 1, 
          scale: 1, 
          duration,
          delay,
          ease: config.defaultEase,
          clearProps: 'all'
        }
      )
    },
    
    bounceIn: (el, duration = config.defaultDuration, delay = 0) => {
      return gsap.fromTo(el, 
        { autoAlpha: 0, scale: 0.3 }, 
        { 
          autoAlpha: 1, 
          scale: 1, 
          duration,
          delay,
          ease: "elastic.out(1, 0.3)",
          clearProps: 'all'
        }
      )
    },
    
    flipIn: (el, duration = config.defaultDuration, delay = 0) => {
      return gsap.fromTo(el, 
        { autoAlpha: 0, rotationX: 90, transformPerspective: 600 }, 
        { 
          autoAlpha: 1, 
          rotationX: 0, 
          duration,
          delay,
          ease: "back.out(1.7)",
          clearProps: 'all'
        }
      )
    }
  }
  
  /**
   * 对元素集合应用交错动画
   * @param {Array|NodeList} elements - 要应用动画的元素集合
   * @param {String} animation - 动画名称
   * @param {Object} options - 动画选项
   */
  const stagger = (elements, animation = config.defaultAnimation, options = {}) => {
    const {
      duration = config.defaultDuration,
      staggerAmount = config.staggerAmount,
      from = 'start',
      grid = null,
      ease = config.defaultEase,
      delay = 0,
      onComplete
    } = options
    
    // 检查动画是否存在
    const animationFn = typeof animation === 'function' ? animation : animations[animation]
    if (!animationFn) {
      console.warn(`动画 "${animation}" 不存在`)
      return
    }
    
    // 应用初始样式
    gsap.set(elements, { autoAlpha: 0 })
    
    // 创建并执行动画
    const tl = gsap.timeline({
      defaults: { ease },
      onComplete
    })
    
    // 元素交错动画
    elements.forEach((el, index) => {
      // 计算当前元素的延迟
      const elDelay = delay + (staggerAmount * index)
      // 添加到时间线
      tl.add(animationFn(el, duration, elDelay), 0)
    })
    
    // 返回动画时间线
    return tl
  }
  
  /**
   * 创建滚动触发的动画
   * @param {String|Element} triggerElement - 触发元素
   * @param {String|Element} animateElement - 动画元素(默认与触发元素相同)
   * @param {Object} options - 动画选项
   */
  const createScrollTrigger = (triggerElement, animateElement = null, options = {}) => {
    const target = animateElement || triggerElement
    
    // 默认配置
    const {
      animation = config.defaultAnimation,
      start = 'top 80%',
      end = 'bottom 20%',
      scrub = false,
      toggleActions = 'play none none reverse',
      markers = config.debug,
      pin = false,
      pinSpacing = false,
      duration = config.defaultDuration,
      delay = 0,
      onEnter = null,
      onLeave = null,
      onEnterBack = null,
      onLeaveBack = null
    } = options
    
    // 检查动画是否存在
    const animationFn = typeof animation === 'function' ? animation : animations[animation]
    if (!animationFn) {
      console.warn(`动画 "${animation}" 不存在`)
      return
    }
    
    // 初始状态
    gsap.set(target, { autoAlpha: 0 })
    
    // 创建ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: triggerElement,
      start,
      end,
      scrub,
      toggleActions,
      markers,
      pin,
      pinSpacing,
      onEnter: (self) => {
        // 执行动画
        animationFn(target, duration, delay)
        // 执行回调
        if (onEnter) onEnter(self)
      },
      onLeave: onLeave,
      onEnterBack: onEnterBack,
      onLeaveBack: onLeaveBack
    })
    
    // 返回ScrollTrigger实例
    return trigger
  }
  
  /**
   * 使用IntersectionObserver创建出现动画
   * @param {Element} element - 要观察的元素
   * @param {Object} options - 选项
   * @returns {IntersectionObserver} - 观察器实例
   */
  const createIntersectionObserver = (element, options = {}) => {
    const {
      animation = config.defaultAnimation,
      threshold = config.threshold,
      rootMargin = config.rootMargin,
      root = config.root,
      once = config.once,
      duration = config.defaultDuration,
      delay = 0,
      onEnter = null,
      onLeave = null
    } = options
    
    // 检查动画是否存在
    const animationFn = typeof animation === 'function' ? animation : animations[animation]
    if (!animationFn) {
      console.warn(`动画 "${animation}" 不存在`)
      return
    }
    
    // 设置初始不可见状态
    gsap.set(element, { autoAlpha: 0 })
    
    // 创建观察器
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 元素进入视口
          animationFn(element, duration, delay)
          
          // 执行回调
          if (onEnter) onEnter(entry)
          
          // 如果只执行一次，取消观察
          if (once) {
            observer.unobserve(element)
          }
        } else if (onLeave) {
          // 元素离开视口时执行回调
          onLeave(entry)
        }
      })
    }, {
      root,
      rootMargin,
      threshold
    })
    
    // 开始观察
    observer.observe(element)
    observers.value.push(observer)
    
    // 返回观察器
    return observer
  }
  
  /**
   * 批量创建视口内动画
   * @param {String|NodeList|Array} selector - 选择器或元素集合
   * @param {Object} options - 选项
   */
  const batchAnimate = (selector, options = {}) => {
    // 获取元素
    let elements = []
    if (typeof selector === 'string') {
      elements = Array.from(document.querySelectorAll(selector))
    } else if (selector instanceof NodeList) {
      elements = Array.from(selector)
    } else if (Array.isArray(selector)) {
      elements = selector
    }
    
    if (elements.length === 0) {
      console.warn('没有找到匹配的元素')
      return
    }
    
    // 应用选项
    const {
      staggered = true,
      staggerAmount = config.staggerAmount,
      animation = config.defaultAnimation,
      delay = 0,
      duration = config.defaultDuration,
      once = config.once,
      threshold = config.threshold,
      rootMargin = config.rootMargin,
      root = config.root
    } = options
    
    // 如果使用交错效果，对整个集合使用IntersectionObserver
    if (staggered) {
      // 记录所有元素
      animationElements.value = [...animationElements.value, ...elements]
      
      // 设置初始不可见状态
      gsap.set(elements, { autoAlpha: 0 })
      
      // 创建观察器
      const observer = new IntersectionObserver((entries) => {
        // 找到所有当前可见的元素
        const visibleElements = entries
          .filter(entry => entry.isIntersecting)
          .map(entry => entry.target)
        
        // 如果有可见元素，应用交错动画
        if (visibleElements.length > 0) {
          stagger(visibleElements, animation, {
            staggerAmount,
            duration,
            delay
          })
          
          // 如果只执行一次，取消对这些元素的观察
          if (once) {
            visibleElements.forEach(el => observer.unobserve(el))
          }
        }
      }, {
        root,
        rootMargin,
        threshold
      })
      
      // 观察所有元素
      elements.forEach(el => {
        observer.observe(el)
      })
      
      // 记录观察器
      observers.value.push(observer)
      
    } else {
      // 对每个元素单独创建动画
      elements.forEach((el, index) => {
        animationElements.value.push(el)
        
        createIntersectionObserver(el, {
          animation,
          threshold,
          rootMargin,
          root,
          once,
          duration,
          delay: delay + (index * staggerAmount)
        })
      })
    }
  }
  
  /**
   * 刷新所有动画，用于组件更新后重新计算
   */
  const refreshAnimations = () => {
    // 刷新ScrollTrigger
    ScrollTrigger.refresh()
    
    // 重新计算已有的动画
    if (config.debug) {
      console.log('刷新动画')
    }
  }
  
  /**
   * 清理所有观察器和动画
   */
  const cleanup = () => {
    // 清理所有观察器
    observers.value.forEach(observer => {
      if (observer && observer.disconnect) {
        observer.disconnect()
      }
    })
    
    // 清理所有ScrollTrigger
    ScrollTrigger.getAll().forEach(trigger => {
      trigger.kill()
    })
    
    // 清理所有正在进行的动画
    gsap.killTweensOf(animationElements.value)
    
    // 重置状态
    observers.value = []
    animationElements.value = []
    animationsInProgress.value.clear()
  }
  
  onMounted(() => {
    // 组件挂载后初始化
    if (config.debug) {
      console.log('滚动动画组合式API已初始化')
    }
  })
  
  onBeforeUnmount(() => {
    // 组件卸载前清理
    cleanup()
  })
  
  // 返回公共API
  return {
    // 方法
    animations,
    stagger,
    createScrollTrigger,
    createIntersectionObserver,
    batchAnimate,
    refreshAnimations,
    cleanup,
    
    // 状态
    animationElements,
    observers,
    animationsInProgress
  }
} 