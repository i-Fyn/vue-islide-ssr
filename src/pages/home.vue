<template>
    <div  class="content-area">
        <div v-for="(module, index) in config.islide_template_index" :id="'home-item-' + module['key']"
            :class="['home-item', 'home-item-' + index, 'module-' + module['module_type'], 'mb-4']"
            v-show="moduleShow(isMobile,module) && defer(index)">
            <div  class="flex flex-row flex-nowrap" :class="{ 'wrapper': (!module.fullscreen || module.fullscreen !== '1') && module.module_type !== 'xingdu' }">
                <component :is="getModules(module.module_type)" :module="module" class="flex-1" />
                <SecondaryHome class="ml-4" :k="index" :key="index" v-if="module.widget_show == '1'" />
            </div>
        </div>
    </div>
</template>
<script setup>
import {defineAsyncComponent, onMounted, computed } from 'vue';
import { useStore } from '@/store';
import { useSeoMeta } from '@unhead/vue';
import { useIsMobile } from '../dist/mobile';

import HomeHeader from '@/components/home/HomeHeader.vue';
import HomePosts from '@/components/home/HomePosts.vue'
import HomeIconSlide from '@/components/home/HomeIconSlide.vue'
import HomeHtml from '@/components/home/HomeHtml.vue';
import { useDefer } from '../dist/defer';

const getModules = (type) => {
  switch (type) {
    case 'html':
      return HomeHtml
    case 'posts':
      return HomePosts
    case 'hometop':
      return HomeIconSlide
    case 'xingdu':
      return HomeHeader
    case 'sliders':
      return false;//HomeSwiper
  }
}

defineOptions({
    name: 'Home',
});

const {isMobile} = useIsMobile();
const SecondaryHome = defineAsyncComponent(() => import('@/components/secondary/SecondaryHome.vue'))
const defer = useDefer();
const store = useStore();

const config = store.config;

const moduleShow = (is,module) => {

    if (is && (module.module_mobile_show == '0' || module.module_mobile_show == '2')) {
        return true;
    }

    if (module.module_mobile_show == '3') {
        return false;
    }

    if (!is && (module.module_mobile_show == '0' || module.module_mobile_show == '1')) {
        return true;
    }

}

useSeoMeta({
  title: computed(() => config.blog_name),
  description: computed(() => config.home_description),
  ogDescription: computed(() => config.home_description),
  ogTitle: computed(() => config.blog_name),
  ogImage: computed(() => config.img_logo),
  ogType: 'website',
  ogUrl: computed(() => import.meta.env.VITE_BASE_URL),
})

onMounted(() => {
    store.center_title = config.blog_name;
    console.log(config.islide_template_index);
})


</script>

