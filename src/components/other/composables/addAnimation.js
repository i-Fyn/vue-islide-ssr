// 动态给元素添加动画
export function addAnimation(item, options = {}) {
    if (!item) return;
  
    const {
      animationPrefix = 'animate__animated',
      animationEffect = 'animate__fadeInUp',
      animationDuration = 1000, // 毫秒
      animationDelay = 300,     // 毫秒
      animationFillMode = 'both',
      animationTimingFunction,   // 新增：定时函数
      onComplete,                // 新增：完成回调
      onStart                    // 新增：开始回调
    } = options;
  
    const content = item;
      
    if (content) {
      // 移除之前的动画类，以便可以重新应用
      const prefix = animationPrefix.split(' ')[0] || animationPrefix;
      content.classList.forEach(className => {
        if (className.startsWith(prefix)) {
          content.classList.remove(className);
        }
      });
      
      // 添加动画类
      animationPrefix.split(' ').forEach(prefix => content.classList.add(prefix));
      content.classList.add(animationEffect);
  
      // 设置动画属性
      content.style.setProperty('--animate-duration', `${animationDuration / 1000}s`);
      content.style.setProperty('--animate-delay', `${animationDelay / 1000}s`);
      content.style.animationFillMode = animationFillMode;
      
      if (animationTimingFunction) {
        content.style.animationTimingFunction = animationTimingFunction;
      }
  
      // 触发开始回调
      if (onStart && typeof onStart === 'function') {
        setTimeout(() => {
          onStart();
        }, 0);
      }
  
      // 监听动画结束事件
      const handleAnimationEnd = () => {
        // 触发完成回调
        if (onComplete && typeof onComplete === 'function') {
          onComplete();
        }
        
        // 清理事件监听
        content.removeEventListener('animationend', handleAnimationEnd);
      };
      
      // 添加事件监听
      content.addEventListener('animationend', handleAnimationEnd);
      
      // 兜底：如果动画结束事件没有触发，确保回调执行
      const fallbackTimer = setTimeout(() => {
        content.removeEventListener('animationend', handleAnimationEnd);
        if (onComplete && typeof onComplete === 'function') {
          onComplete();
        }
      }, animationDuration + animationDelay + 100); // 额外100ms作为缓冲
      
      // 返回清理函数
      return () => {
        clearTimeout(fallbackTimer);
        content.removeEventListener('animationend', handleAnimationEnd);
      };
    }
  }