<template>
    <div class="video-nplayer">
        <NPlayer :options="playerOptions" :set="setPlayer" />
    </div>
</template>

<script setup>
import { onMounted, ref, watch, onBeforeUnmount, computed } from "vue";
import axios from "@/dist/axios";
import { getRootColor } from '@/dist/theme'
import Danmaku from '@nplayer/danmaku'
import { createMessage as message } from '@/dist/message';
const emit = defineEmits(['play', 'pause', 'ended', 'loaded', 'mounted']);

const props = defineProps({
    autoplay: {
        type: Boolean,
        default: false
    },
    videoList: {
        type: Array,
        default: () => []
    },
    videoIndex: {
        type: Number,
        default: 0
    },
    theme: {
        type: String,
        default: 'var(--islide-main)'
    }
});

// 弹幕设置
const danmakus = ref([]);
const danmakuOptions = {
    items: danmakus,
    autoInsert: true,
    disable: false,
    blocked: [],
    fontsize: 24,
    fontsizeScale: 1,
    opacity: 1,
    speed: 1,
    area: 0.5,
    unlimited: false,
    bottomUp: false,
    colors: [
        '#FE0302', '#FF7204', '#FFAA02', '#FFD302', '#FFFF00', 
        '#A0EE00', '#00CD00', '#019899', '#4266BE', '#CC0273', 
        '#222222', '#FFFFFF'
    ],
    duration: 5,
    zIndex: 5,
    persistOptions: false,
    isDefaultColor: (color) => {
        if (!color) return true;
        return color.toLowerCase() === '#fff' || color.toLowerCase() === '#ffffff';
    },
    maxPerInsert: 20,
    poolSize: 50,
    discard: () => false,
};

// 播放器状态
const themeColor = ref(props.theme);
const loadDanmaku = ref(false);
const player = ref(null);

// 播放器配置
const playerOptions = computed(() => ({
    src: props.videoList[props.videoIndex]?.url || '',
    videoProps: { autoplay: props.autoplay },
    plugins: [new Danmaku(danmakuOptions)],
    controls: [['spacer', 'danmaku-settings'], ['progress']],
    themeColor: themeColor.value,
    progressBg: themeColor.value,
    volumeProgressBg: themeColor.value,
}));

// 播放器事件处理
const setPlayer = (el) => {
    player.value = el;

    const events = {
        'LoadedMetadata': () => emit('loaded'),
        'Mounted': () => emit('mounted'),
        'Play': () => {
            emit('play');
            if (!loadDanmaku.value) {
                getDanmaku();
            }
        },
        'Pause': () => emit('pause'),
        'Ended': () => emit('ended'),
        'DanmakuSend': (opts) => sendDanmaku(opts)
    };

    // 注册所有事件
    Object.entries(events).forEach(([event, handler]) => {
        player.value.on(event, handler);
    });
};

// 获取弹幕
const getDanmaku = async () => {
    try {
        const videoId = props.videoList[props.videoIndex]?.id;
        if (!videoId) return;

        const res = await axios.get(`/getDanmaku?cid=${videoId}`);
        
        if (Number(res.data.count) > 0) {
            danmakus.value = [...danmakus.value, ...res.data.danmaku];
            player.value.danmaku.resetItems(danmakus.value);
        } else {
            player.value.danmaku.resetItems([{ time: 2, text: '赶紧来围观！' }]);
        }
        
        loadDanmaku.value = true;
    } catch (error) {
        console.error('获取弹幕失败', error);
        loadDanmaku.value = true;
    }
};

// 发送弹幕
const sendDanmaku = async (obj) => {
    const currentVideo = props.videoList[props.videoIndex];
    if (!currentVideo?.id) return;
    
    const data = { 
        cid: currentVideo.id, 
        post_id: currentVideo.post_id, 
        type: obj.type, 
        text: obj.text, 
        time: obj.time, 
        color: obj.color 
    };
    
    try {
        await axios.post('/sendDanmaku', data);
    } catch (error) {
        console.error('发送弹幕失败', error);
    }
};

// 切换视频
const switchVideo = (index) => {
    if (!player.value) return message({ message: '播放器初始化失败', type: 'warning' });
    
    
    const videoSrc = props.videoList[index]?.url;
    if (!videoSrc) return message({ message: '视频源不存在', type: 'warning' });
    
    player.value.video.src = videoSrc;
    loadDanmaku.value = false;
    
    if (!props.autoplay) {
        player.value.pause();
    }
};

// 生命周期钩子
onMounted(() => {
    themeColor.value = getRootColor(props.theme);
    loadDanmaku.value = false;
    
    // 初始暂停处理
    if (player.value) {
        player.value.pause();
    }
});

onBeforeUnmount(() => {
    if (player.value) {
        player.value.dispose();
    }
});

// 监听视频列表变化
watch(() => props.videoList, (newVal) => {
    if (newVal.length > 0 && player.value) {
        switchVideo(props.videoIndex);
    }
}, { deep: true });

// 监听主题变化
watch(() => props.theme, (newVal) => {
    themeColor.value = getRootColor(newVal);
});

// 监听视频索引变化
watch(() => props.videoIndex, (newVal) => {
    if (props.videoList.length > 0 && player.value) {
        switchVideo(newVal);
    }
});

// 暴露方法
defineExpose({
    switchVideo,
    player,
});
</script>

<style>
.islide-player-wrap .islide-player-box {
    position: relative;
    height: 0px;
    padding-top: calc(56.25%);
    border-radius: 12px;
    overflow: hidden;
}

.video-nplayer {
    position: absolute;
    top: 0;
    border-radius: var(--radius-box);
    left: 0;
    height: 100%;
    width: 100%;
    padding: 1rem;
}
.nplayer_video,.nplayer{
    border-radius: var(--radius-box);
    overflow: hidden;
}

.nplayer_toast .desc {
    font-size: 12px;
    line-height: 13px;
    opacity: .6;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 8px;
}

.nplayer_toast {
    font-size: 14px;
    border-radius: 4px;
    padding: 7px 16px !important;
}

.video-nplayer .prompt-bar-container {
    display: flex;
    align-items: center;
    grid-gap: 16px;
}
</style>