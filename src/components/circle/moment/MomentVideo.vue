<template>
    <div class="moment-video-wrap" v-if="item['attachment']['video'].length"
        :video-id="item['attachment']['video'][0]['post_id']" :style="getVideoStyle(item['attachment']['video'])">
        <div class="video-player-card" :style="getVideoStyle_(item['attachment']['video'])">
            <VideoWrap :data-video-id="item['attachment']['video'][0]['post_id']"
                v-show="videoPlayId == item['attachment']['video'][0]['post_id']" :play="playStatus"
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
                :video-info="item['attachment']['video'][0]" @ended="videoEnded" />
            <div class="video-poster" v-show="videoPlayId != item['attachment']['video'][0]['post_id']">

                <div class="video-image">
                        <van-image lazy-load  :src="item['attachment']['video'][0]['poster']"  alt="poster"  style="width: 100%; height: 100%;"  />
                </div>
                <div class="video-play-btn">
                    <div class="play-btn" @click="palyVideo(item['attachment']['video'][0]['post_id'])"><i
                            class="ri-play-fill"></i></div>
                </div>
                <div class="video-info">
                    <div class="left">{{ item['attachment']['video'][0]['duration'] }}</div>
                    <!--<div class="info-right"><i class="ri-play-circle-line"></i>2 万</div>-->
                </div>

            </div>

            <a class="video-poster" target="_blank" v-show="!videoPlayId">
                <div class="video-image">
                        <van-image lazy-load  :src="item['attachment']['video'][0]['poster']"  alt="poster"  style="width: 100%; height: 100%;" />
                </div>
                <div class="video-play-btn">
                    <div class="play-btn" @click="palyVideo(item['attachment']['video'][0]['post_id'])"><i
                            class="ri-play-fill"></i></div>
                </div>
                <div class="video-info">
                    <div class="left">{{ item['attachment']['video'][0]['duration'] }}</div>
                    <!--<div class="info-right"><i class="ri-play-circle-line"></i>2 万</div>-->
                </div>
            </a>
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue'
import VideoWrap from '@/components/video/Video.vue'
const videoPlayId = ref(null);
const playStatus = ref(false);

const props = defineProps({
    item: {
        type: Object,
    }
})

const videoEnded = () => {
    videoPlayId.value = null;
    playStatus.value = false
}

const palyVideo = (id) => {
    const videoEl = document.querySelector(`[data-video-id="${id}"]`)
    if (videoEl) {
        videoPlayId.value = id;
    }
    playStatus.value = !playStatus.value;
}


const getVideoStyle = (video) => {
    var videoRatio = '';
    if (video[0]['height'] && video[0]['width']) {
        if (video[0].width < video[0].height) {
            videoRatio = Math.round((video[0].height / video[0]['width']) * 100000) / 100000;
        }
    }
    if (videoRatio) {
        return "max-width: 274px;";
    } else {
        return '';
    }

}


const getVideoStyle_ = (video) => {
    var videoRatio = '';
    if (video[0]['height'] && video[0]['width']) {
        if (video[0].width < video[0].height) {
            videoRatio = Math.round((video[0].height / video[0]['width']) * 100000) / 100000;
        }
    }
    if (videoRatio) {
        return "padding-bottom:" + (videoRatio * 100) + "%;";
    } else {
        return '';
    }

}


</script>
