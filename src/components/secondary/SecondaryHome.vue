<template>
    <div id="secondary" class="widget-area hidden lg:block space-y-4" v-if="!isMobile && config.islide_template_index[props.k].widget_show == '1'" >
        <Suspense>
            <template #default>
                <component v-for="(widget, index) in config.islide_template_index[props.k]['widget_select'].enabled" :is="widgetMap[index]" :key="index" />
            </template>
            <template #fallback>
                <div class="widget-loading space-y-6">
                    <div v-for="i in Object.keys(config.islide_template_index[props.k]['widget_select'].enabled).length" :key="i" 
                        class="widget-skeleton bg-base-200 animate-pulse rounded-lg p-4 h-32">
                    </div>
                </div>
            </template>
        </Suspense>
    </div>
</template>


<script setup>
import {   defineAsyncComponent,computed,onMounted } from 'vue'
import { useIsMobile } from '@/dist/mobile'
const { isMobile } = useIsMobile()
import { useStore } from '@/store';
const store = useStore();

const config = computed(() => store.config);

const props = defineProps({
k: {
        type: Number,
        default: 0
    }
})

const widgetMap = {
    'author': defineAsyncComponent(() => import('@/components/widget/widgetAuthor.vue')),
    'sponsor': defineAsyncComponent(() => import('@/components/widget/widgetSponsor.vue')),
    'hotArticle': defineAsyncComponent(() => import('@/components/widget/widgetHotArticle.vue')),
    'tagCloud': defineAsyncComponent(() => import('@/components/widget/widgetTags.vue')),
}


    onMounted(() => {
        console.log(config.value['islide_template_index'][props.k].widget_show);
    })


</script>