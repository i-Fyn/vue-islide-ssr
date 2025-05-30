<template>
    <div class="waterfall-container w-full min-h-25 mb-8" ref="containerRef"
       
        :class="{ 'grid-layout': !enabled && isClient}"
        :style="getContainerStyle()">
        <div v-for="(item, index) in items" :key="index" 
            class="waterfall-item will-change-transform invisible" 
            :style="getItemStyle(index)">
            <slot :item="item" :index="index" />
        </div>
    </div>
    <div :class="{ 'opacity-0': !isChange }">
        <slot name="pagination" />
    </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted, computed, onActivated } from 'vue';
import { addAnimation } from './composables/addAnimation';

const props = defineProps({
    items: Array,
    column: {
        type: Number,
        default: 1
    },
    gap: {
        type: Number,
        default: 12
    },
    enabled: {
        type: Boolean,
        default: true
    }
});

const containerRef = ref(null);
const columnWidth = ref('100%');
const itemPositions = ref([]);
const isClient = ref(false);
const isChange = ref(false);
const enabled = ref(props.enabled);




watch(() => props.enabled, (newVal) => {
    enabled.value = newVal;
    onResize();
}, { immediate: true });

// 更新列宽
function computeColWidth() {
    if (!containerRef.value) return;
    const containerWidth = containerRef.value.clientWidth || 1200;
    columnWidth.value = Math.floor((containerWidth - (props.column - 1) * props.gap) / props.column);
}

// 获取容器样式
const getContainerStyle = () => {
    if (!enabled.value || !isClient.value) {
        return {
            display: 'grid',
            gridTemplateColumns: `repeat(${props.column}, minmax(0, 1fr))`,
            gap: `${props.gap}px`,
            gridAutoRows: '1fr',
            alignItems: 'stretch'
        };
    }
    return {
        position: 'relative',
        marginBottom: 'var(--top-menu-height)'
    };
};

// 重点：重新改造精准布局
function updatePositions() {
    if (!isClient.value || !containerRef.value) return;
    const container = containerRef.value;
    const children = container.querySelectorAll('.waterfall-item');
    if (!enabled.value) {
        console.log(children.length,'children')
        container.style.height = '';
        if (!children.length) return;
        
        for (let i = 0; i < children.length; i++) {
            console.log(i,'children')
            const el = children[i];
            if (el && el.firstElementChild) {
                addAnimation(el.firstElementChild, {
                    animationPrefix: 'animate__animated',
                    animationEffect: 'animate__fadeIn',
                    animationDuration: 1000,
                    animationDelay: 300
                });
            }
        }
        setTimeout(() => {
            isChange.value = true;
        }, 300);
        return;
    }else{
        console.log('children.length',children.length)
    }

    if (!children.length) {
        console.log('children.length',children.length)
        setTimeout(() => {
            isChange.value = true;
        }, 300);
        return;
    }

    const heights = new Array(props.column).fill(0);
    const newPositions = [];

    let hasVisibleElements = false;
    let animationsApplied = false;

    for (let i = 0; i < children.length; i++) {
        const el = children[i];
        if (!el) continue;

        // 检查元素是否可见
        if (el.offsetHeight > 0) {
            hasVisibleElements = true;
        }

        // 找到最矮的列
        const shortestCol = heights.indexOf(Math.min(...heights));
        const top = heights[shortestCol];
        const left = shortestCol * (columnWidth.value + props.gap);

        newPositions[i] = { top, left };

        // 更新该列高度（item真实高度 + gap）
        heights[shortestCol] += el.offsetHeight + props.gap;

        // 只在第一次应用动画，避免多次触发动画
        if (!animationsApplied && el.firstElementChild && !el.firstElementChild.classList.contains('animate__animated')) {
            try {
                addAnimation(el.firstElementChild, {
                    animationPrefix: 'animate__animated',
                    animationEffect: 'animate__fadeIn',
                    animationDuration: 1000,
                    animationDelay: 300
                });
            } catch (error) {
                console.error('添加动画失败:', error);
            }
        }
    }
    
    // 标记已应用动画
    animationsApplied = true;
     
    itemPositions.value = newPositions;
    container.style.height = Math.max(...heights) + 'px';
    
    
    // 如果所有元素高度为0，可能是图片还没加载，设置一个兜底高度
    if (!hasVisibleElements && props.items.length > 0) {
        container.style.height = '200px'; // 临时高度，等待实际内容加载
        
        // 使用一个变量跟踪是否已添加观察器，避免重复添加
        if (!container._hasObserver) {
            container._hasObserver = true;
            
            // 注册一个MutationObserver来监视DOM变化
            const observer = new MutationObserver((mutations) => {
                let shouldUpdate = false;
                mutations.forEach(mutation => {
                    if (mutation.type === 'attributes' || mutation.type === 'childList') {
                        shouldUpdate = true;
                    }
                });
                
                if (shouldUpdate) {
                    // 使用节流函数避免过于频繁的更新
                    throttledResize();
                }
            });
            
            observer.observe(container, { 
                attributes: true, 
                childList: true, 
                subtree: true,
                attributeFilter: ['style', 'class']
            });
            
            // 10秒后断开观察以避免内存泄漏
            setTimeout(() => {
                observer.disconnect();
                container._hasObserver = false;
            }, 10000);
        }
    }
    
    setTimeout(() => {
        isChange.value = true;
    }, 300);
}

// 动态 item 样式
const getItemStyle = (index) => {
    if (!enabled.value || !isClient.value) {
        return {
            width: '100%',
            height: '100%',
            position: 'relative',
            top: 'auto',
            left: 'auto',
            transform: 'none',
            transition: 'none',
            visibility: 'visible',
            display: 'flex',
            flexDirection: 'column'
        };
    }

    return {
        width: columnWidth.value + 'px',
        position: 'absolute',
        top: 0,
        left: 0,
        transform: `translate3d(${itemPositions.value[index]?.left ?? 0}px, ${itemPositions.value[index]?.top ?? 0}px, 0)`,
        visibility: 'visible',
    };
};

// 优化监听逻辑
watch(() => props.items, async () => {
    isChange.value = false;
    await nextTick();
    onResize();
}, { deep: true });

watch(() => columnWidth.value, onResize);

watch(() => enabled.value, () => {
    nextTick(() => {
        onResize();
    });
});

// resize监听
function onResize() {
    if (!isClient.value) return;
    computeColWidth();
    updatePositions();
}

// 添加节流函数
function throttle(fn, wait) {
    let last = 0;
    let timer = null;
    
    return function(...args) {
        const now = Date.now();
        
        if (now - last < wait) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                last = now;
                fn.apply(this, args);
            }, wait - (now - last));
        } else {
            last = now;
            fn.apply(this, args);
        }
    };
}

// 节流后的resize函数
const throttledResize = throttle(onResize, 100);


onMounted(() => {
    isClient.value = true;
    isChange.value = false;
    window.addEventListener('resize', throttledResize, { passive: true });
    window.addEventListener('scroll', throttledResize, { passive: true });
    onResize();
});

onActivated(() => {
    onResize();
});

onUnmounted(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener('resize', throttledResize);
        window.removeEventListener('scroll', throttledResize);
    }
});

// 暴露方法给父组件
defineExpose({
    onResize,
    throttledResize
});

</script>

<style scoped>
.grid-layout {
    display: grid !important;
}

.grid-layout .waterfall-item {
    break-inside: avoid;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.grid-layout .waterfall-item > :first-child {
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>