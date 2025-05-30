<template>
    <div class="download-page wrapper box" style="--wrapper-width: 600px;" v-if="downloadData">
        <h1>{{ downloadData.title }}</h1>

        <div class="attrs">
            <div class="item" v-for="(item, index) in downloadData.attrs" :key="index">
                <span>{{ item.key }}</span>
                <span>{{ item.value }}</span>
            </div>
        </div>

        <div id="tabs" class="tabs">
            <ul class="tabs-nav">
                <li v-for="(link, index) in downloadData.links" :key="index" :class="{ active: currentTab === index }"
                    @click="currentTab = index">
                    {{ link.name }}
                </li>
                <div class="active-bar"></div>
            </ul>

            <div class="tabs-content">
                <div class="tab-pane" v-for="(link, index) in downloadData.links" :key="index"
                    :class="{ active: currentTab === index }">
                    <div class="attr">
                        <div class="tq" v-if="link.tq">
                            <span>提取码：</span>
                            <span class="bg-text">{{ link.tq }}</span>
                        </div>
                        <div class="jy" v-if="link.jy">
                            <span>解压码：</span>
                            <span class="bg-text">{{ link.jy }}</span>
                        </div>
                    </div>
                    <a class="button no-hover" :href="`?token=${link.token}`"
                        @click.prevent="getDownloadFile(link.token)">
                        <i class="ri-download-fill" style="font-size: 16px; line-height: 16px; margin-right: 6px;"></i>
                        下载
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/dist/axios' // 根据你的项目路径调整
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store'
import { createMessage as message } from '../dist/message'

const store = useStore()
const downloadData = ref(null)
const route = useRoute()
const router = useRouter()
const currentTab = ref(0)


const post_id = route.query.post_id || 0;
const index = route.query.index || 0;

const fetchDownloadData = async () => {
    try {
        const res = await axios.post('/getDownload', {
            post_id,
            index
        }) // 你后端的接口路径
        downloadData.value = res.data;
    } catch (err) {
        message({ message: '获取下载信息失败', type: 'error' })
        router.push({ name: 'home' })
    }
}

const getDownloadFile = async (token) => {
    try {
        let res = await axios.post('/getDownloadFile', {
            token
        })
        const a = document.createElement('a')
        a.href = res.data
        a.download = res.filename
        a.click()
    } catch (err) {
    }
}

onMounted(() => {
    if (post_id && index) {
        fetchDownloadData()
    }else{
        message({ message: '参数错误', type: 'error' })
        router.push({ name: 'home' })
    }
})
</script>