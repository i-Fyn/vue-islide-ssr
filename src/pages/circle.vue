<template>
    <div class="single-page">
    <div class="wrapper flex">
        <CircleSideBar type="home" @cangeTabs="changeTab" v-if="config.circle_home_left_sidebar == '1' && !isMobile" />
        <div class="content-area bg-base-100 rounded-md min-h-[calc(100vh-var(--top-menu-height)-8px)] lg:min-h-[calc(100vh-var(--top-menu-height)-16px)]">
            <CircleMoment :tabSelector="tabSelector" />
        </div>
        <Secondary :enabled="config.circle_home_layout.sidebar_select.enabled"
            class="ml-4 !sticky top-0"
            v-if="!isMobile && config.circle_home_layout.sidebar_open == '1'" />
    </div>
</div>
</template>


<script setup>

import { ref, reactive, computed, defineAsyncComponent, onActivated, onDeactivated } from 'vue'
import CircleMoment from '@/components/circle/CircleMoment.vue';
import CircleHeader from '@/components/circle/CircleHeader.vue';
import { useStore } from '@/store';
import { useHead, useSeoMeta } from '@unhead/vue';
import { useIsMobile } from '../dist/mobile';

const Secondary = defineAsyncComponent(() => import('@/components/secondary/SecondarySingle.vue'))
const CircleSideBar = defineAsyncComponent(() => import('@/components/circle/CircleSideBar.vue'))

defineOptions({
    name: 'circleHome'
})

const tax = ref(0)
const tabSelector = reactive({})
const store = useStore()
const config = computed(() => store.config)
const { isMobile } = useIsMobile()


useSeoMeta({
    title: computed(() => config.value.circle_name + config.value.separator + config.value.blog_name),
    description: computed(() => config.value.circle_description),
    ogDescription: computed(() => config.value.circle_description),
    ogTitle: computed(() => config.value.circle_name + config.value.separator + config.value.blog_name),
    ogImage: computed(() => config.value.img_logo),
    ogType: 'article',
    ogUrl: computed(() => '/circle'),
})


const changeTab = (index, selector) => {
    tabSelector['index'] = index;
    tabSelector['select'] = selector;
}

const changeTabHandler = (index, tabName) => {
    changeTab(index, tabName);
}

</script>
