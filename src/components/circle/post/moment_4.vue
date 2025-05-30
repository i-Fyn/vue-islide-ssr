<template>
    <article class="p-0 list-group-item border-b border-base-300 w-full h-full !block">
        <div class="py-2 sm:py-3 h-full">
            
            <!-- 右侧内容区 -->
            <div class="w-full flex flex-col justify-between h-full gap-2">
                <!-- 标题 -->
                <div class="flex items-start mb-2 sm:mb-3">
                    <h3 class="text-base  mb-0 line-clamp-2 break-all ">
                        <a :href="item.link" @click.prevent="router.push(item.link)" class="text-base-content hover:text-primary" target="">
                           {{ item.title }}
                        </a>
                    </h3>

            
                </div>

                <!-- 底部信息 -->
                <div class="flex items-center flex-wrap gap-1 sm:gap-2 mt-auto">
                    <!-- 用户信息 -->
                    <div class="text-sm flex items-center justify-start flex-1">
                        <div class="flex items-center gap-1">
                            <avatarVue :data="item.author" :size="20" />
                            <nameVue :data="item.author" :icon="false" class="mr-1 sm:mr-2 text-primary"></nameVue>
                        </div>
                        <span class="mx-1 sm:mx-2 text-base-content/60">·</span>
                        <a :href="'/moment/' + item.id" @click="router.push('/moment/' + item.id)" class="text-base-content/60 hover:text-primary" target="">
                            {{item.date}}
                        </a>
                        <span class="mx-1 sm:mx-2 text-base-content/60">·</span>
                        <span class="text-sm text-base-content/60">{{handleNumber(item.meta.views)}}阅读</span>
                    </div>
                    <!-- 标签 -->
                    <div class="flex flex-wrap items-center mr-2 sm:mr-3">
                        <div class="-m-0.5 sm:-m-1 flex flex-wrap items-center">
                            <a :href="'/topic/' + tag.id" @click="router.push('/topic/' + tag.id)" v-for="tag in item.topics.slice(0, 1)" class="badge badge-soft badge-accent">{{ tag.name }}</a>
                        </div>
                    </div>

                    
                </div>
            </div>
        </div>
        
    </article>
</template>


<script setup>
import { useRouter } from 'vue-router';
import nameVue from '../../user/nameVue.vue';
import avatarVue from '../../user/avatarVue.vue';
import { handleNumber } from '../../../dist/theme';


const router = useRouter();
const props = defineProps({
    item: {
        type: Object,
        default: () => { }
    },
    index: {
        type: Number,
        default: 0
    },
    selectTabs: {
        type: Object,
    }
})
</script>