<template>
    <NPlayer :options="playerOPtions" :set="setPlayer" />
</template>
<script setup>
import { ref,watch,onBeforeUnmount } from "vue";
import axios from "@/dist/axios";
import Danmaku from '@nplayer/danmaku'

const emit = defineEmits(['play','pause','ended']);
const props = defineProps({
    id: {
        type: [String, Number],
    },
    videoInfo: {
        type: Object,
    },
    play:{
        type: Boolean,
        default: false
    }
});
const danmakus = ref([
    ]);
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
    colors: ['#FE0302', '#FF7204', '#FFAA02', '#FFD302', '#FFFF00', '#A0EE00', '#00CD00', '#019899', '#4266BE', '#CC0273', '#222222', '#FFFFFF'],
    duration: 5,
    zIndex: 5,
    persistOptions: false,
    isDefaultColor(color) {
        if (!color) return true;
        color = color.toLowerCase();
        return color === '#fff' || color === '#ffffff';
    },
    maxPerInsert: 20,
    poolSize: 50,
    discard() { return false; },

}

const playStatus = ref(props.play);
const loadDanmaku = ref(false);


let player = ref(null);

const playerOPtions = ref({
    src: "",
    videoProps: { autoplay: false },
    plugins: [new Danmaku(danmakuOptions)],
    controls: [['spacer', 'danmaku-settings'], ['progress']],
    themeColor: 'var(--islide-main)',
    progressBg: 'var(--islide-main)',
    volumeProgressBg: 'var(--islide-main)',
})

const setPlayer = (p) => {
    player.value = p;
    player.value.on('Play', () => {
        emit('play')
    })

    player.value.on('Pause', () => {
        emit('pause')
    })

    player.value.on('Ended', () => {
        emit('ended')
    })

    player.value.on('DanmakuSend', (opts) => {
       sendDanmaku(opts)
    })
}



const getDanmaku = () => {
    axios.get('/getDanmaku?cid=' + props.videoInfo.id).then(res => {
    if(Number(res.data.count) > 0){
     danmakus.value =[...danmakus.value, ...res.data.danmaku];
     player.value.danmaku.resetItems(danmakus.value)
    }else{
     player.value.danmaku.resetItems([{ time: 2, text: '赶紧来围观！' }])
    }
    }).catch(err => {
        // console.log(err)
    })
}

const sendDanmaku = (obj) => {

var data = {"cid":props.videoInfo.id,"post_id":props.videoInfo.post_id,"type":obj.type,"text":obj.text,"time":obj.time,"color":obj.color}
axios.post('/sendDanmaku',data).then(res => {
   // console.log(res)
}).catch(err => {
   // console.log(err)
})
}


onBeforeUnmount(() => {
    player.value && player.value.dispose()
})


watch (() => props.play, (newVal, oldVal) => {
playStatus.value = newVal;
if(playStatus.value && !loadDanmaku.value){
    getDanmaku()
    loadDanmaku.value = true;
}
if (newVal !== oldVal){
    if (newVal) {
        player.value.video.src = props.videoInfo.url;
        player.value && player.value.play();
    } else {
        player.value && player.value.pause()
    }
}

})

</script>

<style>
.video-container {
    position: absolute;
    width: 100%;
    height: 100%;
}
</style>