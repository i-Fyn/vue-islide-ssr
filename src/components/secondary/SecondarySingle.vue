<template>
    <aside id="secondary" class="widget-area hidden lg:block lg:w-[var(--sidebar-width)] min-w-[var(--sidebar-width)] h-fit space-y-4" >
        <Suspense>
            <template #default>
                <component 
                v-for="(widget, index) in enabled" 
                :key="index"
                :is="widgetMap[index]"   
                v-bind="getWidgetProps(index, widget)"
                />
            </template>
            <template #fallback>
                <div class="widget-loading space-y-6">
                    <div v-for="i in Object.keys(enabled).length" :key="i" 
                        class="widget-skeleton bg-base-200 animate-pulse rounded-lg p-4 h-32">
                    </div>
                </div>
            </template>
        </Suspense>
    </aside>
</template>


<script setup>
import {   defineAsyncComponent,onMounted,ref } from 'vue'

import { useIsMobile } from '@/dist/mobile'
const { isMobile } = useIsMobile()

const props = defineProps({
    enabled: {
        type: Object,
        default: {}
    },
    postDetail:{
        type: Object,
        default: {}
    }
})

const getWidgetProps = (name, widget) => {
  switch (name) {
    case 'content':
      return { postDetail: props.postDetail };
    default:
      return {};
  }
};

const widgetMap = {
    'hotTopic': defineAsyncComponent(() => import('@/components/widget/widgetHotTopic.vue')),
    'hotCircle': defineAsyncComponent(() => import('@/components/widget/widgetHotCircle.vue')),
    'author': defineAsyncComponent(() => import('@/components/widget/widgetAuthor.vue')),
    'sponsor': defineAsyncComponent(() => import('@/components/widget/widgetSponsor.vue')),
    'content': defineAsyncComponent(() => import('@/components/widget/widgetContent.vue')),
    'download': defineAsyncComponent(() => import('@/components/widget/widgetDownload.vue')),
    'tagCloud': defineAsyncComponent(() => import('@/components/widget/widgetTags.vue')),
    'archive': defineAsyncComponent(() => import('@/components/widget/widgetArchive.vue')),
    'category': defineAsyncComponent(() => import('@/components/widget/widgetCats.vue')),
}




</script>

<style>

.sticky-sidebar {
    position: sticky;
    top: var(--top-menu-height);
    height: fit-content;
}
</style>