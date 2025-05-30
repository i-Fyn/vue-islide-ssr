<template>
    <slot></slot>
    <div class="topic-list flex flex-wrap gap-3 items-center not-last: justify-center content-end lg:content-center cursor-pointer" v-if="item['circle'] && item['circle']['id']">
        <a class="topic-item circle pr-3 pl-2 h-7 leading-5  rounded-4xl text-sm text-base-content flex items-center gap-1 bg-primary/10"
            @click="router.push({ name: 'circles', params: { circle_id: item['circle']['id'] } })">
            <i class="ri-donut-chart-line text-primary"></i>
            {{ item['circle']['name'] }}
        </a>
    </div>
</template>

<script setup>


import { useRouter } from 'vue-router'

defineProps({
    item: {
        type: Object,
        required: true
    }
})

const router = useRouter()


</script>