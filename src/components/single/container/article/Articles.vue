<template>
    <ClientOnly>
        <div v-lazy-container="{ selector: 'img' }" ref="articleRef" class="article-content p-4 text-sm"
            v-html="postDetail.content.content">
        </div>
    </ClientOnly>
    <div v-if="show" class="article-content will-change-auto p-4" v-html="postDetail.content.content"></div>

</template>

<script setup>
import { ref, nextTick, onMounted, onServerPrefetch, createApp, watch } from 'vue'
import ClientOnly from '../../../other/ClientOnly.vue';
import ArticleHide from './ArticleHide.vue';
import { Image as VanImage, Lazyload as VanLazyload } from 'vant';
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css' // 任选一种主题

const props = defineProps({
    postDetail: Object,
})

const show = ref(false)

onServerPrefetch(() => {
    show.value = true
})


const articleRef = ref(null)

watch(() => props.postDetail.content.content, async () => {
    await nextTick()
    if (typeof window === 'undefined') return
    if (articleRef.value && props.postDetail.content.content.includes('pre')) {
        addActionBar()
        document.querySelectorAll('pre code').forEach((el) => {
            hljs.highlightElement(el)
        })
    }
    
    // 添加文章内容的滚动动画
    addScrollAnimateToContent()
}, { immediate: true })

// 为文章内容的主要元素添加滚动动画
const addScrollAnimateToContent = () => {
    if (!articleRef.value || typeof window === 'undefined') return
    
    // 使用IntersectionObserver为内容元素添加动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-animate', 'fade-in-up')
                entry.target.style.visibility = 'visible'
                observer.unobserve(entry.target)
            }
        })
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    })
    
    // 选择要观察的元素类型
    const contentSelectors = [
        'p:not(:has(img))', // 段落（不包含图片的）
        'h2, h3, h4, h5, h6', // 标题
        'ul, ol', // 列表
        'blockquote', // 引用
        '.pre-wrapper', // 代码块
        'table', // 表格
    ]
    
    // 为每个元素设置初始状态并开始观察
    contentSelectors.forEach(selector => {
        const elements = articleRef.value.querySelectorAll(selector)
        elements.forEach((el, index) => {
            // 设置初始状态
            el.style.visibility = 'hidden'
            el.style.animationDelay = `${index * 50}ms`
            // 开始观察
            observer.observe(el)
        })
    })
    
    // 为图片添加特殊动画
    const images = articleRef.value.querySelectorAll('p:has(img)')
    images.forEach((el, index) => {
        el.style.visibility = 'hidden'
        el.style.animationDelay = `${index * 100}ms`
        el.classList.add('scroll-animate', 'zoom-in')
        observer.observe(el)
    })
}

const actionBarHTML = `
  <div class="action-bar absolute right-2 top-2 flex flex-row gap-2 z-10">
    <div class="px-2 py-1 bg-gray-100 rounded-md cursor-pointer text-sm hover:bg-gray-200">复制</div>
    <div class="px-2 py-1 bg-gray-100 rounded-md cursor-pointer text-sm hover:bg-gray-200">全选代码</div>
  </div>
`;


const addActionBar = () => {
    const pres = Array.from(articleRef.value.querySelectorAll('pre'));
    pres.forEach((pre) => {
        if (pre.parentElement?.classList.contains('code-wrapper')) return;

        // 创建 wrapper div
        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper relative';
        pre.parentElement.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        // 插入操作栏
        const barWrapper = document.createElement('div');
        barWrapper.innerHTML = actionBarHTML;
        const bar = barWrapper.firstElementChild;
        wrapper.appendChild(bar);

        const [copyBtn, selectBtn] = bar.querySelectorAll('div');
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(pre.innerText).then(() => {
                copyBtn.textContent = '已复制';
                setTimeout(() => (copyBtn.textContent = '复制'), 1000);
            });
        });

        selectBtn.addEventListener('click', () => {
            const range = document.createRange();
            range.selectNodeContents(pre);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        });
    });

}


onMounted(async () => {
    await nextTick()

    const hideContentList = props.postDetail.content?.content_hide?.content || []

    if (!Array.isArray(hideContentList) || hideContentList.length === 0) return

    const blocks = articleRef.value.querySelectorAll('.content-hide-block[data-id]')
    blocks.forEach((el) => {
        const id = parseInt(el.dataset.id)
        const content = hideContentList[id]

        if (content !== undefined) {
            // 创建挂载节点
            const mountNode = document.createElement('div')
            el.replaceWith(mountNode)
            // 动态挂载组件
            const rolesData = {
                ...props.postDetail.content.content_hide, // 复制整体结构
                content // 只替换当前的 content
            }
            const app = createApp(ArticleHide, {
                roles: rolesData,
            }).use(VanImage).use(VanLazyload, {
                attempt: 3,
                observer: true,
                observerOptions: {
                    rootMargin: '0px',
                    threshold: 0
                },
                lazyComponent: true,
                adapter: {
                    loaded({ el }) {
                        // **确保图片真正加载完成**
                        el.onload = () => {
                            el.classList.add("loaded");
                        };

                        // **防止 onload 不触发，确保 fallback**
                        if (el.complete) {
                            el.classList.add("loaded");
                        }
                    }
                }
            })

            app.mount(mountNode)
        }
    })
    
    // 在挂载后添加滚动动画
    addScrollAnimateToContent()
})

</script>
