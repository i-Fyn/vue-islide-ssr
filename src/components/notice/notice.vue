<script setup>
import { computed, onBeforeUnmount, ref,onMounted } from 'vue'
import { islideSetCookie, islideGetCookie } from '@/dist/theme';
import { useRouter } from 'vue-router';
const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    close : {
        type: Function,
        default: () => {}
    }
})
const emit = defineEmits(['loadinged','close-modal'])
const locked = ref(false)
const router = useRouter()

const buttons = computed(() => {
    return props.data.buttons?.length > 0
        ? props.data.buttons
        : [{ text: '查看详情', link: props.data.href }]
})

const handleButtonClick = (button) => {
    markAsRead()
    props.close();
    emit('close-modal')
    if (button.link) {
        router.push(button.link)
    }
}

const markAsRead = () => {
    const currentNotice = props.data.id
    const currentTimeStamp = parseInt(new Date().getTime() / 1000)

    let readNotices = decodeURIComponent(islideGetCookie('read_notices'))
    if (!readNotices || readNotices === '[]' || readNotices === 'null') {
        readNotices = '{}'
    }

    readNotices = JSON.parse(readNotices)
    readNotices[currentNotice] = currentTimeStamp
    islideSetCookie('read_notices', JSON.stringify(readNotices))
}

onMounted(() => {
    emit('loadinged')
})

// 组件销毁时调用
onBeforeUnmount(() => {
    markAsRead()
})
</script>

<template>
    <div class="card min-w-80 bg-base-100">
        <!-- 背景图片区域 -->
        <figure v-if="data.thumb" class="relative h-30">
            <img :src="data.thumb" class="w-full h-full object-cover" />
            <div class="absolute inset-0  bg-opacity-40 backdrop-blur-sm"></div>
        </figure>
        <figure v-else class="relative h-30 bg-gradient-to-br from-primary to-secondary opacity-80">
            <img src="/assets/image/notice-modal-bg.png" class="w-full h-full object-cover mix-blend-overlay" />
        </figure>

        <!-- 内容区域 -->
        <div class="card-body bg-base-100">
            <h2 class="card-title text-base-content line-clamp-1">{{ data.title }}</h2>
            <p class="text-sm text-neutral-content">{{ data.date }}</p>
            <div class="prose prose-sm text-base-content line-clamp-2" v-html="data.desc"></div>
            
            <!-- 按钮区域 -->
            <div class="card-actions justify-end mt-4">
                <button 
                    v-for="(item, index) in buttons" 
                    :key="index"
                    @click="handleButtonClick(item)"
                    class="btn btn-primary btn-sm"
                >
                    {{ item.text }}
                </button>
            </div>
        </div>
    </div>
</template>