<template>
    <div class="back-warp box mobile-show">
        <div class="back-box">
            <div class="back" @click="goBack"><i class="ri-arrow-left-s-line"></i></div>
            <div class="page-title" @click="router.push({ name: path })">
                <span>{{ title }}</span>
            </div>
            <div class="right-box">
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

import { ref } from 'vue'
const router = useRouter()


const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    path: {
        type: String,
        default: 'home'
    },
    back: {
        type: Function,
    }
})


const goBack = props.back || (() => router.go(-1))


</script>

