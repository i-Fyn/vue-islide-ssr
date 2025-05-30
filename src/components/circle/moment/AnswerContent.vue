<template>
    <ClientOnly>
        <div v-lazy-container="{ selector: 'img' }" ref="articleRef" class="answer-content overflow-hidden break-words"
            v-html="content">
        </div>
    </ClientOnly>
    <div v-if="show" class="answer-content will-change-auto overflow-hidden break-words" v-html="content"></div>

</template>

<script setup>
import { ref, nextTick, onServerPrefetch, watch } from 'vue'
import ClientOnly from '../../other/ClientOnly.vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css' // 任选一种主题

const props = defineProps({
    content: {
        type: String,
        default: ''
    },
})

const show = ref(false)

onServerPrefetch(() => {
    show.value = true
})


const articleRef = ref(null)

watch(() => props.content, async () => {
    await nextTick()
    if (typeof window === 'undefined') return
    if (articleRef.value && props.content.includes('pre')) {
        addActionBar()
        document.querySelectorAll('pre code').forEach((el) => {
            hljs.highlightElement(el)
        })
    }
}, { immediate: true })

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




</script>

<style>
.answer-content ul {
    list-style-type: disc;
}
.answer-content ol {
    list-style-type: decimal;
}
.action-bar>div{
    padding: 4px 8px !important;
}
</style>