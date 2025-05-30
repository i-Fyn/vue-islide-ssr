<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import axios from 'axios'
import { useStore } from '@/store'
import { createMessage as message } from '@/dist/message'
const store = useStore()

const props = defineProps({
  modelValue: Boolean,  // Vue3 v-model 命名变更
  target: String
})

const emit = defineEmits(['update:modelValue', 'emoji-click'])

// 响应式数据
const me_show = ref(props.modelValue)
const index = ref(0)
const page = ref(1)
const pages = ref(1)
const data = ref([])
const container = ref(null)  // 模板引用

// 获取表情数据
const fetchEmojiData = async () => {
  try {
    const response = await store.fetchEmojiList()
    data.value = response
    pages.value = Math.ceil(data.value.length / 5)
  } catch (err) {
    // 使用你的消息提示组件替换
    // message({ type: 'error', text: err.response?.data?.message || '请求失败' })
  }
}

// 计算定位
const calculatePosition = () => {
  nextTick(() => {
    if (!props.target || !container.value) return

    const targetElement = document.querySelector(props.target)
    const targetRect = targetElement.getBoundingClientRect()
    const parentElement = targetElement.parentElement.parentElement
    const parentRect = parentElement?.getBoundingClientRect() || { left: 0, top: 0 }

    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const componentWidth = container.value.offsetWidth
    const componentHeight = container.value.offsetHeight

    // 计算初始位置
    let left = targetRect.left - parentRect.left + window.pageXOffset
    let top = targetRect.top - parentRect.top + targetRect.height + window.pageYOffset

    // 边界处理
    const maxLeft = Math.max(windowWidth - componentWidth - 12, 12)
    const maxTop = Math.max(windowHeight - componentHeight - 12, 12)
    
    left = Math.min(Math.max(left, 12), maxLeft)
    top = Math.min(Math.max(top, 12), maxTop)

    container.value.style.left = `${left}px`
    container.value.style.top = `${top}px`
  })
}

// 标签切换
const changeTabs = (tabIndex) => {
  index.value = (page.value - 1) * 5 + tabIndex
}

// 分页控制
const prev = () => page.value > 1 && page.value--
const next = () => page.value < pages.value && page.value++

// 表情点击
const emojiClick = (emoji) => {
  emit('emoji-click', { ...emoji, size: data.value[index.value].size })
  me_show.value = false
}

// 监听显示状态变化
watch(() => props.modelValue, (val) => {
  me_show.value = val
  val && calculatePosition()
})

watch(me_show, (val) => {
  emit('update:modelValue', val)
})

// 生命周期
onMounted(() => {
  fetchEmojiData()
  window.addEventListener('resize', calculatePosition)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculatePosition)
})
</script>

<template>
  <div
    v-if="me_show && data.length"
    ref="container"
    class="absolute bottom-0  z-10 mt-2 w-[300px] rounded-lg border border-base-300 shadow-xl bg-base-100 text-sm text-gray-700"
    @click.stop
  >
    <!-- 表情包标题 -->
    <div class="px-4 py-2 border-b border-base-200 font-medium">
      {{ data[index].name }}
    </div>

    <!-- 表情区域 -->
    <ul :class="[
        'flex flex-wrap scroll-y overflow-x-hidden px-3 py-2 h-[196px]',
        data[index].size === 'small' ? 'emoji-small' : data[index].size === 'large' ? 'emoji-large' : ''
      ]">
      <li
        v-for="(item, i) in data[index].list"
        :key="i"
        class="cursor-pointer p-1 max-w-[20%] rounded hover:bg-gray-100 transition"
        :class="{
          'max-w-[12.5%]': data[index].size === 'small',
          'max-w-[25%]': data[index].size === 'large'
        }"
        @click="emojiClick(item)"
      >
        <van-image lazy-load :src="item.icon" :title="item.name" />
      </li>
    </ul>

    <!-- tab 和分页 -->
    <div class="flex justify-between items-center h-9 bg-base-200 border-t border-base-300 px-2">
      <ul class="flex space-x-1">
        <li
          v-for="(item, i) in data.slice((page - 1) * 5, page * 5)"
          :key="i"
          :class="[
            'w-8 h-8 rounded-md cursor-pointer overflow-hidden flex items-center justify-center',
            i === index % 5 ? 'bg-primary' : 'hover:bg-base-100 transition'
          ]"
          @click="changeTabs(i)"
        >
          <van-image lazy-load :src="item.list[0].icon" :title="item.name" />
        </li>
      </ul>
      <div v-if="pages > 1" class="flex space-x-2 text-sm">
        <div
          class="cursor-pointer select-none"
          :class="{ 'text-gray-400 cursor-not-allowed': page === 1 }"
          @click="prev"
        >
          ❮
        </div>
        <div
          class="cursor-pointer select-none"
          :class="{ 'text-gray-400 cursor-not-allowed': page === pages }"
          @click="next"
        >
          ❯
        </div>
      </div>
    </div>
  </div>
</template>